import express from 'express';
import { generateMeetingInsights } from '../services/aiService';

const router = express.Router();

router.post('/insights', async (req, res) => {
  const { transcript } = req.body;
  
  if (!transcript) {
    res.status(400).json({ message: 'Transcript is required' });
    return;
  }

  try {
    const insights = await generateMeetingInsights(transcript);
    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
