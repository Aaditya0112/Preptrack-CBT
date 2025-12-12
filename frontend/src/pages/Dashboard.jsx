import React from 'react';
import EXAMS from '../data/examsList';
import { COACHINGMATERIALS } from '../data/coachingMaterial'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleSelect = (examId) => {
    // navigate to /preview and pass examId in location state
    navigate('/preview', { state: { examId } });
  };

  const openSubject = (id) => {
    navigate(`/topics/${id}`)
  }

  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Practice Papers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMS.map((e) => (
            <article key={e.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow" onClick={() => handleSelect(e.id)}>
              <div className="h-44 bg-gray-200">
                <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{e.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{e.subtitle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Duration: {Math.round((e.exam?.durationInSeconds || 0) / 60)} mins</span>
                  <button onClick={(ev) => { ev.stopPropagation(); handleSelect(e.id); }} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Start</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
      </div>
      <hr className='p-2 m-4 border-t-gray-300'/>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Coaching Materials</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COACHINGMATERIALS.map((m) => (
            <article key={m.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow" onClick={() => openSubject(m.id)}>
              <div className="h-44 bg-gray-200">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.subtitle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Recommended: {m.recommendedDurationMins} mins</span>
                  <button onClick={(ev) => { ev.stopPropagation(); openSubject(m.id); }} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">View Topics</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
      </div>
    </div>
  );
}
