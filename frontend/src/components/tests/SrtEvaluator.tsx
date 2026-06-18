'use client'
import { useState } from 'react'

const MOCK_SITUATIONS = [
    "You are going for an important exam and your bicycle gets punctured in the middle of a deserted road...",
    "You are trekking in a forest and suddenly your friend gets bitten by a snake...",
    "You find out that your best friend is passing classified information to an unknown source..."
]

export default function SrtEvaluator() {
    const [currentSrt, setCurrentSrt] = useState(0)
    const [response, setResponse] = useState('')

    const handleNext = () => {
        // In a real implementation this would save to Supabase like WatTimer does
        setResponse('')
        setCurrentSrt(prev => (prev + 1) % MOCK_SITUATIONS.length)
    }

    return (
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-2xl mx-auto mt-10 border-t-4 border-indigo-600">
            <h3 className="text-xl font-bold mb-2 text-indigo-900">Situation {currentSrt + 1} of {MOCK_SITUATIONS.length}</h3>
            <p className="text-lg text-slate-700 italic border-l-4 border-slate-300 pl-4 py-2 mb-6 bg-slate-50">
                {MOCK_SITUATIONS[currentSrt]}
            </p>

            <div className="space-y-4">
                <textarea
                    required
                    rows={4}
                    maxLength={150}
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    placeholder="Write your immediate reaction (max 150 characters)..."
                    className="w-full p-4 text-slate-800 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
                ></textarea>
                <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>Speed and logical reasoning are key.</span>
                    <span>{response.length} / 150</span>
                </div>
                <button
                    onClick={handleNext}
                    disabled={response.trim() === ''}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    Submit Reaction
                </button>
            </div>
        </div>
    )
}
