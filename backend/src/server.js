import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Athletica API is running'
  });
});

app.listen(PORT, () => {
  console.log(`Athletica backend server running on port ${PORT}`);
});
