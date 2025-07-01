'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { useTestExecution } from '@/context/TestExecutionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  Users,
  Target,
  Activity,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, getTasks } = useTask();
  const { testExecutions, getTestExecutions } = useTestExecution();
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalExecutions: 0,
    completedExecutions: 0,
    pendingExecutions: 0,
    failedExecutions: 0,
    inProgressExecutions: 0,
    averagePassRate: 0,
  });

  useEffect(() => {
    getTasks();
    getTestExecutions();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || testExecutions.length > 0) {
      calculateStats();
    }
  }, [tasks, testExecutions]);

  const calculateStats = () => {
    const totalTasks = tasks.length;
    const totalExecutions = testExecutions.length;
    
    const statusCounts = testExecutions.reduce((acc, execution) => {
      acc[execution.status] = (acc[execution.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalPassedTests = testExecutions.reduce((sum, execution) => sum + execution.passedTestCases, 0);
    const totalTests = testExecutions.reduce((sum, execution) => sum + execution.totalTestCases, 0);
    const averagePassRate = totalTests > 0 ? (totalPassedTests / totalTests) * 100 : 0;

    setStats({
      totalTasks,
      totalExecutions,
      completedExecutions: statusCounts.completed || 0,
      pendingExecutions: statusCounts.pending || 0,
      failedExecutions: statusCounts.failed || 0,
      inProgressExecutions: statusCounts['in-progress'] || 0,
      averagePassRate,
    });
  };

  const statusData = [
    { name: 'Completed', value: stats.completedExecutions, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgressExecutions, color: '#3B82F6' },
    { name: 'Pending', value: stats.pendingExecutions, color: '#F59E0B' },
    { name: 'Failed', value: stats.failedExecutions, color: '#EF4444' },
  ];

  const recentExecutions = testExecutions
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's an overview of your QA testing activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Created tasks in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Total test runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePassRate.toFixed(1)}%</div>
            <Progress value={stats.averagePassRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Test Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
          {statusData.every((entry) => entry.value === 0) ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
              No test status data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData.filter(entry => entry.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData
                    .filter(entry => entry.value > 0)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>

        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExecutions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent test executions
                </p>
              ) : (
                recentExecutions.map((execution) => (
                  <div key={execution._id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    {getStatusIcon(execution.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Test ID: {execution.testId}
                      </p>
                      <p className="text-sm text-gray-500">
                        By {execution.testerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {execution.passedTestCases}/{execution.totalTestCases} passed
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/create-task"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Create New Task</h3>
                <p className="text-sm text-gray-500">Add a new QA testing task</p>
              </div>
            </a>

            <a
              href="/test-task"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-green-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Execute Test</h3>
                <p className="text-sm text-gray-500">Run tests on existing tasks</p>
              </div>
            </a>

            <a
              href="/task-history"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">View History</h3>
                <p className="text-sm text-gray-500">Check task history and reports</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}