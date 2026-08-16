export type NavigationTab = 'dashboard' | 'chat' | 'roadmaps' | 'notes' | 'settings' | 'landing' | 'auth';

export type ThemeMode = 'palladian' | 'abyssal';

export interface TopicItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'locked';
  estimatedHours?: number;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  topics: TopicItem[];
}

export interface Roadmap {
  id: string;
  title: string;
  category: string;
  overallProgress: number; // 0-100
  estimatedCompletion: string;
  timeSpent: string;
  currentStreakDays: number;
  phases: RoadmapPhase[];
}

export interface NoteItem {
  id: string;
  title: string;
  date: string;
  tags: string[];
  isAiGenerated: boolean;
  content: string; // Markdown or rich HTML
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  roadmapCard?: {
    title: string;
    actionId?: string;
  };
}

export interface ChatConversation {
  id: string;
  category: string; // 'COGNITIVE SCIENCE', 'MACHINE LEARNING', etc.
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface SprintTask {
  id: string;
  text: string;
  completed: boolean;
  inProgress?: boolean;
}

export interface ActiveSprint {
  moduleName: string;
  title: string;
  description: string;
  tasks: SprintTask[];
  progressPercent: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  roadmapsCompleted: number;
  dayStreak: number;
  notesSynthesized: number;
  theme: ThemeMode;
  exportFormat: 'PDF Document' | 'Markdown (.md)' | 'HTML Document' | 'JSON Archive';
  authProvider?: 'google' | 'email';
  isLoggedIn?: boolean;
  uid?: string;
}
