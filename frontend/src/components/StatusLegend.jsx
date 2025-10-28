import React from 'react';
import { QUESTION_STATUS } from '../context/assessmentContext';

export default function StatusLegend({ stats = {} }) {
	const legendItems = [
		{ status: QUESTION_STATUS.ANSWERED, label: 'Answered', count: stats[QUESTION_STATUS.ANSWERED] || 0, icon: 'src/assets/answered.png' },
		{ status: QUESTION_STATUS.NOT_ANSWERED, label: 'Not Answered', count: stats[QUESTION_STATUS.NOT_ANSWERED] || 0, icon: 'src/assets/not-answered01-small.png' },
		{ status: QUESTION_STATUS.MARKED_FOR_REVIEW, label: 'Marked for Review', count: stats[QUESTION_STATUS.MARKED_FOR_REVIEW] || 0, icon: 'src/assets/mark-review.jpg' },
		{ status: QUESTION_STATUS.ANSWERED_AND_MARKED, label: 'Answered & Marked', count: stats[QUESTION_STATUS.ANSWERED_AND_MARKED] || 0, icon: 'src/assets/answer-review.jpg', badge: true },
		{ status: QUESTION_STATUS.NOT_VISITED, label: 'Not Visited', count: stats[QUESTION_STATUS.NOT_VISITED] || 0, icon: 'src/assets/not-visited.jpg' },
	];

	return (
		<div className="p-4 bg-white border border-black border-solid shadow-md">
			<div className="space-y-3">
				{legendItems.map(item => (
					<div key={item.status} className="flex items-center justify-start space-x-3 text-sm">
						<div className="relative w-8 h-8 shrink-0">
							{item.icon ? (
								<img
									src={item.icon}
									alt={item.label}
									className="w-full h-full object-contain rounded-md"
									onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=?'; }}
								/>
							) : (
								<div className="w-full h-full bg-gray-200 rounded-md" />
							)}

							<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
								<div className={`w-7 h-7 rounded-full flex items-center justify-center text-s font-semibold z-10 ${item.status === QUESTION_STATUS.NOT_VISITED ? 'text-black' : 'text-white bg-transparent'}`}>
									{item.count}
								</div>
							</div>

							{item.badge && (
								<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
							)}
						</div>

						<div className="flex-1">
							<div className="text-sm font-medium text-gray-800">{item.label}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
