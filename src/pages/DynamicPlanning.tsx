import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bell } from 'lucide-react';

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

  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    const savedTasks = localStorage.getItem('tasks');

    if (savedBudget) setBudget(Number(savedBudget));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
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
    setExpenses((prev) => [...prev, newExpense]);
    setTotalExpenses((prev) => prev + amount);
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

  const handleEditTask = (
    id: number,
    newDescription: string,
    newTime: string,
    newDate: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              description: newDescription,
              time: newTime,
              month: new Date(newDate).toLocaleString('default', { month: 'long' }),
              year: new Date(newDate).getFullYear(),
            }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      {notifications.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center z-50">
          {notifications[notifications.length - 1]}
        </div>
      )}

      <div className="container mx-auto flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-500/10 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-4xl text-green-400">Dynamic Planning</h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="neon-card bg-black/50 p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500 transition duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-400">Budget</h2>
                <button
                  className="p-2 hover:bg-green-500/10 rounded-lg"
                  onClick={() => {
                    const newBudget = Number(prompt('Enter new budget:', budget.toString()));
                    if (!isNaN(newBudget) && newBudget >= 0) setBudget(newBudget);
                  }}
                >
                  <Plus className="w-6 h-6 text-green-400" />
                </button>
              </div>
              <div className="space-y-4">
                <p>Total Budget: ${budget.toFixed(2)}</p>
                <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
                <p>Remaining: ${Math.max(0, budget - totalExpenses).toFixed(2)}</p>
              </div>
            </div>

            {/* Expense Card */}
            <div className="neon-card bg-black/50 p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500 transition duration-300">
              <h3 className="text-xl font-bold text-green-400 mb-4">Expenses</h3>
              <ul>
                {expenses.map((expense) => (
                  <li key={expense.id} className="mb-2">
                    {expense.description}: ${expense.amount.toFixed(2)}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500 transition duration-300"
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
          </div>

          {/* Task Card */}
          <div className="space-y-6">
            <div className="neon-card bg-black/50 p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500 transition duration-300">
              <h3 className="text-xl font-bold text-green-400 mb-4">Tasks</h3>
              <ul>
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`mb-2 p-4 rounded-lg ${
                      task.completed ? 'bg-gray-700' : 'bg-green-700'
                    } text-white`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold">{task.description}</p>
                        <p className="text-sm">
                          {task.month} {task.year} - {task.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`px-2 py-1 rounded ${
                            task.completed ? 'bg-gray-500' : 'bg-blue-500'
                          }`}
                        >
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="px-2 py-1 bg-red-500 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500 transition duration-300"
                onClick={() => {
                  const description = prompt('Enter task description:');
                  const time = prompt('Enter task time (HH:MM AM/PM):');
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
        </div>
      </div>
    </div>
  );
}
