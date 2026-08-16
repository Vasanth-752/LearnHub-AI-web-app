import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NotesView } from './components/NotesView';
import { AiChatView } from './components/AiChatView';
import { RoadmapsView } from './components/RoadmapsView';
import { SettingsView } from './components/SettingsView';
import { LandingView } from './components/LandingView';
import { AuthView } from './components/AuthView';
import { NewResearchModal } from './components/NewResearchModal';
import { DeepWorkTimerModal } from './components/DeepWorkTimerModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SupabaseDiagnosticsToast } from './components/SupabaseDiagnosticsToast';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { supabaseService } from './lib/supabaseService';

import {
  initialProfile,
  initialActiveSprint,
  initialRoadmaps,
  initialNotes,
  initialConversations,
} from './data/initialData';
import {
  NavigationTab,
  Roadmap,
  NoteItem,
  ChatConversation,
  ActiveSprint,
  UserProfile,
  TopicItem,
} from './types';

export default function App() {
  // Navigation & View State (Check if returning from OAuth redirect on initial load)
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (
        hash.includes('access_token=') ||
        hash.includes('type=recovery') ||
        hash.includes('type=invite') ||
        search.includes('code=')
      ) {
        return 'dashboard';
      }
    }
    return 'landing';
  });

  // Application Data States
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('learnhub_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [sprint, setSprint] = useState<ActiveSprint>(() => {
    const saved = localStorage.getItem('learnhub_sprint');
    return saved ? JSON.parse(saved) : initialActiveSprint;
  });

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(() => {
    const saved = localStorage.getItem('learnhub_roadmaps');
    return saved ? JSON.parse(saved) : initialRoadmaps;
  });
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(initialRoadmaps[0].id);

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('learnhub_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('learnhub_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });
  const [activeConversationId, setActiveConversationId] = useState<string>(
    initialConversations[0].id
  );

  // Modals & Mode States
  const [isDeepWorkActive, setIsDeepWorkActive] = useState<boolean>(true);
  const [isNewResearchOpen, setIsNewResearchOpen] = useState<boolean>(false);
  const [isDeepWorkTimerOpen, setIsDeepWorkTimerOpen] = useState<boolean>(false);

  // Sync Persistence
  useEffect(() => {
    localStorage.setItem('learnhub_profile', JSON.stringify(profile));
    if (profile.theme === 'abyssal') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile]);

  // Supabase Auth State Listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Scholar';
        setProfile((prev) => ({
          ...prev,
          name: prev.name || name,
          email: user.email || prev.email,
          authProvider: user.app_metadata?.provider === 'google' ? 'google' : 'email',
          isLoggedIn: true,
          uid: user.id,
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = session.user;
          const remoteProfile = await supabaseService.getProfile(user.id);
          const name = remoteProfile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Scholar';
          
          setProfile((prev) => ({
            ...prev,
            name,
            email: user.email || prev.email,
            avatarUrl: remoteProfile?.avatarUrl || user.user_metadata?.avatar_url || prev.avatarUrl,
            theme: remoteProfile?.theme || prev.theme,
            exportFormat: remoteProfile?.exportFormat || prev.exportFormat,
            roadmapsCompleted: remoteProfile?.roadmapsCompleted ?? prev.roadmapsCompleted,
            dayStreak: remoteProfile?.dayStreak ?? prev.dayStreak,
            notesSynthesized: remoteProfile?.notesSynthesized ?? prev.notesSynthesized,
            authProvider: user.app_metadata?.provider === 'google' ? 'google' : 'email',
            isLoggedIn: true,
            uid: user.id,
          }));

          // If returning from OAuth redirect, route user straight to dashboard
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
              setCurrentTab('dashboard');
              // Clean up the URL hash/search without full page reload
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          }

          // Fetch cloud roadmaps, notes, and sprint
          const [cloudRoadmaps, cloudNotes, cloudSprint] = await Promise.all([
            supabaseService.getRoadmaps(user.id),
            supabaseService.getNotes(user.id),
            supabaseService.getSprint(user.id),
          ]);

          if (cloudRoadmaps && cloudRoadmaps.length > 0) setRoadmaps(cloudRoadmaps);
          if (cloudNotes && cloudNotes.length > 0) setNotes(cloudNotes);
          if (cloudSprint) setSprint(cloudSprint);
        } else if (event === 'SIGNED_OUT') {
          setProfile((prev) => ({
            ...prev,
            isLoggedIn: false,
            uid: undefined,
            authProvider: undefined,
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('learnhub_sprint', JSON.stringify(sprint));
    if (profile.uid && supabaseService.isReady()) {
      supabaseService.saveSprint(profile.uid, sprint);
    }
  }, [sprint, profile.uid]);

  // Supabase Realtime Sync Listener across sessions / tabs / devices
  useEffect(() => {
    if (!profile.uid || !supabaseService.isReady()) return;

    const unsubscribeRealtime = supabaseService.subscribeToUserData(profile.uid, {
      onProfileUpdate: (updatedProfile) => {
        setProfile((prev) => ({ ...prev, ...updatedProfile }));
      },
      onRoadmapUpsert: (updatedRoadmap) => {
        setRoadmaps((prev) => {
          const index = prev.findIndex((r) => r.id === updatedRoadmap.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedRoadmap;
            return next;
          }
          return [updatedRoadmap, ...prev];
        });
      },
      onRoadmapDelete: (roadmapId) => {
        setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId));
      },
      onNoteUpsert: (updatedNote) => {
        setNotes((prev) => {
          const index = prev.findIndex((n) => n.id === updatedNote.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedNote;
            return next;
          }
          return [updatedNote, ...prev];
        });
      },
      onNoteDelete: (noteId) => {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      },
      onSprintUpdate: (updatedSprint) => {
        setSprint(updatedSprint);
      },
    });

    return () => {
      unsubscribeRealtime();
    };
  }, [profile.uid]);

  useEffect(() => {
    localStorage.setItem('learnhub_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('learnhub_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('learnhub_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Handlers
  const handleSaveNote = (updatedNote: NoteItem) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    if (profile.uid && supabaseService.isReady()) {
      supabaseService.saveNote(profile.uid, updatedNote);
    }
  };

  const handleCreateNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
    setProfile((p) => {
      const updated = { ...p, notesSynthesized: p.notesSynthesized + 1 };
      if (p.uid && supabaseService.isReady()) {
        supabaseService.upsertProfile(p.uid, { notesSynthesized: updated.notesSynthesized });
      }
      return updated;
    });
    if (profile.uid && supabaseService.isReady()) {
      supabaseService.saveNote(profile.uid, newNote);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (profile.uid && supabaseService.isReady()) {
      supabaseService.deleteNote(profile.uid, noteId);
    }
  };

  const handleCreateRoadmap = (newRoadmap: Roadmap) => {
    setRoadmaps((prev) => [newRoadmap, ...prev]);
    setActiveRoadmapId(newRoadmap.id);
    setCurrentTab('roadmaps');
    if (profile.uid && supabaseService.isReady()) {
      supabaseService.saveRoadmap(profile.uid, newRoadmap);
    }
  };

  const handleUpdateRoadmap = (updated: Roadmap) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    if (profile.uid && supabaseService.isReady()) {
      supabaseService.saveRoadmap(profile.uid, updated);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsgId = `m-${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      sender: 'user' as const,
      text,
      timestamp: 'Just now',
    };

    // Append user message immediately
    const targetConvId = activeConversationId;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          return {
            ...c,
            messages: [...c.messages, userMessage],
            updatedAt: 'Just now',
          };
        }
        return c;
      })
    );

    // Call server endpoint
    const history =
      conversations
        .find((c) => c.id === targetConvId)
        ?.messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })) || [];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: history,
        }),
      });
      const data = await res.json();

      const aiMessage = {
        id: `m-ai-${Date.now()}`,
        sender: 'ai' as const,
        text: data.reply || 'Analysis synthesized.',
        timestamp: 'Just now',
        roadmapCard: data.createdRoadmapTitle
          ? {
              title: data.createdRoadmapTitle,
              actionId: activeRoadmapId,
            }
          : undefined,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: [...c.messages, aiMessage],
              updatedAt: 'Just now',
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error(err);
      const fallbackAiMsg = {
        id: `m-ai-${Date.now()}`,
        sender: 'ai' as const,
        text: `Here is a structured synthesis regarding "${text}":\n\n### Core Theoretical Framework\n1. Foundational Axioms & Definitions\n2. Primary Mechanisms & Dynamic Constraints\n3. Empirical Validation and Literature Context\n\nWould you like to build an actionable learning roadmap around this?`,
        timestamp: 'Just now',
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: [...c.messages, fallbackAiMsg],
            };
          }
          return c;
        })
      );
    }
  };

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      category: 'NEW INQUIRY',
      title: 'Structured Exploration',
      updatedAt: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'ai',
          text: `Welcome to your deep work inquiry space. What concept, research problem, or curriculum would you like to deconstruct systematically today?`,
          timestamp: 'Just now',
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
  };

  const handleNavigateToTopic = (topic: TopicItem) => {
    // Check if we have a note for this topic, or create one and switch to Notes
    const existingNote = notes.find((n) =>
      n.title.toLowerCase().includes(topic.title.toLowerCase())
    );
    if (existingNote) {
      setCurrentTab('notes');
    } else {
      const newTopicNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: topic.title,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        tags: ['Roadmap Topic', 'Active Study'],
        isAiGenerated: false,
        content: `### ${topic.title}\n\n${topic.description}\n\n- Key definitions:\n- Mathematical formulations or syntax:\n- Reflection and exercises:`,
      };
      handleCreateNote(newTopicNote);
      setCurrentTab('notes');
    }
  };

  const handleRegenerateRoadmapInChat = (title: string) => {
    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      category: 'ROADMAP ADAPTATION',
      title: `Refining: ${title}`,
      updatedAt: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'ai',
          text: `I'm ready to adapt your roadmap for "${title}". What aspects would you like to emphasize more (e.g. practical implementations, deeper theoretical proofs, or accelerated pace)?`,
          timestamp: 'Just now',
          roadmapCard: {
            title,
            actionId: activeRoadmapId,
          },
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    setCurrentTab('chat');
  };

  // Centralized Sign Out Handler
  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase signout error:', e);
      }
    }
    setProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        isLoggedIn: false,
        authProvider: undefined,
        uid: undefined,
      };
      localStorage.setItem('learnhub_profile', JSON.stringify(updated));
      return updated;
    });
    setCurrentTab('landing');
  };

  // Protect Workspace: Redirect to landing page if user is not authenticated
  useEffect(() => {
    if (!profile.isLoggedIn && currentTab !== 'landing' && currentTab !== 'auth') {
      setCurrentTab('landing');
    }
  }, [profile.isLoggedIn, currentTab]);

  // If on Landing page
  if (currentTab === 'landing') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing-view-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="min-h-screen"
        >
          <LandingView
            onEnterApp={(tab = 'dashboard') => {
              if (tab === 'auth') {
                setCurrentTab('auth');
              } else if (profile.isLoggedIn) {
                setCurrentTab(tab);
              } else {
                setCurrentTab('auth');
              }
            }}
            theme={profile.theme}
            isLoggedIn={profile.isLoggedIn}
            userName={profile.name.split(' ')[0]}
            onSignOut={handleSignOut}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // If on Sign In / Register Auth page
  if (currentTab === 'auth') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="auth-view-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="min-h-screen"
        >
          <AuthView
            theme={profile.theme}
            onSuccess={(updates) => {
              setProfile((prev) => ({
                ...prev,
                ...updates,
              }));
              setCurrentTab('dashboard');
            }}
            onBackToLanding={() => setCurrentTab('landing')}
            onToggleTheme={() =>
              setProfile((p) => ({
                ...p,
                theme: p.theme === 'abyssal' ? 'palladian' : 'abyssal',
              }))
            }
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  const isAbyssal = profile.theme === 'abyssal';

  const getHeaderPlaceholder = () => {
    switch (currentTab) {
      case 'notes':
        return 'Search notes, tags, syntax...';
      case 'roadmaps':
        return 'Search roadmap topics, phases...';
      case 'chat':
        return 'Search conversation history...';
      case 'settings':
        return 'Search settings & preferences...';
      default:
        return 'Search knowledge & notes...';
    }
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        isAbyssal ? 'bg-[#0B111A] text-[#F1F5F9]' : 'bg-[#FAF6EE] text-[#1E252B]'
      }`}
    >
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenNewResearch={() => setIsNewResearchOpen(true)}
        onToggleDeepWork={() => setIsDeepWorkTimerOpen(true)}
        isDeepWorkActive={isDeepWorkActive}
        theme={profile.theme}
        onToggleTheme={() =>
          setProfile((p) => ({
            ...p,
            theme: p.theme === 'abyssal' ? 'palladian' : 'abyssal',
          }))
        }
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          placeholder={getHeaderPlaceholder()}
          profile={profile}
          theme={profile.theme}
          isDeepWorkActive={isDeepWorkActive}
          onOpenSettings={() => setCurrentTab('settings')}
          onToggleDeepWork={() => setIsDeepWorkTimerOpen(true)}
        />

        {/* Dynamic Tab Body with Smooth Fade-in View Transition & Error Boundary */}
        <main className="flex-1 overflow-y-auto relative">
          <ErrorBoundary
            fallbackTitle="Something went wrong while rendering this view"
            onReset={() => setCurrentTab('dashboard')}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="min-h-full"
              >
                {currentTab === 'dashboard' && (
                  <DashboardView
                    sprint={sprint}
                    onUpdateSprint={setSprint}
                    onNavigate={(tab) => setCurrentTab(tab)}
                    onOpenChat={(topicTitle) => {
                      if (topicTitle) {
                        const matchingConv = conversations.find((c) =>
                          c.title.toLowerCase().includes(topicTitle.toLowerCase())
                        );
                        if (matchingConv) {
                          setActiveConversationId(matchingConv.id);
                        }
                      }
                      setCurrentTab('chat');
                    }}
                    onOpenNewResearch={() => setIsNewResearchOpen(true)}
                    theme={profile.theme}
                    isDeepWorkActive={isDeepWorkActive}
                    userName={profile.name.split(' ')[0]}
                    profile={profile}
                    roadmaps={roadmaps}
                  />
                )}

                {currentTab === 'chat' && (
                  <AiChatView
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={setActiveConversationId}
                    onNewConversation={handleNewConversation}
                    onSendMessage={handleSendMessage}
                    onNavigateToRoadmap={(id) => {
                      if (id) setActiveRoadmapId(id);
                      setCurrentTab('roadmaps');
                    }}
                    theme={profile.theme}
                  />
                )}

                {currentTab === 'roadmaps' && (
                  <RoadmapsView
                    roadmaps={roadmaps}
                    activeRoadmapId={activeRoadmapId}
                    onSelectRoadmap={setActiveRoadmapId}
                    onUpdateRoadmap={handleUpdateRoadmap}
                    onNavigateToTopic={handleNavigateToTopic}
                    onRegenerateInChat={handleRegenerateRoadmapInChat}
                    onOpenNewResearch={() => setIsNewResearchOpen(true)}
                    theme={profile.theme}
                  />
                )}

                {currentTab === 'notes' && (
                  <NotesView
                    notes={notes}
                    onSaveNote={handleSaveNote}
                    onCreateNote={handleCreateNote}
                    onDeleteNote={handleDeleteNote}
                    theme={profile.theme}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsView
                    profile={profile}
                    onUpdateProfile={setProfile}
                    onSignOut={handleSignOut}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

      {/* New Research Roadmap Modal */}
      <NewResearchModal
        isOpen={isNewResearchOpen}
        onClose={() => setIsNewResearchOpen(false)}
        onCreateRoadmap={handleCreateRoadmap}
        theme={profile.theme}
      />

      {/* Deep Work Timer Modal */}
      <DeepWorkTimerModal
        isOpen={isDeepWorkTimerOpen}
        onClose={() => setIsDeepWorkTimerOpen(false)}
        isActive={isDeepWorkActive}
        onToggleActive={() => setIsDeepWorkActive(!isDeepWorkActive)}
        theme={profile.theme}
      />

      {/* Supabase Connectivity & Environment Diagnostic Notification */}
      <SupabaseDiagnosticsToast />
    </div>
  );
}
