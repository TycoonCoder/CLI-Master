export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challenge: string;
  expectedCommand: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  bitsReward: number;
  completed: boolean;
}

export const generateDailyChallenges = (): DailyChallenge[] => {
  // const today = new Date().toDateString();
  
  const challenges: DailyChallenge[] = [
    {
      id: 'daily-1',
      title: 'Quick Navigation',
      description: 'Navigate to your home directory and list all files',
      challenge: 'Go to your home directory and list all files',
      expectedCommand: 'cd ~ && ls',
      difficulty: 'easy',
      xpReward: 25,
      bitsReward: 5,
      completed: false
    },
    {
      id: 'daily-2',
      title: 'File Creation',
      description: 'Create a new directory and add a file inside',
      challenge: 'Create a directory called "daily" and add a file "notes.txt" inside',
      expectedCommand: 'mkdir daily && cd daily && touch notes.txt',
      difficulty: 'medium',
      xpReward: 50,
      bitsReward: 10,
      completed: false
    },
    {
      id: 'daily-3',
      title: 'Text Processing',
      description: 'Search for a specific pattern in files',
      challenge: 'Find all files containing "TODO" in the current directory',
      expectedCommand: 'grep -r "TODO" .',
      difficulty: 'hard',
      xpReward: 75,
      bitsReward: 15,
      completed: false
    }
  ];
  
  // Shuffle based on today's date
  return challenges.sort(() => Math.random() - 0.5);
};

export const checkDailyChallengeCompletion = (
  command: string, 
  challenges: DailyChallenge[]
): { completed: DailyChallenge[]; remaining: DailyChallenge[] } => {
  const completed: DailyChallenge[] = [];
  const remaining: DailyChallenge[] = [];
  
  challenges.forEach(challenge => {
    if (challenge.completed) {
      completed.push(challenge);
    } else {
      // Simple check for now - in real implementation would need proper command matching
      const normalizedCommand = command.trim().toLowerCase();
      const normalizedExpected = challenge.expectedCommand.trim().toLowerCase();
      
      if (normalizedCommand.includes(normalizedExpected.split(' ')[0])) {
        completed.push({ ...challenge, completed: true });
      } else {
        remaining.push(challenge);
      }
    }
  });
  
  return { completed, remaining };
};