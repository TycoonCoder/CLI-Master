// Simulate the localStorage issue
const progress = {
  xp: 100,
  level: 2,
  streak: 3,
  bits: 15,
  hasXpBoost: false,
  achievements: [],
  completedLessons: new Set(['lesson-1', 'lesson-2']),
  lastActive: new Date()
};

console.log('Original progress:');
console.log('  Bits:', progress.bits);
console.log('  XP:', progress.xp);
console.log('  Completed lessons:', Array.from(progress.completedLessons));

const toSave = {
  ...progress,
  completedLessons: Array.from(progress.completedLessons)
};

console.log('\nTo save:');
console.log('  Bits:', toSave.bits);
console.log('  XP:', toSave.xp);
console.log('  Completed lessons:', toSave.completedLessons);

const saved = JSON.stringify(toSave);
console.log('\nJSON saved:', saved);

const parsed = JSON.parse(saved);
console.log('\nParsed back:');
console.log('  Bits:', parsed.bits);
console.log('  XP:', parsed.xp);
console.log('  Completed lessons:', parsed.completedLessons);

// Test the load logic
const loadedProgress = {
  xp: parsed.xp || 0,
  level: parsed.level || 1,
  streak: parsed.streak || 0,
  bits: parsed.bits ?? 5, // Nullish coalescing
  hasXpBoost: parsed.hasXpBoost || false,
  achievements: parsed.achievements || [],
  completedLessons: new Set(parsed.completedLessons || []),
  lastActive: parsed.lastActive ? new Date(parsed.lastActive) : new Date()
};

console.log('\nLoaded progress:');
console.log('  Bits:', loadedProgress.bits);
console.log('  XP:', loadedProgress.xp);
console.log('  Completed lessons:', Array.from(loadedProgress.completedLessons));
