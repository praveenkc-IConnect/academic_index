import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbService } from './db-service';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- API Routes ---
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Users
  app.get('/api/users', (req, res) => {
    try {
      res.json(dbService.getUsers());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users', (req, res) => {
    try {
      const newUser = dbService.createUser(req.body);
      res.json(newUser);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Academic Years
  app.get('/api/academic-years', (req, res) => {
    try {
      res.json(dbService.getAcademicYears());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Responsibility References
  app.get('/api/references', (req, res) => {
    try {
      res.json(dbService.getReferences());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/references', (req, res) => {
    try {
      const ref = dbService.updateReference(req.body);
      res.json(ref);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/references/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = dbService.deleteReference(id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Workload weight factor
  app.get('/api/weight-factor', (req, res) => {
    try {
      res.json({ weight_factor: dbService.getWeightFactor() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/weight-factor', (req, res) => {
    try {
      const { factor } = req.body;
      if (typeof factor !== 'number' || isNaN(factor)) {
        return res.status(400).json({ error: 'Factor must be a valid number' });
      }
      dbService.updateWeightFactor(factor);
      res.json({ success: true, weight_factor: factor });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Full Appraisal details fetch
  app.get('/api/evaluation', (req, res) => {
    try {
      const { userId, ayId } = req.query;
      if (!userId || !ayId) {
        return res.status(400).json({ error: 'Missing userId or ayId parameter' });
      }
      const details = dbService.getEvaluationDetailsByUserIdAndAy(
        String(userId), 
        parseInt(String(ayId))
      );
      if (!details) {
        return res.status(404).json({ error: 'User or Academic Year not found' });
      }
      res.json(details);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Record Submits & Updates
  app.post('/api/evaluation/academic', (req, res) => {
    try {
      const updated = dbService.updateAcademicMetrics(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/evaluation/research', (req, res) => {
    try {
      const updated = dbService.updateResearchMetrics(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/evaluation/responsibilities', (req, res) => {
    try {
      const { evalId, refIds } = req.body;
      if (typeof evalId !== 'number' || !Array.isArray(refIds)) {
        return res.status(400).json({ error: 'Missing evalId or refIds array' });
      }
      const updated = dbService.updateFacultyResponsibilities(evalId, refIds);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/evaluation/industry-societal', (req, res) => {
    try {
      const updated = dbService.updateIndustrySocietalMetrics(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/evaluation/submit', (req, res) => {
    try {
      const { evalId } = req.body;
      if (!evalId) {
        return res.status(400).json({ error: 'Missing evalId' });
      }
      const success = dbService.submitEvaluation(Number(evalId));
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Approvals & Signoffs
  app.post('/api/evaluation/signoff', (req, res) => {
    try {
      const { evalId, role, comments, action } = req.body;
      if (!evalId || !role || typeof comments !== 'string' || !action) {
        return res.status(400).json({ error: 'Missing signoff details' });
      }
      const success = dbService.signOffEvaluation(Number(evalId), role, comments, action);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DB actions
  app.post('/api/reset', (req, res) => {
    try {
      dbService.resetToDefaults();
      res.json({ success: true, message: 'Database reset to default template state successful.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Vite & Production Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faculty Performance Evaluation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
