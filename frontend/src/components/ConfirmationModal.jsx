import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ message, onConfirm, onCancel, title = "Confirm Action" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700">{message}</p>
          </div>
          {onCancel && (
            <button 
              onClick={onCancel} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onCancel} 
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

