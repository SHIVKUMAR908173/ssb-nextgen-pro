'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
interface SvgFigure {
  label: string;
  svg?: string;
  image_url?: string;
}

interface VisualQuestion {
  id: string;
  category: string;
  prompt: string;
  referenceFigures?: SvgFigure[];
  imageUrl?: string;
  options: string[];
  explanation?: string;
}

/* ─────────────────────────────────────────────────────────
   SVG / Image Renderer
───────────────────────────────────────────────────────── */
function FigureRenderer({ figure, className }: { figure: SvgFigure, className?: string }) {
  if (figure.image_url) {
    return <img src={figure.image_url} alt={figure.label} className={className} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />;
  }
  if (figure.svg) {
    let svgHTML = figure.svg.replace('<svg', '<svg style="width: 100%; height: 100%; max-width: 100%;"');
    svgHTML = svgHTML.replace(/stroke=['"][^'"]+['"]/g, 'stroke="currentColor"');
    svgHTML = svgHTML.replace(/fill=['"](?:black|#e2e8f0)['"]/g, 'fill="currentColor"');
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: svgHTML }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#e2e8f0' }}
      />
    );
  }
  return null;
}

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export default function OIRVisualTest() {
  const [questions, setQuestions] = useState<VisualQuestion[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Backend State Machine
  const sessionId = useRef(`oir-${Date.now()}`);
  const [sessionState, setSessionState] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);

  const startTestSession = async () => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/oir/session/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                config: {
                    sessionId: sessionId.current,
                    totalTimeSeconds: 1200,
                    questionCount: 40,
                    balanceCategories: true,
                    seed: Date.now()
                }
            })
        });
        const data = await res.json();
        if (res.ok && data.state && data.questions) {
            setSessionState(data.state);
            setQuestions(data.questions.map((q: any) => ({
                id: q.id,
                category: q.category,
                prompt: q.prompt,
                options: q.options,
                explanation: q.explanation
            })));
            setAnswers(Array(data.questions.length).fill(null));
            setTimeLeft(data.state.config.totalTimeSeconds);
            setHasStarted(true);
        } else {
            alert('Failed to initialize OIR session from backend');
        }
    } catch (e) {
        console.error(e);
        alert('Failed to fetch OIR set');
    } finally {
        setIsLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (hasStarted && timeLeft > 0 && !isFinished && questions.length > 0) {
      const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft === 0 && !isFinished && questions.length > 0) finishTest();
  }, [timeLeft, isFinished, hasStarted, questions.length]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const finishTest = useCallback(async () => {
    setIsFinished(true);

    const answersByQuestionId: Record<string, number | null> = {};
    questions.forEach((q, idx) => {
        answersByQuestionId[q.id] = answers[idx];
    });

    try {
        const res = await fetch('/api/oir/session/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                state: sessionState,
                answersByQuestionId
            })
        });
        const data = await res.json();
        if (res.ok && data.evaluation) {
            setEvaluation(data.evaluation);
            setSessionState(data.state);
        }
    } catch (e) {
        console.error(e);
    }
  }, [answers, questions, sessionState]);


  const handleSelectOption = (idx: number) => {
    if (answers[currentIdx] !== null) return; // locked
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  };

  if (!hasStarted) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1e293b', padding: '3rem', borderRadius: '1rem', maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>OIR Intelligence Test</h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Test contains 40 questions. You will have 20 minutes. Evaluated strictly by Backend State Machine.</p>
          
          <button onClick={startTestSession} disabled={isLoading} style={{ background: '#6366f1', color: '#fff', padding: '1rem 3rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: isLoading ? 'not-allowed' : 'pointer', border: 'none', marginBottom: '2rem' }}>
            {isLoading ? 'INITIALIZING...' : 'START TEST'}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const userAnsIdx = answers[currentIdx];
  const isAnswered = userAnsIdx !== null;
  const progressPercent = ((answers.filter(a => a !== null).length) / questions.length) * 100;

  /* ─── Results Screen ─── */
  if (isFinished && !showReview) {
    const score = evaluation?.totalScore || 0;
    const pct = Math.round((score / questions.length) * 100);
    const rating = pct >= 90 ? 'OIR-1' : pct >= 75 ? 'OIR-2' : pct >= 60 ? 'OIR-3' : pct >= 40 ? 'OIR-4' : 'OIR-5';

    return (
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'rgba(30,41,59,0.85)', backdropFilter: 'blur(24px)', borderRadius: '1.5rem', border: '1px solid rgba(99,102,241,0.3)', padding: '3rem', maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Test Complete</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#0f172a', borderRadius: '1rem', padding: '1rem' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Score</p>
              <p style={{ color: '#818cf8', fontSize: '1.5rem', fontWeight: 800 }}>{score}/{questions.length}</p>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '1rem', padding: '1rem' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Rating</p>
              <p style={{ color: '#34d399', fontSize: '1.25rem', fontWeight: 700 }}>{rating}</p>
            </div>
          </div>
          <button onClick={() => setShowReview(true)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #818cf8', background: 'transparent', color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}>Review Answers</button>
        </div>
      </div>
    );
  }

  /* ─── Review Screen ─── */
  if (isFinished && showReview && evaluation) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: '#e2e8f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => setShowReview(false)} style={{ padding: '0.5rem 1.25rem', background: '#334155', border: 'none', borderRadius: '0.5rem', color: '#e2e8f0', cursor: 'pointer', marginBottom: '2rem' }}>← Back</button>
          {questions.map((rq, i) => {
            const ans = evaluation.perQuestion.find((p: any) => p.questionId === rq.id);
            const wasCorrect = ans?.isCorrect;
            return (
              <div key={rq.id} style={{ background: 'rgba(30,41,59,0.7)', borderRadius: '1rem', border: `1px solid ${wasCorrect ? '#22c55e33' : ans?.selectedIndex !== null ? '#ef444433' : '#33415533'}`, padding: '1.5rem', marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: wasCorrect ? '#22c55e' : '#ef4444' }}>{wasCorrect ? '✓ Correct' : ans?.selectedIndex !== null ? '✗ Wrong' : '— Skipped'}</p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Q: {rq.prompt}</p>
                <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Your Answer: {ans?.selectedIndex !== null ? rq.options[ans.selectedIndex] : 'None'}</p>
                <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Correct: {rq.options[ans?.correctIndex]}</p>
                {rq.explanation && <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>💡 {rq.explanation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>🧠 OIR <span style={{ color: '#818cf8' }}>— Battery</span></h1>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Q {currentIdx + 1} / {questions.length}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: timeLeft < 60 ? '#7f1d1d' : '#1e293b', padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', color: timeLeft < 60 ? '#fca5a5' : '#e2e8f0' }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0.5rem auto 0', display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1, height: '3px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)', transition: 'width 0.4s' }} />
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#818cf8', background: '#818cf815', padding: '0.3rem 0.85rem', borderRadius: '2rem', fontWeight: 600, marginBottom: '1rem', display: 'inline-block' }}>{q.category.replace('_', ' ')}</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}><span style={{ color: '#64748b' }}>Q{currentIdx + 1}.</span> {q.prompt}</h2>

        {q.imageUrl && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img src={q.imageUrl} alt="Reference" style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
          </div>
        )}
        
        {q.referenceFigures && q.referenceFigures.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            {q.referenceFigures.map((fig, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', background: '#0f172a', borderRadius: '0.75rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FigureRenderer figure={fig} />
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>{fig.label}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(q.options.length, 4)}, 1fr)`, gap: '1rem' }}>
              {q.options.map((opt, optIdx) => {
                const isSelected = userAnsIdx === optIdx;
                let bg = 'rgba(30,41,59,0.6)';
                let border = '2px solid #334155';
                if (isSelected) {
                   bg = 'rgba(99,102,241,0.12)';
                   border = '2px solid #818cf8';
                }
                return (
                  <button key={optIdx} disabled={isAnswered} onClick={() => handleSelectOption(optIdx)} style={{ background: bg, border, borderRadius: '1rem', padding: '1rem', cursor: isAnswered ? 'default' : 'pointer' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: isSelected ? '#fff' : '#94a3b8' }}>{opt}</p>
                  </button>
                );
              })}
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
           <button onClick={handlePrev} disabled={currentIdx === 0} style={{ padding: '0.75rem 2rem', borderRadius: '0.75rem', background: '#334155', color: currentIdx === 0 ? '#475569' : '#fff', border: 'none', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer' }}>
             ← Previous
           </button>
           <button onClick={handleNext} style={{ padding: '0.75rem 2rem', borderRadius: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer' }}>
             {currentIdx === questions.length - 1 ? '🏁 Finish Test' : 'Next →'}
           </button>
        </div>
      </div>
    </div>
  );
}
