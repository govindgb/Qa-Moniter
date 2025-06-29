export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  tags?: string[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  due_date?: string;
  tags?: string[];
}

export interface UpdateTaskRequest extends CreateTaskRequest {
  id: string;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: CreateTaskRequest) => Promise<void>;
  updateTask: (task: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | null;
  refreshTasks: () => Promise<void>;
}