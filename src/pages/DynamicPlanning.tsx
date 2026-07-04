import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bell, Sparkles, Brain, Compass, DollarSign, CalendarRange, Import, Check, X, ShieldAlert } from 'lucide-react';
import axios from 'axios';

interface Expense {
  id: number;
  description: string;
  amount: number;
}

interface Task {
  id: number;
  description: string;
  completed: boolean;
  time: string;
  month: string;
  year: number;
}

export function DynamicPlanning({ onBack }: { onBack: () => void }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budget, setBudget] = useState<number>(1000);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [notifications, setNotifications] = useState<string[]>([]);

  // AI Recommendation State
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [budgetTier, setBudgetTier] = useState('any');
  const [duration, setDuration] = useState(3);
  const [recs, setRecs] = useState<any[]>([]);
  const [activeItinerary, setActiveItinerary] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const availableTags = ["adventure", "nature", "culture", "relaxation", "culinary", "nightlife"];

  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    const savedTasks = localStorage.getItem('tasks');

    if (savedBudget) setBudget(Number(savedBudget));
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      // recalculate total expenses
      const total = parsedExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
      setTotalExpenses(total);
    }
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [budget, expenses, tasks]);

  const convertTo24HourFormat = (time: string): string => {
    const [hourMinute, period] = time.split(' ');
    let [hour, minute] = hourMinute.split(':').map(Number);

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentTimeFormatted = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      tasks.forEach((task) => {
        const taskTime24hr = convertTo24HourFormat(task.time);
        if (
          !task.completed &&
          taskTime24hr === currentTimeFormatted &&
          task.year === currentTime.getFullYear() &&
          task.month === currentTime.toLocaleString('default', { month: 'long' })
        ) {
          setNotifications((prev) => [
            ...prev,
            `Task "${task.description}" is due now!`,
          ]);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddExpense = (description: string, amount: number) => {
    const newExpense = { id: Date.now(), description, amount };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    setTotalExpenses(updated.reduce((sum, exp) => sum + exp.amount, 0));
  };

  const handleRemoveExpense = (id: number) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    setTotalExpenses(updated.reduce((sum, exp) => sum + exp.amount, 0));
  };

  const handleAddTask = (description: string, time: string, date: string) => {
    const newTask = {
      id: Date.now(),
      description,
      completed: false,
      time,
      month: new Date(date).toLocaleString('default', { month: 'long' }),
      year: new Date(date).getFullYear(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemoveTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAISearch = async () => {
    setSearchLoading(true);
    setApiError('');
    setRecs([]);
    setActiveItinerary(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/recommend', {
        query: query,
        tags: selectedTags,
        budget_tier: budgetTier,
        top_n: 3
      });
      if (response.data.success) {
        setRecs(response.data.results);
        if (response.data.results.length === 0) {
          setApiError('No destinations matched your criteria. Try widening your tags or description.');
        }
      } else {
        setApiError('Failed to fetch recommendations.');
      }
    } catch (err: any) {
      console.error(err);
      setApiError('Could not connect to the ML backend. Please make sure the backend server is running locally on port 8000.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGenerateItinerary = async (destinationName: string) => {
    setItineraryLoading(true);
    setApiError('');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/itinerary`, {
        params: {
          destination: destinationName,
          days: duration
        }
      });
      if (response.data.success) {
        setActiveItinerary(response.data.itinerary);
      } else {
        setApiError('Failed to generate itinerary.');
      }
    } catch (err: any) {
      console.error(err);
      setApiError('Could not connect to the ML backend.');
    } finally {
      setItineraryLoading(false);
    }
  };

  const handleImportItinerary = () => {
    if (!activeItinerary) return;

    // 1. Add estimated cost as an expense
    const totalCost = activeItinerary.estimated_cost_usd;
    handleAddExpense(`Trip to ${activeItinerary.destination}`, totalCost);

    // 2. Import schedule items as tasks
    const newTasks = [...tasks];
    let addedCount = 0;
    
    // Set task dates starting tomorrow
    const baseDate = new Date();
    
    activeItinerary.itinerary.forEach((day: any) => {
      day.schedule.forEach((item: any) => {
        const taskDate = new Date(baseDate);
        taskDate.setDate(baseDate.getDate() + day.day); // Day 1 is tomorrow, Day 2 day after, etc.
        const dateStr = taskDate.toISOString().split('T')[0];

        const newTaskItem = {
          id: Date.now() + addedCount,
          description: `[Day ${day.day}] ${item.activity} (${item.type})`,
          completed: false,
          time: item.time,
          month: taskDate.toLocaleString('default', { month: 'long' }),
          year: taskDate.getFullYear()
        };
        newTasks.push(newTaskItem);
        addedCount++;
      });
    });

    setTasks(newTasks);
    
    // Clear active itinerary view & show success notification
    setNotifications((prev) => [
      ...prev,
      `Imported: Added 1 expense ($${totalCost}) and ${addedCount} activities to your plan!`,
    ]);
    setActiveItinerary(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-16 text-slate-100 font-sans pb-24">
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 bg-sky-500 text-white px-6 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] z-50 flex items-center gap-2 transition duration-300">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>{notifications[notifications.length - 1]}</span>
          <button onClick={() => setNotifications([])} className="ml-4 hover:scale-110">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="container mx-auto flex items-center gap-4 mb-8 px-4">
        <button onClick={onBack} className="p-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-xl transition duration-300 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-sky-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Dynamic Planner
          </h1>
          <p className="text-slate-400 text-sm">Organize your expenses, tasks, and get AI itinerary recommendations</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main Grid for Budget & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Budget Card */}
          <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-sky-400" />
                Budget Summary
              </h2>
              <button
                className="p-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition duration-300"
                onClick={() => {
                  const newBudget = Number(prompt('Enter new budget:', budget.toString()));
                  if (!isNaN(newBudget) && newBudget >= 0) setBudget(newBudget);
                }}
              >
                <Plus className="w-5 h-5 text-sky-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Budget:</span>
                <span className="font-semibold text-white">${budget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Expenses:</span>
                <span className="font-semibold text-red-400">${totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Remaining:</span>
                <span className={`font-bold text-lg ${budget - totalExpenses >= 0 ? 'text-sky-400' : 'text-red-500'}`}>
                  ${(budget - totalExpenses).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Expense List Card */}
          <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300">
            <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
              <Compass className="w-6 h-6" />
              Expenses
            </h3>
            <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2 mb-4">
              {expenses.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No expenses added yet.</p>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-sm">
                    <span className="text-slate-300 truncate max-w-[150px]">{expense.description}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">${expense.amount.toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveExpense(expense.id)}
                        className="p-1 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg font-bold border border-sky-500/30 transition duration-300"
              onClick={() => {
                const description = prompt('Enter expense description:');
                const amount = Number(prompt('Enter expense amount:'));
                if (description && !isNaN(amount) && amount > 0) {
                  handleAddExpense(description, amount);
                }
              }}
            >
              Add Expense
            </button>
          </div>

          {/* Task Card */}
          <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300">
            <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
              <CalendarRange className="w-6 h-6" />
              Schedule & Tasks
            </h3>
            <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2 mb-4">
              {tasks.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No tasks or activities scheduled.</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex justify-between items-center p-2 rounded-lg border text-xs transition duration-300 ${
                      task.completed
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-500 line-through'
                        : 'bg-sky-950/20 border-sky-500/20 text-white'
                    }`}
                  >
                    <div className="truncate max-w-[170px]">
                      <p className="font-semibold truncate">{task.description}</p>
                      <p className="text-[10px] text-slate-400">
                        {task.month} {task.year} - {task.time}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-1 rounded ${
                          task.completed ? 'text-zinc-600 hover:text-sky-400' : 'text-sky-400 hover:text-sky-300'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTask(task.id)}
                        className="p-1 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg font-bold border border-sky-500/30 transition duration-300"
              onClick={() => {
                const description = prompt('Enter task description:');
                const time = prompt('Enter task time (e.g. 09:00 AM):');
                const date = prompt('Enter task date (YYYY-MM-DD):');
                if (description && time && date) {
                  handleAddTask(description, time, date);
                }
              }}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* AI Travel Recommendation Section */}
        <div className="neon-card bg-[#0f172a]/60 border border-slate-800 p-8 rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.5)] mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-sky-400 animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                AI Travel Planner & Recommender
                <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  ML-Powered
                </span>
              </h2>
              <p className="text-slate-400 text-sm">Powered by scikit-learn Content-Based Filtering & Cosine Similarity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            {/* Left Query input column */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">What kind of trip are you looking for?</label>
                <input
                  type="text"
                  placeholder="e.g. Seeking ancient history, serene temples, beautiful autumn scenery, and amazing street food"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white transition focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* Tag Selector */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Select Your Interests & Styles</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                          isSelected
                            ? 'bg-sky-500 text-white border-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.4)] scale-105'
                            : 'bg-slate-900/50 border-slate-800 text-sky-400 hover:border-slate-750 hover:bg-sky-500/5'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right configuration column */}
            <div className="md:col-span-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Budget Tier</label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full bg-[#070b13] border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none transition"
                  >
                    <option value="any">Any Budget</option>
                    <option value="budget">Budget Friendly</option>
                    <option value="midrange">Midrange</option>
                    <option value="luxury">Luxury Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#070b13] border border-slate-800 rounded-xl p-3 text-white focus:border-sky-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                onClick={handleAISearch}
                disabled={searchLoading}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.2)] hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] transition duration-300 hover:scale-[1.02] flex justify-center items-center gap-2"
              >
                {searchLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    MATCH DESTINATIONS
                  </>
                )}
              </button>
            </div>
          </div>

          {/* API Error Box */}
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 flex items-start gap-2 text-sm shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Recommendations Results list */}
          {recs.length > 0 && (
            <div className="border-t border-slate-800 pt-6 mt-6">
              <h3 className="text-xl font-bold text-sky-400 mb-4">Top AI Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recs.map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-[#0b0f19]/80 border border-slate-800 hover:border-sky-500/20 rounded-2xl p-5 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-white leading-tight">
                          {dest.name}, <span className="text-slate-400 text-sm font-normal">{dest.country}</span>
                        </h4>
                        <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-lg tracking-wide shadow-sm border border-sky-500/30">
                          {dest.match_score}% Match
                        </span>
                      </div>
                      
                      {/* Match Score Indicator Bar */}
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full mb-4 overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-indigo-400 h-full rounded-full"
                          style={{ width: `${dest.match_score}%` }}
                        ></div>
                      </div>

                      <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">{dest.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {dest.tags.split(' ').map((t: string) => (
                          <span key={t} className="text-[9px] bg-zinc-850 border border-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded uppercase font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Budget: <strong className="text-zinc-300 capitalize">{dest.budget_tier}</strong></span>
                        <span>Location: <strong className="text-zinc-300">{dest.latitude.toFixed(2)}, {dest.longitude.toFixed(2)}</strong></span>
                      </div>
                      <button
                        onClick={() => handleGenerateItinerary(dest.name)}
                        disabled={itineraryLoading}
                        className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold rounded-lg border border-sky-500/20 hover:border-sky-500/40 text-xs transition duration-200"
                      >
                        Generate Itinerary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Generated Itinerary Timeline */}
          {itineraryLoading && (
            <div className="flex flex-col items-center justify-center py-12 border-t border-slate-800 mt-6">
              <span className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-slate-400 text-sm">Processing activity coordinates and tags via ML Optimizer...</p>
            </div>
          )}

          {activeItinerary && (
            <div className="border-t border-slate-800 pt-8 mt-8 bg-slate-900/10 p-6 rounded-2xl border border-slate-800 shadow-inner">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-sky-400">
                    AI Itinerary: {activeItinerary.destination}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Geographically grouped activities for {activeItinerary.days} Days • Estimated Budget: ${activeItinerary.estimated_cost_usd}
                  </p>
                </div>
                <button
                  onClick={handleImportItinerary}
                  className="px-5 py-2.5 bg-sky-500 text-white hover:bg-sky-400 font-bold rounded-xl text-sm transition duration-200 hover:scale-[1.02] flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                >
                  <Import className="w-4 h-4" />
                  Import to Tasks & Budget
                </button>
              </div>

              {/* Day Timeline */}
              <div className="space-y-6">
                {activeItinerary.itinerary.map((day: any) => (
                  <div key={day.day} className="relative pl-6 border-l-2 border-sky-500/20 space-y-4">
                    {/* Day circle marker */}
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-sky-500 flex items-center justify-center shadow-[0_0_8px_rgba(14,165,233,0.5)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    </div>
                    
                    <h4 className="text-md font-bold text-white flex items-center gap-2">
                      Day {day.day} Plan
                    </h4>

                    {/* Schedule block items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {day.schedule.map((item: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="bg-[#0b0f19]/80 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-sky-500/20 transition"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-sky-400 font-mono font-bold bg-sky-500/10 px-1.5 py-0.5 rounded">
                              {item.time}
                            </span>
                            <span className="text-[9px] bg-zinc-850 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-semibold">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white leading-tight mb-3">{item.activity}</p>
                          <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-900/50 pt-2">
                            <span>Cost: {item.cost === 0 ? <strong className="text-sky-400 font-bold uppercase">Free</strong> : <strong className="text-slate-300 font-semibold">${item.cost}</strong>}</span>
                            <span>Duration: {item.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
