'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import visualQuestions from '@/data/oir_set15_visual.json';

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
interface SvgFigure {
  label: string;
  svg?: string;
  image_url?: string;
}

interface VisualQuestion {
  id: number;
  category: string;
  question_text: string;
  reference_figures?: SvgFigure[];
  image_url?: string;
  options?: SvgFigure[];
  correct_option: string;
  explanation: string;
  is_fill_in_blank?: boolean;
}

/* ─────────────────────────────────────────────────────────
   SVG / Image Renderer
───────────────────────────────────────────────────────── */
function FigureRenderer({ figure, className }: { figure: SvgFigure, className?: string }) {
  if (figure.image_url) {
    return <img src={figure.image_url} alt={figure.label} className={className} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />;
  }
  if (figure.svg) {
    // Inject width/height to ensure it scales within the container
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
  const [setId, setSetId] = useState<string>('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Ref for fill-in-the-blank input
  const fillInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRandomSet = async () => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/oir?type=visual');
        const data = await res.json();
        if (data && data.data) {
            setQuestions(data.data);
            setSetId(data.setId);
        } else {
            alert('Failed to load questions from server');
        }
    } catch (e) {
        console.error(e);
        alert('Failed to fetch OIR set');
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasStarted && questions.length === 0 && !isLoading) {
       fetchRandomSet();
    }
  }, [hasStarted]);

  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions, answers]);

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

  const finishTest = useCallback(() => {
    let finalScore = 0;
    answers.forEach((ans, idx) => {
      if (ans && ans.toLowerCase().trim() === questions[idx].correct_option.toLowerCase().trim()) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setIsFinished(true);

    // Save to test history
    try {
      const historyStr = localStorage.getItem('testHistory') || '[]';
      const history = JSON.parse(historyStr);
      history.push({
        type: 'OIR',
        score: finalScore,
        total: questions.length,
        date: new Date().toISOString()
      });
      localStorage.setItem('testHistory', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [answers, questions]);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
          setAnswers(Array(parsed.length).fill(null));
          alert(`Loaded ${parsed.length} questions successfully!`);
        }
      } catch (err) {
        alert("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  const handleSelectOption = (optLabel: string) => {
    if (answers[currentIdx] !== null) return; // locked
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optLabel;
    setAnswers(newAnswers);
  };

  const handleFillSubmit = () => {
    if (answers[currentIdx] !== null) return;
    const val = fillInputRef.current?.value || '';
    if (!val) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = val;
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
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Test contains {questions.length} questions. You will have 20 minutes.</p>
          
          <button onClick={() => setHasStarted(true)} style={{ background: '#6366f1', color: '#fff', padding: '1rem 3rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none', marginBottom: '2rem' }}>
            START TEST
          </button>
          
          <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Want to practice a custom dataset?</p>
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleCustomUpload} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ background: 'transparent', border: '1px solid #6366f1', color: '#6366f1', padding: '0.5rem 1.5rem', borderRadius: '1rem', cursor: 'pointer' }}>
              Upload oir_custom.json
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const userAns = answers[currentIdx];
  const isAnswered = userAns !== null;
  const isCorrect = isAnswered && userAns?.toLowerCase().trim() === q.correct_option.toLowerCase().trim();
  const progressPercent = ((answers.filter(a => a !== null).length) / questions.length) * 100;
  const timePercent = (timeLeft / 1200) * 100;

  /* ─── Results Screen ─── */
  if (isFinished && !showReview) {
    const pct = Math.round((score / questions.length) * 100);
    const rating = pct >= 90 ? 'Outstanding' : pct >= 75 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Average' : 'Needs Improvement';

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
  if (isFinished && showReview) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', color: '#e2e8f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => setShowReview(false)} style={{ padding: '0.5rem 1.25rem', background: '#334155', border: 'none', borderRadius: '0.5rem', color: '#e2e8f0', cursor: 'pointer', marginBottom: '2rem' }}>← Back</button>
          {questions.map((rq, i) => {
            const ans = answers[i];
            const wasCorrect = ans?.toLowerCase().trim() === rq.correct_option.toLowerCase().trim();
            return (
              <div key={rq.id} style={{ background: 'rgba(30,41,59,0.7)', borderRadius: '1rem', border: `1px solid ${wasCorrect ? '#22c55e33' : ans ? '#ef444433' : '#33415533'}`, padding: '1.5rem', marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 700, color: wasCorrect ? '#22c55e' : '#ef4444' }}>{wasCorrect ? '✓ Correct' : ans ? '✗ Wrong' : '— Skipped'}</p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Q: {rq.question_text}</p>
                <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Your Answer: {ans || 'None'}</p>
                <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Correct: {rq.correct_option}</p>
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
          <h1 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>🧠 OIR <span style={{ color: '#818cf8' }}>— Non-Verbal</span></h1>
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
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#818cf8', background: '#818cf815', padding: '0.3rem 0.85rem', borderRadius: '2rem', fontWeight: 600, marginBottom: '1rem', display: 'inline-block' }}>{q.category}</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}><span style={{ color: '#64748b' }}>Q{currentIdx + 1}.</span> {q.question_text}</h2>

        {q.image_url && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img src={q.image_url} alt="Reference" style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
          </div>
        )}
        
        {q.reference_figures && q.reference_figures.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            {q.reference_figures.map((fig, i) => (
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
          {q.is_fill_in_blank || !q.options || q.options.length === 0 ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              <input 
                ref={fillInputRef}
                type="text" 
                placeholder="Type your answer here..."
                disabled={isAnswered}
                defaultValue={userAns || ''}
                style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#1e293b', color: '#fff', width: '300px' }}
              />
              <button 
                onClick={handleFillSubmit} 
                disabled={isAnswered}
                style={{ padding: '1rem 2rem', borderRadius: '0.5rem', background: isAnswered ? '#334155' : '#6366f1', color: '#fff', border: 'none', cursor: isAnswered ? 'not-allowed' : 'pointer' }}
              >
                {isAnswered ? 'Locked' : 'Submit'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(q.options.length, 4)}, 1fr)`, gap: '1rem' }}>
              {q.options.map((opt) => {
                const isSelected = userAns === opt.label;
                let bg = 'rgba(30,41,59,0.6)';
                let border = '2px solid #334155';
                if (isSelected) {
                   bg = isAnswered && isCorrect ? 'rgba(34,197,94,0.12)' : (isAnswered && !isCorrect ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)');
                   border = isAnswered && isCorrect ? '2px solid #22c55e' : (isAnswered && !isCorrect ? '2px solid #ef4444' : '2px solid #818cf8');
                }
                return (
                  <button key={opt.label} disabled={isAnswered} onClick={() => handleSelectOption(opt.label)} style={{ background: bg, border, borderRadius: '1rem', padding: '1rem', cursor: isAnswered ? 'default' : 'pointer' }}>
                    {opt.svg || opt.image_url ? (
                      <div style={{ width: '100px', height: '100px', margin: '0 auto 0.75rem', background: '#0f172a', borderRadius: '0.5rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <FigureRenderer figure={opt} />
                      </div>
                    ) : null}
                    <p style={{ margin: 0, fontWeight: 700, color: isSelected ? '#fff' : '#94a3b8' }}>Option {opt.label}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isAnswered && (
          <div style={{ background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: `1px solid ${isCorrect ? '#22c55e33' : '#ef444433'}` }}>
            <p style={{ color: isCorrect ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{isCorrect ? '🎉 Correct!' : `❌ Incorrect — Answer is ${q.correct_option}`}</p>
            {q.explanation && <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>💡 {q.explanation}</p>}
          </div>
        )}

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
