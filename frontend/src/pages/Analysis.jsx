import React, { useMemo, useState, useEffect } from 'react'
import { EXAM_DATA } from '../data/examData.js'
import { EXAM_ATTEMPTS, USER_ANSWERS } from '../data/attemptsData.js'
import { BarChart, PieChart } from '@mui/x-charts'
import MathField from '../components/MathField.jsx'
import QuestionRenderer from '../components/QuestionRenderer.jsx'
import { useLocation } from 'react-router-dom'


const COLORS = {
  correct: '#16a34a',
  wrong: '#ef4444',
  not_answered: '#9ca3af'
}



export default function Analysis() {

  const location  = useLocation()
  const submissionResult = location?.state?.submissionResult

  if(!submissionResult) {
    console.log("No submission result found in location state")
    return (
      <div className="p-6">
        <div className="text-lg">No analysis data available.</div>
      </div>
    )
  }

  // const attempt = EXAM_ATTEMPTS.find((a) => a.attemptId === 'attempt_1') || EXAM_ATTEMPTS[0]

  // const answers = USER_ANSWERS.filter((u) => u.attemptId === attempt.attemptId)


  // const stats = useMemo(() => {
  //   const total = EXAM_DATA.questions.length
  //   const attempted = answers.filter((a) => a.answerStatus === 'answered').length
  //   const correct = answers.filter((a) => a.isCorrect === true).length
  //   const wrong = answers.filter((a) => a.isCorrect === false).length
  //   const notAnswered = total - attempted
  //   const attemptRate = Math.round((attempted / total) * 100)
  //   const accuracyRate = attempted ? Math.round((correct / attempted) * 100) : 0

  //   // difficulty breakdown
  //   const difficulties = { EASY: { count: 0, score: 0 }, MEDIUM: { count: 0, score: 0 }, DIFFICULT: { count: 0, score: 0 } }
  //   EXAM_DATA.questions.forEach((q) => {
  //     const diff = q.difficulty || 'EASY'
  //     difficulties[diff] = difficulties[diff] || { count: 0, score: 0 }
  //     difficulties[diff].count += 1
  //     const ans = answers.find((a) => a.questionId === q.questionId)
  //     if (ans && ans.isCorrect === true) difficulties[diff].score += 1
  //   })

  //   return { total, attempted, correct, wrong, notAnswered, attemptRate, accuracyRate, difficulties }
  // }, [answers])
  

  const stats = submissionResult.stats || {}
  const attempt_data = submissionResult.attempt.answers || {}
   const sections = [...new Set(
    attempt_data
      .map((s) => s.question_detail.section)
      .filter((section) => section !== null)
  )]
  const questions = [...new Set(
    attempt_data
      .map((s) => s.question_detail)
  )]

  const [selectedSection, setSelectedSection] = useState(sections[0] || null)

  const sectionQuestions = sections.length > 0 ? questions.filter(q => q.section.sectionId === selectedSection.sectionId) : questions


  const [activeTab, setActiveTab] = useState('overview')
  const [activeQuestionId, setActiveQuestionId] = useState(sectionQuestions[0].questionId || null)

  // ensure active question updates when section changes
  React.useEffect(() => {
    if (!selectedSection) return
    const sq = questions.find(q => q.section.sectionId === selectedSection.sectionId)
    setActiveQuestionId(sq.questionId)
  }, [selectedSection])

  const getArcLabel = (params) => {
  const percent = params.value / stats.total_questions;
  return `${(percent * 100).toFixed(0)}%`;
    };
  
  const correct = stats.correct_answers || 0;
  const attempted = stats.questions_attempted || 0;
  const wrong = attempted - correct || 0;
  // console.log("submission_data:", submission_data)

 
  // console.log(sections);
  



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
                    { data: [stats.correct_answers], label: 'Correct', color: COLORS.correct },
                    { data: [stats.questions_attempted - stats.correct_answers], label: 'Wrong', color: COLORS.wrong },
                    { data: [stats.questions_attempted], label: 'Attempted', color: '#3b82f6' }
                  ]}
                  height={320}
                  legend={{ position: 'bottom' }}
                  yAxis={[{ id: 'count', width: stats.total_questions, max: stats.total_questions }]}
                />
              </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Questions Attempted</div>
                <div className="text-lg font-semibold">{stats.questions_attempted} / {stats.total_questions}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Attempt Rate</div>
                <div className="text-lg font-semibold">{stats.attempt_rate} <span className='text-sm font-light'>s/question</span></div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Correct Answered</div>
                <div className="text-lg font-semibold">{stats.correct_answers}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
                <div className="text-lg font-semibold">{stats.accuracy}%</div>
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
                        { value: stats.correct_answers, label: `${stats.correct_answers} Correct`, color: COLORS.correct },      
                        { value: stats.questions_attempted - stats.correct_answers, label: `${stats.questions_attempted - stats.correct_answers} Wrong`, color: COLORS.wrong },
                        { value: stats.total_questions - stats.questions_attempted, label: `${stats.total_questions - stats.questions_attempted} Not Attempted`, color: '#9ca3af' }
                    ],
                    arcLabel: getArcLabel,
                    },
                    
                ]}
                  height={320}
                  legend={{ position: 'bottom' }}
                />
          </div>

          <div className="col-span-3 bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-3">Difficulty Level Of Questions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['E', 'M', 'H'].map((d) => {
                const dd = stats.difficulty_wise_stats[d] || { total: 0, correct: 0, attempted: 0 }
                const accuracy = dd.total ? Math.round((dd.correct / dd.attempted) * 100) : 0
                const pct = dd.total ? Math.round((dd.correct / dd.total) * 100) : 0
                const accent = d === 'E' ? COLORS.correct : (d === 'M' ? '#f59e0b' : COLORS.wrong)
                return (
                  <div key={d} className="flex items-center gap-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm">
                    <div className="w-1 h-16 rounded" style={{ background: accent }} />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">{d[0] + d.slice(1).toLowerCase()}</div>
                      <div className="text-2xl font-semibold mt-1">{dd.total}</div>
                      <div className="text-sm text-gray-600 mt-1">{dd.correct} / {dd.total} correct</div>
                      <div className="mt-3 bg-gray-100 h-2 rounded overflow-hidden">
                        <div className="h-2 rounded" style={{ width: `${pct}%`, background: accent }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Accuracy</div>
                      <div className="text-lg font-semibold">{accuracy ? `${accuracy}%` : 'N/A'}</div>
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
                    {['E','M','H'].map((d, idx) => {
                      const dd = stats.difficulty_wise_stats[d] || { total: 0, correct: 0, attempted: 0 }
                      const pct = dd.total ? Math.round((dd.correct / dd.total) * 100) : 0
                      const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      const chipColor = d === 'E' ? 'bg-green-100 text-green-800' : (d === 'M' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')
                      return (
                        <tr key={d} className={rowBg}>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-2 px-2 py-1 rounded ${chipColor}`}>
                              <span className={`inline-block w-2 h-2 rounded-full`} style={{ background: d === 'E' ? COLORS.correct : (d === 'M' ? '#f59e0b' : COLORS.wrong) }} />
                              <span className="font-medium">{d[0] + d.slice(1).toLowerCase()}</span>
                            </span>
                          </td>
                          <td className="py-3 text-center font-semibold">{dd.total}</td>
                          <td className="py-3 text-center">{dd.correct}/{dd.total}</td>
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
          {sections && sections.length > 0 ? (
            <div className="flex items-center gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600">Select Section</label>
                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="mt-1 p-2 border rounded">
                  {Array.from(sections).filter(s => attemptedSectionIds.includes(s.sectionId)).map(s => (
                    <option key={s.sectionId} value={s.sectionId}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-medium">All Questions</h3>
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">

              {attempt_data.map((a, idx) => {
                const q = a.question_detail
                
                let ans = ''
                if (q.questionType === 'MCQ')
                  ans = a.selected_option_identifier
                else if (q.questionType === 'NUM')
                  ans = a.numerical_answer
                const status = ans ? (a.is_correct === true ? 'correct' : (a.is_correct === false ? 'wrong' : 'not_answered')) : 'not_answered'
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
                const ans = attempt_data.find(a => a.question_detail.questionId === activeQuestionId)
                const q = ans.question_detail

                // const ans = answers.find(a => a.questionId === activeQuestionId)
                // const selectedOption = q.options ? q.options.find(o => o.optionId === ans?.selectedOptionId) : null
                return (
                  <div>
                    <div className="mb-2 font-semibold">Q. {q.number}. <QuestionRenderer text={q.questionText} /></div>
                    {q.questionType === 'MCQ' ? (
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Options:</div>
                        <div className="p-3 bg-gray-50 rounded space-y-2">
                          {q.options && q.options.length ? (
                            q.options.map((o) => {
                              const isMarked = ans?.selected_option_identifier === o.identifier
                              const isCorrect = ans.correct_answer?.mcq_correct_option === o.identifier
                              return (
                                <div key={o.optionId} className={`flex items-start gap-3 p-2 rounded ${isMarked ? 'bg-blue-50 border border-blue-200' : 'bg-white'} ${isCorrect ? 'ring-1 ring-green-100' : ''}`}>
                                  <div className="font-semibold">{o.identifier} —</div>
                                  <div className="flex-1">
                                  <MathField latex={String(o.text).replace(/\\\\/g, '\\') || ''} />
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
                            ans.numerical_answer ? (
                              <div className="text-sm font-medium">{ans.numerical_answer}</div>
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
                        {q.questionType === 'MCQ' ? (
                          (() => {
                            const correctOpt = q.options?.find(o => o.identifier === ans.correct_answer?.mcq_correct_option)
                            const correctText = correctOpt?.text || 'N/A'
                            // console.log(correctText);
                            
                            return (
                              <div className="flex items-start gap-2">
                                <div className="font-semibold">{ans.correct_answer?.mcq_correct_option} —</div>
                                <div className="flex-1">
                                  <MathField latex={String(correctText).replace(/\\\\/g, '\\') || ''} />
                                </div>
                              </div>
                            )
                          })()
                        ) : (<>
                          <MathField latex={String(ans.correct_answer?.numerical_answer || '')} />
                          {ans.correct_answer?.numerical_answer_range_max && (
                            <span><br></br>Range :  {ans.correct_answer?.numerical_answer_range_min} - {ans.correct_answer?.numerical_answer_range_max} </span>
                        )}
                        </>)}

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
