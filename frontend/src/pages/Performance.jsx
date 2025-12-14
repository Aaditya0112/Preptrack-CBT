import React, { useMemo, useState, useRef, useEffect } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { LineChart, PieChart, BarChart, RadarChart } from "@mui/x-charts";

import TrendChart from "../components/performance/TrendChart";
import SubjectAnalysis from "../components/performance/SubjectAnalysis";
import SnapshotCards from "../components/performance/SnapshotCards";
import TopicWeakness from "../components/performance/TopicWeakness";
import {
  labels,
  values,
  genDummyTests,
  cards as performanceCards,
  subjectMetrics as performanceSubjectMetrics,
  subjectData as performanceSubjectData,
} from "../data/PerformanceData";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InfoCard from "../components/performance/InfoCard";
import LevelBadge from "../components/performance/LevelBadge";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import {
  areaElementClasses,
  lineElementClasses,
} from "@mui/x-charts/LineChart";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";


const colors = {
  notAttempted: "#9CA3AF", // gray
  correct: "#10B981", // green
  incorrect: "#EF4444", // red
};


function SubjectGrid() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const settings = {
    baseline: "min",
    margin: { bottom: 0, top: 5, left: 4, right: 0 },
    xAxis: {
      id: "test-axis",
      data: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"],
    },
    yAxis: {
      domainLimit: (_, maxValue) => ({
        min: -maxValue / 6, //  Hack to add 5px bellow 0 like npm.
        max: maxValue,
      }),
    },
    sx: {
      [`& .${areaElementClasses.root}`]: { opacity: 0.2 },
      [`& .${lineElementClasses.root}`]: { strokeWidth: 3 },
      [`& .${chartsAxisHighlightClasses.root}`]: {
        stroke: "rgb(137, 86, 255)",
        strokeDasharray: "none",
        strokeWidth: 2,
      },
    },
    slotProps: {
      lineHighlight: { r: 4 }, // Reduce the radius of the axis highlight.
    },
    clipAreaOffset: { top: 2, bottom: 2 },
    axisHighlight: { x: "line" },
  };
  // aggregate subject scores
const subjects = [
    {
        subjectName: "Physics",
        avgScore: 75,
        accuracy: 82,
    },
    {
        subjectName: "Chemistry",
        avgScore: 68,
        accuracy: 78,
    },
    {
        subjectName: "Mathematics",
        avgScore: 85,
        accuracy: 88,
    },
];

  const [active, setActive] = useState(null);

  const handleClick = (subjectName) => {
    setActive(subjectName);
    // navigate after a brief delay to allow framer-motion to capture layout
    setTimeout(() => {
      navigate(`/performance/${encodeURIComponent(subjectName)}`);
    }, 240);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {subjects.map((s) => {
        const isActive = active === s.subjectName;
        return (
          <motion.button
            layoutId={`subject-card-${s.subjectName}`}
            key={s.subjectName}
            onClick={() => handleClick(s.subjectName)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`bg-white p-3 rounded shadow transform text-left focus:outline-none hover:shadow-lg`}
            aria-label={`Open ${s.subjectName} performance`}
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold">{s.subjectName}</div>
              <div className="text-xs text-gray-500">Open</div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold">{s.avgScore}%</div>
              <div className="text-xs text-gray-500 mt-1">Avg Score</div>
            </div>

            <SparkLineChart
              data={[1, 4, 2, 5, 7, 2, 4, 6]}
              height={100}
              width={300}
              area
              showHighlight
              color="rgb(137, 86, 255)"
              {...settings}
              showTooltip
            />
            <div className="text-center">
              <span className="font-medium text-sm">Accuracy Trend</span>
            </div>
            <div className="text-center">
              <span className="font-medium text-sm text-purple-600">Click To View Details</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function SubjectRadar({ tests }) {
  // aggregate subject scores (same logic as SubjectGrid)

  const categories = ["Physics", "Chemistry", "Mathematics"];

  const [mode, setMode] = useState("marks");

  if (!categories.length) {
    return (
      <div className="bg-white p-3 rounded shadow text-sm">
        No subject data available
      </div>
    );
  }

  const handleMode = (e, v) => {
    if (v) setMode(v);
  };

  let seriesToShow = [];
  if (mode === "marks")
    seriesToShow = [
      { data: [75, 80, 95], label: "Avg Score", color: "#3b82f6" },
    ];
  if (mode === "accuracy")
    seriesToShow = [
      { data: [100, 82, 90], label: "Accuracy", color: "#10b981" },
    ];

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">Subject Comparison</div>
        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={handleMode}
          aria-label="chart mode"
        >
          <ToggleButton value="marks" aria-label="marks">
            Marks
          </ToggleButton>
          <ToggleButton value="accuracy" aria-label="accuracy">
            Accuracy
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div style={{ height: 320 }}>
        <RadarChart
          categories={categories}
          series={seriesToShow}
          height={320}
          radar={{
            max: 100,
            metrics: ["Physics", "Chemistry", "Mathematics"],
          }}
          fill="transparent"
          legend={{ position: "bottom" }}
        />
      </div>
    </div>
  );
}


function DifficultyPieCharts({ tests }) {

  // deterministic stats based on tests length so UI is stable across renders
const stats = [
    {
        difficulty: "Difficult",
        correct: 45,
        incorrect: 35,
        notAttempted: 20,
    },
    {
        difficulty: "Medium",
        correct: 65,
        incorrect: 20,
        notAttempted: 15,
    },
    {
        difficulty: "Easy",
        correct: 80,
        incorrect: 10,
        notAttempted: 10,
    },
];


  //    console.log('DifficultyPieCharts stats:', stats);
  return (
    <div className="space-y-4">
      <div className="font-medium"> Breakdown by Difficulty</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.difficulty}
            className="bg-white p-3 rounded shadow text-center"
          >
            <div className="font-semibold mb-2">{s.difficulty}</div>
            <div style={{ height: 140 }}>
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
                height={140}
                hideLegend
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div>
                Correct: <span className="font-semibold">{s.correct}%</span>
              </div>
              <div>
                Incorrect: <span className="font-semibold">{s.incorrect}%</span>
              </div>
              <div>
                Not Attempted:{" "}
                <span className="font-semibold">{s.notAttempted}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestTimeline({ tests }) {
  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="font-medium mb-2">Recent Tests</div>
      <div className="space-y-2">
        {tests
          .slice()
          .reverse()
          .map((t) => (
            <div
              key={t.testId}
              className="flex justify-between items-center p-2 rounded hover:bg-gray-50"
            >
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-gray-500">
                  {t.date} • {t.timeTaken} min
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold"> Score : {t.score}%</div>
                <div className="text-xs text-gray-500">Acc {t.accuracy}%</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}



function ComingSoon() {
  return (
    <div className="bg-white p-8 rounded shadow text-center">
      <div className="text-2xl font-semibold mb-2">Coming Soon</div>
      <div className="text-sm text-gray-600">
        Test analytics and reports will appear here shortly.
      </div>
    </div>
  );
}

export default function Performance() {
  const tests = useMemo(() => genDummyTests(12), []);
  const avg = 75;
  const [range, setRange] = useState("30");
  const [activeTab, setActiveTab] = useState("practice");
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subjectName = subjectId ? decodeURIComponent(subjectId) : null;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 20);
    return () => clearTimeout(t);
  }, []);

  // If subjectName is present, build a filtered tests array focused on that subject
  const filteredTests = useMemo(() => {
    if (!subjectName) return tests;
    return tests
      .map((t) => {
        const sb = t.subjectBreakdown.find(
          (s) => s.subjectName === subjectName
        );
        if (!sb) return null;
        return {
          ...t,
          score: sb.score,
          accuracy: sb.accuracy,
          subjectBreakdown: [sb],
        };
      })
      .filter(Boolean);
  }, [tests, subjectName]);

  // Derived metrics for subject detail
  const speed = 35; // time taken per question in seconds
  const acc = 82;
  const rank = 20;
  const consistency = 85;

  // use centralized sample data from data/PerformanceData.js
  const cards = performanceCards;
  const subjectMetrics = performanceSubjectMetrics;
  const subjectData = performanceSubjectData;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Performance</h2>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Daily</option>
            <option value="">Weekly</option>
            <option value="">Monthly</option>
            <option value="all">Overall</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Performance view tabs"
            className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-100/60 p-1 rounded-full shadow-sm"
          >
            <button
              role="tab"
              aria-selected={activeTab === "practice"}
              onClick={() => setActiveTab("practice")}
              className={`px-5 py-2 rounded-full transition-all duration-200 focus:outline-none text-sm font-medium ${
                activeTab === "practice"
                  ? "bg-white shadow text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Practice
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "test"}
              onClick={() => setActiveTab("test")}
              className={`ml-1 px-5 py-2 rounded-full transition-all duration-200 focus:outline-none text-sm font-medium ${
                activeTab === "test"
                  ? "bg-white shadow text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Test
            </button>
          </div>
        </div>
      </div>
      {activeTab === "practice" ? (
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
          <AnimatePresence mode="wait">
            {subjectName && (
              <motion.div
                key="subjectHeader"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className={`lg:col-span-9 mb-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/performance")}
                      className="p-2 rounded bg-white shadow mr-2"
                      aria-label="Back to performance"
                    >
                      ←
                    </button>
                    <h3 className="text-xl font-semibold">
                      {subjectName} — Performance
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    Subject-specific insights
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="lg:col-span-6 space-y-4">
            {/* When viewing a subject, render subject-specific cards (no general overall data). */}
            {!subjectName ? (
              <>
                <LevelBadge avg={avg} />
                <SnapshotCards cards={cards} />
                <TrendChart labels={labels} values={values} />
                <SubjectGrid tests={tests} />
                <SubjectRadar tests={tests} />
              </>
            ) : (
              <>
                <SubjectAnalysis
                  subjectName={subjectName}
                  tests={filteredTests}
                  subjectMetrics={subjectMetrics}
                  subjectData={subjectData}
                  TrendChartLabels={labels}
                  TrendChartValues={values}
                />
              </>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <TopicWeakness tests={subjectName ? filteredTests : tests} />
            <DifficultyPieCharts tests={subjectName ? filteredTests : tests} />
            <TestTimeline tests={subjectName ? filteredTests : tests} />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <ComingSoon />
        </div>
      )}
    </div>
  );
}
