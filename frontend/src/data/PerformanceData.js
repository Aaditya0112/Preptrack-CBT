// Centralized performance data used by the Performance page
// Keep this file focused on static/sample data and small deterministic generators

const daysAgo = (d) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString().slice(0, 10);
};

export const labels = [
  "Test1",
  "Test2",
  "Test3",
  "Test4",
  "Test5",
  "Test6",
  "Test7",
  "Test8",
  "Test9",
  "Test10",
];

export const values = [90, 86, 63, 69, 73, 94, 82, 75, 68, 67];

export function genDummyTests(count = 12) {
  const subjects = ["Physics", "Chemistry", "Mathematics"];
  return Array.from({ length: count }).map((_, i) => {
    const score = Math.round(40 + Math.random() * 60);
    const accuracy = Math.round(30 + Math.random() * 70);
    const timeTaken = Math.round(30 + Math.random() * 90); // minutes
    const date = daysAgo((count - i) * 4);
    const subjectBreakdown = subjects.map((s) => ({
      subjectName: s,
      score: Math.round(30 + Math.random() * 70),
      accuracy: Math.round(20 + Math.random() * 80),
    }));
    return {
      testId: `t${i + 1}`,
      name: `Practice ${i + 1}`,
      date,
      score,
      accuracy,
      timeTaken,
      subjectBreakdown,
    };
  });
}

export const cards = [
  {
    title: "Previous Test Rank ",
    value: `20`,
    requiresInfo: true,
    Info: `Rank Based on last Mock test given.`,
  },
  { title: "Accuracy", value: `82%`, requiresInfo: false },
  { title: "Avg. Time Taken", value: `35 sec/question`, requiresInfo: false },
  {
    title: "Consistency Score",
    value: `85%`,
    requiresInfo: true,
    Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
  },
];

export const subjectMetrics = [
  {
    title: "Avg. Score ",
    value: `20%`,
    requiresInfo: true,
    Info: `This score is normalized for all the test given`,
  },
  { title: "Accuracy", value: `75%`, requiresInfo: false },
  { title: "Avg. Time Taken", value: `25 sec/question`, requiresInfo: false },
  {
    title: "Avg. Time Taken / Topic",
    value: `40 mins`,
    requiresInfo: false,
    Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
  },
];

export const subjectData = [
  { topic: "Kinematics", Marks: 70, Accuracy: 80 },
  { topic: "Optics", Marks: 60, Accuracy: 70 },
  { topic: "Thermodynamics", Marks: 80, Accuracy: 90 },
  { topic: "Electrostatics", Marks: 50, Accuracy: 60 },
];

export const performanceData = {
  daily: {
    cards: [
      {
        title: "Previous Test Rank ",
        value: `25`,
        requiresInfo: true,
        Info: `Rank Based on last Mock test given.`,
      },
      { title: "Accuracy", value: `75%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `40 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Consistency Score",
        value: `80%`,
        requiresInfo: true,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectMetrics: [
      {
        title: "Avg. Score ",
        value: `15%`,
        requiresInfo: true,
        Info: `This score is normalized for all the test given`,
      },
      { title: "Accuracy", value: `70%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `30 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Avg. Time Taken / Topic",
        value: `35 mins`,
        requiresInfo: false,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectData: [
      { topic: "Kinematics", Marks: 65, Accuracy: 75 },
      { topic: "Optics", Marks: 55, Accuracy: 65 },
      { topic: "Thermodynamics", Marks: 75, Accuracy: 85 },
      { topic: "Electrostatics", Marks: 45, Accuracy: 55 },
    ],
    trendChartData: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [65, 68, 72, 70, 75, 78, 80],
    },
  },
  weekly: {
    cards: [
      {
        title: "Previous Test Rank ",
        value: `20`,
        requiresInfo: true,
        Info: `Rank Based on last Mock test given.`,
      },
      { title: "Accuracy", value: `82%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `35 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Consistency Score",
        value: `85%`,
        requiresInfo: true,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectMetrics: [
      {
        title: "Avg. Score ",
        value: `20%`,
        requiresInfo: true,
        Info: `This score is normalized for all the test given`,
      },
      { title: "Accuracy", value: `75%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `25 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Avg. Time Taken / Topic",
        value: `40 mins`,
        requiresInfo: false,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectData: [
      { topic: "Kinematics", Marks: 70, Accuracy: 80 },
      { topic: "Optics", Marks: 60, Accuracy: 70 },
      { topic: "Thermodynamics", Marks: 80, Accuracy: 90 },
      { topic: "Electrostatics", Marks: 50, Accuracy: 60 },
    ],
    trendChartData: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [70, 75, 72, 80],
    },
  },
  monthly: {
    cards: [
      {
        title: "Previous Test Rank ",
        value: `15`,
        requiresInfo: true,
        Info: `Rank Based on last Mock test given.`,
      },
      { title: "Accuracy", value: `85%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `30 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Consistency Score",
        value: `90%`,
        requiresInfo: true,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectMetrics: [
      {
        title: "Avg. Score ",
        value: `25%`,
        requiresInfo: true,
        Info: `This score is normalized for all the test given`,
      },
      { title: "Accuracy", value: `80%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `20 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Avg. Time Taken / Topic",
        value: `45 mins`,
        requiresInfo: false,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectData: [
      { topic: "Kinematics", Marks: 75, Accuracy: 85 },
      { topic: "Optics", Marks: 65, Accuracy: 75 },
      { topic: "Thermodynamics", Marks: 85, Accuracy: 95 },
      { topic: "Electrostatics", Marks: 55, Accuracy: 65 },
    ],
    trendChartData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [75, 78, 82, 80, 85, 88],
    },
  },
  overall: {
    cards: [
      {
        title: "Previous Test Rank ",
        value: `10`,
        requiresInfo: true,
        Info: `Rank Based on last Mock test given.`,
      },
      { title: "Accuracy", value: `90%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `25 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Consistency Score",
        value: `95%`,
        requiresInfo: true,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectMetrics: [
      {
        title: "Avg. Score ",
        value: `30%`,
        requiresInfo: true,
        Info: `This score is normalized for all the test given`,
      },
      { title: "Accuracy", value: `85%`, requiresInfo: false },
      {
        title: "Avg. Time Taken",
        value: `15 sec/question`,
        requiresInfo: false,
      },
      {
        title: "Avg. Time Taken / Topic",
        value: `50 mins`,
        requiresInfo: false,
        Info: `Measures how stable the student’s scores are over recent tests, i.e., in how many tests the student scored more than 80%.`,
      },
    ],
    subjectData: [
      { topic: "Kinematics", Marks: 80, Accuracy: 90 },
      { topic: "Optics", Marks: 70, Accuracy: 80 },
      { topic: "Thermodynamics", Marks: 90, Accuracy: 100 },
      { topic: "Electrostatics", Marks: 60, Accuracy: 70 },
    ],
    trendChartData: {
      labels: ["test1", "test2", "test3", "test4"],
      values: [80, 85, 82, 90],
    },
  },
};

export default {
  labels,
  values,
  genDummyTests,
  cards,
  subjectMetrics,
  subjectData,
  performanceData,
};
