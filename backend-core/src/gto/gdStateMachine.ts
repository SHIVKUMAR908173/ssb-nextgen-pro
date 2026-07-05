import { GoogleGenAI } from '@google/genai';

export type GDSessionConfig = {
  sessionId: string;
};

export type GDSessionState = {
  config: GDSessionConfig;
  topic: string;
  history: Array<{ role: 'system' | 'user' | 'ai'; content: string; speakerName?: string }>;
  turnCount: number;
  completed: boolean;
};

export type GDSessionInitResult = {
  state: GDSessionState;
};

export type GDSessionTurnInput = {
  state: GDSessionState;
  userMessage: string;
};

export type GDSessionTurnResult = {
  state: GDSessionState;
  aiResponses: Array<{ speakerName: string; content: string }>;
};

// Mock GD Topics
const GD_TOPICS = [
  "Should artificial intelligence be regulated by the government?",
  "Is the current education system preparing students for the future?",
  "Impact of social media on youth mental health.",
  "Women in combat roles in the Armed Forces."
];

export function initGDSession(config: GDSessionConfig): GDSessionInitResult {
  const topic = GD_TOPICS[Math.floor(Math.random() * GD_TOPICS.length)];
  const state: GDSessionState = {
    config,
    topic,
    history: [{
      role: 'system',
      content: `Group Discussion started. Topic: ${topic}`
    }],
    turnCount: 0,
    completed: false
  };

  return { state };
}

// Simple conversational state machine for GD using Gemini
export async function submitGDTurn(input: GDSessionTurnInput): Promise<GDSessionTurnResult> {
  const { state, userMessage } = input;
  const newState = { ...state };

  // Add user message
  newState.history = [...newState.history, { role: 'user', content: userMessage, speakerName: 'Candidate' }];
  newState.turnCount += 1;

  if (newState.turnCount >= 10) {
    newState.completed = true;
    const aiResponses = [{ speakerName: 'GTO', content: "Gentlemen, the time is up. We will conclude the group discussion here." }];
    newState.history = [...newState.history, { role: 'system', content: aiResponses[0].content, speakerName: 'GTO' }];
    return { state: newState, aiResponses };
  }

  // Call Gemini
  let aiResponses: Array<{ speakerName: string; content: string }> = [];
  try {
    const ai = new GoogleGenAI({});
    
    const historyText = newState.history.map(h => `${h.speakerName}: ${h.content}`).join("\n");
    const prompt = `You are a Group Discussion simulator for an SSB interview. 
The topic is: "${newState.topic}".
There are 3 AI candidates: Chest No 4 (Aggressive/Dominant), Chest No 7 (Logical/Peacemaker), Chest No 2 (Quiet/Supportive).
The user is "Candidate".

Conversation so far:
${historyText}

The Candidate just spoke. Generate a response from 1 or 2 of the AI candidates. They should respond directly to the Candidate or to each other. Keep responses short and conversational (1-2 sentences).
Output ONLY a JSON object in this format: {"responses": [{"speakerName": "Chest No 4", "content": "I disagree..."}]}
Do not include markdown blocks or any other text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || '{"responses": []}');
    if (parsed.responses && Array.isArray(parsed.responses)) {
      aiResponses = parsed.responses;
    }
  } catch (error) {
    console.error("Gemini API Error in GD:", error);
    // Fallback
    aiResponses = [{ 
      speakerName: 'Chest No 7', 
      content: `That's an interesting perspective on ${newState.topic.split(' ')[0]}. However, we must also look at the practical implications.` 
    }];
  }

  for (const resp of aiResponses) {
    newState.history = [...newState.history, { role: 'ai', content: resp.content, speakerName: resp.speakerName }];
  }

  return {
    state: newState,
    aiResponses
  };
}
