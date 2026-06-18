"""
User Progress Tracking Service

This module provides persistent storage and analytics for user evaluations
across all SSB test types.
"""

from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import json
from app.middleware.session_manager import SessionManager


@dataclass
class EvaluationRecord:
    """Record of a single evaluation"""
    user_id: str
    test_type: str  # WAT, TAT, SRT, SD, GPE, PPDT
    test_id: str  # Specific test/scenario ID
    overall_score: float
    olq_scores: Dict[str, float]
    feedback: str
    strengths: List[str]
    weaknesses: List[str]
    time_taken: Optional[int]
    created_at: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class UserProgress:
    """Aggregated progress for a user"""
    user_id: str
    total_tests_completed: int
    average_score: float
    olq_averages: Dict[str, float]
    strengths: List[str]
    weaknesses: List[str]
    recommendation: str
    last_updated: str
    trend: str  # "improving", "declining", "stable"


class ProgressTracker:
    """
    Service for tracking user progress across all SSB tests.
    In production, this would connect to PostgreSQL/Supabase.
    For now, uses in-memory storage with export capabilities.
    """
    
    def __init__(self):
        # In-memory storage with TTL to prevent memory leaks (replace with database in production)
        self._evaluations = SessionManager(ttl_seconds=86400, max_items=5000)
        self._user_progress = SessionManager(ttl_seconds=86400, max_items=5000)
    
    def save_evaluation(self, record: EvaluationRecord) -> bool:
        """Save an evaluation record"""
        user_id = record.user_id
        if user_id not in self._evaluations:
            self._evaluations[user_id] = []
        self._evaluations[user_id].append(record)
        
        # Update user progress
        self._update_user_progress(user_id)
        return True
    
    def get_user_evaluations(
        self, 
        user_id: str, 
        test_type: Optional[str] = None,
        limit: int = 50
    ) -> List[EvaluationRecord]:
        """Get evaluations for a user, optionally filtered by test type"""
        if user_id not in self._evaluations:
            return []
        
        evaluations = self._evaluations[user_id]
        if test_type:
            evaluations = [e for e in evaluations if e.test_type == test_type]
        
        # Sort by date descending and limit
        evaluations.sort(key=lambda x: x.created_at, reverse=True)
        return evaluations[:limit]
    
    def get_user_progress(self, user_id: str) -> Optional[UserProgress]:
        """Get aggregated progress for a user"""
        return self._user_progress.get(user_id)
    
    def get_olq_trend(self, user_id: str, olq_name: str, days: int = 30) -> List[Dict]:
        """Get trend data for a specific OLQ"""
        if user_id not in self._evaluations:
            return []
        
        cutoff_date = datetime.now() - timedelta(days=days)
        trend_data = []
        
        for record in self._evaluations[user_id]:
            record_date = datetime.fromisoformat(record.created_at)
            if record_date >= cutoff_date and olq_name in record.olq_scores:
                trend_data.append({
                    "date": record.created_at,
                    "score": record.olq_scores[olq_name],
                    "test_type": record.test_type
                })
        
        trend_data.sort(key=lambda x: x["date"])
        return trend_data
    
    def get_comprehensive_report(self, user_id: str) -> Dict[str, Any]:
        """Generate comprehensive progress report"""
        if user_id not in self._evaluations:
            return {"error": "No data found"}
        
        evaluations = self._evaluations[user_id]
        progress = self._user_progress.get(user_id)
        
        # Calculate trends for each OLQ
        olq_trends = {}
        for olq_name in ["Effective Intelligence", "Reasoning Ability", "Organising Ability",
                        "Power of Expression", "Social Adaptability", "Cooperation",
                        "Sense of Responsibility", "Initiative", "Self-Confidence",
                        "Speed of Decision", "Ability to Influence the Group",
                        "Liveliness", "Determination", "Courage", "Stamina"]:
            trend = self.get_olq_trend(user_id, olq_name)
            if trend:
                olq_trends[olq_name] = {
                    "current": trend[-1]["score"] if trend else 0,
                    "trend": self._calculate_trend_direction(trend),
                    "data_points": len(trend)
                }
        
        return {
            "user_id": user_id,
            "progress": asdict(progress) if progress else None,
            "recent_evaluations": [asdict(e) for e in evaluations[-10:]],
            "olq_trends": olq_trends,
            "total_evaluations": len(evaluations),
            "generated_at": datetime.now().isoformat()
        }
    
    def _update_user_progress(self, user_id: str):
        """Recalculate user progress based on all evaluations"""
        if user_id not in self._evaluations:
            return
        
        evaluations = self._evaluations[user_id]
        if not evaluations:
            return
        
        # Calculate averages
        all_olq_scores: Dict[str, List[float]] = {}
        all_strengths = []
        all_weaknesses = []
        
        for record in evaluations:
            for olq, score in record.olq_scores.items():
                if olq not in all_olq_scores:
                    all_olq_scores[olq] = []
                all_olq_scores[olq].append(score)
            all_strengths.extend(record.strengths)
            all_weaknesses.extend(record.weaknesses)
        
        # Calculate OLQ averages
        olq_averages = {
            olq: round(sum(scores) / len(scores), 2)
            for olq, scores in all_olq_scores.items()
        }
        
        # Calculate overall average
        avg_score = round(sum(olq_averages.values()) / len(olq_averages), 2) if olq_averages else 0
        
        # Determine recommendation
        if avg_score >= 4.0:
            recommendation = "STRONGLY RECOMMENDED"
        elif avg_score >= 3.5:
            recommendation = "RECOMMENDED"
        elif avg_score >= 3.0:
            recommendation = "BORDERLINE"
        else:
            recommendation = "NEEDS IMPROVEMENT"
        
        # Determine trend
        trend = self._calculate_overall_trend(evaluations)
        
        # Get top strengths and weaknesses
        strength_counts = {}
        for s in all_strengths:
            strength_counts[s] = strength_counts.get(s, 0) + 1
        top_strengths = sorted(strength_counts.keys(), key=lambda x: strength_counts[x], reverse=True)[:5]
        
        weakness_counts = {}
        for w in all_weaknesses:
            weakness_counts[w] = weakness_counts.get(w, 0) + 1
        top_weaknesses = sorted(weakness_counts.keys(), key=lambda x: weakness_counts[x], reverse=True)[:5]
        
        self._user_progress[user_id] = UserProgress(
            user_id=user_id,
            total_tests_completed=len(evaluations),
            average_score=avg_score,
            olq_averages=olq_averages,
            strengths=top_strengths,
            weaknesses=top_weaknesses,
            recommendation=recommendation,
            last_updated=datetime.now().isoformat(),
            trend=trend
        )
    
    def _calculate_trend_direction(self, trend_data: List[Dict]) -> str:
        """Calculate if trend is improving, declining, or stable"""
        if len(trend_data) < 2:
            return "stable"
        
        recent = [d["score"] for d in trend_data[-5:]]
        older = [d["score"] for d in trend_data[:5]]
        
        recent_avg = sum(recent) / len(recent)
        older_avg = sum(older) / len(older)
        
        diff = recent_avg - older_avg
        if diff > 0.3:
            return "improving"
        elif diff < -0.3:
            return "declining"
        return "stable"
    
    def _calculate_overall_trend(self, evaluations: List[EvaluationRecord]) -> str:
        """Calculate overall trend from evaluations"""
        if len(evaluations) < 2:
            return "stable"
        
        recent_scores = [e.overall_score for e in evaluations[-5:]]
        older_scores = [e.overall_score for e in evaluations[:5]]
        
        recent_avg = sum(recent_scores) / len(recent_scores)
        older_avg = sum(older_scores) / len(older_scores)
        
        diff = recent_avg - older_avg
        if diff > 0.2:
            return "improving"
        elif diff < -0.2:
            return "declining"
        return "stable"
    
    def export_data(self, user_id: str) -> str:
        """Export all data for a user as JSON"""
        data = self.get_comprehensive_report(user_id)
        return json.dumps(data, indent=2)


# Singleton instance
_progress_tracker = None

def get_progress_tracker() -> ProgressTracker:
    """Get or create the progress tracker singleton"""
    global _progress_tracker
    if _progress_tracker is None:
        _progress_tracker = ProgressTracker()
    return _progress_tracker