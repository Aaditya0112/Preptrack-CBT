// Centralized exam and user data
// Centralized exam and user data (enhanced for backend models)
export const USER_DATA = {
  userId: 'user_1',
  name: 'Aaditya',
  mobileNumber: '+911234567890',
  exam: 'JEE Advanced',
  class: '12th',
  accessToken: null,
  refreshToken: null,
  avatarUrl: 'src/assets/avatar.jpeg'
};

export const EXAM_DATA = {
  examId: 'exam_jeea_2025_paper2',
  examTitle: "JEEA 2025-Sample Paper-Paper 2",
  durationInSeconds: 180 * 60, // 3 hours
  instructions: 'Solve all questions. Use of calculator is not allowed. Show workings for numerical answers where required.',
  sections: [
    { id: 'phy1', sectionId: 'phy1', name: 'Physics SEC 1', examId: 'exam_jeea_2025_paper2' },
    { id: 'che1', sectionId: 'che1', name: 'Chemistry SEC 1', examId: 'exam_jeea_2025_paper2' },
    { id: 'mat1', sectionId: 'mat1', name: 'Mathematics SEC 1', examId: 'exam_jeea_2025_paper2' },
  ],
  questions: [
    // Physics (10 questions)
    {
      id: 'p1',
      questionId: 'p1',
      sectionId: 'phy1',
      questionText: 'A block of mass $m$ is placed on a smooth inclined plane of inclination $\\theta$. The force required to keep the block stationary is:',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      options: [
        { id: 'A', optionId: 'opt_p1_a', identifier: 'A', text: '$mg$' },
        { id: 'B', optionId: 'opt_p1_b', identifier: 'B', text: '$mg \\sin \\theta$' },
        { id: 'C', optionId: 'opt_p1_c', identifier: 'C', text: '$mg \\cos \\theta$' },
        { id: 'D', optionId: 'opt_p1_d', identifier: 'D', text: '$mg \\tan \\theta$' }
      ],
      correctAnswer: { optionId: 'opt_p1_b', identifier: 'B' },
      image: 'https://placehold.co/400x200/eee/aaa?text=Physics+Diagram+1'
    },
    {
      id: 'p2',
      questionId: 'p2',
      sectionId: 'phy1',
      questionText: 'A ball is thrown vertically upwards with a velocity of 20 m/s. Calculate the maximum height it reaches. (Take $g = 10 \\, \\text{m/s}^2$)',
      type: 'NUMERICAL',
      difficulty: 'EASY',
      correctAnswer: { value: '20' }
    },
    { id: 'p3', questionId: 'p3', sectionId: 'phy1', questionText: 'What is the unit of electrical resistance?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_p3_a', identifier: 'A', text: 'Volt'}, {id: 'B', optionId: 'opt_p3_b', identifier: 'B', text: 'Ampere'}, {id: 'C', optionId: 'opt_p3_c', identifier: 'C', text: 'Ohm'}, {id: 'D', optionId: 'opt_p3_d', identifier: 'D', text: 'Watt'}], correctAnswer: { optionId: 'opt_p3_c', identifier: 'C' } },
    { id: 'p4', questionId: 'p4', sectionId: 'phy1', questionText: 'The equivalent resistance of two resistors $R_1 = 10\\Omega$ and $R_2 = 15\\Omega$ connected in parallel is:', type: 'NUMERICAL', difficulty: 'MEDIUM', correctAnswer: { value: '6' }},
    { id: 'p5', questionId: 'p5', sectionId: 'phy1', questionText: 'Which law of thermodynamics states that energy cannot be created or destroyed?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_p5_a', identifier: 'A', text: 'Zeroth Law'}, {id: 'B', optionId: 'opt_p5_b', identifier: 'B', text: 'First Law'}, {id: 'C', optionId: 'opt_p5_c', identifier: 'C', text: 'Second Law'}, {id: 'D', optionId: 'opt_p5_d', identifier: 'D', text: 'Third Law'}], correctAnswer: { optionId: 'opt_p5_b', identifier: 'B' } },
    { id: 'p6', questionId: 'p6', sectionId: 'phy1', questionText: 'A car travels 6 km towards north at an angle of $45^\\circ$ to the east and then travels 4 km towards north. The total displacement is:', type: 'MCQ', difficulty: 'MEDIUM', options: [{id: 'A', optionId: 'opt_p6_a', identifier: 'A', text: '8 km'}, {id: 'B', optionId: 'opt_p6_b', identifier: 'B', text: '10 km'}, {id: 'C', optionId: 'opt_p6_c', identifier: 'C', text: '$\\sqrt{52}$ km'}, {id: 'D', optionId: 'opt_p6_d', identifier: 'D', text: '12 km'}], correctAnswer: { optionId: 'opt_p6_c', identifier: 'C' } },
    { id: 'p7', questionId: 'p7', sectionId: 'phy1', questionText: 'What is the focal length of a convex lens with power 2.5 D?', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '0.4' }},
    { id: 'p8', questionId: 'p8', sectionId: 'phy1', questionText: 'The phenomenon of light bending around corners is called:', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_p8_a', identifier: 'A', text: 'Reflection'}, {id: 'B', optionId: 'opt_p8_b', identifier: 'B', text: 'Refraction'}, {id: 'C', optionId: 'opt_p8_c', identifier: 'C', text: 'Diffraction'}, {id: 'D', optionId: 'opt_p8_d', identifier: 'D', text: 'Interference'}], correctAnswer: { optionId: 'opt_p8_c', identifier: 'C' } },
    { id: 'p9', questionId: 'p9', sectionId: 'phy1', questionText: 'A body of mass 5 kg is moving with an acceleration of $2 \\, \\text{m/s}^2$. The force acting on it is:', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '10' }},
    { id: 'p10', questionId: 'p10', sectionId: 'phy1', questionText: 'Escape velocity from the Earth is approximately:', type: 'MCQ', difficulty: 'MEDIUM', options: [{id: 'A', optionId: 'opt_p10_a', identifier: 'A', text: '9.8 m/s'}, {id: 'B', optionId: 'opt_p10_b', identifier: 'B', text: '11.2 km/s'}, {id: 'C', optionId: 'opt_p10_c', identifier: 'C', text: '1.2 km/s'}, {id: 'D', optionId: 'opt_p10_d', identifier: 'D', text: '3 x 10^8 m/s'}], correctAnswer: { optionId: 'opt_p10_b', identifier: 'B' } },

    // Chemistry (10 questions)
    { id: 'c1', questionId: 'c1', sectionId: 'che1', questionText: 'What is the chemical formula for water?', type: 'MCQ', difficulty: 'EASY', options: [ {id: 'A', optionId: 'opt_c1_a', identifier: 'A', text: '$CO_2$' }, {id: 'B', optionId: 'opt_c1_b', identifier: 'B', text: '$H_2O$' }, {id: 'C', optionId: 'opt_c1_c', identifier: 'C', text: '$O_2$' }, {id: 'D', optionId: 'opt_c1_d', identifier: 'D', text: '$Nacl$' } ], correctAnswer: { optionId: 'opt_c1_b', identifier: 'B' } },
    { id: 'c2', questionId: 'c2', sectionId: 'che1', questionText: 'The pH of a neutral solution is:', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '7' } },
    { id: 'c3', questionId: 'c3', sectionId: 'che1', questionText: 'Which of the following is a noble gas?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_c3_a', identifier: 'A', text: 'Nitrogen'}, {id: 'B', optionId: 'opt_c3_b', identifier: 'B', text: 'Oxygen'}, {id: 'C', optionId: 'opt_c3_c', identifier: 'C', text: 'Helium'}, {id: 'D', optionId: 'opt_c3_d', identifier: 'D', text: 'Hydrogen'}], correctAnswer: { optionId: 'opt_c3_c', identifier: 'C' } },
    { id: 'c4', questionId: 'c4', sectionId: 'che1', questionText: 'The atomic number of Carbon is:', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '6' } },
    { id: 'c5', questionId: 'c5', sectionId: 'che1', questionText: 'What is the main component of natural gas?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_c5_a', identifier: 'A', text: 'Ethane'}, {id: 'B', optionId: 'opt_c5_b', identifier: 'B', text: 'Propane'}, {id: 'C', optionId: 'opt_c5_c', identifier: 'C', text: 'Butane'}, {id: 'D', optionId: 'opt_c5_d', identifier: 'D', text: 'Methane'}], correctAnswer: { optionId: 'opt_c5_d', identifier: 'D' } },
    { id: 'c6', questionId: 'c6', sectionId: 'che1', questionText: 'The chemical symbol for Gold is:', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_c6_a', identifier: 'A', text: 'Go'}, {id: 'B', optionId: 'opt_c6_b', identifier: 'B', text: 'Ag'}, {id: 'C', optionId: 'opt_c6_c', identifier: 'C', text: 'Au'}, {id: 'D', optionId: 'opt_c6_d', identifier: 'D', text: 'Ge'}], correctAnswer: { optionId: 'opt_c6_c', identifier: 'C' } },
    { id: 'c7', questionId: 'c7', sectionId: 'che1', questionText: 'Calculate the molar mass of $H_2SO_4$. (H=1, S=32, O=16)', type: 'NUMERICAL', difficulty: 'MEDIUM', correctAnswer: { value: '98' } },
    { id: 'c8', questionId: 'c8', sectionId: 'che1', questionText: 'Which acid is found in vinegar?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_c8_a', identifier: 'A', text: 'Citric Acid'}, {id: 'B', optionId: 'opt_c8_b', identifier: 'B', text: 'Lactic Acid'}, {id: 'C', optionId: 'opt_c8_c', identifier: 'C', text: 'Acetic Acid'}, {id: 'D', optionId: 'opt_c8_d', identifier: 'D', text: 'Hydrochloric Acid'}], correctAnswer: { optionId: 'opt_c8_c', identifier: 'C' } },
    { id: 'c9', questionId: 'c9', sectionId: 'che1', questionText: 'How many electrons are in a $Na^+$ ion? (Atomic number of Na is 11)', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '10' } },
    { id: 'c10', questionId: 'c10', sectionId: 'che1', questionText: 'What is the process of converting a solid directly into a gas called?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_c10_a', identifier: 'A', text: 'Evaporation'}, {id: 'B', optionId: 'opt_c10_b', identifier: 'B', text: 'Condensation'}, {id: 'C', optionId: 'opt_c10_c', identifier: 'C', text: 'Sublimation'}, {id: 'D', optionId: 'opt_c10_d', identifier: 'D', text: 'Deposition'}], correctAnswer: { optionId: 'opt_c10_c', identifier: 'C' } },

    // Mathematics (10 questions)
    { id: 'm1', questionId: 'm1', sectionId: 'mat1', questionText: 'What is the value of $\\int_{0}^{1} x^2 \\,dx$?', type: 'MCQ', difficulty: 'EASY', options: [ { id: 'A', optionId: 'opt_m1_a', identifier: 'A', text: '$1$' }, { id: 'B', optionId: 'opt_m1_b', identifier: 'B', text: '$1/2$' }, { id: 'C', optionId: 'opt_m1_c', identifier: 'C', text: '$1/3$' }, { id: 'D', optionId: 'opt_m1_d', identifier: 'D', text: '$0$' } ], correctAnswer: { optionId: 'opt_m1_c', identifier: 'C' } },
    { id: 'm2', questionId: 'm2', sectionId: 'mat1', questionText: 'If a matrix $A$ has 3 rows and 4 columns, and matrix $B$ has 4 rows and 2 columns, what are the dimensions of the product $AB$?', type: 'MCQ', difficulty: 'MEDIUM', options: [ { id: 'A', optionId: 'opt_m2_a', identifier: 'A', text: '$3 \\times 2$' }, { id: 'B', optionId: 'opt_m2_b', identifier: 'B', text: '$4 \\times 4$' }, { id: 'C', optionId: 'opt_m2_c', identifier: 'C', text: '$3 \\times 4$' }, { id: 'D', optionId: 'opt_m2_d', identifier: 'D', text: '$4 \\times 2$' } ], image: 'https://placehold.co/400x150/eee/aaa?text=Matrix+Example', correctAnswer: { optionId: 'opt_m2_a', identifier: 'A' } },
    { id: 'm3', questionId: 'm3', sectionId: 'mat1', questionText: 'What is the value of $5!$ (5 factorial)?', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '120' } },
    { id: 'm4', questionId: 'm4', sectionId: 'mat1', questionText: 'The derivative of $e^{2x}$ with respect to $x$ is:', type: 'MCQ', difficulty: 'MEDIUM', options: [{id: 'A', optionId: 'opt_m4_a', identifier: 'A', text: '$e^{2x}$'}, {id: 'B', optionId: 'opt_m4_b', identifier: 'B', text: '$2e^{2x}$'}, {id: 'C', optionId: 'opt_m4_c', identifier: 'C', text: '$\\frac{1}{2}e^{2x}$'}, {id: 'D', optionId: 'opt_m4_d', identifier: 'D', text: '$e^x$'}], correctAnswer: { optionId: 'opt_m4_b', identifier: 'B' } },
    { id: 'm5', questionId: 'm5', sectionId: 'mat1', questionText: 'If $z = 3 + 4i$, what is the modulus $|z|$?', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '5' } },
    { id: 'm6', questionId: 'm6', sectionId: 'mat1', questionText: 'What is the 10th term of the arithmetic progression 2, 5, 8, ...?', type: 'NUMERICAL', difficulty: 'MEDIUM', correctAnswer: { value: '29' } },
    { id: 'm7', questionId: 'm7', sectionId: 'mat1', questionText: 'The solution to the equation $2x + 5 = 17$ is:', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '6' } },
    { id: 'm8', questionId: 'm8', sectionId: 'mat1', questionText: 'What is the probability of getting a head when a fair coin is tossed?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_m8_a', identifier: 'A', text: '0'}, {id: 'B', optionId: 'opt_m8_b', identifier: 'B', text: '0.5'}, {id: 'C', optionId: 'opt_m8_c', identifier: 'C', text: '1'}, {id: 'D', optionId: 'opt_m8_d', identifier: 'D', text: '0.25'}], correctAnswer: { optionId: 'opt_m8_b', identifier: 'B' } },
    { id: 'm9', questionId: 'm9', sectionId: 'mat1', questionText: 'What is the area of a circle with radius $r = 7$? (Use $\\pi = 22/7$)', type: 'NUMERICAL', difficulty: 'EASY', correctAnswer: { value: '154' } },
    { id: 'm10', questionId: 'm10', sectionId: 'mat1', questionText: 'What is $\\sin(90^\\circ)$?', type: 'MCQ', difficulty: 'EASY', options: [{id: 'A', optionId: 'opt_m10_a', identifier: 'A', text: '0'}, {id: 'B', optionId: 'opt_m10_b', identifier: 'B', text: '0.5'}, {id: 'C', optionId: 'opt_m10_c', identifier: 'C', text: '1'}, {id: 'D', optionId: 'opt_m10_d', identifier: 'D', text: '-1'}], correctAnswer: { optionId: 'opt_m10_c', identifier: 'C' } },
  ]
};
