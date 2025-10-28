import React, { useContext, useMemo } from 'react';
import { AssessmentContext, QUESTION_STATUS } from '../context/assessmentContext';
import StatusLegend from './StatusLegend.jsx';

export default function QuestionPalette() {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  const dispatch = ctx?.dispatch;

  const stats = useMemo(() => {
    const counts = {
      [QUESTION_STATUS.ANSWERED]: 0,
      [QUESTION_STATUS.NOT_ANSWERED]: 0,
      [QUESTION_STATUS.MARKED_FOR_REVIEW]: 0,
      [QUESTION_STATUS.ANSWERED_AND_MARKED]: 0,
      [QUESTION_STATUS.NOT_VISITED]: 0,
    };
    if (state && state.answers) {
      Object.values(state.answers).forEach(q => { counts[q.status]++; });
    }
    return counts;
  }, [state?.answers]);

  const getStatusColor = (status) => {
    switch (status) {
      case QUESTION_STATUS.ANSWERED:
        return { img: 'src/assets/answered.png',classes: 'text-white' };
      case QUESTION_STATUS.NOT_ANSWERED:
        return { img: 'src/assets/not-answered01.png', classes: 'text-white' };
      case QUESTION_STATUS.MARKED_FOR_REVIEW:
        return { img: 'src/assets/mark-review.jpg', classes: 'text-white' };
      case QUESTION_STATUS.ANSWERED_AND_MARKED:
        return { img: 'src/assets/answer-review.jpg', classes: 'text-white relative' };
      case QUESTION_STATUS.NOT_VISITED:
      default:
        return { img: 'src/assets/not-visited.png', classes: 'text-gray-800' };
    }
  };

  const currentSection = state?.sections?.find(section => section.id === state?.currentSectionId);

  return (
    <div className=" flex flex-col grow bg-white shadow-md overflow-y-auto">
      <StatusLegend stats={stats} />
      <div className='border flex-1 overflow-auto border-black bg-sky-100 max-h-full'>
        {!state && (
          <div className="p-4 text-gray-600">Loading questions...</div>
        )}

        {state && currentSection && (
          <div key={currentSection.id}>
            <h5 className="font-semibold p-2 bg-blue-400 text-white">{currentSection.name}</h5>
            <h3 className='p-2'>Choose a Question</h3>
            <div className="grid grid-cols-5 gap-2 p-3 rounded-b-lg">
              {state.questions.map((q, index) => {
                if (q.sectionId === currentSection.id) {
                  const status = state.answers[q.id].status;
                  const isAnsweredAndMarked = status === QUESTION_STATUS.ANSWERED_AND_MARKED;
                  const isActive = index === state.currentQuestionIndex;

                  const statusMeta = getStatusColor(status);

                  return (
                    <button key={q.id} onClick={() => dispatch({ type: 'GO_TO_QUESTION', payload: index })} className={`relative w-10 h-10  transition-all flex items-center justify-center overflow-hidden rounded ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:opacity-80'}`} title={`Question ${index + 1}: ${status}`}>
                      {statusMeta?.img && (
                        <img src={statusMeta.img} alt={status} className="absolute inset-0 w-full h-full object-cover pointer-events-none" onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/40x40?text=?'}} />
                      )}
                      <span className={`relative z-10 text-center text-sm font-semibold ${statusMeta?.classes || 'text-gray-800'} rounded px-1`}>{index + 1}</span>
                      {isAnsweredAndMarked && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
