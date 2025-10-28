import React, { useContext, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AssessmentContext } from '../context/assessmentContext';

export default function SectionTabs() {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  const dispatch = ctx?.dispatch;
  const scrollContainerRef = useRef(null);

  const goToSection = (sectionId) => {
    if (!state || !dispatch) return;
    const firstQuestionOfSectionIndex = state.questions.findIndex(q => q.sectionId === sectionId);
    if (firstQuestionOfSectionIndex !== -1) {
      dispatch({ type: 'GO_TO_QUESTION', payload: firstQuestionOfSectionIndex });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className=" bg-white mb-2">
      <div className="flex justify-between items-center h-full">
        <button onClick={scrollLeft} className="p-3 bg-gray-200 hover:bg-gray-300 shrink-0">
          <ChevronLeft size={18} />
        </button>
        <div ref={scrollContainerRef} className="flex  items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
          {!state ? (
            <div className="p-2 text-gray-600">Loading sections...</div>
          ) : (
            state.sections.map(section => (
              <button
                key={section.id}
                onClick={() => goToSection(section.id)}
                className={`py-2 px-4 border border-gray-300 font-medium whitespace-nowrap transition-colors ${
                  state.currentSectionId === section.id
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.name}
              </button>
            ))
          )}
        </div>
        <button onClick={scrollRight} className="p-3 bg-gray-200 hover:bg-gray-300 shrink-0">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
