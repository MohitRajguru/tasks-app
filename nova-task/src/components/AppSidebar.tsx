import { useState } from 'react';
import { LayoutDashboard, ListTodo, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Tasks', path: '/tasks', icon: ListTodo },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative hidden flex-col border-r border-border bg-card transition-all duration-300 md:flex ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-foreground">
            Task<span className="text-primary">Flow</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground ${
              collapsed ? 'justify-center' : ''
            }`}
            activeClassName="bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
