const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const officeRoutes = require('./routes/employeeRouter');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/employee_details', officeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on port http://localhost:${PORT}`));