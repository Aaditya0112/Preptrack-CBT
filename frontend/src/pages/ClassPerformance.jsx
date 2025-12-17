import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import SnapshotCards from '../components/performance/SnapshotCards';

// Mock data for box plot
const boxPlotData = [
  {
    x: 'Test 1',
    y: [54, 66, 69, 75, 88],
  },
  {
    x: 'Test 2',
    y: [43, 65, 69, 76, 81],
  },
  {
    x: 'Test 3',
    y: [31, 39, 45, 51, 59],
  },
  {
    x: 'Test 4',
    y: [39, 46, 55, 65, 71],
  },
  {
    x: 'Test 5',
    y: [29, 31, 35, 39, 44],
  },
  {
    x: 'Test 6',
    y: [29, 31, 35, 39, 44],
  },
  {
    x: 'Test 7',
    y: [29, 31, 35, 39, 44],
  },
];

const ClassBoxPlot = () => {
    const navigate = useNavigate();
  
    const options = {
      chart: {
        type: 'boxPlot',
        height: 350,
        events: {
            markerClick: function(event, chartContext, { seriesIndex, dataPointIndex }) {
                const testId = dataPointIndex + 1; // Assuming test IDs are sequential
                navigate(`/class-performance/test/${testId}`);
            }
        }
      },
      title: {
        text: 'Class Test Performance Distribution',
        align: 'left',
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: '#5C4742',
            lower: '#A5978B'
          }
        }
      },
      tooltip: {
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            const [min, q1, median, q3, max] = data.y;
            return `<div class="p-2">
                <strong>${data.x}</strong><br/>
                Max: ${max}<br/>
                Q3: ${q3}<br/>
                Median: ${median}<br/>
                Q1: ${q1}<br/>
                Min: ${min}<br/>
                <button class="mt-2 px-2 py-1 bg-indigo-600 text-white rounded text-xs" onclick="document.getElementById('view-details-btn-${dataPointIndex}').click()">View Details</button>
                <a href="/class-performance/test/${dataPointIndex + 1}" id="view-details-btn-${dataPointIndex}" style="display:none"></a>
            </div>`;
        }
      }
    };
  
    const series = [
      {
        name: 'Scores',
        type: 'boxPlot',
        data: boxPlotData,
      },
    ];
  
    return <Chart options={options} series={series} type="boxPlot" height={350}  />;
};

export default function ClassPerformance() {
  const navigate = useNavigate();
  // sample metrics for class view
  const cards = useMemo(
    () => [
      { title: 'Avg Score', value: '72%', requiresInfo: true, Info: 'Average score across all students in the class.' },
      { title: 'Class Accuracy', value: '78%', requiresInfo: true, Info: 'Percentage of correct answers across all students.' },
      { title: 'Topper Score', value: '98%', requiresInfo: false },
      { title: 'Pass Rate', value: '89%', requiresInfo: true, Info: 'Share of students scoring above pass threshold.' },
    ],
    []
  );

  const students = [
    { name: 'Aarav', score: 88 },
    { name: 'Maya', score: 76 },
    { name: 'Rohan', score: 52 },
    { name: 'Sara', score: 94 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Class Performance</h2>
        <div className="text-sm text-gray-500">Overview & metrics</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SnapshotCards cards={cards} />

          <div className="bg-white p-4 rounded shadow">
            <ClassBoxPlot />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="font-medium mb-2">Top Students</div>
            <div className="space-y-2">
              {students.map((s) => (
                <div key={s.name} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="font-medium mb-2">Class Summary</div>
            <div className="text-sm text-gray-600 space-y-2">
              <div>Total Students: <strong>42</strong></div>
              <div>Tests This Term: <strong>6</strong></div>
              <div>Average Time/Q: <strong>36s</strong></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="font-medium mb-2">Quick Actions</div>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-2 bg-indigo-600 text-white rounded">Export Report</button>
              <button className="px-3 py-2 border rounded">Message Class</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
