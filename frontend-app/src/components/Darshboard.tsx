import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from './api'; // Assuming api is an Axios instance
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: number;
  message: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: new Date(),
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          // Get tasks from the backend API
          const response = await api.get('/tasks/');
          setTasks(response.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };
    fetchTasks();
  }, [navigate]);

  // Simulating real-time notifications
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `New notification at ${new Date().toLocaleTimeString()}`,
      };
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(notificationInterval);
  }, []);

  // Handle adding new tasks to the backend
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      try {
        // Send POST request to create a new task
        const response = await api.post('/tasks/create/', {
          ...newTask,
          due_date: newTask.due_date.toISOString(),
        });
        // Update the task list with the new task
        setTasks(prev => [...prev, response.data]);
        setNewTask({
          title: '',
          description: '',
          due_date: new Date(),
          priority: 'medium',
        });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Handle toggling the completed status of a task
  const handleToggleTask = async (id: number) => {
    try {
      const taskToToggle = tasks.find(task => task.id === id);
      if (taskToToggle) {
        // Send PATCH request to update task completion
        const response = await api.patch(`/tasks/${id}/`, {
          completed: !taskToToggle.completed,
        });
        // Update the task in the list
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? { ...task, completed: response.data.completed } : task
          )
        );
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Handle deleting a task from the backend
  const handleDeleteTask = async (id: number) => {
    try {
      // Send DELETE request to remove the task
      await api.delete(`/tasks/${id}/`);
      // Remove the task from the state
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Task Management Dashboard</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col space-y-4">
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Task title"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Task description"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <DatePicker
                      selected={newTask.due_date}
                      onChange={(date: Date) => setNewTask({...newTask, due_date: date})}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-cyan-500 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                      Add Task
                    </button>
                  </form>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                          />
                          <div className={task.completed ? 'line-through text-gray-500' : ''}>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm">{task.description}</p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(task.due_date).toLocaleDateString()} | 
                              Priority: {task.priority}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <h2 className="text-xl mb-2">Notifications</h2>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2 bg-yellow-100 rounded-md text-sm"
                    >
                      {notification.message}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <Link
                  to="/logout"
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
