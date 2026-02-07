import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { format } from 'date-fns';

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  NEW: { label: 'New', className: 'bg-primary/15 text-primary border border-primary/30' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-accent/15 text-accent border border-accent/30' },
  COMPLETED: { label: 'Completed', className: 'bg-success/15 text-success border border-success/30' },
  CLOSED: { label: 'Closed', className: 'bg-muted text-muted-foreground border border-border' },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'bg-success/10 text-success' },
  MEDIUM: { label: 'Medium', className: 'bg-info/10 text-info' },
  HIGH: { label: 'High', className: 'bg-accent/10 text-accent' },
  CRITICAL: { label: 'Critical', className: 'bg-destructive/10 text-destructive' },
};

interface TaskCardProps {
  task: Task;
  index: number;
  onClick?: (task: Task) => void;
}

const TaskCard = ({ task, index, onClick }: TaskCardProps) => {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onClick?.(task)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${priority.className}`}>
            {priority.label}
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">#{task.id}</span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
        {task.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{task.assignedToName || 'Unassigned'}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
