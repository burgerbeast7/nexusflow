import OpenAI from 'openai';
import { createLogger, RedisCache, createRedisClient } from '@nexusflow/shared-utils';
import type { AICommand, AIResponse, AISuggestion } from '@nexusflow/shared-types';

const logger = createLogger('nlp-service');
const cache = new RedisCache(createRedisClient(), 600);

const SYSTEM_PROMPT = `You are NexusFlow AI, an intelligent workflow assistant. You help teams manage projects, tasks, and sprints.

When given a natural language command, extract the intent and return a structured JSON response with:
- action: The action to perform (create_task, assign_task, update_status, create_sprint, prioritize, query)
- data: Structured data for the action
- explanation: Brief human-readable explanation
- confidence: 0-1 confidence score

Examples:
"Create a high-priority bug for the auth module" → { action: "create_task", data: { title: "Auth module bug", type: "BUG", priority: "HIGH", labels: ["auth"] }, explanation: "Creating a high-priority bug task for the authentication module", confidence: 0.95 }
"Assign all P0 bugs to Sarah" → { action: "assign_task", data: { filter: { priority: "CRITICAL", type: "BUG" }, assignee: "Sarah" }, explanation: "Assigning all critical bugs to Sarah", confidence: 0.90 }

Always respond with valid JSON only.`;

export class NLPService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'demo-key',
    });
  }

  async processCommand(command: AICommand): Promise<AIResponse> {
    try {
      // Check cache for similar commands
      const cacheKey = `ai:cmd:${Buffer.from(command.input).toString('base64').substring(0, 32)}`;
      const cached = await cache.get<AIResponse>(cacheKey);
      if (cached) return cached;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Context: ${JSON.stringify(command.context || {})}\nCommand: ${command.input}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}') as AIResponse;

      // Cache the result
      await cache.set(cacheKey, result);

      logger.info('AI command processed', { input: command.input, action: result.action, confidence: result.confidence });

      return result;
    } catch (err) {
      logger.error('NLP processing failed', { error: (err as Error).message });
      // Fallback response
      return {
        action: 'unknown',
        data: {},
        explanation: 'I could not process that command. Please try rephrasing.',
        confidence: 0,
      };
    }
  }

  async generateSuggestions(projectId: string): Promise<AISuggestion[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a project management AI. Generate actionable suggestions based on project data. Return JSON array of suggestions.',
          },
          {
            role: 'user',
            content: `Generate 3 workflow improvement suggestions for project ${projectId}. Include task assignments, priority changes, and sprint planning tips.`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
      return parsed.suggestions || [];
    } catch (err) {
      logger.error('Suggestion generation failed', { error: (err as Error).message });
      return [];
    }
  }

  async summarizeActivity(projectId: string, timeRange?: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Summarize project activity concisely. Highlight key achievements, blockers, and recommendations.',
          },
          {
            role: 'user',
            content: `Summarize activity for project ${projectId} over ${timeRange || 'the past week'}.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      return response.choices[0].message.content || 'No activity to summarize.';
    } catch (err) {
      logger.error('Summary generation failed', { error: (err as Error).message });
      return 'Unable to generate summary at this time.';
    }
  }
}
