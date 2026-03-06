const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const officeRoutes = require('./routes/employeeRouter');

dotenv.config({ override: true });

connectDB();

const app = express();

// Allow requests from frontend
app.use(cors({
  origin: "https://crud-using-mongoose-frontend.vercel.app"
}));

app.use(express.json());

// Test route (important)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use('/api/employee_details', officeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);