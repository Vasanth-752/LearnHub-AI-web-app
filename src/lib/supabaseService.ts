import { supabase, isSupabaseConfigured } from './supabase';
import { Roadmap, NoteItem, ActiveSprint, UserProfile } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeSyncCallbacks {
  onProfileUpdate?: (profile: Partial<UserProfile>) => void;
  onRoadmapsChange?: (roadmaps: Roadmap[]) => void;
  onRoadmapUpsert?: (roadmap: Roadmap) => void;
  onRoadmapDelete?: (roadmapId: string) => void;
  onNotesChange?: (notes: NoteItem[]) => void;
  onNoteUpsert?: (note: NoteItem) => void;
  onNoteDelete?: (noteId: string) => void;
  onSprintUpdate?: (sprint: ActiveSprint) => void;
}

export const supabaseService = {
  // Check if Supabase is active
  isReady: () => isSupabaseConfigured && !!supabase,

  // 1. Profile Management
  async getProfile(userId: string): Promise<Partial<UserProfile> | null> {
    if (!supabaseService.isReady() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatar_url,
        theme: data.theme || 'palladian',
        exportFormat: data.export_format || 'PDF Document',
        roadmapsCompleted: data.roadmaps_completed || 0,
        dayStreak: data.day_streak || 1,
        notesSynthesized: data.notes_synthesized || 0,
      };
    } catch (err) {
      console.warn('Failed to fetch Supabase profile:', err);
      return null;
    }
  },

  async upsertProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
    if (!supabaseService.isReady() || !supabase) return false;
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        name: profile.name,
        email: profile.email,
        avatar_url: profile.avatarUrl,
        theme: profile.theme,
        export_format: profile.exportFormat,
        roadmaps_completed: profile.roadmapsCompleted,
        day_streak: profile.dayStreak,
        notes_synthesized: profile.notesSynthesized,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      console.warn('Failed to upsert Supabase profile:', err);
      return false;
    }
  },

  // 2. Roadmaps Management
  async getRoadmaps(userId: string): Promise<Roadmap[]> {
    if (!supabaseService.isReady() || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        overallProgress: row.overall_progress,
        estimatedCompletion: row.estimated_completion,
        timeSpent: row.time_spent,
        currentStreakDays: row.current_streak_days,
        phases: row.phases || [],
      }));
    } catch (err) {
      console.warn('Failed to fetch roadmaps from Supabase:', err);
      return [];
    }
  },

  async saveRoadmap(userId: string, roadmap: Roadmap): Promise<boolean> {
    if (!supabaseService.isReady() || !supabase) return false;
    try {
      const { error } = await supabase.from('roadmaps').upsert({
        id: roadmap.id,
        user_id: userId,
        title: roadmap.title,
        category: roadmap.category,
        overall_progress: roadmap.overallProgress,
        estimated_completion: roadmap.estimatedCompletion,
        time_spent: roadmap.timeSpent,
        current_streak_days: roadmap.currentStreakDays,
        phases: roadmap.phases,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      console.warn('Failed to save roadmap to Supabase:', err);
      return false;
    }
  },

  async deleteRoadmap(userId: string, roadmapId: string): Promise<boolean> {
    if (!supabaseService.isReady() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', roadmapId)
        .eq('user_id', userId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // 3. Notes Management
  async getNotes(userId: string): Promise<NoteItem[]> {
    if (!supabaseService.isReady() || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        date: row.date,
        tags: row.tags || [],
        isAiGenerated: row.is_ai_generated || false,
        content: row.content || '',
      }));
    } catch (err) {
      console.warn('Failed to fetch notes from Supabase:', err);
      return [];
    }
  },

  async saveNote(userId: string, note: NoteItem): Promise<boolean> {
    if (!supabaseService.isReady() || !supabase) return false;
    try {
      const { error } = await supabase.from('notes').upsert({
        id: note.id,
        user_id: userId,
        title: note.title,
        date: note.date,
        tags: note.tags,
        is_ai_generated: note.isAiGenerated,
        content: note.content,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      console.warn('Failed to save note to Supabase:', err);
      return false;
    }
  },

  async deleteNote(userId: string, noteId: string): Promise<boolean> {
    if (!supabaseService.isReady() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // 4. Sprint Management
  async getSprint(userId: string): Promise<ActiveSprint | null> {
    if (!supabaseService.isReady() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('active_sprints')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        moduleName: data.module_name,
        title: data.title,
        description: data.description,
        tasks: data.tasks || [],
        progressPercent: data.progress_percent || 0,
      };
    } catch (err) {
      return null;
    }
  },

  async saveSprint(userId: string, sprint: ActiveSprint): Promise<boolean> {
    if (!supabaseService.isReady() || !supabase) return false;
    try {
      const { error } = await supabase.from('active_sprints').upsert({
        user_id: userId,
        module_name: sprint.moduleName,
        title: sprint.title,
        description: sprint.description,
        tasks: sprint.tasks,
        progress_percent: sprint.progressPercent,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      return false;
    }
  },

  // 5. Supabase Realtime Subscription Service
  subscribeToUserData(userId: string, callbacks: RealtimeSyncCallbacks): () => void {
    if (!supabaseService.isReady() || !supabase) {
      return () => {};
    }

    const channelName = `realtime-user-sync-${userId}-${Date.now()}`;
    let channel: RealtimeChannel | null = null;

    try {
      channel = supabase
        .channel(channelName)
        // 1. Listen for Roadmaps real-time changes
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'roadmaps',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              const oldId = payload.old?.id;
              if (oldId && callbacks.onRoadmapDelete) {
                callbacks.onRoadmapDelete(oldId);
              }
            } else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const row = payload.new;
              if (row && callbacks.onRoadmapUpsert) {
                callbacks.onRoadmapUpsert({
                  id: row.id,
                  title: row.title,
                  category: row.category,
                  overallProgress: row.overall_progress,
                  estimatedCompletion: row.estimated_completion,
                  timeSpent: row.time_spent,
                  currentStreakDays: row.current_streak_days,
                  phases: row.phases || [],
                });
              }
            }
          }
        )
        // 2. Listen for Notes real-time changes
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notes',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              const oldId = payload.old?.id;
              if (oldId && callbacks.onNoteDelete) {
                callbacks.onNoteDelete(oldId);
              }
            } else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const row = payload.new;
              if (row && callbacks.onNoteUpsert) {
                callbacks.onNoteUpsert({
                  id: row.id,
                  title: row.title,
                  date: row.date,
                  tags: row.tags || [],
                  isAiGenerated: row.is_ai_generated || false,
                  content: row.content || '',
                });
              }
            }
          }
        )
        // 3. Listen for Profile real-time changes
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const row = payload.new;
              if (row && callbacks.onProfileUpdate) {
                callbacks.onProfileUpdate({
                  name: row.name,
                  email: row.email,
                  avatarUrl: row.avatar_url,
                  theme: row.theme || 'palladian',
                  exportFormat: row.export_format || 'PDF Document',
                  roadmapsCompleted: row.roadmaps_completed,
                  dayStreak: row.day_streak,
                  notesSynthesized: row.notes_synthesized,
                });
              }
            }
          }
        )
        // 4. Listen for Active Sprint changes
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'active_sprints',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const row = payload.new;
              if (row && callbacks.onSprintUpdate) {
                callbacks.onSprintUpdate({
                  moduleName: row.module_name,
                  title: row.title,
                  description: row.description,
                  tasks: row.tasks || [],
                  progressPercent: row.progress_percent || 0,
                });
              }
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription error:', err);
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  },
};
