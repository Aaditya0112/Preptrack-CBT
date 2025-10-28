import React, { useContext, useMemo } from 'react';
import { AssessmentContext } from '../context/assessmentContext';

export default function SummaryPage() {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  const dispatch = ctx?.dispatch;

  if (!state || !dispatch) return null;

  const summaryStats = useMemo(() => {
    return state.sections.map(section => {
      const sectionQuestions = state.questions.filter(q => q.sectionId === section.id);
      const stats = { total: sectionQuestions.length, answered: 0, notAnswered: 0, marked: 0, answeredAndMarked: 0, notVisited: 0 };
      sectionQuestions.forEach(q => {
        const status = state.answers[q.id].status;
        switch (status) {
          case 'ANSWERED': stats.answered++; break;
          case 'NOT_ANSWERED': stats.notAnswered++; break;
          case 'MARKED_FOR_REVIEW': stats.marked++; break;
          case 'ANSWERED_AND_MARKED': stats.answeredAndMarked++; break;
          case 'NOT_VISITED': stats.notVisited++; break;
        }
      });
      return { ...section, ...stats };
    });
  }, [state.sections, state.questions, state.answers]);

  const handleFinalSubmit = () => dispatch({ type: 'FINAL_SUBMIT' });
  const handleCancel = () => dispatch({ type: 'TOGGLE_SUMMARY' });
  const isSubmitted = state.timeLeft <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8">
        <h2 className="text-3xl font-bold text-center mb-6">{isSubmitted ? 'Exam Finished' : 'Exit Summary'}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left font-semibold">Section Name</th>
                <th className="p-3 border font-semibold">No. of Qs</th>
                <th className="p-3 border font-semibold">Answered</th>
                <th className="p-3 border font-semibold">Not Answered</th>
                <th className="p-3 border font-semibold">Marked</th>
                <th className="p-3 border font-semibold">Answered & Marked</th>
                <th className="p-3 border font-semibold">Not Visited</th>
              </tr>
            </thead>
            <tbody>
              {summaryStats.map(sec => (
                <tr key={sec.id} className="text-center">
                  <td className="p-3 border text-left">{sec.name}</td>
                  <td className="p-3 border">{sec.total}</td>
                  <td className="p-3 border">{sec.answered}</td>
                  <td className="p-3 border">{sec.notAnswered}</td>
                  <td className="p-3 border">{sec.marked}</td>
                  <td className="p-3 border">{sec.answeredAndMarked}</td>
                  <td className="p-3 border">{sec.notVisited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-lg my-6">{isSubmitted ? 'Your exam has been automatically submitted.' : 'Are you sure you wish to submit this group of questions for marking?'}</p>
        {!isSubmitted && (
          <div className="flex justify-center gap-6">
            <button onClick={handleFinalSubmit} className="py-3 px-10 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">YES</button>
            <button onClick={handleCancel} className="py-3 px-10 bg-gray-400 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 transition-colors">NO</button>
          </div>
        )}
      </div>
    </div>
  );
}
