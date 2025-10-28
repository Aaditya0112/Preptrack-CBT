// Centralized exam and user data
export const USER_DATA = {
  name: 'Aaditya',
  avatarUrl: 'src/assets/avatar.jpeg'
};

export const EXAM_DATA = {
  examTitle: "JEEA 2025-Sample Paper-Paper 2",
  durationInSeconds: 180 * 60, // 3 hours
  sections: [
    { id: 'phy1', name: 'Physics SEC 1' },
    { id: 'che1', name: 'Chemistry SEC 1' },
    { id: 'mat1', name: 'Mathematics SEC 1' },
  ],
  questions: [
    // Physics (10 questions)
    {
      id: 'p1',
      sectionId: 'phy1',
      questionText: 'A block of mass $m$ is placed on a smooth inclined plane of inclination $\\theta$. The force required to keep the block stationary is:',
      type: 'MCQ',
      options: [
        { id: 'A', text: '$mg$' },
        { id: 'B', text: '$mg \\sin \\theta$' },
        { id: 'C', text: '$mg \\cos \\theta$' },
        { id: 'D', text: '$mg \\tan \\theta$' }
      ],
      image: 'https://placehold.co/400x200/eee/aaa?text=Physics+Diagram+1'
    },
    {
      id: 'p2',
      sectionId: 'phy1',
      questionText: 'A ball is thrown vertically upwards with a velocity of 20 m/s. Calculate the maximum height it reaches. (Take $g = 10 \\, \\text{m/s}^2$)',
      type: 'NUMERICAL',
    },
    { id: 'p3', sectionId: 'phy1', questionText: 'What is the unit of electrical resistance?', type: 'MCQ', options: [{id: 'A', text: 'Volt'}, {id: 'B', text: 'Ampere'}, {id: 'C', text: 'Ohm'}, {id: 'D', text: 'Watt'}] },
    { id: 'p4', sectionId: 'phy1', questionText: 'The equivalent resistance of two resistors $R_1 = 10\\Omega$ and $R_2 = 15\\Omega$ connected in parallel is:', type: 'NUMERICAL'},
    { id: 'p5', sectionId: 'phy1', questionText: 'Which law of thermodynamics states that energy cannot be created or destroyed?', type: 'MCQ', options: [{id: 'A', text: 'Zeroth Law'}, {id: 'B', text: 'First Law'}, {id: 'C', text: 'Second Law'}, {id: 'D', text: 'Third Law'}] },
    { id: 'p6', sectionId: 'phy1', questionText: 'A car travels 6 km towards north at an angle of $45^\\circ$ to the east and then travels 4 km towards north. The total displacement is:', type: 'MCQ', options: [{id: 'A', text: '8 km'}, {id: 'B', text: '10 km'}, {id: 'C', text: '$\\sqrt{52}$ km'}, {id: 'D', text: '12 km'}] },
    { id: 'p7', sectionId: 'phy1', questionText: 'What is the focal length of a convex lens with power 2.5 D?', type: 'NUMERICAL'},
    { id: 'p8', sectionId: 'phy1', questionText: 'The phenomenon of light bending around corners is called:', type: 'MCQ', options: [{id: 'A', text: 'Reflection'}, {id: 'B', text: 'Refraction'}, {id: 'C', text: 'Diffraction'}, {id: 'D', text: 'Interference'}] },
    { id: 'p9', sectionId: 'phy1', questionText: 'A body of mass 5 kg is moving with an acceleration of $2 \\, \\text{m/s}^2$. The force acting on it is:', type: 'NUMERICAL'},
    { id: 'p10', sectionId: 'phy1', questionText: 'Escape velocity from the Earth is approximately:', type: 'MCQ', options: [{id: 'A', text: '9.8 m/s'}, {id: 'B', text: '11.2 km/s'}, {id: 'C', text: '1.2 km/s'}, {id: 'D', text: '3 x 10^8 m/s'}] },

    // Chemistry (10 questions)
    {
      id: 'c1',
      sectionId: 'che1',
      questionText: 'What is the chemical formula for water?',
      type: 'MCQ',
      options: [
        { id: 'A', text: '$CO_2$' },
        { id: 'B', text: '$H_2O$' },
        { id: 'C', text: '$O_2$' },
        { id: 'D', text: '$Nacl$' }
      ]
    },
    {
      id: 'c2',
      sectionId: 'che1',
      questionText: 'The pH of a neutral solution is:',
      type: 'NUMERICAL',
    },
    { id: 'c3', sectionId: 'che1', questionText: 'Which of the following is a noble gas?', type: 'MCQ', options: [{id: 'A', text: 'Nitrogen'}, {id: 'B', text: 'Oxygen'}, {id: 'C', text: 'Helium'}, {id: 'D', text: 'Hydrogen'}] },
    { id: 'c4', sectionId: 'che1', questionText: 'The atomic number of Carbon is:', type: 'NUMERICAL'},
    { id: 'c5', sectionId: 'che1', questionText: 'What is the main component of natural gas?', type: 'MCQ', options: [{id: 'A', text: 'Ethane'}, {id: 'B', text: 'Propane'}, {id: 'C', text: 'Butane'}, {id: 'D', text: 'Methane'}] },
    { id: 'c6', sectionId: 'che1', questionText: 'The chemical symbol for Gold is:', type: 'MCQ', options: [{id: 'A', text: 'Go'}, {id: 'B', text: 'Ag'}, {id: 'C', text: 'Au'}, {id: 'D', text: 'Ge'}] },
    { id: 'c7', sectionId: 'che1', questionText: 'Calculate the molar mass of $H_2SO_4$. (H=1, S=32, O=16)', type: 'NUMERICAL'},
    { id: 'c8', sectionId: 'che1', questionText: 'Which acid is found in vinegar?', type: 'MCQ', options: [{id: 'A', text: 'Citric Acid'}, {id: 'B', text: 'Lactic Acid'}, {id: 'C', text: 'Acetic Acid'}, {id: 'D', text: 'Hydrochloric Acid'}] },
    { id: 'c9', sectionId: 'che1', questionText: 'How many electrons are in a $Na^+$ ion? (Atomic number of Na is 11)', type: 'NUMERICAL'},
    { id: 'c10', sectionId: 'che1', questionText: 'What is the process of converting a solid directly into a gas called?', type: 'MCQ', options: [{id: 'A', text: 'Evaporation'}, {id: 'B', text: 'Condensation'}, {id: 'C', text: 'Sublimation'}, {id: 'D', text: 'Deposition'}] },

    // Mathematics (10 questions)
    {
      id: 'm1',
      sectionId: 'mat1',
      questionText: 'What is the value of $\\int_{0}^{1} x^2 \\,dx$?',
      type: 'MCQ',
      options: [
        { id: 'A', text: '$1$' },
        { id: 'B', text: '$1/2$' },
        { id: 'C', text: '$1/3$' },
        { id: 'D', text: '$0$' }
      ]
    },
    {
      id: 'm2',
      sectionId: 'mat1',
      questionText: 'If a matrix $A$ has 3 rows and 4 columns, and matrix $B$ has 4 rows and 2 columns, what are the dimensions of the product $AB$?',
      type: 'MCQ',
      options: [
        { id: 'A', text: '$3 \\times 2$' },
        { id: 'B', text: '$4 \\times 4$' },
        { id: 'C', text: '$3 \\times 4$' },
        { id: 'D', text: '$4 \\times 2$' }
      ],
      image: 'https://placehold.co/400x150/eee/aaa?text=Matrix+Example'
    },
    { id: 'm3', sectionId: 'mat1', questionText: 'What is the value of $5!$ (5 factorial)?', type: 'NUMERICAL'},
    { id: 'm4', sectionId: 'mat1', questionText: 'The derivative of $e^{2x}$ with respect to $x$ is:', type: 'MCQ', options: [{id: 'A', text: '$e^{2x}$'}, {id: 'B', text: '$2e^{2x}$'}, {id: 'C', text: '$\\frac{1}{2}e^{2x}$'}, {id: 'D', text: '$e^x$'}] },
    { id: 'm5', sectionId: 'mat1', questionText: 'If $z = 3 + 4i$, what is the modulus $|z|$?', type: 'NUMERICAL'},
    { id: 'm6', sectionId: 'mat1', questionText: 'What is the 10th term of the arithmetic progression 2, 5, 8, ...?', type: 'NUMERICAL'},
    { id: 'm7', sectionId: 'mat1', questionText: 'The solution to the equation $2x + 5 = 17$ is:', type: 'NUMERICAL'},
    { id: 'm8', sectionId: 'mat1', questionText: 'What is the probability of getting a head when a fair coin is tossed?', type: 'MCQ', options: [{id: 'A', text: '0'}, {id: 'B', text: '0.5'}, {id: 'C', text: '1'}, {id: 'D', text: '0.25'}] },
    { id: 'm9', sectionId: 'mat1', questionText: 'What is the area of a circle with radius $r = 7$? (Use $\\pi = 22/7$)', type: 'NUMERICAL'},
    { id: 'm10', sectionId: 'mat1', questionText: 'What is $\\sin(90^\\circ)$?', type: 'MCQ', options: [{id: 'A', text: '0'}, {id: 'B', text: '0.5'}, {id: 'C', text: '1'}, {id: 'D', text: '-1'}] },
  ]
};
