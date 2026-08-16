import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export const aiRouter = Router();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Roadmap Generator
aiRouter.post('/generate-roadmap', async (req, res) => {
  try {
    const { topic, experienceLevel = 'Intermediate', focus = 'Deep Mastery' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        title: `Mastering ${topic || 'New Field'}`,
        phases: [
          {
            id: 'p1',
            phaseNumber: 1,
            title: 'Foundations & Primitives',
            status: 'COMPLETED',
            topics: [
              {
                id: 't1',
                title: 'Core Principles & Architecture',
                description: 'Fundamental axioms and setup',
                status: 'completed',
                estimatedHours: 2,
              },
              {
                id: 't2',
                title: 'Key Mechanisms & Taxonomy',
                description: 'Essential vocabulary and workflows',
                status: 'completed',
                estimatedHours: 3,
              },
            ],
          },
          {
            id: 'p2',
            phaseNumber: 2,
            title: 'Intermediate Syntheses & Architecture',
            status: 'IN_PROGRESS',
            topics: [
              {
                id: 't3',
                title: 'Complex Patterns & Edge Cases',
                description: 'Deep dive into performance and nuances',
                status: 'completed',
                estimatedHours: 3,
              },
              {
                id: 't4',
                title: 'Applied Problem Solving & Workflows',
                description: 'Handling stateful scenarios and optimization',
                status: 'in_progress',
                estimatedHours: 2,
              },
              {
                id: 't5',
                title: 'Comparative Frameworks',
                description: 'Evaluating alternative approaches',
                status: 'pending',
                estimatedHours: 4,
              },
            ],
          },
          {
            id: 'p3',
            phaseNumber: 3,
            title: 'Advanced Specialization & Production',
            status: 'LOCKED',
            topics: [
              {
                id: 't6',
                title: 'High-Scale Implementations',
                description: 'Production resilience and benchmark analysis',
                status: 'pending',
                estimatedHours: 5,
              },
              {
                id: 't7',
                title: 'Autonomous Research & Synthesis',
                description: 'Pushing beyond standard conventions',
                status: 'pending',
                estimatedHours: 6,
              },
            ],
          },
        ],
      });
    }

    const prompt = `Generate a high-signal, academic-grade deep learning roadmap for: "${topic}".
Experience level: ${experienceLevel}. Focus: ${focus}.
Return JSON only matching this format:
{
  "title": "Mastering ${topic}",
  "phases": [
    {
      "id": "p1",
      "phaseNumber": 1,
      "title": "Phase title",
      "status": "COMPLETED" or "IN_PROGRESS" or "LOCKED",
      "topics": [
        {
          "id": "t1",
          "title": "Topic title",
          "description": "Short 1-sentence precise synopsis",
          "status": "completed" or "in_progress" or "pending",
          "estimatedHours": 2
        }
      ]
    }
  ]
}
Provide exactly 3 distinct chronological phases with 2-3 topics each.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Roadmap generation error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// AI Notes Synthesizer
aiRouter.post('/synthesize-notes', async (req, res) => {
  try {
    const { topic, rawInput } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        title: `Synthesized Notes: ${topic || 'Deep Concepts'}`,
        tags: ['Synthesized', 'Deep Work', 'Research'],
        contentMarkdown: `## Core Overview\n\nThese notes distill the essence of **${topic || 'the topic'}** into fundamental principles and operational insights.\n\n### Key Concepts\n- **First Principles**: Establishing invariant properties.\n- **Runtime Behavior**: Observing real-world constraints.\n\n> **💡 AI Insight**: Consistent practice and mental modeling accelerate conceptual retention by over 40%.`,
      });
    }

    const prompt = `Synthesize a structured, academic, markdown study note on: "${topic}".
Raw input/context: "${rawInput || 'Provide a comprehensive breakdown with code/examples if relevant.'}"
Include:
1. Executive Summary
2. 2 numbered core sections (with a code snippet if technical)
3. An AI Insight callout block
4. Tags array
Return JSON format:
{
  "title": "Title of the note",
  "tags": ["Tag1", "Tag2"],
  "contentMarkdown": "Formatted markdown text"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Note synthesis error:', err);
    res.status(500).json({ error: 'Failed to synthesize note' });
  }
});
