const Task = require('../models/Task');

// Get all tasks or search by title
// Added search checking here
exports.getTasks = async (req, res) => {
  try {
    console.log("Fetching all tasks...");
    
    // If the user typed something in search, filter by keyword
    let filter = {};
    if (req.query.keyword) {
      console.log("Searching for keyword:", req.query.keyword);
      filter = { title: { $regex: req.query.keyword, $options: 'i' } };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    console.log("Found", tasks.length, "tasks");

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.log("Error getting tasks:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    console.log("Creating new task with data:", req.body);
    
    const task = await Task.create(req.body);
    console.log("Successfully created task:", task._id);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.log("Error creating task:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  try {
    console.log("Updating task ID:", req.params.id);
    console.log("Update requested with data:", req.body);

    let task = await Task.findById(req.params.id);

    if (!task) {
      console.log("Task not found for editing");
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    
    console.log("Task successfully updated!");

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.log("Error updating task:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    console.log("Attempting to delete task ID:", req.params.id);
    
    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log("Task not found for deletion");
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();
    console.log("Task deleted successfully");

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log("Error deleting task:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
