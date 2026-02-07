import { motion } from 'framer-motion';
import { ListTodo, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';

interface StatsCardsProps {
  tasks: Task[];
}

const StatsCards = ({ tasks }: StatsCardsProps) => {
  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/30',
    },
    {
      label: 'In Progress',
      value: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      icon: Clock,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'hover:border-accent/30',
    },
    {
      label: 'Completed',
      value: tasks.filter((t) => t.status === 'COMPLETED').length,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'hover:border-success/30',
    },
    {
      label: 'Critical',
      value: tasks.filter((t) => t.priority === 'CRITICAL').length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'hover:border-destructive/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={`rounded-xl border border-border bg-card p-5 transition-all duration-300 ${stat.border} hover:shadow-glow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
