import React from 'react';

export default function Numpad({ value, onChange }) {
  const buttons = ['1','2','3','4','5','6','7','8','9','.','0','-'];

  const handleInput = (char) => {
    if (char === '-') {
      onChange(value.startsWith('-') ? value.substring(1) : '-' + value);
    } else if (char === '.') {
      if (!value.includes('.')) onChange(value + '.');
    } else {
      onChange(value + char);
    }
  };

  const handleBackspace = () => onChange(value.slice(0, -1));
  const handleClear = () => onChange('');

  return (
    <div className="my-4 w-full">
      <input type="text" readOnly value={value} className="w-1/5 p-1 border border-gray-300 rounded-lg text-lg shadow-inner" />
      <div className="grid w-1/5 grid-cols-3 gap-1 mt-3">
        {buttons.map(btn => (
          <button key={btn} onClick={() => handleInput(btn)} className="p-1 bg-gray-100 text-black rounded-lg text-xl  hover:bg-gray-200 transition-colors">{btn}</button>
        ))}
        <button onClick={handleBackspace} className="p-1 bg-yellow-400 rounded-lg text-xl hover:bg-yellow-500 transition-colors col-span-2">Backspace</button>
        <button onClick={handleClear} className="p-1 bg-red-500 text-white rounded-lg text-xl font-semibold hover:bg-red-600 transition-colors">Clear</button>
      </div>
    </div>
  );
}
