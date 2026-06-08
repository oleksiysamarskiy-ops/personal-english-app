import { Movie, Series, VocabItem } from '../types';

export const INITIAL_VOCAB: VocabItem[] = [
  { id: 'v1', term: 'attorney', translation: 'a lawyer; someone who practices law', example: 'You have the right to an attorney.', category: 'Word', status: 'Learning', dateAdded: '2024-12-01', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 0 },
  { id: 'v2', term: 'cut me some slack', translation: 'be less strict or critical with someone', example: "Come on, cut me some slack — it's my first day!", category: 'Idiom', status: 'Weak', dateAdded: '2024-12-02', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 0 },
  { id: 'v3', term: "I didn't see that coming", translation: 'I was completely surprised by that', example: "Wow, I didn't see that coming at all!", category: 'Phrase', status: 'Learning', dateAdded: '2024-12-03', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 1 },
  { id: 'v4', term: 'woke', translation: 'aware of social injustice and discrimination', example: 'She became more woke after watching that documentary.', category: 'Slang', status: 'Known', dateAdded: '2024-12-04', nextReviewDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], correctStreak: 3 },
  { id: 'v5', term: 'ambiguous', translation: 'open to more than one interpretation; unclear', example: 'His answer was deliberately ambiguous.', category: 'Word', status: 'Learning', dateAdded: '2024-12-05', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 1 },
  { id: 'v6', term: 'ghost someone', translation: 'to suddenly stop all communication with someone', example: 'He ghosted her after three dates.', category: 'Slang', status: 'Known', dateAdded: '2024-12-06', nextReviewDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], correctStreak: 4 },
  { id: 'v7', term: 'bite the bullet', translation: 'to endure a painful or difficult situation', example: 'Just bite the bullet and tell him the truth.', category: 'Idiom', status: 'Weak', dateAdded: '2024-12-07', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 0 },
  { id: 'v8', term: 'protagonist', translation: 'the main character in a story', example: 'The protagonist faces many obstacles throughout the film.', category: 'Word', status: 'Known', dateAdded: '2024-12-08', nextReviewDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], correctStreak: 5 },
  { id: 'v9', term: 'spill the tea', translation: 'to share gossip or reveal secrets', example: "Come on, spill the tea! What happened last night?", category: 'Slang', status: 'New', dateAdded: '2024-12-09', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 0 },
  { id: 'v10', term: 'on the house', translation: 'free of charge; paid for by the establishment', example: "The dessert is on the house tonight.", category: 'Phrase', status: 'Known', dateAdded: '2024-12-10', nextReviewDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], correctStreak: 3 },
  { id: 'v11', term: 'redemption', translation: 'the act of being saved from sin or evil; making amends', example: 'The film is ultimately a story of redemption.', category: 'Word', status: 'Learning', dateAdded: '2024-12-11', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 1 },
  { id: 'v12', term: 'hit the sack', translation: 'to go to bed', example: "I'm exhausted — time to hit the sack.", category: 'Idiom', status: 'New', dateAdded: '2024-12-12', nextReviewDate: new Date().toISOString().split('T')[0], correctStreak: 0 },
];

const movieQuizzes: Record<string, any[]> = {
  m1: [
    { id: 'q1', type: 'translation', question: 'What does "interstellar" mean?', options: ['Inside a star', 'Between stars', 'Beyond the universe', 'Near a planet'], correctIndex: 1, vocabTerm: 'interstellar' },
    { id: 'q2', type: 'context', question: '"We are the bridge between the stars." What does "bridge" mean here?', options: ['A physical structure over water', 'A connection or link', 'A type of spaceship', 'A musical term'], correctIndex: 1, vocabTerm: 'bridge' },
    { id: 'q3', type: 'phrase', question: 'What does "wormhole" mean in the context of the film?', options: ['A hole made by worms', 'A portal in space connecting distant points', 'A type of black hole', 'An asteroid belt'], correctIndex: 1, vocabTerm: 'wormhole' },
    { id: 'q4', type: 'translation', question: 'What does "gravity" mean?', options: ['The speed of light', 'The force attracting objects toward each other', 'A type of energy', 'The curvature of space'], correctIndex: 1, vocabTerm: 'gravity' },
    { id: 'q5', type: 'context', question: '"Do not go gentle into that good night." What emotion does this express?', options: ['Acceptance of death', 'Fighting against death or defeat', 'Happiness', 'Fear of the dark'], correctIndex: 1, vocabTerm: 'resilience' },
  ],
  m2: [
    { id: 'q1', type: 'translation', question: 'What does "inception" mean?', options: ['The end of something', 'The beginning or origin of something', 'A dream state', 'A memory'], correctIndex: 1, vocabTerm: 'inception' },
    { id: 'q2', type: 'phrase', question: 'What does "plant an idea" mean in the film?', options: ['Grow a plant', 'Place a thought into someone\'s mind', 'Hide evidence', 'Create a memory'], correctIndex: 1, vocabTerm: 'plant an idea' },
    { id: 'q3', type: 'context', question: '"We need to go deeper." What does "deeper" refer to?', options: ['Into the ocean', 'Into a lower level of a dream', 'Into someone\'s past', 'Into a building'], correctIndex: 1, vocabTerm: 'deeper' },
    { id: 'q4', type: 'translation', question: 'What does "subconscious" mean?', options: ['Fully awake mind', 'The part of the mind below conscious awareness', 'A dream', 'Memory storage'], correctIndex: 1, vocabTerm: 'subconscious' },
    { id: 'q5', type: 'phrase', question: 'What does "totem" mean in Inception?', options: ['A type of weapon', 'An object used to distinguish dreams from reality', 'A spinning top game', 'A religious symbol'], correctIndex: 1, vocabTerm: 'totem' },
  ],
  m3: [
    { id: 'q1', type: 'translation', question: 'What does "witness" mean?', options: ['Someone who commits a crime', 'Someone who sees an event happen', 'A police officer', 'A judge'], correctIndex: 1, vocabTerm: 'witness' },
    { id: 'q2', type: 'phrase', question: 'What does "take the stand" mean in a courtroom?', options: ['Stand up from your seat', 'Testify as a witness in court', 'Object to a question', 'Leave the courtroom'], correctIndex: 1, vocabTerm: 'take the stand' },
    { id: 'q3', type: 'context', question: '"The truth will set you free." What does this phrase mean?', options: ['Truth is an escape from prison', 'Being honest relieves guilt and burden', 'Only the truth matters in court', 'Lies lead to imprisonment'], correctIndex: 1, vocabTerm: 'truth' },
    { id: 'q4', type: 'translation', question: 'What does "verdict" mean?', options: ['The beginning of a trial', 'A judge\'s salary', 'The decision reached in a trial', 'Evidence presented in court'], correctIndex: 2, vocabTerm: 'verdict' },
    { id: 'q5', type: 'translation', question: 'What does "presumed innocent" mean?', options: ['Known to be guilty', 'Treated as innocent until proven guilty', 'Released without trial', 'Pardoned by the court'], correctIndex: 1, vocabTerm: 'presumed innocent' },
  ],
  m4: [
    { id: 'q1', type: 'translation', question: 'What does "dystopian" mean?', options: ['A perfect society', 'An imagined state where everything is unpleasant', 'A futuristic utopia', 'A historical period'], correctIndex: 1, vocabTerm: 'dystopian' },
    { id: 'q2', type: 'phrase', question: 'What does "Big Brother is watching you" imply?', options: ['Your brother spies on you', 'The government constantly surveils citizens', 'Privacy is protected', 'Family is important'], correctIndex: 1, vocabTerm: 'surveillance' },
    { id: 'q3', type: 'context', question: '"War is peace. Freedom is slavery." What literary device is used?', options: ['Metaphor', 'Simile', 'Doublespeak / Paradox', 'Alliteration'], correctIndex: 2, vocabTerm: 'doublespeak' },
    { id: 'q4', type: 'translation', question: 'What does "totalitarian" mean?', options: ['A democratic system', 'A system where the state controls everything', 'A free market economy', 'A federal government'], correctIndex: 1, vocabTerm: 'totalitarian' },
    { id: 'q5', type: 'phrase', question: 'What does "thought crime" mean in 1984?', options: ['A crime involving theft', 'Having thoughts that go against the state', 'Spreading false information', 'Planning a crime'], correctIndex: 1, vocabTerm: 'thought crime' },
  ],
  m5: [
    { id: 'q1', type: 'phrase', question: 'What does "cut me some slack" mean?', options: ['Cut a rope', 'Be less strict or critical with me', 'Give me money', 'Help me with something'], correctIndex: 1, vocabTerm: 'cut me some slack' },
    { id: 'q2', type: 'context', question: '"He\'s got hustle." What does "hustle" mean here?', options: ['Dishonest behavior', 'Energetic hard work and determination', 'Physical speed', 'Musical rhythm'], correctIndex: 1, vocabTerm: 'hustle' },
    { id: 'q3', type: 'translation', question: 'What does "attorney" mean?', options: ['A police officer', 'A judge', 'A lawyer', 'A witness'], correctIndex: 2, vocabTerm: 'attorney' },
    { id: 'q4', type: 'phrase', question: 'What does "I didn\'t see that coming" mean?', options: ['I couldn\'t see the road', 'I was completely surprised', 'I predicted this event', 'I missed an opportunity'], correctIndex: 1, vocabTerm: "I didn't see that coming" },
    { id: 'q5', type: 'context', question: '"That\'s a wrap." What does this phrase mean in filmmaking?', options: ['Wrap a gift', 'Filming is finished for the day', 'A new scene begins', 'The director is angry'], correctIndex: 1, vocabTerm: "that's a wrap" },
  ],
};

export const INITIAL_MOVIES: Movie[] = [
  { id: 'm1', title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', genre: 'Sci-Fi', level: 'B2', year: 2014, emoji: '🌌', watched: true, quizCompleted: true, quizScore: 80, watchedAt: '2024-12-10', quiz: movieQuizzes.m1 },
  { id: 'm2', title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the task of planting an idea.', genre: 'Sci-Fi', level: 'C1', year: 2010, emoji: '🌀', watched: true, quizCompleted: false, watchedAt: '2024-12-12', quiz: movieQuizzes.m2 },
  { id: 'm3', title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests.', genre: 'Action', level: 'B1', year: 2008, emoji: '🦇', watched: false, quizCompleted: false, quiz: movieQuizzes.m3 },
  { id: 'm4', title: '1984', description: 'In a totalitarian future society, a man struggles to retain his humanity as he rebels against a repressive regime.', genre: 'Thriller', level: 'C1', year: 1984, emoji: '👁️', watched: false, quizCompleted: false, quiz: movieQuizzes.m4 },
  { id: 'm5', title: 'Good Will Hunting', description: 'A janitor at MIT has a gift for mathematics and is discovered by a professor who wants to help him.', genre: 'Drama', level: 'B2', year: 1997, emoji: '🧮', watched: false, quizCompleted: false, quiz: movieQuizzes.m5 },
];

const seriesQuizzes: Record<string, any[]> = {
  s1e1: [
    { id: 'q1', type: 'translation', question: 'What does "pilot" mean in the context of a TV show?', options: ['The person flying a plane', 'The first episode of a series', 'A test episode never aired', 'The final episode'], correctIndex: 1, vocabTerm: 'pilot' },
    { id: 'q2', type: 'phrase', question: 'What does "on a break" mean in a relationship?', options: ['Going on holiday', 'A temporary pause in the relationship', 'Breaking up permanently', 'Taking a nap'], correctIndex: 1, vocabTerm: 'on a break' },
    { id: 'q3', type: 'context', question: '"How you doin\'?" What is this famous line used as?', options: ['A genuine health question', 'A flirtatious greeting', 'An insult', 'A farewell'], correctIndex: 1, vocabTerm: 'how you doing' },
  ],
  s1e2: [
    { id: 'q1', type: 'translation', question: 'What does "apartment" mean?', options: ['A house with a garden', 'A set of rooms forming a home in a larger building', 'An office building', 'A hotel room'], correctIndex: 1, vocabTerm: 'apartment' },
    { id: 'q2', type: 'phrase', question: 'What does "central perk" evoke as a place?', options: ['A park in the center', 'A coffee shop where friends gather', 'A central office', 'A local bar'], correctIndex: 1, vocabTerm: 'coffee shop' },
  ],
  s2e1: [
    { id: 'q1', type: 'translation', question: 'What does "meth" refer to?', options: ['A medical treatment', 'Methamphetamine, an illegal drug', 'A chemistry experiment', 'A cooking ingredient'], correctIndex: 1, vocabTerm: 'meth' },
    { id: 'q2', type: 'context', question: '"I am the one who knocks." What does Walter mean?', options: ['He is a door-to-door salesman', 'He is powerful and in control', 'He is looking for his family', 'He is afraid'], correctIndex: 1, vocabTerm: 'power' },
    { id: 'q3', type: 'phrase', question: 'What does "cook" mean as slang in Breaking Bad?', options: ['To prepare food', 'To manufacture illegal drugs', 'To plan a scheme', 'To commit arson'], correctIndex: 1, vocabTerm: 'cook' },
  ],
  s2e2: [
    { id: 'q1', type: 'translation', question: 'What does "terminal" mean in a medical context?', options: ['A bus terminal', 'An illness that will cause death', 'The end of a journey', 'A computer screen'], correctIndex: 1, vocabTerm: 'terminal' },
    { id: 'q2', type: 'phrase', question: 'What does "say my name" express in the show?', options: ['Politeness', 'A demand for recognition and respect', 'Confusion about identity', 'Greeting'], correctIndex: 1, vocabTerm: 'say my name' },
  ],
  s3e1: [
    { id: 'q1', type: 'translation', question: 'What does "supernatural" mean?', options: ['Extremely natural', 'Beyond the laws of nature', 'A type of food', 'Very strong'], correctIndex: 1, vocabTerm: 'supernatural' },
    { id: 'q2', type: 'context', question: '"The Upside Down" represents what in the show?', options: ['A dance move', 'A parallel dark dimension', 'A underground city', 'A mirror world'], correctIndex: 1, vocabTerm: 'parallel dimension' },
    { id: 'q3', type: 'phrase', question: 'What does "missing person" mean?', options: ['A person who is lost', 'Someone whose whereabouts are unknown', 'A person with amnesia', 'Someone who leaves willingly'], correctIndex: 1, vocabTerm: 'missing person' },
  ],
  s3e2: [
    { id: 'q1', type: 'translation', question: 'What does "demogorgon" symbolize?', options: ['A friendly creature', 'An evil, terrifying monster', 'A type of fungus', 'A government experiment'], correctIndex: 1, vocabTerm: 'demogorgon' },
    { id: 'q2', type: 'phrase', question: 'What does "friends don\'t lie" mean as a theme?', options: ['True friends are always honest', 'Lying to friends is acceptable', 'Secrets strengthen friendships', 'Trust is overrated'], correctIndex: 0, vocabTerm: 'honesty' },
  ],
};

export const INITIAL_SERIES: Series[] = [
  {
    id: 's1', title: 'Friends', description: 'Six friends navigate life, love, and careers in New York City over ten unforgettable seasons.', genre: 'Comedy', level: 'A2', year: 1994, emoji: '☕',
    seasons: [
      { id: 's1-1', seasonNumber: 1, episodes: [
        { id: 's1e1', title: 'The One Where Monica Gets a Roommate', episodeNumber: 1, description: 'Ross is depressed after his divorce, and Rachel joins the group.', watched: true, quizCompleted: true, quizScore: 100, watchedAt: '2024-12-11', quiz: seriesQuizzes.s1e1 },
        { id: 's1e2', title: 'The One with the Sonogram at the End', episodeNumber: 2, description: 'Ross finds out his ex-wife is pregnant with his child.', watched: true, quizCompleted: false, watchedAt: '2024-12-13', quiz: seriesQuizzes.s1e2 },
        { id: 's1e3', title: 'The One with the Thumb', episodeNumber: 3, description: 'Phoebe finds a human thumb in her soda can.', watched: false, quizCompleted: false, quiz: seriesQuizzes.s1e1 },
      ]},
      { id: 's1-2', seasonNumber: 2, episodes: [
        { id: 's1e4', title: 'The One with Ross\'s New Girlfriend', episodeNumber: 1, description: 'Ross returns from China with a new girlfriend.', watched: false, quizCompleted: false, quiz: seriesQuizzes.s1e2 },
      ]},
    ],
  },
  {
    id: 's2', title: 'Breaking Bad', description: 'A chemistry teacher turned drug manufacturer descends into the criminal underworld.', genre: 'Crime', level: 'C1', year: 2008, emoji: '⚗️',
    seasons: [
      { id: 's2-1', seasonNumber: 1, episodes: [
        { id: 's2e1', title: 'Pilot', episodeNumber: 1, description: 'Walter White, a chemistry teacher, is diagnosed with cancer and turns to making drugs.', watched: false, quizCompleted: false, quiz: seriesQuizzes.s2e1 },
        { id: 's2e2', title: 'Cat\'s in the Bag', episodeNumber: 2, description: 'Walt and Jesse deal with the aftermath of their first cook.', watched: false, quizCompleted: false, quiz: seriesQuizzes.s2e2 },
      ]},
    ],
  },
  {
    id: 's3', title: 'Stranger Things', description: 'A group of kids uncover supernatural mysteries in their small town of Hawkins, Indiana.', genre: 'Sci-Fi', level: 'B1', year: 2016, emoji: '🔦',
    seasons: [
      { id: 's3-1', seasonNumber: 1, episodes: [
        { id: 's3e1', title: 'The Vanishing of Will Byers', episodeNumber: 1, description: 'A young boy disappears under mysterious circumstances.', watched: false, quizCompleted: false, quiz: seriesQuizzes.s3e1 },
        { id: 's3e2', title: 'The Weirdo on Maple Street', episodeNumber: 2, description: 'The boys encounter a mysterious girl in the woods.', watched: false, quizCompleted: false, quiz: seriesQuizzes.s3e2 },
      ]},
    ],
  },
];
