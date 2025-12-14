import React, { useState } from "react";
import { motion } from "framer-motion";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import {BarChart, PieChart } from "@mui/x-charts";
import TrendChart from "./TrendChart";
import InfoCard from "./InfoCard";
import SnapshotCards from "./SnapshotCards";
import TopicWeakness from "./TopicWeakness";
import Recommendations from "./Recommendations";

const colors = {
  notAttempted: "#9CA3AF",
  correct: "#10B981",
  incorrect: "#EF4444",
};


export default function SubjectAnalysis({
  subjectName,
  tests,
  subjectMetrics,
  subjectData,
  TrendChartLabels,
  TrendChartValues
}) {
  const [basis, setBasis] = useState("marks");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleBasisChange = (event, newBasis) => {
    if (newBasis) {
      setBasis(newBasis);
    }
  };
  const chartSetting = {
    xAxis: [
      {
        label: `${basis == "marks" ? "Marks" : "Accuracy"}`,
      },
    ],
    height: 300,

    margin: { left: 20, right: 20 },
  };

  function genSparkData(key) {
    // deterministic pseudo-random based on topic string
    let seed = 0;
    for (let i = 0; i < key.length; i++)
      seed = (seed << 5) - seed + key.charCodeAt(i);
    const arr = Array.from({ length: 8 }).map((_, i) => {
      const x = Math.abs(Math.sin(seed + i * 13));
      return Math.round(40 + x * 60);
    });
    return arr;
  }

  function valueFormatter(value) {
    return `${value}`;
  }

  const stats = [
    { difficulty: "Easy", correct: 80, incorrect: 15, notAttempted: 5 },
    { difficulty: "Medium", correct: 65, incorrect: 25, notAttempted: 10 },
    { difficulty: "Hard", correct: 50, incorrect: 35, notAttempted: 15 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{subjectName} Summary</div>
            <div className="text-2xl font-bold">70%</div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>
              Accuracy <span className="font-semibold">90%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded shadow">
        <div className="font-medium mb-2">Metrics</div>
        <SnapshotCards cards={subjectMetrics} />
      </div>

      <div className="bg-white p-3 rounded shadow">
        <TopicWeakness tests={tests} />
      </div>

      <div className="bg-white p-3 rounded shadow">
        <TrendChart labels={TrendChartLabels} values={TrendChartValues}/>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Topic-wise Performance</div>
          <ToggleButtonGroup
            size="small"
            value={basis}
            exclusive
            onChange={handleBasisChange}
            aria-label="chart basis"
          >
            <ToggleButton value="marks" aria-label="marks">
              Marks
            </ToggleButton>
            <ToggleButton value="time" aria-label="time taken">
              Accuracy
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <BarChart
          dataset={subjectData}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "topic",
              categoryGapRatio: 0.3,
              barGapRatio: 0.1,
            },
          ]}
          series={[
            {
              dataKey: `${basis == "marks" ? "Marks" : "Accuracy"}`,
              label: `${basis == "marks" ? "Marks" : "Accuracy"}`,
              valueFormatter,
            },
          ]}
          layout="horizontal"
          {...chartSetting}
        />
      </div>

      <div className="bg-white p-3 rounded shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Detailed Analysis</div>
          <div className="text-sm text-gray-500">
            Click a topic to view details
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subjectData.map((t) => (
            <button
              key={t.topic}
              onClick={() => setSelectedTopic(t)}
              className="w-full bg-gray-50 hover:bg-indigo-50 text-gray-700 rounded-lg px-3 py-4 text-sm text-center shadow-sm transition"
            >
              {t.topic}
            </button>
          ))}
        </div>
      </div>

      {selectedTopic && (
        <>
          <div
            className="fixed inset-0 h-full bg-black/50 z-40"
            onClick={() => setSelectedTopic(null)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 top-16 ">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full  overflow-hidden">
              <div className="flex items-start justify-between p-4 border-b">
                <div>
                  <div className="text-lg font-semibold">
                    {selectedTopic.topic}
                  </div>
                  <div className="text-xs text-gray-500">
                    Detailed topic analysis
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="text-sm text-gray-600 mb-2">
                  Difficulty Breakdown
                </div>
                <div className="flex flex-row items-center w-full justify-center">
                  <div
                    style={{ height: "100" }}
                    className="flex flex-row items-center justify-center gap-4"
                  >

                    {stats.map((s) => (
                        <div key={s.difficulty} className="flex flex-col items-center">
                        <div className="font-semibold mb-2">{s.difficulty}</div>
                      <div
                        key={s.difficulty}
                        className="flex flex-row bg-white p-3 rounded shadow text-center"
                      >
                        
                        <div style={{ height: 100 }}>
                          <PieChart
                            series={[
                              {
                                data: [
                                  {
                                    value: s.notAttempted,
                                    label: "Not Attempted",
                                    color: colors.notAttempted,
                                  },
                                  {
                                    value: s.correct,
                                    label: "Correct",
                                    color: colors.correct,
                                  },
                                  {
                                    value: s.incorrect,
                                    label: "Incorrect",
                                    color: colors.incorrect,
                                  },
                                ],
                                // arcLabel: getArcLabel
                              },
                            ]}
                            height={100}
                            width={100}
                            hideLegend
                          />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div>
                            Correct:{" "}
                            <span className="font-semibold">{s.correct}%</span>
                          </div>
                          <div>
                            Incorrect:{" "}
                            <span className="font-semibold">
                              {s.incorrect}%
                            </span>
                          </div>
                          <div>
                            Not Attempted:{" "}
                            <span className="font-semibold">
                              {s.notAttempted}%
                            </span>
                          </div>
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                  
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Recent Trend</div>
                  <div className="bg-gray-50 p-4 rounded">
                    <SparkLineChart
                      data={genSparkData(selectedTopic.topic)}
                      height={120}
                      width={420}
                      area
                      color="#6366F1"
                      showHighlight
                    />
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Quick stats</div>
                  <div className="mt-2 flex gap-3 text-sm">
                    <div className="bg-gray-100 px-3 py-2 rounded">
                      Avg Time Spent: <strong>45m</strong>
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded">
                      Attempts: <strong>12</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-white p-3 rounded shadow">
        <Recommendations />
      </div>
    </div>
  );
}
