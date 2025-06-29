'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Task, TaskContextType, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/tasks');
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/tasks', taskData);
      
      if (response.data.success) {
        await refreshTasks();
      } else {
        setError(response.data.error || 'Failed to create task');
        throw new Error(response.data.error || 'Failed to create task');
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to create task'
        : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskData: UpdateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskData.id}`, taskData);
      
      if (response.data.success) {
        await refreshTasks();
      } else {
        setError(response.data.error || 'Failed to update task');
        throw new Error(response.data.error || 'Failed to update task');
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to update task'
        : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`/api/tasks/${id}`);
      
      if (response.data.success) {
        await refreshTasks();
      } else {
        setError(response.data.error || 'Failed to delete task');
        throw new Error(response.data.error || 'Failed to delete task');
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to delete task'
        : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = (id: string): Task | null => {
    return tasks.find(task => task.id === id) || null;
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    refreshTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};