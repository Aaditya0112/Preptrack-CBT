import React from 'react';
import { X } from 'lucide-react';

export default function AlertModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-yellow-600">Alert</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <button onClick={onClose} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">OK</button>
      </div>
    </div>
  );
}
