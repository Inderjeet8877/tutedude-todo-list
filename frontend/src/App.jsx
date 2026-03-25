import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import { Plus, Search, Trash2, CheckCircle, Circle, Lightbulb, Quote, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MOTIVATIONS = [
    "Discipline is the bridge between goals and accomplishment.",
    "Conquer the nebula. One mission at a time.",
    "To achieve what others won't, you have to do what others don't.",
    "Your future is created by what you do today, not tomorrow.",
    "Don't stop when you're tired. Stop when you're done."
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MOTIVATIONS.length);
    }, 20000);
    return () => clearInterval(slideTimer);
  }, []);

  const fetchTasks = async (searchKeyword = '') => {
    try {
      setLoading(true);
      const res = await getTasks(searchKeyword);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks(keyword);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDesc.trim()) return;

    try {
      const res = await createTask({
        title: newTaskTitle,
        description: newTaskDesc,
      });
      if (res.success) {
        setTasks([res.data, ...tasks]);
        setNewTaskTitle('');
        setNewTaskDesc('');
      }
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
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
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-obsidian-primary/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-obsidian-secondary/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <header className="mb-14 text-center relative z-10 pt-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-3"
        >
          <span className="obsidian-gradient-text drop-shadow-[0_0_15px_rgba(164,166,255,0.3)]">My Tasks</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-obsidian-textMuted text-lg tracking-wide"
        >
          Capture the digital nebula.
        </motion.p>
      </header>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-obsidian-error/10 ghost-border text-obsidian-error p-4 rounded-xl mb-6 text-center font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="obsidian-glass shadow-2xl rounded-3xl p-6 mb-8 relative z-10 border-t border-l border-white/5"
      >
        <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="What's the next mission?"
            className="flex-1 bg-obsidian-surface/60 ghost-border rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-obsidian-primary/50 transition-all text-obsidian-text placeholder-obsidian-textMuted focus:bg-obsidian-surface"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Details..."
            className="flex-[1.5] bg-obsidian-surface/60 ghost-border rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-obsidian-primary/50 transition-all text-obsidian-text placeholder-obsidian-textMuted focus:bg-obsidian-surface"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="obsidian-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(164,166,255,0.3)] hover:shadow-[0_0_30px_rgba(164,166,255,0.5)]"
          >
            <Plus className="w-5 h-5" />
            <span className="uppercase text-sm tracking-widest">Add</span>
          </motion.button>
        </form>
      </motion.div>

      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mb-8 z-10"
      >
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-obsidian-textMuted" />
        </div>
        <input
          type="text"
          placeholder="Search the void..."
          className="w-full bg-[#000000]/40 ghost-border backdrop-blur-md rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-1 focus:ring-obsidian-secondary/50 transition-all text-obsidian-text placeholder-obsidian-textMuted"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </motion.div>

      {/* Task List */}
      <div className="space-y-6 relative z-10">
        <AnimatePresence>
          {loading && tasks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-obsidian-textMuted py-10 font-medium tracking-wide animate-pulse"
            >
              Scanning the database...
            </motion.div>
          )}

          {!loading && tasks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-obsidian-textMuted py-16 obsidian-glass rounded-3xl ghost-border border-dashed font-medium"
            >
              The nebula is clear. No active tasks.
            </motion.div>
          )}

          {tasks.map((task, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              key={task._id}
              className={`obsidian-glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-5 group transition-all duration-500 hover:scale-[1.02] border-t border-l border-white/5 ${
                task.status === 'completed' ? 'opacity-40 grayscale-[80%]' : ''
              }`}
            >
              <button
                onClick={() => handleToggleStatus(task)}
                className="text-obsidian-textMuted hover:text-obsidian-primary transition-colors flex-shrink-0 focus:outline-none"
              >
                {task.status === 'completed' ? (
                  <CheckCircle className="w-8 h-8 text-obsidian-tertiary drop-shadow-[0_0_8px_rgba(0,209,255,0.7)]" />
                ) : (
                  <Circle className="w-8 h-8" />
                )}
              </button>
              
              <div className="flex-1">
                <h3
                  className={`text-xl font-semibold transition-all mb-1 ${
                    task.status === 'completed' ? 'line-through text-obsidian-textMuted' : 'text-obsidian-text'
                  }`}
                >
                  {task.title}
                </h3>
                <p className={`text-base ${task.status === 'completed' ? 'text-obsidian-textMuted/50' : 'text-obsidian-textMuted'}`}>
                  {task.description}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-3 text-obsidian-textMuted hover:text-obsidian-error hover:bg-obsidian-error/10 rounded-xl transition-all focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Motivation Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 mb-8 relative z-10"
      >
        <div className="obsidian-glass rounded-3xl p-8 border-t border-l border-white/5 relative overflow-hidden group">
          <Quote className="absolute top-4 left-4 w-12 h-12 text-obsidian-primary/10" />
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold obsidian-gradient-text mb-6">Daily Fuel</h2>
            <div className="h-24 flex items-center justify-center px-4 md:px-12 w-full relative">
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + MOTIVATIONS.length) % MOTIVATIONS.length)}
                className="absolute left-0 p-2 text-obsidian-textMuted hover:text-obsidian-primary transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-xl font-medium text-obsidian-text italic"
                >
                  "{MOTIVATIONS[currentSlide]}"
                </motion.p>
              </AnimatePresence>

              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % MOTIVATIONS.length)}
                className="absolute right-0 p-2 text-obsidian-textMuted hover:text-obsidian-primary transition-colors focus:outline-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-2 mt-6">
              {MOTIVATIONS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 obsidian-gradient' : 'w-2 bg-obsidian-surfaceVariant'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructional Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-12 relative z-10"
      >
        <div className="bg-[#000000]/40 backdrop-blur-md rounded-3xl p-8 ghost-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-obsidian-secondary/5 blur-[50px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-obsidian-primary" />
            <h2 className="text-xl font-bold text-obsidian-text">How to manage your missions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-obsidian-surface/50 rounded-2xl p-5 border border-white/5 transition-all outline outline-1 outline-transparent hover:outline-obsidian-primary/30">
              <div className="w-10 h-10 rounded-xl bg-obsidian-primary/10 flex items-center justify-center mb-4">
                <Plus className="w-5 h-5 text-obsidian-primary" />
              </div>
              <h3 className="font-semibold text-obsidian-text mb-2">1. Add Missions</h3>
              <p className="text-sm text-obsidian-textMuted leading-relaxed">Type your goal and details in the top input bars, then hit the additive Add button to plot it into the database.</p>
            </div>

            <div className="bg-obsidian-surface/50 rounded-2xl p-5 border border-white/5 transition-all outline outline-1 outline-transparent hover:outline-obsidian-secondary/30">
              <div className="w-10 h-10 rounded-xl bg-obsidian-secondary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-obsidian-secondary" />
              </div>
              <h3 className="font-semibold text-obsidian-text mb-2">2. Complete</h3>
              <p className="text-sm text-obsidian-textMuted leading-relaxed">Click the empty cycle circle to mark a task as completed. It will glow cyan and cross itself out, fading from focus.</p>
            </div>

            <div className="bg-obsidian-surface/50 rounded-2xl p-5 border border-white/5 transition-all outline outline-1 outline-transparent hover:outline-obsidian-error/30">
              <div className="w-10 h-10 rounded-xl bg-obsidian-error/10 flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5 text-obsidian-error" />
              </div>
              <h3 className="font-semibold text-obsidian-text mb-2">3. Clear the Void</h3>
              <p className="text-sm text-obsidian-textMuted leading-relaxed">Hover over any mission with your cursor to reveal the red trash icon on the right, allowing you to permanently delete it.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
