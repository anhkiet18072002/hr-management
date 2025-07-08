'use client'
import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'

import { Dashboard_SkillLevel_Type } from '@/app/types/dashboard.type'
import {
    useGetDashboardSkillLevel,
    useUpdateDashboardSkillLevel
} from '@/app/hooks/api/dashboard.hook'
Chart.register(...registerables)

const generatePastelColors = (count: number) => {
    const backgroundColors: string[] = []
    const borderColors: string[] = []

    for (let i = 0; i < count; i++) {
        const hue = Math.floor((360 / count) * i)
        backgroundColors.push(`hsl(${hue}, 70%, 80%)`)
        borderColors.push(`hsl(${hue}, 70%, 50%)`)
    }

    return { backgroundColors, borderColors }
}

const BarChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null)
    const chartInstance = useRef<Chart | null>(null)

    const [skillLevels, setSkillLevels] = useState<Dashboard_SkillLevel_Type>()

    const { mutate: getReport } = useGetDashboardSkillLevel()
    const { mutate: updateChartSkillLevel } = useUpdateDashboardSkillLevel()
    useEffect(() => {
        updateChartSkillLevel('top-skill')
        getReport('top-skill', {
            onSuccess: async (res: any) => {
                setSkillLevels(res)
            },
            onError: async (err: any) => {
                console.error('Error fetching skill level data:', err)
             }
        })
    }, [])

    useEffect(() => {
        if (chartRef.current && skillLevels) {
            const ctx = chartRef.current.getContext('2d')

            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy()
                }
                const labels = [...skillLevels.data.skillName]
                const data = skillLevels.data.averageLevel
                const { backgroundColors, borderColors } = generatePastelColors(labels.length)
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: 'Skill by Average Level',
                                data,
                                backgroundColor: backgroundColors,
                                borderColor: borderColors,
                                borderWidth: 1,
                                barPercentage: 0.5,
                                categoryPercentage: 0.8
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'TOP SKILL',
                                font: {
                                    size: 20
                                }
                            }
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Average Level'
                                },
                                min: 0,
                                max: 100,
                                ticks: {
                                    stepSize: 10
                                }
                            }
                        }
                    }
                })
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }
        }
    }, [skillLevels])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ width: 1000, height: 1000 }}>
                    <canvas ref={chartRef} />
                </div>
            </div>
        </>
    )
}

export default BarChart

