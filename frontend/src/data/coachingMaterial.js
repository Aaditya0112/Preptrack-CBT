import { EXAM_DATA } from './examData'

// topics array structure for each subject — these will be rendered as cards
const PHYSICS_TOPICS = [
  { topicId: 'phy_kin', title: 'Kinematics', summary: 'Motion, velocity, acceleration, graphs', difficulty: 'Medium', estMinutes: 30 },
  { topicId: 'phy_dyn', title: 'Dynamics', summary: 'Forces, Newton laws, friction', difficulty: 'Medium', estMinutes: 40 },
  { topicId: 'phy_thermo', title: 'Thermodynamics', summary: 'Heat, work, energy, laws', difficulty: 'Hard', estMinutes: 35 },
  { topicId: 'phy_optics', title: 'Optics', summary: 'Reflection, refraction, lenses', difficulty: 'Easy', estMinutes: 25 },
  { topicId: 'phy_em', title: 'Electromagnetism', summary: 'Circuits, fields, magnetism', difficulty: 'Hard', estMinutes: 45 },
  { topicId: 'phy_waves', title: 'Waves & Oscillations', summary: 'SHM, wave equations', difficulty: 'Medium', estMinutes: 30 },
  { topicId: 'phy_mod', title: 'Modern Physics', summary: 'Photoelectric effect, atoms', difficulty: 'Medium', estMinutes: 30 },
]

const CHEMISTRY_TOPICS = [
  { topicId: 'chem_gen', title: 'General Chemistry', summary: 'Stoichiometry, mole concept', difficulty: 'Easy', estMinutes: 30 },
  { topicId: 'chem_inorg', title: 'Inorganic Chemistry', summary: 'Periodic trends, compounds', difficulty: 'Medium', estMinutes: 40 },
  { topicId: 'chem_org', title: 'Organic Chemistry', summary: 'Basic reactions, nomenclature', difficulty: 'Medium', estMinutes: 35 },
  { topicId: 'chem_phys', title: 'Physical Chemistry', summary: 'Thermo, kinetics, equilibrium', difficulty: 'Hard', estMinutes: 45 },
  { topicId: 'chem_analytical', title: 'Analytical Techniques', summary: 'Titrations, spectroscopy basics', difficulty: 'Easy', estMinutes: 25 },
]

const MATH_TOPICS = [
  { topicId: 'mth_alg', title: 'Algebra', summary: 'Equations, inequalities, polynomials', difficulty: 'Medium', estMinutes: 30 },
  { topicId: 'mth_calc', title: 'Calculus', summary: 'Limits, differentiation, integration', difficulty: 'Hard', estMinutes: 45 },
  { topicId: 'mth_geo', title: 'Coordinate Geometry', summary: 'Lines, circles, conics', difficulty: 'Medium', estMinutes: 35 },
  { topicId: 'mth_matrix', title: 'Matrices & Determinants', summary: 'Matrix operations, determinants', difficulty: 'Medium', estMinutes: 30 },
  { topicId: 'mth_prob', title: 'Probability', summary: 'Permutations, combinations', difficulty: 'Easy', estMinutes: 25 },
  { topicId: 'mth_trig', title: 'Trigonometry', summary: 'Identities, equations', difficulty: 'Easy', estMinutes: 30 },
]

// helper to generate a few dummy questions per topic
function generateQuestionsForTopic(topic, subjectId) {
  const qbase = []
  const tid = topic.topicId
  // 3 MCQs and 1 numerical
  for (let i = 1; i <= 3; i++) {
    const qId = `${tid}_q${i}`
    qbase.push({
      id: qId,
      questionId: qId,
      sectionId: subjectId,
      topic: topic.title,
      questionText: `(${topic.title}) Sample MCQ ${i}: What is the correct option for ${topic.title} problem ${i}?`,
      type: 'MCQ',
      difficulty: topic.difficulty === 'Hard' ? 'DIFFICULT' : (topic.difficulty === 'Easy' ? 'EASY' : 'MEDIUM'),
      options: [
        { id: 'A', optionId: `${qId}_opt_a`, identifier: 'A', text: '$Option A$' },
        { id: 'B', optionId: `${qId}_opt_b`, identifier: 'B', text: '$Option B$' },
        { id: 'C', optionId: `${qId}_opt_c`, identifier: 'C', text: '$Option C$' },
        { id: 'D', optionId: `${qId}_opt_d`, identifier: 'D', text: '$Option D$' },
      ],
      correctAnswer: { optionId: `${qId}_opt_a`, identifier: 'A' }
    })
  }
  // numerical question
  const nqId = `${tid}_q4`
  qbase.push({
    id: nqId,
    questionId: nqId,
    sectionId: subjectId,
    topic: topic.title,
    questionText: `(${topic.title}) Numerical: Compute the value for a sample ${topic.title} expression.`,
    type: 'NUMERICAL',
    difficulty: topic.difficulty === 'Hard' ? 'DIFFICULT' : (topic.difficulty === 'Easy' ? 'EASY' : 'MEDIUM'),
    correctAnswer: { value: `${Math.round(1 + Math.random() * 99)}` }
  })

  return qbase
}

// attach generated questions to each topic
PHYSICS_TOPICS.forEach(t => { t.questions = generateQuestionsForTopic(t, 'phy') })
CHEMISTRY_TOPICS.forEach(t => { t.questions = generateQuestionsForTopic(t, 'chem') })
MATH_TOPICS.forEach(t => { t.questions = generateQuestionsForTopic(t, 'mth') })

export const COACHINGMATERIALS = [
  {
    id: 'phy',
    title: 'Physics',
    // subtitle: 'Full length practice & topic cards',
    image: '/src/assets/physics.png',
    exam: EXAM_DATA,
    topics: PHYSICS_TOPICS,
    recommendedDurationMins: 120,
    difficulty: 'Mixed',
    suggestedNext: ['Revise Kinematics - 30 min', 'Attempt 10 Mechanics MCQs']
  },
  {
    id: 'chem',
    title: 'Chemistry',
    // subtitle: 'Sectional practice & topic cards',
    image: '/src/assets/chemistry.png',
    exam: { ...EXAM_DATA, examTitle: 'JEEA 2025 - Paper 2' },
    topics: CHEMISTRY_TOPICS,
    recommendedDurationMins: 90,
    difficulty: 'Mixed',
    suggestedNext: ['Practice Organic reactions - 30 min', 'Solve 20 Physical Chem problems']
  },
  {
    id: 'mth',
    title: 'Mathematics',
    // subtitle: 'Quick topic practice & tests',
    image: '/src/assets/maths.png',
    exam: { ...EXAM_DATA, examTitle: 'JEEA Quick Test', durationInSeconds: 30 * 60 },
    topics: MATH_TOPICS,
    recommendedDurationMins: 60,
    difficulty: 'Mixed',
    suggestedNext: ['Practice Calculus - 45 min', 'Attempt Algebra set']
  },
]