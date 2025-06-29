'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { toast } from 'sonner';
import { Task } from '@/types/task';

const taskSchema = z.object({
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  description: z.string().min(1, 'Description is required'),
  testCases: z.array(z.string()).min(1, 'At least one test case is required'),
  notes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const tagOptions = [
  'Sprint 1',
  'Sprint 2',
  'Feature A',
  'Feature B',
  'Bug Fix',
  'Performance',
  'Security',
  'UI/UX'
];

interface EditTaskFormProps {
  task: Task;
  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onCancel }) => {
  const [testCases, setTestCases] = useState<string[]>(task.testCases || ['']);
  const [selectedTags, setSelectedTags] = useState<string[]>(task.tags || []);
  const { updateTask, loading } = useTaskContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      tags: task.tags || [],
      description: task.description || '',
      testCases: task.testCases || [''],
      notes: task.notes || ''
    }
  });

  useEffect(() => {
    setTestCases(task.testCases || ['']);
    setSelectedTags(task.tags || []);
    setValue('tags', task.tags || []);
    setValue('description', task.description || '');
    setValue('testCases', task.testCases || ['']);
    setValue('notes', task.notes || '');
  }, [task, setValue]);

  const addTestCase = () => {
    const newTestCases = [...testCases, ''];
    setTestCases(newTestCases);
    setValue('testCases', newTestCases);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      const newTestCases = testCases.filter((_, i) => i !== index);
      setTestCases(newTestCases);
      setValue('testCases', newTestCases);
    }
  };

  const updateTestCase = (index: number, value: string) => {
    const newTestCases = [...testCases];
    newTestCases[index] = value;
    setTestCases(newTestCases);
    setValue('testCases', newTestCases);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setValue('tags', newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      const filteredTestCases = data.testCases.filter(tc => tc.trim() !== '');
      
      await updateTask({
        ...data,
        _id: task._id!,
        testCases: filteredTestCases,
        tags: selectedTags
      });
      
      toast.success('Task updated successfully!');
      onCancel();
    } catch (error) {
      toast.error('Failed to update task. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Edit QA Testing Task
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags
            </Label>
            <Select onValueChange={handleTagSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                {tagOptions.map((tag) => (
                  <SelectItem key={tag} value={tag} disabled={selectedTags.includes(tag)}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.tags && (
              <p className="text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              className="min-h-[100px]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Test Cases */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Test Cases</Label>
            <div className="space-y-3">
              {testCases.map((testCase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Test case ${index + 1}`}
                    value={testCase}
                    onChange={(e) => updateTestCase(index, e.target.value)}
                    className="flex-1"
                  />
                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTestCase}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Test Case
              </Button>
            </div>
            {errors.testCases && (
              <p className="text-sm text-red-600">{errors.testCases.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              className="min-h-[80px]"
              {...register('notes')}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-start gap-4">
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditTaskForm;