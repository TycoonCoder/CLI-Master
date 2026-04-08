export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  condition: {
    type: 'xp' | 'lessons' | 'streak' | 'bits' | 'quiz' | 'review' | 'special';
    threshold: number;
  };
  xpReward: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  bits: number;
  hasXpBoost: boolean;
  achievements: Achievement[];
  completedLessons: Set<string>;
  lastActive: Date;
  completedUnits?: Set<string>;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  commands: string[];
  challenges: Challenge[];
  prerequisites: string[];
  xpReward: number;
  visualAid?: VisualAid;
}

export interface Challenge {
  id: string;
  description: string;
  expectedCommand: string;
  hints: string[];
  fileSystemState: VirtualFileSystemState;
}

export interface VirtualFileSystemState {
  currentPath: string;
  files: FileEntry[];
  directories: DirectoryEntry[];
  environment: Record<string, string>;
}

export interface FileEntry {
  name: string;
  content: string;
  permissions: string;
  owner: string;
  group: string;
}

export interface DirectoryEntry {
  name: string;
  permissions: string;
  owner: string;
  group: string;
}

export interface VisualAid {
  type: 'filesystem' | 'command-flow' | 'output-visualization';
  data: any;
}

export interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
}

export interface TerminalState {
  isActive: boolean;
  currentInput: string;
  history: string[];
  output: string[];
  currentLesson?: string;
}