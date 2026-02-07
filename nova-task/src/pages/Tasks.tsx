import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import TaskForm from '@/components/TaskForm';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Task, TaskRequest, TaskStatus, TaskPriority } from '@/types/task';

const Tasks = () => {
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
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
        </div>
      </motion.div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load tasks. Is your backend running?</p>
          <p className="mt-1 text-xs text-muted-foreground">{(error as Error).message}</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16"
        >
          <p className="text-muted-foreground">No tasks found</p>
          <Button
            variant="outline"
            onClick={() => {
              setEditingTask(null);
              setFormOpen(true);
            }}
            className="mt-4 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create a task
          </Button>
        </motion.div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-3'
          }
        >
          {filteredTasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} onClick={handleEditTask} />
          ))}
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

export default Tasks;
