import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, Brain, Compass, DollarSign, CalendarRange, Import, Check, X, ShieldAlert, Edit2 } from 'lucide-react';
import axios from 'axios';
import { Navigation } from '../components/navigation/Navigation';
import { useToast } from '../components/common/Toast';

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
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budget, setBudget] = useState<number>(1000);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

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

  // Inline forms states
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetVal, setNewBudgetVal] = useState('1000');

  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTime, setTaskTime] = useState('09:00 AM');
  const [taskDate, setTaskDate] = useState('');

  const availableTags = ["adventure", "nature", "culture", "relaxation", "culinary", "nightlife"];

  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    const savedTasks = localStorage.getItem('tasks');

    if (savedBudget) {
      setBudget(Number(savedBudget));
      setNewBudgetVal(savedBudget);
    }
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
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
          showToast(`Task Overdue: "${task.description}" is scheduled for now!`, 'info');
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks, showToast]);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim()) {
      showToast('Please enter an expense description', 'error');
      return;
    }
    const val = parseFloat(expenseAmount);
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid expense amount greater than 0', 'error');
      return;
    }

    const newExpense = { id: Date.now(), description: expenseDesc.trim(), amount: val };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    setTotalExpenses(updated.reduce((sum, exp) => sum + exp.amount, 0));
    
    setExpenseDesc('');
    setExpenseAmount('');
    setIsAddingExpense(false);
    showToast('Expense recorded successfully.', 'success');
  };

  const handleRemoveExpense = (id: number) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    setTotalExpenses(updated.reduce((sum, exp) => sum + exp.amount, 0));
    showToast('Expense removed', 'info');
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDesc.trim()) {
      showToast('Please enter a task description', 'error');
      return;
    }
    if (!taskDate) {
      showToast('Please select a date', 'error');
      return;
    }

    const dateObj = new Date(taskDate);
    const newTask = {
      id: Date.now(),
      description: taskDesc.trim(),
      completed: false,
      time: taskTime,
      month: dateObj.toLocaleString('default', { month: 'long' }),
      year: dateObj.getFullYear(),
    };
    setTasks((prev) => [...prev, newTask]);
    
    setTaskDesc('');
    setTaskDate('');
    setIsAddingTask(false);
    showToast('Task added to your itinerary schedule.', 'success');
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
    showToast('Task removed', 'info');
  };

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBudgetVal);
    if (isNaN(val) || val < 0) {
      showToast('Please enter a valid budget amount', 'error');
      return;
    }
    setBudget(val);
    setIsEditingBudget(false);
    showToast('Budget threshold updated.', 'success');
  };

  const handleAISearch = async () => {
    if (!query.trim() && selectedTags.length === 0) {
      showToast('Please describe your trip search or select tags', 'error');
      return;
    }
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
        } else {
          showToast(`Found ${response.data.results.length} destination matches!`, 'success');
        }
      } else {
        setApiError('Failed to fetch recommendations.');
      }
    } catch (err: any) {
      console.error(err);
      setApiError('Could not connect to the ML backend. Please make sure the backend server is running locally on port 8000.');
      showToast('ML backend offline.', 'error');
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
        showToast('AI Itinerary generated successfully.', 'success');
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

    const totalCost = activeItinerary.estimated_cost_usd;
    handleAddExpense(`Trip to ${activeItinerary.destination}`, totalCost);

    const newTasks = [...tasks];
    let addedCount = 0;
    const baseDate = new Date();
    
    activeItinerary.itinerary.forEach((day: any) => {
      day.schedule.forEach((item: any) => {
        const taskDate = new Date(baseDate);
        taskDate.setDate(baseDate.getDate() + day.day);

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
    showToast(`Successfully added 1 expense ($${totalCost}) and ${addedCount} schedule activities!`, 'success');
    setActiveItinerary(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const budgetUsagePercent = budget > 0 ? Math.min(100, Math.round((totalExpenses / budget) * 100)) : 0;

  return (
    <div className="min-h-screen pt-24 text-slate-800 pb-24 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      <Navigation onBack={onBack} title="AI Itinerary & Planning" />

      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-8 relative z-10 flex-1 flex flex-col justify-center">
        {/* Main Grid for Budget & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto w-full">
          
          {/* Budget Card */}
          <div className="travel-card p-6 rounded-[20px] relative text-left flex flex-col justify-between h-full min-h-[300px] bg-white">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-bold text-[#0F3D91] flex items-center gap-2 tracking-tight">
                  <DollarSign className="w-5 h-5 text-[#00A896]" />
                  Budget Summary
                </h2>
                {!isEditingBudget && (
                  <button
                    onClick={() => setIsEditingBudget(true)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition duration-200"
                    aria-label="Edit budget"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#00A896]" />
                  </button>
                )}
              </div>

              {isEditingBudget ? (
                <form onSubmit={handleUpdateBudget} className="flex gap-2 mb-4">
                  <input
                    type="number"
                    value={newBudgetVal}
                    onChange={(e) => setNewBudgetVal(e.target.value)}
                    className="travel-input p-2 text-xs w-28 font-semibold text-right"
                    min="0"
                    required
                  />
                  <button type="submit" className="px-3 py-1 btn-teal text-xs font-bold rounded-lg">
                    Save
                  </button>
                  <button type="button" onClick={() => setIsEditingBudget(false)} className="px-2 border border-slate-200 rounded-lg text-xs hover:bg-slate-50">
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Total Budget:</span>
                    <span className="text-slate-800 font-mono font-bold">${budget.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500">Total Expenses:</span>
                    <span className="text-red-500 font-mono font-bold">${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-2.5">
                    <span className="text-slate-500">Remaining:</span>
                    <span className={`font-black text-sm font-mono ${budget - totalExpenses >= 0 ? 'text-[#00A896]' : 'text-red-500'}`}>
                      ${(budget - totalExpenses).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Gauge */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Usage Limit</span>
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="14" className="stroke-slate-100" strokeWidth="2.5" fill="transparent" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="14" 
                      className={`transition-all duration-500 ${
                        budgetUsagePercent > 90 ? 'stroke-red-500' :
                        budgetUsagePercent > 70 ? 'stroke-amber-500' :
                        'stroke-[#00A896]'
                      }`}
                      strokeWidth="2.5" 
                      fill="transparent" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (88 * budgetUsagePercent) / 100} 
                    />
                  </svg>
                  <span className="absolute text-[8px] font-mono font-bold text-slate-850">{budgetUsagePercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expense List Card */}
          <div className="travel-card p-6 rounded-[20px] relative text-left flex flex-col justify-between h-full min-h-[300px] bg-white">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-[#0F3D91] flex items-center gap-2 tracking-tight">
                  <Compass className="w-5 h-5 text-[#00A896]" />
                  Expenses
                </h3>
                {!isAddingExpense && (
                  <button
                    onClick={() => setIsAddingExpense(true)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[#00A896] transition"
                    aria-label="Add expense"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isAddingExpense && (
                <form onSubmit={handleAddExpenseSubmit} className="space-y-3 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="text"
                    required
                    placeholder="Expense name (e.g. Flight)"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    className="w-full travel-input p-2 text-xs font-semibold"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      placeholder="Amount ($)"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full travel-input p-2 text-xs font-semibold"
                    />
                    <button type="submit" className="px-3 btn-teal text-xs font-bold rounded-lg">
                      Save
                    </button>
                    <button type="button" onClick={() => setIsAddingExpense(false)} className="px-2.5 border border-slate-200 rounded-lg text-xs hover:bg-slate-100">
                      X
                    </button>
                  </div>
                </form>
              )}

              <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2 mb-2">
                {expenses.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-slate-400 text-xs italic font-semibold">No expenses recorded yet.</p>
                    {!isAddingExpense && (
                      <button
                        type="button"
                        onClick={() => setIsAddingExpense(true)}
                        className="text-[10px] font-bold text-[#00A896] uppercase tracking-widest font-mono hover:underline"
                      >
                        + Create Expense
                      </button>
                    )}
                  </div>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold">
                      <span className="text-slate-650 truncate max-w-[130px]">{expense.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-mono font-bold">${expense.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="p-1 hover:text-red-500 text-slate-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="h-2"></div>
          </div>

          {/* Task Checklist Card */}
          <div className="travel-card p-6 rounded-[20px] relative text-left flex flex-col justify-between h-full min-h-[300px] bg-white">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-[#0F3D91] flex items-center gap-2 tracking-tight">
                  <CalendarRange className="w-5 h-5 text-[#00A896]" />
                  Schedule & Tasks
                </h3>
                {!isAddingTask && (
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[#00A896] transition"
                    aria-label="Add task"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isAddingTask && (
                <form onSubmit={handleAddTaskSubmit} className="space-y-3 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="text"
                    required
                    placeholder="Task details (e.g. Check-in)"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full travel-input p-2 text-xs font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="travel-input p-2 text-xs font-semibold w-full"
                    />
                    <input
                      type="text"
                      required
                      placeholder="9:00 AM"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                      className="travel-input p-2 text-xs font-semibold w-full text-center"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button type="submit" className="px-3 py-1.5 btn-primary text-xs text-white">
                      Save
                    </button>
                    <button type="button" onClick={() => setIsAddingTask(false)} className="px-2.5 border border-slate-200 rounded-lg text-xs hover:bg-slate-100">
                      X
                    </button>
                  </div>
                </form>
              )}

              <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2 mb-2">
                {tasks.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-slate-400 text-xs italic font-semibold">Your schedule is clear.</p>
                    {!isAddingTask && (
                      <button
                        type="button"
                        onClick={() => setIsAddingTask(true)}
                        className="text-[10px] font-bold text-[#00A896] uppercase tracking-widest font-mono hover:underline"
                      >
                        + Add Activity
                      </button>
                    )}
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex justify-between items-center p-2 rounded-lg border text-xs font-semibold transition duration-200 ${
                        task.completed
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="truncate max-w-[150px]">
                        <p className="font-bold truncate leading-tight">{task.description}</p>
                        <p className="text-[9px] text-slate-450 mt-0.5 font-mono font-bold">
                          {task.month} {task.year} - {task.time}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`p-1 rounded ${
                            task.completed ? 'text-slate-400 hover:text-[#00A896]' : 'text-[#00A896] hover:text-[#00a896]/80'
                          }`}
                          aria-label="Toggle completion"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="p-1 text-slate-400 hover:text-red-500"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="h-2"></div>
          </div>
        </div>

        {/* AI Travel Recommendation Section */}
        <div className="travel-card p-6 sm:p-8 rounded-[20px] bg-white border border-slate-200 mb-12 max-w-6xl mx-auto w-full relative text-left shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0F3D91]/5 border border-[#0F3D91]/10 flex items-center justify-center text-[#0F3D91]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F3D91] flex items-center gap-2 tracking-tight">
                AI Travel Planner & Recommender
                <span className="text-[9px] bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold font-mono">
                  Helper Tool
                </span>
              </h2>
              <p className="text-slate-450 text-xs mt-0.5">Content-Based Recommendation Engine & Cosine Similarity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 font-mono">What kind of trip are you looking for?</label>
                <input
                  type="text"
                  placeholder="e.g. Seeking ancient history, serene temples, beautiful autumn scenery, and amazing street food"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full travel-input p-3 text-slate-800 text-xs sm:text-sm font-medium"
                />
              </div>

              {/* Tag Selector */}
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 font-mono">Select Your Interests & Styles</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#00A896] text-white border-[#00A896] shadow-sm'
                            : 'bg-white border-slate-200 text-[#00A896] hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Config & Search Button */}
            <div className="md:col-span-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-550 text-xs font-bold uppercase tracking-wider mb-2 font-mono">Budget Tier</label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-700 text-xs sm:text-sm font-semibold outline-none focus:border-[#00A896] transition"
                  >
                    <option value="any">Any Budget</option>
                    <option value="budget">Budget Friendly</option>
                    <option value="midrange">Midrange</option>
                    <option value="luxury">Luxury Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-555 text-xs font-bold uppercase tracking-wider mb-2 font-mono">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-700 text-xs sm:text-sm font-semibold outline-none focus:border-[#00A896] transition text-right font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleAISearch}
                disabled={searchLoading}
                className="w-full py-3.5 btn-teal text-white rounded-xl font-bold tracking-wider shadow-sm hover:scale-[1.01] transition duration-200 flex justify-center items-center gap-2 text-xs uppercase"
              >
                {searchLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Match Destinations
                  </>
                )}
              </button>
            </div>
          </div>

          {apiError && (
            <div className="bg-red-500/5 border border-red-500/25 text-red-500 rounded-xl p-4 mb-6 flex items-start gap-2 text-xs">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* AI Loader */}
          {searchLoading && (
            <div className="flex flex-col items-center justify-center py-10 border-t border-slate-100">
              <span className="w-8 h-8 border-3 border-[#00A896] border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest font-mono">Running Content-Based Filtering Matrix...</p>
            </div>
          )}

          {/* Empty matched recommendations list state */}
          {recs.length === 0 && !searchLoading && !apiError && (
            <div className="border-t border-slate-100 pt-10 text-center space-y-3">
              <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-xl text-slate-400 mx-auto animate-float">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Matched Destinations Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                Describe your desired trip (e.g. serene temples, street food, autumn leaves) and search to fetch matching destinations.
              </p>
            </div>
          )}

          {/* Recommendations Matches List */}
          {recs.length > 0 && !searchLoading && (
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest font-mono">Top AI Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recs.map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-slate-50 border border-slate-200 hover:border-[#00A896]/20 rounded-[20px] p-5 transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-slate-850 leading-tight">
                          {dest.name}, <span className="text-slate-400 text-[11px] font-normal">{dest.country}</span>
                        </h4>
                        <span className="px-2 py-0.5 bg-[#00A896]/10 text-[#00A896] text-[10px] font-mono font-bold rounded-lg border border-[#00A896]/20 shrink-0 ml-2">
                          {dest.match_score}% Match
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-4 overflow-hidden">
                        <div
                          className="bg-[#00A896] h-full rounded-full"
                          style={{ width: `${dest.match_score}%` }}
                        ></div>
                      </div>

                      <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed font-medium">{dest.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {dest.tags.split(' ').map((t: string) => (
                          <span key={t} className="text-[8px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase font-semibold font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between text-[10px] text-slate-450 font-mono font-bold">
                        <span>Budget: <strong className="text-slate-500 uppercase">{dest.budget_tier}</strong></span>
                        <span>Coord: <strong className="text-slate-500">{dest.latitude.toFixed(1)}, {dest.longitude.toFixed(1)}</strong></span>
                      </div>
                      <button
                        onClick={() => handleGenerateItinerary(dest.name)}
                        disabled={itineraryLoading}
                        className="w-full py-2 bg-[#00A896]/10 hover:bg-[#00A896]/15 text-[#00A896] font-bold rounded-lg border border-[#00A896]/20 text-xs transition duration-200 uppercase tracking-wider"
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
            <div className="flex flex-col items-center justify-center py-12 border-t border-slate-100 mt-6">
              <span className="w-8 h-8 border-3 border-[#00A896] border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-slate-500 text-xs font-semibold font-mono uppercase tracking-wider">Processing coordinates and optimizing schedule...</p>
            </div>
          )}

          {activeItinerary && !itineraryLoading && (
            <div className="border-t border-slate-100 pt-8 mt-8 bg-slate-50 p-6 rounded-[20px] border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    AI Itinerary: {activeItinerary.destination}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-bold mt-1">
                    Geographically grouped activities for {activeItinerary.days} Days • Budget: ${activeItinerary.estimated_cost_usd}
                  </p>
                </div>
                <button
                  onClick={handleImportItinerary}
                  className="px-5 py-2.5 btn-teal text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
                >
                  <Import className="w-4 h-4" />
                  Import to Schedule
                </button>
              </div>

              {/* Day Timeline Connected by subtle route line */}
              <div className="space-y-6">
                {activeItinerary.itinerary.map((day: any) => (
                  <div key={day.day} className="relative pl-6 border-l-2 border-dashed border-slate-200 space-y-4">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FAFAFA] border-2 border-[#00A896] flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00A896]"></div>
                    </div>
                    
                    <h4 className="text-sm font-bold text-[#0F3D91]">
                      Day {day.day} Plan
                    </h4>

                    {/* Schedule block items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {day.schedule.map((item: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full hover:border-[#00A896]/20 transition"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[9px] text-[#00A896] font-mono font-bold bg-[#00A896]/10 px-2 py-0.5 rounded border border-[#00A896]/15">
                                {item.time}
                              </span>
                              <span className="text-[8px] bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase font-semibold font-mono">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mb-3">{item.activity}</p>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-slate-100 pt-2 mt-2 font-mono font-bold">
                            <span>Cost: {item.cost === 0 ? <strong className="text-[#00A896] font-bold">Free</strong> : <strong>${item.cost}</strong>}</span>
                            <span>{item.duration}</span>
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
