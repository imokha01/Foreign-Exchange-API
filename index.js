import express from 'express';
import useRouter from './routes/route.js';

// Initialize Express app
const app = express();
const PORT =  3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.use('/', useRouter)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

