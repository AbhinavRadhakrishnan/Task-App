import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Check, X, AlertCircle, Search } from 'lucide-react';

const API_URL = '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = { title: title.trim(), priority };
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { id: tempId, ...newTask, completed: false, created_at: new Date().toISOString() };
    setTasks([optimisticTask, ...tasks]);
    setTitle('');

    try {
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      setTasks(prev => prev.map(t => t.id === tempId ? response.data : t));
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      setError('Failed to add task.');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));

    try {
      await axios.put(`${API_URL}/tasks/${id}?completed=${!currentStatus}`);
    } catch (err) {
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    const previousTasks = [...tasks];
    // Optimistic UI update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);
      setError('Failed to delete task.');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const getPriorityColor = (level) => {
    switch(level) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' ? true : filter === 'Active' ? !task.completed : task.completed;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Task Board</h1>
          <p className="mt-2 text-lg text-slate-600">Manage your tasks with priority</p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Your Progress</span>
              <span className="text-sm font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border outline-none transition-shadow"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border outline-none bg-white cursor-pointer"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <button
              type="submit"
              disabled={!title.trim()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Active', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none text-sm transition-shadow"
            />
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">No tasks yet. Add one above!</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">No tasks match your filters.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border transition-all ${task.completed ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
              >
                <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-500'}`}
                  >
                    {task.completed && <Check className="h-4 w-4 text-white" />}
                  </button>
                  <div className="flex flex-col truncate">
                    <span className={`text-lg font-medium truncate transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
