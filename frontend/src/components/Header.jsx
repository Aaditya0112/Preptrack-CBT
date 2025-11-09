import React from 'react';
import { FileText, Info, ArrowLeft } from 'lucide-react';

export default function Header({ examTitle, onBack }) {
  return (
    <header className="bg-blue-400 text-white p-3 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 rounded bg-white/20 hover:bg-white/30">
            <ArrowLeft size={18} />
          </button>
        )}
        <h1 className="text-2xl font-bold">PrepTrack Computer Based Test</h1>
      </div>
      <h2 className="text-xl ml-6 hidden sm:block">{examTitle}</h2>
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 p-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors">
          <FileText size={18} />
          <span className="hidden md:inline">Question Paper</span>
        </button>
        <button className="flex items-center space-x-1 p-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors">
          <Info size={18} />
          <span className="hidden md:inline">Instructions</span>
        </button>
      </div>
    </header>
  );
}
