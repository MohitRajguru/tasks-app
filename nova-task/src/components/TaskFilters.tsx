import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskStatus, TaskPriority } from '@/types/task';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskStatus | 'ALL';
  onStatusChange: (value: TaskStatus | 'ALL') => void;
  priorityFilter: TaskPriority | 'ALL';
  onPriorityChange: (value: TaskPriority | 'ALL') => void;
}

const TaskFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-card pl-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as TaskStatus | 'ALL')}>
        <SelectTrigger className="w-full bg-card sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CLOSED">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priorityFilter} onValueChange={(v) => onPriorityChange(v as TaskPriority | 'ALL')}>
        <SelectTrigger className="w-full bg-card sm:w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Priority</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="CRITICAL">Critical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskFilters;
