import React, { useMemo, useState, useEffect } from 'react'
import { EXAM_DATA } from '../data/examData.js'
import { EXAM_ATTEMPTS, USER_ANSWERS } from '../data/attemptsData.js'
import { BarChart, PieChart } from '@mui/x-charts'
import MathField from '../components/MathField.jsx'
import QuestionRenderer from '../components/QuestionRenderer.jsx'


const COLORS = {
  correct: '#16a34a',
  wrong: '#ef4444',
  not_answered: '#9ca3af'
}



export default function Analysis() {

  const attempt = EXAM_ATTEMPTS.find((a) => a.attemptId === 'attempt_1') || EXAM_ATTEMPTS[0]

  const answers = USER_ANSWERS.filter((u) => u.attemptId === attempt.attemptId)

  const questionMap = useMemo(() => {
    const map = {}
    EXAM_DATA.questions.forEach((q, idx) => map[q.questionId] = { ...q, number: idx + 1 })
    return map
  }, [])

  const stats = useMemo(() => {
    const total = EXAM_DATA.questions.length
    const attempted = answers.filter((a) => a.answerStatus === 'answered').length
    const correct = answers.filter((a) => a.isCorrect === true).length
    const wrong = answers.filter((a) => a.isCorrect === false).length
    const notAnswered = total - attempted
    const attemptRate = Math.round((attempted / total) * 100)
    const accuracyRate = attempted ? Math.round((correct / attempted) * 100) : 0

    // difficulty breakdown
    const difficulties = { EASY: { count: 0, score: 0 }, MEDIUM: { count: 0, score: 0 }, DIFFICULT: { count: 0, score: 0 } }
    EXAM_DATA.questions.forEach((q) => {
      const diff = q.difficulty || 'EASY'
      difficulties[diff] = difficulties[diff] || { count: 0, score: 0 }
      difficulties[diff].count += 1
      const ans = answers.find((a) => a.questionId === q.questionId)
      if (ans && ans.isCorrect === true) difficulties[diff].score += 1
    })

    return { total, attempted, correct, wrong, notAnswered, attemptRate, accuracyRate, difficulties }
  }, [answers])

  const attemptedSectionIds = useMemo(() => {
    const ids = new Set()
    answers.forEach(a => {
      const q = questionMap[a.questionId]
      if (q) ids.add(q.sectionId)
    })
    return Array.from(ids)
  }, [answers, questionMap])

  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSection, setSelectedSection] = useState(attemptedSectionIds[0] || EXAM_DATA.sections[0].sectionId)
  const sectionQuestions = EXAM_DATA.questions.filter(q => q.sectionId === selectedSection)
  const [activeQuestionId, setActiveQuestionId] = useState(sectionQuestions[0]?.questionId || null)

  // ensure active question updates when section changes
  React.useEffect(() => {
    const sq = EXAM_DATA.questions.find(q => q.sectionId === selectedSection)
    setActiveQuestionId(sq?.questionId || null)
  }, [selectedSection])

  const getArcLabel = (params) => {
  const percent = params.value / stats.total;
  return `${(percent * 100).toFixed(0)}%`;
    };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analysis</h2>

      <div className="mb-6">
        <div className="flex gap-2 bg-white p-2 rounded shadow">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 ${activeTab==='overview' ? 'bg-gray-100 rounded' : ''}`}>Overview</button>
          <button onClick={() => setActiveTab('qwise')} className={`px-4 py-2 ${activeTab==='qwise' ? 'bg-gray-100 rounded' : ''}`}>Question-Wise Performance</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6 ">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-3">Attempt Summary</h3>
              <div style={{ height: 320 }}>
                <BarChart
                  xAxis={[{ id: 'attempt_summary', data: ['Attempt Summary'] }]}
                  series={[
                    { data: [stats.correct], label: 'Correct', color: COLORS.correct },
                    { data: [stats.wrong], label: 'Wrong', color: COLORS.wrong },
                    { data: [stats.attempted], label: 'Attempted', color: '#3b82f6' }
                  ]}
                  height={320}
                  legend={{ position: 'bottom' }}
                  yAxis={[{ id: 'count', width: stats.total, max: 30 }]}
                />
              </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Questions Attempted</div>
                <div className="text-lg font-semibold">{stats.attempted} / {stats.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Attempt Rate</div>
                <div className="text-lg font-semibold">{stats.attemptRate}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Correct Answered</div>
                <div className="text-lg font-semibold">{stats.correct}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
                <div className="text-lg font-semibold">{stats.accuracyRate}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <h3 className="font-medium mb-2">Result Distribution</h3>
            <PieChart
                  xAxis={[{ id: 'attempt_summary', data: ['Attempt Summary'] }]}
                  series={[
                    {
                    startAngle: -180,
                    endAngle: 180,
                    data : [
                        { value: stats.correct, label: 'Correct', color: COLORS.correct },      
                        { value: stats.wrong, label: 'Wrong', color: COLORS.wrong },
                        { value: stats.notAnswered, label: 'Not Attempted', color: '#9ca3af' }
                    ],
                    arcLabel: getArcLabel,
                    },
                    
                ]}
                  height={320}
                  legend={{ position: 'bottom' }}
                  yAxis={[{ id: 'count', width: stats.total, max: 30 }]}
                />
          </div>

          <div className="col-span-3 bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-3">Difficulty Level Of Questions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['EASY', 'MEDIUM', 'DIFFICULT'].map((d) => {
                const dd = stats.difficulties[d] || { count: 0, score: 0 }
                const pct = dd.count ? Math.round((dd.score / dd.count) * 100) : 0
                const accent = d === 'EASY' ? COLORS.correct : (d === 'MEDIUM' ? '#f59e0b' : COLORS.wrong)
                return (
                  <div key={d} className="flex items-center gap-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm">
                    <div className="w-1 h-16 rounded" style={{ background: accent }} />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">{d[0] + d.slice(1).toLowerCase()}</div>
                      <div className="text-2xl font-semibold mt-1">{dd.count}</div>
                      <div className="text-sm text-gray-600 mt-1">{dd.score} / {dd.count} correct</div>
                      <div className="mt-3 bg-gray-100 h-2 rounded overflow-hidden">
                        <div className="h-2 rounded" style={{ width: `${pct}%`, background: accent }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Accuracy</div>
                      <div className="text-lg font-semibold">{pct}%</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="text-sm text-gray-600 mb-2">Detailed Comparison</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="pb-2">Difficulty</th>
                      <th className="pb-2 text-center">No. Of Questions</th>
                      <th className="pb-2 text-center">My Marks / Total Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['EASY','MEDIUM','DIFFICULT'].map((d, idx) => {
                      const dd = stats.difficulties[d] || { count: 0, score: 0 }
                      const pct = dd.count ? Math.round((dd.score / dd.count) * 100) : 0
                      const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      const chipColor = d === 'EASY' ? 'bg-green-100 text-green-800' : (d === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')
                      return (
                        <tr key={d} className={rowBg}>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-2 px-2 py-1 rounded ${chipColor}`}>
                              <span className={`inline-block w-2 h-2 rounded-full`} style={{ background: d === 'EASY' ? COLORS.correct : (d === 'MEDIUM' ? '#f59e0b' : COLORS.wrong) }} />
                              <span className="font-medium">{d[0] + d.slice(1).toLowerCase()}</span>
                            </span>
                          </td>
                          <td className="py-3 text-center font-semibold">{dd.count}</td>
                          <td className="py-3 text-center">{dd.score}/{dd.count}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

        {activeTab === 'qwise' && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600">Select Section</label>
              <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="mt-1 p-2 border rounded">
                {EXAM_DATA.sections.filter(s => attemptedSectionIds.includes(s.sectionId)).map(s => (
                  <option key={s.sectionId} value={s.sectionId}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">

              {sectionQuestions.map((q, idx) => {
                const ans = answers.find(a => a.questionId === q.questionId)
                const status = ans ? (ans.isCorrect === true ? 'correct' : (ans.isCorrect === false ? 'wrong' : 'not_answered')) : 'not_answered'
                const bg = status === 'correct' ? 'bg-green-500' : (status === 'wrong' ? 'bg-red-500' : 'bg-yellow-300')
                return (
                  <button key={q.questionId} value= {idx+1} onClick={() => setActiveQuestionId(q.questionId)} className={`${bg} text-white px-3 py-2 rounded`}>
                    {idx + 1}
                  </button>
                )
              })}

            </div>
          </div>

          <div className="border-t pt-4">
            {activeQuestionId ? (
              (() => {
                const q = questionMap[activeQuestionId]
                const ans = answers.find(a => a.questionId === activeQuestionId)
                const selectedOption = q.options ? q.options.find(o => o.optionId === ans?.selectedOptionId) : null
                return (
                  <div>
                    <div className="mb-2 font-semibold">Q. {q.number}. <QuestionRenderer text={q.questionText} /></div>
                    {q.type === 'MCQ' ? (
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Options:</div>
                        <div className="p-3 bg-gray-50 rounded space-y-2">
                          {q.options && q.options.length ? (
                            q.options.map((o) => {
                              const isMarked = ans?.selectedOptionId === o.optionId
                              const isCorrect = q.correctAnswer?.optionId === o.optionId
                              return (
                                <div key={o.optionId} className={`flex items-start gap-3 p-2 rounded ${isMarked ? 'bg-blue-50 border border-blue-200' : 'bg-white'} ${isCorrect ? 'ring-1 ring-green-100' : ''}`}>
                                  <div className="font-semibold">{o.identifier} —</div>
                                  <div className="flex-1">
                                    <MathField latex={o.text || ''} />
                                  </div>
                                  <div className="ml-2 text-sm flex items-center gap-2">
                                    {isMarked && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Marked</span>}
                                    {isCorrect && <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">Correct</span>}
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <div className="text-gray-600">No options available.</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Your Answer:</div>
                        <div className="p-3 bg-gray-50 rounded">
                          {ans ? (
                            ans.numericalAnswer ? (
                              <div className="text-sm font-medium">{ans.numericalAnswer}</div>
                            ) : (
                              <span className="text-gray-500">Not Answered</span>
                            )
                          ) : (
                            <span className="text-gray-500">Not Answered</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-600">Correct Answer:</div>
                      <div className="p-3 bg-green-50 rounded">
                        {q.type === 'MCQ' ? (
                          (() => {
                            const correctOpt = q.options?.find(o => o.optionId === q.correctAnswer.optionId)
                            const correctText = correctOpt?.text || q.correctAnswer.optionId
                            return (
                              <div className="flex items-start gap-2">
                                <div className="font-semibold">{q.correctAnswer.identifier} —</div>
                                <div className="flex-1">
                                  <MathField latex={correctText || ''} />
                                </div>
                              </div>
                            )
                          })()
                        ) : (
                          <MathField latex={String(q.correctAnswer.value || '')} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()
            ) : (
              <div className="text-gray-500">Select a question to view details.</div>
            )}
          </div>
        </div>
      )}


    </div>
  )
}
