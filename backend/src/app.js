import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Athletica API is running'
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

export default app;
