const express = require('express');
const router = express.Router();
const OfficeTask = require('../models/empolyeeController');

// Create a task
router.post('/', async (req, res) => {
    const task = new OfficeTask(req.body);
    try {
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await OfficeTask.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await OfficeTask.findByIdAndUpdate
        (req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        await OfficeTask.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;