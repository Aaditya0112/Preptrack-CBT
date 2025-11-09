import { EXAM_DATA } from './examData';

// Simple exams list for Dashboard. For now we clone the single EXAM_DATA with different titles/images.
export const EXAMS = [
  {
    id: 'jee-sample-1',
    title: 'JEEA 2025 - Paper 1',
    subtitle: 'Full length practice',
    image: 'https://placehold.co/600x360/2563eb/ffffff?text=JEEA+Paper+1',
    exam: EXAM_DATA,
  },
  {
    id: 'jee-sample-2',
    title: 'JEEA 2025 - Paper 2',
    subtitle: 'Sectional practice',
    image: 'https://placehold.co/600x360/10b981/ffffff?text=JEEA+Paper+2',
    exam: { ...EXAM_DATA, examTitle: 'JEEA 2025 - Paper 2' },
  },
  {
    id: 'jee-sample-3',
    title: 'JEEA 2025 - Short Test',
    subtitle: '30 minute quick test',
    image: 'https://placehold.co/600x360/f59e0b/ffffff?text=Quick+Test',
    exam: { ...EXAM_DATA, examTitle: 'JEEA Quick Test', durationInSeconds: 30 * 60 },
  },
];

export default EXAMS;
