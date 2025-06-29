'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TasksTableProps {
  onEditTask: (task: Task) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ onEditTask }) => {
  const { tasks, loading, deleteTask } = useTaskContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteTask(id);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getTaskSummary = (description: string, testCases: string[]) => {
    if (description.length > 50) {
      return description.substring(0, 50) + '...';
    }
    return description;
  };

  if (loading && tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          Created Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks created yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Task ID</TableHead>
                <TableHead>Task Summary</TableHead>
                <TableHead>Associated Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">
                    {String(index + 123).padStart(3, '0')}
                  </TableCell>
                  <TableCell>
                    {getTaskSummary(task.description, task.testCases)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTask(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            disabled={deletingId === task._id}
                          >
                            {deletingId === task._id ? (
                              <Loader2 size={16} className="mr-1 animate-spin" />
                            ) : (
                              <Trash2 size={16} className="mr-1" />
                            )}
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(task._id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksTable;