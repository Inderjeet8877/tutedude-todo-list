import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async (searchKeyword = '') => {
    try {
      console.log("Fetching tasks from API...");
      setLoading(true);
      const res = await getTasks(searchKeyword);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tasks initially
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", keyword);
    fetchTasks(keyword);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDesc.trim()) {
      console.log("Empty task prevented");
      return;
    }

    try {
      console.log("Sending save request for new task...");
      const res = await createTask({
        title: newTaskTitle,
        description: newTaskDesc,
      });
      if (res.success) {
        setTasks([res.data, ...tasks]);
        setNewTaskTitle('');
        setNewTaskDesc('');
        console.log("Task created successfully!");
      }
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      console.log(`Toggling task ${task._id} from ${task.status} to ${newStatus}`);
      const res = await updateTask(task._id, { status: newStatus });
      if (res.success) {
        setTasks(
          tasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      console.log("Deleting task:", id);
      const res = await deleteTask(id);
      if (res.success) {
        setTasks(tasks.filter((t) => t._id !== id));
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-blue-600">My To-Do List</h1>
          <p className="text-gray-500 text-lg">A simple MERN application</p>
        </header>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white shadow-md rounded border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add a New Task</h2>
          <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Task Title"
              className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description details..."
              className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search tasks..."
              className="flex-1 bg-white border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded font-medium transition-colors border cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Pending & Completed Tasks</h2>
          
          {loading && (
            <div className="text-center text-gray-500 py-4">
              Loading tasks...
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="text-center text-gray-500 py-10 bg-white rounded border border-dashed">
              No tasks found. Start by adding one above!
            </div>
          )}

          {tasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded shadow-sm border p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all ${
                task.status === 'completed' ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <button
                onClick={() => handleToggleStatus(task)}
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  task.status === 'completed' 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-400 hover:border-blue-500'
                }`}
              >
                {task.status === 'completed' && <span className="text-white text-xs">✓</span>}
              </button>
              
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium mb-1 ${
                    task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {task.description}
                </p>
              </div>

              <button
                onClick={() => handleDeleteTask(task._id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors text-sm font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
