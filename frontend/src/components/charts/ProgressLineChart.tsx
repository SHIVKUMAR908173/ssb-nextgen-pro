'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function ProgressLineChart({ history = [] }: { history?: any[] }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => { setIsMounted(true) }, [])

    if (!isMounted) return <div className="h-64 w-full animate-pulse bg-white/5 rounded-xl"></div>

    // If no history, use dummy data
    let xData = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']
    let yData = [0, 0, 0, 0, 0]

    // Determine if we have any actual scores
    const hasData = history.some(h => h.score !== null && h.score > 0)

    if (history.length > 0 && hasData) {
        xData = history.map(h => h.date)
        yData = history.map(h => h.score)
    }

    return (
        <Plot
            data={[
                {
                    x: xData,
                    y: yData,
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Average Score',
                    line: { color: '#3b82f6', width: 3, shape: 'spline' }, // Blue
                    marker: { size: 8, color: '#3b82f6' },
                    connectgaps: true
                }
            ]}
            layout={{
                autosize: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                margin: { t: 20, r: 40, b: 30, l: 40 },
                xaxis: {
                    showgrid: true,
                    gridcolor: '#334155',
                    tickfont: { color: '#94a3b8' }
                },
                yaxis: {
                    title: {
                        text: 'Daily Avg Score',
                        font: { color: '#3b82f6', size: 10 }
                    },
                    tickfont: { color: '#3b82f6' },
                    showgrid: true,
                    gridcolor: '#334155',
                    range: [0, 100]
                },
                legend: {
                    orientation: 'h',
                    y: 1.1,
                    font: { color: '#e2e8f0' }
                }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
        />
    )
}
