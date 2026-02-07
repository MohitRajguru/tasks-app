import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCards from '@/components/StatsCards';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Task, TaskRequest } from '@/types/task';

const Dashboard = () => {
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
    .slice(0, 6);

  const handleSubmit = (data: TaskRequest) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data });
    } else {
      createTask.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    deleteTask.mutate(id);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your task management</p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </motion.div>

      <StatsCards tasks={tasks} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load tasks. Is your backend running?</p>
          <p className="mt-1 text-xs text-muted-foreground">{(error as Error).message}</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet. Create one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} onClick={handleEditTask} />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
