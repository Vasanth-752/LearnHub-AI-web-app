import { Roadmap, NoteItem, ChatConversation, ActiveSprint, UserProfile } from '../types';

export const initialProfile: UserProfile = {
  name: 'Alex Researcher',
  email: 'alex.r@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
  roadmapsCompleted: 14,
  dayStreak: 8,
  notesSynthesized: 124,
  theme: 'palladian',
  exportFormat: 'PDF Document',
  isLoggedIn: false,
};

export const initialActiveSprint: ActiveSprint = {
  moduleName: 'Learn React',
  title: 'Mastering React Hooks',
  description: 'Synthesize understanding of useEffect dependencies and custom hooks for the final project.',
  tasks: [
    { id: 'st-1', text: 'Review useMemo vs useCallback', completed: true },
    { id: 'st-2', text: 'Build a custom useFetch hook', completed: false, inProgress: true },
    { id: 'st-3', text: 'Optimize re-renders in UserDashboard', completed: false },
  ],
  progressPercent: 33,
};

export const initialRoadmaps: Roadmap[] = [
  {
    id: 'rm-neural-networks',
    title: 'Mastering Neural Networks',
    category: 'MACHINE LEARNING',
    overallProgress: 80,
    estimatedCompletion: 'Nov 24, 2023',
    timeSpent: '42h 15m',
    currentStreakDays: 4,
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Phase 1: Foundations',
        status: 'COMPLETED',
        topics: [
          { id: 't-1-1', title: 'Linear Algebra & Vector Calculus', description: 'Matrix multiplications, gradients, and optimization', status: 'completed', estimatedHours: 4 },
          { id: 't-1-2', title: 'Perceptrons & Multilayer Networks', description: 'Activation functions and forward propagation', status: 'completed', estimatedHours: 3 },
          { id: 't-1-3', title: 'Backpropagation Mechanics', description: 'Derivatives with chain rule and gradient descent', status: 'completed', estimatedHours: 5 },
          { id: 't-1-4', title: 'Loss Functions & Regularization', description: 'MSE, Cross-entropy, L1/L2, and Dropout', status: 'completed', estimatedHours: 3 },
        ],
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Phase 2: Deep Learning Architectures',
        subtitle: 'RNNs, and the transition to Transformer models.',
        status: 'IN_PROGRESS',
        topics: [
          {
            id: 't-2-1',
            title: 'Convolutional Neural Networks (CNNs)',
            description: 'Image processing fundamentals and feature extraction.',
            status: 'completed',
            estimatedHours: 4,
          },
          {
            id: 't-2-2',
            title: 'Recurrent Neural Networks (RNNs) & LSTMs',
            description: 'Handling sequential data and the vanishing gradient problem.',
            status: 'in_progress',
            estimatedHours: 2,
          },
          {
            id: 't-2-3',
            title: 'Introduction to Transformers',
            description: 'Attention mechanisms and self-attention.',
            status: 'pending',
            estimatedHours: 3,
          },
        ],
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Phase 3: Large Language Models',
        subtitle: 'Locked • 5 topics',
        status: 'LOCKED',
        topics: [
          { id: 't-3-1', title: 'Pre-training and Masked Language Modeling', description: 'Scaling laws and tokenization', status: 'locked', estimatedHours: 5 },
          { id: 't-3-2', title: 'Instruction Tuning & RLHF', description: 'Aligning models with human feedback and preference pairs', status: 'locked', estimatedHours: 6 },
          { id: 't-3-3', title: 'In-Context Learning & Prompt Engineering', description: 'Chain-of-thought, zero-shot and few-shot reasoning', status: 'locked', estimatedHours: 4 },
          { id: 't-3-4', title: 'Parameter-Efficient Fine-Tuning (PEFT/LoRA)', description: 'Low-rank adaptation and model distillation', status: 'locked', estimatedHours: 4 },
          { id: 't-3-5', title: 'Retrieval Augmented Generation (RAG)', description: 'Vector embeddings, chunking, and similarity search', status: 'locked', estimatedHours: 5 },
        ],
      },
    ],
  },
  {
    id: 'rm-philosophy-mind',
    title: 'The Philosophy of Mind: Consciousness',
    category: 'COGNITIVE SCIENCE',
    overallProgress: 45,
    estimatedCompletion: 'Dec 12, 2023',
    timeSpent: '18h 40m',
    currentStreakDays: 3,
    phases: [
      {
        id: 'pm-1',
        phaseNumber: 1,
        title: 'Phase 1: Dualism & Physicalism',
        status: 'COMPLETED',
        topics: [
          { id: 'pm-t1', title: 'Cartesian Dualism & Mind-Body Interaction', description: 'Substance dualism and historic critiques', status: 'completed', estimatedHours: 3 },
          { id: 'pm-t2', title: 'Identity Theory & Functionalism', description: 'Mental states as physical computational states', status: 'completed', estimatedHours: 4 },
        ],
      },
      {
        id: 'pm-2',
        phaseNumber: 2,
        title: 'Phase 2: The Hard Problem & Qualia',
        subtitle: 'Subjective phenomenology and explanatory gaps.',
        status: 'IN_PROGRESS',
        topics: [
          { id: 'pm-t3', title: 'David Chalmers and the Hard Problem', description: 'Why physical processing leads to subjective inner experience', status: 'in_progress', estimatedHours: 2 },
          { id: 'pm-t4', title: "Nagel's 'What Is It Like to Be a Bat?'", description: 'Inherent subjective limits of objective physicalist models', status: 'pending', estimatedHours: 3 },
        ],
      },
      {
        id: 'pm-3',
        phaseNumber: 3,
        title: 'Phase 3: Neural Correlates & Global Workspace',
        status: 'LOCKED',
        topics: [
          { id: 'pm-t5', title: 'Global Neuronal Workspace Theory', description: 'Conscious broadcast and cortical dynamics', status: 'locked', estimatedHours: 4 },
          { id: 'pm-t6', title: 'Integrated Information Theory (IIT)', description: 'Mathematical measure of consciousness (Phi)', status: 'locked', estimatedHours: 5 },
        ],
      },
    ],
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: 'note-react-hooks',
    title: 'Understanding React Hooks: A Deep Dive',
    date: 'Oct 24, 2023',
    tags: ['React', 'Frontend'],
    isAiGenerated: true,
    content: `Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. This note synthesizes the core concepts necessary for mastering functional components.

### 1. The useState Hook

The most fundamental hook. It allows you to add React state to function components.

\`\`\`javascript
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### 2. The useEffect Hook

The Effect Hook lets you perform side effects in function components. It serves the same purpose as \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\` in React classes, but unified into a single API.

- Data fetching
- Setting up a subscription
- Manually changing the DOM in React components

> **AI Insight**
> Remember to include a dependency array \`[]\` as the second argument to \`useEffect\` to prevent infinite loops. Omit it only if you genuinely want the effect to run on every single render.

Mastering these two hooks provides the foundation for 90% of daily React development tasks.`,
  },
  {
    id: 'note-consciousness',
    title: 'The Hard Problem of Consciousness: Synthesis',
    date: 'Oct 22, 2023',
    tags: ['Philosophy', 'Cognitive Science'],
    isAiGenerated: true,
    content: `A rigorous breakdown of David Chalmers' famous formulation distinguishing between the "easy" cognitive problems and the single "hard" problem of qualia.

### 1. The Easy Problems
- Discrimination and categorization of environmental stimuli
- Integration of information by cognitive systems
- Reportability of mental states
- Focus of attention and deliberate behavior control

### 2. The Hard Problem
Why does information processing feel like anything from the inside? How do physical electro-chemical signals create the redness of red, the feeling of warmth, or the painfulness of pain?

> **AI Insight**
> Notice that even if we map every single synapse in the human connectome, we have still only solved the easy problems—the explanatory gap remains completely open.`,
  },
  {
    id: 'note-transformers',
    title: 'Attention Is All You Need: Architectural Notes',
    date: 'Oct 19, 2023',
    tags: ['Machine Learning', 'NLP'],
    isAiGenerated: false,
    content: `Core takeaways from the seminal Vaswani et al. 2017 Transformer architecture:

### Key Pillars
1. **Self-Attention**: Computing Query, Key, and Value vectors across token embeddings.
2. **Multi-Head Attention**: Allowing the model to jointly attend to information from different representation subspaces at different positions.
3. **Positional Encodings**: Sinusoidal functions injected to provide sequence order without recurrence.

\`\`\`python
# Scaled Dot-Product Attention equation:
# Attention(Q, K, V) = softmax(Q * K.T / sqrt(d_k)) * V
\`\`\`
`,
  },
];

export const initialConversations: ChatConversation[] = [
  {
    id: 'conv-philosophy',
    category: 'COGNITIVE SCIENCE',
    title: 'Philosophy of Mind',
    updatedAt: '10:42 AM',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: "I'm trying to understand the 'Hard Problem of Consciousness'. Can you break it down into a structured learning path?",
        timestamp: 'Today, 10:42 AM',
      },
      {
        id: 'm2',
        sender: 'ai',
        text: `The "Hard Problem of Consciousness," coined by David Chalmers, is one of the central debates in the philosophy of mind. It distinguishes between the mechanics of the brain and the subjective experience itself.

### The Core Distinction

- **Easy Problems**: How the brain processes information, integrates sensory data, or controls behavior (mechanistic functions).
- **The Hard Problem**: Why and how these physical processes give rise to subjective, inner experience (qualia). Why does it *feel* like something to see the color red?

I've structured a progressive learning path to help you explore this topic systemically.`,
        timestamp: 'Today, 10:42 AM',
        roadmapCard: {
          title: 'The Philosophy of Mind: Consciousness',
          actionId: 'rm-philosophy-mind',
        },
      },
    ],
  },
  {
    id: 'conv-neural-correlates',
    category: 'COGNITIVE SCIENCE',
    title: 'Neural Correlates of Consciousness',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 'm-nc-1',
        sender: 'user',
        text: 'What are the leading neurological theories for NCC (Neural Correlates of Consciousness)?',
        timestamp: 'Yesterday, 3:15 PM',
      },
      {
        id: 'm-nc-2',
        sender: 'ai',
        text: `The two most prominent frameworks in contemporary neuroscience are:
1. **Global Neuronal Workspace Theory (GNWT)** - Consciousness emerges when sensory information is 'ignited' into frontoparietal networks and broadcast globally.
2. **Integrated Information Theory (IIT)** - Consciousness is an intrinsic, fundamental property quantified as Phi (Φ).`,
        timestamp: 'Yesterday, 3:16 PM',
      },
    ],
  },
  {
    id: 'conv-transformers',
    category: 'MACHINE LEARNING',
    title: 'Transformer Architectures',
    updatedAt: '2 days ago',
    messages: [
      {
        id: 'm-tf-1',
        sender: 'user',
        text: 'Explain how multi-head attention overcomes the memory bottlenecks of standard RNNs.',
        timestamp: '2 days ago',
      },
      {
        id: 'm-tf-2',
        sender: 'ai',
        text: `RNNs are sequential by nature: step $t$ strictly requires step $t-1$, which prevents massive GPU parallelization. 

Transformers compute attention across all tokens concurrently via matrix multiplications ($Q \\times K^T$), scaling training efficiency exponentially.`,
        timestamp: '2 days ago',
      },
    ],
  },
  {
    id: 'conv-attention',
    category: 'MACHINE LEARNING',
    title: 'Attention Mechanisms',
    updatedAt: '3 days ago',
    messages: [
      {
        id: 'm-at-1',
        sender: 'user',
        text: 'What is the exact scaling factor in scaled dot-product attention?',
        timestamp: '3 days ago',
      },
      {
        id: 'm-at-2',
        sender: 'ai',
        text: `The scaling factor is $1 / \\sqrt{d_k}$, where $d_k$ is the dimensionality of the key vectors.

**Why it matters:** As $d_k$ grows large, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by $\\sqrt{d_k}$ stabilizes gradient backpropagation.`,
        timestamp: '3 days ago',
      },
    ],
  },
];
