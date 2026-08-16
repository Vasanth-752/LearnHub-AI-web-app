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
import { auth, logoutFirebase } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
  // Navigation & View State (Always starts from the landing page)
  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');

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

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setProfile((prev) => ({
          ...prev,
          name: firebaseUser.displayName || prev.name,
          email: firebaseUser.email || prev.email,
          avatarUrl:
            firebaseUser.photoURL ||
            prev.avatarUrl ||
            `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
          authProvider: 'google',
          isLoggedIn: true,
          uid: firebaseUser.uid,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('learnhub_sprint', JSON.stringify(sprint));
  }, [sprint]);

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
  };

  const handleCreateNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
    setProfile((p) => ({ ...p, notesSynthesized: p.notesSynthesized + 1 }));
  };

  const handleCreateRoadmap = (newRoadmap: Roadmap) => {
    setRoadmaps((prev) => [newRoadmap, ...prev]);
    setActiveRoadmapId(newRoadmap.id);
    setCurrentTab('roadmaps');
  };

  const handleUpdateRoadmap = (updated: Roadmap) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
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
    try {
      await logoutFirebase();
    } catch (e) {
      console.error('Firebase signout error:', e);
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

        {/* Dynamic Tab Body with Smooth Fade-in View Transition */}
        <main className="flex-1 overflow-y-auto relative">
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
    </div>
  );
}
