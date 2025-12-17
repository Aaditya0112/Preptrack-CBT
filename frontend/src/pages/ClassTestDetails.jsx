import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import InfoCard from '../components/performance/InfoCard';
import { Info } from 'lucide-react';


// Helper to generate Gaussian distribution points
const generateGaussianData = (mean, stdDev, points = 50) => {
  const data = [];
  const min = mean - 3.5 * stdDev;
  const max = mean + 3.5 * stdDev;
  const step = (max - min) / points;

  for (let x = min; x <= max; x += step) {
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    data.push({ x, y });
  }
  return data;
};

export default function ClassTestDetails() {
  const { testId } = useParams();
  const navigate = useNavigate();

  // Mock Data - In a real app, fetch based on testId
  const testData = {
    name: `Test ${testId || 'Unknown'}`,
    stats: {
      max: 98,
      min: 42,
      avg: 76,
      median: 78,
      stdDev: 12,
    },
    difficulty: [
      { id: 0, value: 30, label: 'Easy', color: '#4ade80' },
      { id: 1, value: 45, label: 'Medium', color: '#facc15' },
      { id: 2, value: 25, label: 'Hard', color: '#f87171' },
    ],
    errorBreakdown: [
      { id: 0, value: 40, label: 'Easy', color: '#4ade80' },
      { id: 1, value: 25, label: 'Medium', color: '#facc15' },
      { id: 2, value: 35, label: 'Hard', color: '#f87171' },
    ],
  };

  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const errorTooltipRef = useRef(null);
  const errorBtnRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (errorTooltipRef.current && !errorTooltipRef.current.contains(e.target) && errorBtnRef.current && !errorBtnRef.current.contains(e.target)) {
        setShowErrorTooltip(false);
      }
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  const gaussianData = useMemo(() => 
    generateGaussianData(testData.stats.avg, testData.stats.stdDev), 
    [testData.stats.avg, testData.stats.stdDev]
  );

  const cards = [
    { title: 'Max Score', value: `${testData.stats.max}%`, requiresInfo: false },
    { title: 'Min Score', value: `${testData.stats.min}%`, requiresInfo: false },
    { title: 'Average', value: `${testData.stats.avg}%`, requiresInfo: true, Info: 'Class average score' },
    { title: 'Median', value: `${testData.stats.median}%`, requiresInfo: true, Info: 'Middle score of the class' },
    { title: 'Std Dev', value: testData.stats.stdDev, requiresInfo: true, Info: 'Standard Deviation (Spread of scores)' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{testData.name} Details</h2>
          <p className="text-gray-500 text-sm">Comprehensive class performance analysis</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <InfoCard key={i} c={c} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Difficulty Analysis</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <PieChart
              series={[
                {
                  data: testData.difficulty,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={200}
              width={400}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Distribution of questions by difficulty level
          </p>
        </div>

        {/* Error Breakdown Pie Chart */}
        <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Error Breakdown</h3>
              <button
                  ref={errorBtnRef}
                  onClick={(e) => {
                      e.stopPropagation();
                      setShowErrorTooltip((s) => !s);
                  }}
                  className="text-gray-500 hover:text-gray-700"
              >
                  <Info size={18} />
              </button>
          </div>

          {showErrorTooltip && (
              <div ref={errorTooltipRef} className="absolute top-14 right-6 z-20 w-72 bg-white border rounded-lg shadow-lg p-4 text-sm">
                  <div className="font-bold mb-2">Where are they losing marks?</div>
                  <p className="text-gray-600">This chart breaks down the students' wrong answers by difficulty level.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><span className="font-semibold">Large "Easy" Slice:</span> Indicates carelessness. Students may need to slow down and double-check their work.</li>
                      <li><span className="font-semibold">Large "Hard" Slice:</span> Suggests knowledge gaps in complex topics. Students understand the basics but struggle with advanced concepts.</li>
                  </ul>
              </div>
          )}

          <div className="h-64 w-full flex items-center justify-center">
              <PieChart
                  series={[
                      {
                          data: testData.errorBreakdown,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      },
                  ]}
                  height={200}
                  width={400}
              />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
              Breakdown of marks lost by question difficulty
          </p>
        </div>

        {/* Gaussian Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Score Distribution (Gaussian)</h3>
          <div className="h-64 w-full">
            <LineChart
              dataset={gaussianData}
              xAxis={[{ 
                dataKey: 'x', 
                label: 'Score',
                min: 40,
                max: 120,
                valueFormatter: (v) => Math.round(v).toString()
              }]}
              series={[
                {
                  dataKey: 'y',
                  showMark: false,
                  area: true,
                  color: '#818cf8',
                  label: 'Student Density',
                },
              ]}
              height={250}
              margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Bell curve showing the spread of student scores
          </p>
        </div>
      </div>
    </div>
  );
}
