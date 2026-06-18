'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const WAT_WORDS = ['WAR', 'PEACE', 'LEADER', 'COUNTRY', 'HELP', 'FEAR'];

export default function WatTimer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [response, setResponse] = useState('');
    const [isTestActive, setIsTestActive] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (!isTestActive || currentIndex >= WAT_WORDS.length) return;

        if (timeLeft === 0) {
            saveResponseAndNext();
            return;
        }

        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, isTestActive, currentIndex]);

    async function saveResponseAndNext() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && response.trim() !== '') {
            await supabase.from('wat_responses').insert({
                user_id: user.id,
                word: WAT_WORDS[currentIndex],
                response: response
            });
        }

        setResponse('');
        setTimeLeft(15);
        setCurrentIndex((prev) => prev + 1);
    }

    if (currentIndex >= WAT_WORDS.length) {
        return <div className="text-xl font-bold text-green-700">WAT Session Complete. Data sent to AI Psychologist...</div>;
    }

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 rounded-xl shadow-inner max-w-lg mx-auto mt-10">
            {!isTestActive ? (
                <button onClick={() => setIsTestActive(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold">Start WAT (15s per word)</button>
            ) : (
                <>
                    <div className="text-6xl font-black tracking-widest uppercase mb-4 text-slate-800">{WAT_WORDS[currentIndex]}</div>
                    <div className="text-2xl text-red-600 font-mono mb-6">00:{timeLeft.toString().padStart(2, '0')}</div>
                    <input
                        type="text"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveResponseAndNext()}
                        placeholder="Type your first thought..."
                        className="w-full max-w-md p-4 text-lg rounded border-2 border-gray-300 focus:border-indigo-500 text-black"
                        autoFocus
                    />
                </>
            )}
        </div>
    )
}
