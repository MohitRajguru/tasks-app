import { LogOut, Bell, Moon, Sun, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <Zap className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold text-foreground">
          Task<span className="text-primary">Flow</span>
        </span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <div className="ml-2 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none text-foreground">{user?.fullName || 'User'}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">@{user?.username}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={logout} className="ml-1 text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
