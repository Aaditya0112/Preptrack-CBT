import React from 'react';
import QuestionRenderer from './QuestionRenderer';

export default function MCQOptions({ options, selected, onChange }) {
  return (
    <div className="my-3 space-y-4">
      {options.map((option) => (
        <label key={option.id} className={`flex items-center  rounded-lg cursor-pointer transition-all ${selected === option.id ? '' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
          <input type="radio" name="mcq-option" value={option.id} checked={selected === option.id} onChange={() => onChange(option.id)} className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500" />
          <QuestionRenderer text={option.text} inline={true} />
        </label>
      ))}
    </div>
  );
}
