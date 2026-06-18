"""
Assessment Report Generation and Download API

This module provides endpoints for generating, viewing, and downloading
comprehensive assessment reports in various formats (PDF, JSON, CSV).
"""

from fastapi import APIRouter, HTTPException, status, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
import json
import io

# Router setup
router = APIRouter(prefix="/reports", tags=["Assessment Reports"])


class ReportRequest(BaseModel):
    """Request to generate a report"""
    session_id: str
    report_type: str = Field("comprehensive", description="Type of report: comprehensive, summary, olq_breakdown")
    format: str = Field("json", description="Output format: json, pdf, csv")
    include_recommendations: bool = True
    include_improvement_plan: bool = True


class OLQScore(BaseModel):
    """OLQ score data"""
    olq_name: str
    score: float
    max_score: float
    percentage: float
    assessment: str
    category: str
    positive_indicators: List[str]
    areas_for_improvement: List[str]


class ReportData(BaseModel):
    """Complete report data structure"""
    candidate_info: Dict[str, Any]
    assessment_date: str
    overall_score: float
    recommendation: str
    olq_scores: List[OLQScore]
    stage_wise_performance: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    red_flags: List[str]
    green_flags: List[str]
    improvement_plan: List[Dict[str, Any]]
    recommended_resources: List[str]


# In-memory report storage (use database in production)
report_storage: Dict[str, Dict[str, Any]] = {}


@router.post("/generate")
async def generate_report(request: ReportRequest):
    """
    Generate an assessment report for a completed session
    
    Creates a comprehensive report with OLQ scores, recommendations,
    and improvement suggestions.
    """
    try:
        # In production, fetch session data from database
        # For now, generate a sample report structure
        report_data = await _create_report_data(request.session_id)
        
        # Store report
        report_id = f"report_{request.session_id}_{datetime.now().strftime('%Y%m%d')}"
        report_storage[report_id] = {
            "data": report_data.dict(),
            "created_at": datetime.now().isoformat(),
            "type": request.report_type,
            "format": request.format
        }
        
        return {
            "report_id": report_id,
            "session_id": request.session_id,
            "report_type": request.report_type,
            "format": request.format,
            "data": report_data.dict() if request.format == "json" else None,
            "download_url": f"/reports/download/{report_id}?format={request.format}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )


@router.get("/download/{report_id}")
async def download_report(report_id: str, format: str = "json"):
    """
    Download a generated report in the specified format
    
    Supports JSON, PDF, and CSV formats.
    """
    if report_id not in report_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    try:
        report_data = report_storage[report_id]["data"]
        
        if format == "json":
            return Response(
                content=json.dumps(report_data, indent=2),
                media_type="application/json",
                headers={
                    "Content-Disposition": f"attachment; filename=ssb_assessment_report_{report_id}.json"
                }
            )
        
        elif format == "pdf":
            # Generate PDF content
            pdf_content = await _generate_pdf_report(report_data)
            return Response(
                content=pdf_content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename=ssb_assessment_report_{report_id}.pdf"
                }
            )
        
        elif format == "csv":
            # Generate CSV content
            csv_content = await _generate_csv_report(report_data)
            return Response(
                content=csv_content,
                media_type="text/csv",
                headers={
                    "Content-Disposition": f"attachment; filename=ssb_assessment_report_{report_id}.csv"
                }
            )
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported format: {format}. Supported formats: json, pdf, csv"
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )


@router.get("/{report_id}")
async def get_report(report_id: str):
    """
    Retrieve a specific report by ID
    """
    if report_id not in report_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return report_storage[report_id]


@router.get("/list")
async def list_reports(candidate_id: Optional[str] = None, limit: int = 10):
    """
    List all available reports, optionally filtered by candidate
    """
    reports = []
    for report_id, report_data in report_storage.items():
        if candidate_id and report_data["data"].get("candidate_info", {}).get("id") != candidate_id:
            continue
        
        reports.append({
            "report_id": report_id,
            "session_id": report_data["data"].get("session_id"),
            "candidate_name": report_data["data"].get("candidate_info", {}).get("name"),
            "assessment_date": report_data["data"].get("assessment_date"),
            "overall_score": report_data["data"].get("overall_score"),
            "recommendation": report_data["data"].get("recommendation"),
            "created_at": report_data["created_at"],
            "download_url": f"/reports/download/{report_id}"
        })
    
    # Sort by date (newest first) and limit
    reports.sort(key=lambda x: x["created_at"], reverse=True)
    return {
        "reports": reports[:limit],
        "total_count": len(reports)
    }


@router.delete("/{report_id}")
async def delete_report(report_id: str):
    """
    Delete a specific report
    """
    if report_id not in report_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    del report_storage[report_id]
    return {"message": "Report deleted successfully", "report_id": report_id}


# Helper functions

async def _create_report_data(session_id: str) -> ReportData:
    """Create comprehensive report data from session"""
    # In production, this would fetch actual data from the session
    # For now, create a sample structure
    
    return ReportData(
        candidate_info={
            "name": "Sample Candidate",
            "age": 22,
            "education": "B.Tech Computer Science",
            "session_id": session_id
        },
        assessment_date=datetime.now().strftime("%Y-%m-%d"),
        overall_score=3.8,
        recommendation="Recommended",
        olq_scores=[
            OLQScore(
                olq_name="Effective Intelligence",
                score=4.0,
                max_score=5.0,
                percentage=80.0,
                assessment="Good",
                category="Cognitive",
                positive_indicators=["Quick thinking", "Practical solutions"],
                areas_for_improvement=["Strategic planning"]
            ),
            OLQScore(
                olq_name="Social Adaptability",
                score=3.5,
                max_score=5.0,
                percentage=70.0,
                assessment="Average",
                category="Social",
                positive_indicators=["Team player"],
                areas_for_improvement=["Conflict resolution", "Leadership in groups"]
            ),
            OLQScore(
                olq_name="Courage",
                score=4.5,
                max_score=5.0,
                percentage=90.0,
                assessment="Excellent",
                category="Personal",
                positive_indicators=["Moral courage", "Quick decision under pressure"],
                areas_for_improvement=[]
            ),
            OLQScore(
                olq_name="Sense of Responsibility",
                score=4.2,
                max_score=5.0,
                percentage=84.0,
                assessment="Good",
                category="Personal",
                positive_indicators=["Takes ownership", "Reliable"],
                areas_for_improvement=["Delegation"]
            ),
            OLQScore(
                olq_name="Determination",
                score=3.8,
                max_score=5.0,
                percentage=76.0,
                assessment="Good",
                category="Personal",
                positive_indicators=["Persistent", "Goal-oriented"],
                areas_for_improvement=["Handling setbacks"]
            )
        ],
        stage_wise_performance={
            "personal_interview": {
                "score": 4.0,
                "feedback": "Good communication and self-awareness"
            },
            "wat": {
                "score": 3.5,
                "feedback": "Positive themes but could be more original"
            },
            "srt": {
                "score": 3.8,
                "feedback": "Good practical responses"
            },
            "tat": {
                "score": 3.6,
                "feedback": "Well-structured stories with positive themes"
            },
            "gpe": {
                "score": 4.2,
                "feedback": "Excellent planning and resource management"
            }
        },
        strengths=[
            "Strong moral compass",
            "Quick decision-making ability",
            "Good communication skills",
            "Team orientation",
            "Practical problem-solving"
        ],
        weaknesses=[
            "Could improve strategic thinking",
            "Needs more confidence in leadership roles",
            "Time management under pressure"
        ],
        red_flags=[],
        green_flags=[
            "Honest and authentic responses",
            "Takes responsibility for actions",
            "Shows concern for team welfare",
            "Demonstrates ethical decision-making"
        ],
        improvement_plan=[
            {
                "area": "Strategic Thinking",
                "activities": [
                    "Practice case studies on military strategy",
                    "Read books on leadership and decision-making",
                    "Participate in strategy games and simulations"
                ],
                "timeline": "3 months",
                "success_metrics": "Improved performance in GPE and scenario-based questions"
            },
            {
                "area": "Leadership Confidence",
                "activities": [
                    "Take up leadership roles in college activities",
                    "Practice public speaking",
                    "Lead team projects"
                ],
                "timeline": "2 months",
                "success_metrics": "Comfortable leading groups and making decisions"
            },
            {
                "area": "Time Management",
                "activities": [
                    "Use time management tools and techniques",
                    "Practice timed mock tests",
                    "Set priorities and stick to them"
                ],
                "timeline": "1 month",
                "success_metrics": "Complete tasks within deadlines consistently"
            }
        ],
        recommended_resources=[
            "Book: 'Leaders Eat Last' by Simon Sinek",
            "Book: 'The Art of War' by Sun Tzu",
            "Online Course: Strategic Thinking Fundamentals",
            "Practice: Daily current affairs reading",
            "Activity: Join debate club or public speaking group"
        ]
    )


async def _generate_pdf_report(report_data: Dict[str, Any]) -> bytes:
    """Generate PDF content from report data"""
    # In production, use a library like reportlab or weasyprint
    # For now, return a simple text representation
    
    buffer = io.BytesIO()
    
    # Create a simple text-based PDF structure
    content = f"""
SSB ASSESSMENT REPORT
=====================

Candidate: {report_data['candidate_info']['name']}
Assessment Date: {report_data['assessment_date']}
Overall Score: {report_data['overall_score']}/5.0
Recommendation: {report_data['recommendation']}

OLQ SCORES:
-----------
"""
    
    for olq in report_data['olq_scores']:
        content += f"{olq['olq_name']}: {olq['score']}/{olq['max_score']} ({olq['percentage']}%) - {olq['assessment']}\n"
    
    content += f"""
STAGE-WISE PERFORMANCE:
-----------------------
"""
    for stage, data in report_data['stage_wise_performance'].items():
        content += f"{stage.replace('_', ' ').title()}: {data['score']}/5.0 - {data['feedback']}\n"
    
    content += f"""
STRENGTHS:
----------
{chr(10).join(f'• {s}' for s in report_data['strengths'])}

AREAS FOR IMPROVEMENT:
----------------------
{chr(10).join(f'• {w}' for w in report_data['weaknesses'])}

IMPROVEMENT PLAN:
-----------------
"""
    
    for plan in report_data['improvement_plan']:
        content += f"\n{plan['area']} (Timeline: {plan['timeline']}):\n"
        for activity in plan['activities']:
            content += f"  • {activity}\n"
    
    content += f"""
RECOMMENDED RESOURCES:
----------------------
{chr(10).join(f'• {r}' for r in report_data['recommended_resources'])}

---
Report generated by SSB NextGen Pro Assessment System
"""
    
    buffer.write(content.encode('utf-8'))
    buffer.seek(0)
    return buffer.getvalue()


async def _generate_csv_report(report_data: Dict[str, Any]) -> str:
    """Generate CSV content from report data"""
    import csv
    import io
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(['SSB Assessment Report'])
    writer.writerow(['Candidate', report_data['candidate_info']['name']])
    writer.writerow(['Assessment Date', report_data['assessment_date']])
    writer.writerow(['Overall Score', report_data['overall_score']])
    writer.writerow(['Recommendation', report_data['recommendation']])
    writer.writerow([])
    
    # OLQ Scores
    writer.writerow(['OLQ Scores'])
    writer.writerow(['OLQ Name', 'Score', 'Max Score', 'Percentage', 'Assessment', 'Category'])
    for olq in report_data['olq_scores']:
        writer.writerow([
            olq['olq_name'],
            olq['score'],
            olq['max_score'],
            f"{olq['percentage']}%",
            olq['assessment'],
            olq['category']
        ])
    
    writer.writerow([])
    
    # Stage-wise performance
    writer.writerow(['Stage-wise Performance'])
    writer.writerow(['Stage', 'Score', 'Feedback'])
    for stage, data in report_data['stage_wise_performance'].items():
        writer.writerow([stage.replace('_', ' ').title(), data['score'], data['feedback']])
    
    writer.writerow([])
    
    # Strengths and weaknesses
    writer.writerow(['Strengths'])
    for strength in report_data['strengths']:
        writer.writerow([strength])
    
    writer.writerow([])
    writer.writerow(['Areas for Improvement'])
    for weakness in report_data['weaknesses']:
        writer.writerow([weakness])
    
    return output.getvalue()