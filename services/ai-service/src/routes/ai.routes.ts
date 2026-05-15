import { Router } from 'express';
import { NLPService } from '../services/nlp.service';
import { PredictionService } from '../services/prediction.service';
import { validate } from '@nexusflow/shared-utils';
import type { Request, Response, NextFunction } from 'express';

export const aiRouter = Router();
const nlpService = new NLPService();
const predictionService = new PredictionService();

// POST /api/ai/command — Process natural language command
aiRouter.post('/command', validate('aiCommand'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await nlpService.processCommand(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/suggest — Get AI suggestions for a project
aiRouter.post('/suggest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.body;
    const suggestions = await nlpService.generateSuggestions(projectId);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/predict — Predict sprint completion
aiRouter.post('/predict', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sprintId } = req.body;
    const prediction = await predictionService.predictCompletion(sprintId);
    res.json({ success: true, data: prediction });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/summarize — Summarize project/sprint activity
aiRouter.post('/summarize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, timeRange } = req.body;
    const summary = await nlpService.summarizeActivity(projectId, timeRange);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});
