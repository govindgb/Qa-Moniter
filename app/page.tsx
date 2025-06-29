'use client';

import React, { useState } from 'react';
import CreateTaskForm from '@/components/forms/CreateTaskForm';
import EditTaskForm from '@/components/forms/EditTaskForm';
import TasksTable from '@/components/tables/TasksTable';
import { Task } from '@/types/task';

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="space-y-8">
      {editingTask ? (
        <EditTaskForm task={editingTask} onCancel={handleCancelEdit} />
      ) : (
        <CreateTaskForm />
      )}
      
      <TasksTable onEditTask={handleEditTask} />
    </div>
  );
}