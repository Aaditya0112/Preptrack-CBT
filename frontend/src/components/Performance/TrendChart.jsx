import React, { useState } from 'react';
import { LineChart, BarChart } from '@mui/x-charts';

export default function TrendChart({ labels = [], values = [],height = 300, title = 'Performance Trend' }) {
  const [chartType, setChartType] = useState('line');
  const lineSeries = [
      {
        id: "scores",
        data: values,
        label: "Score",
        color: "#3b82f6",
      },
    ];
    const barSeries = [{ data: values, label: "Score", color: "#3b82f6" }];

  return (
    <div className="bg-white p-4 rounded shadow relative">
      <div className="text-sm font-medium mb-2">{title}</div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setChartType('line')}
          aria-label="Line chart"
          title="Line chart"
          className={`p-1 rounded ${chartType === 'line' ? 'bg-gray-100' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 17 9 11 13 15 21 7" />
          </svg>
        </button>
        <button
          onClick={() => setChartType('bar')}
          aria-label="Bar chart"
          title="Bar chart"
          className={`p-1 rounded ${chartType === 'bar' ? 'bg-gray-100' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="4" height="18" />
            <rect x="10" y="8" width="4" height="13" />
            <rect x="17" y="13" width="4" height="8" />
          </svg>
        </button>
      </div>

      <div style={{ height }}>
        {chartType === 'bar' ? (
          <BarChart xAxis={[{ scaleType: 'band', id: 'x', data: labels }]} series={barSeries} height={height} legend={false} />
        ) : (
          <LineChart series={lineSeries} xAxis={[{ scaleType: 'point', id: 'x', data: labels }]} height={height} margin={{ right: 24, bottom: 24 }} />
        )}
      </div>
    </div>
  );
}
