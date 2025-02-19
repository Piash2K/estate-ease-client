import { Moon, Sun } from "lucide-react";
import useTheme from "./useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-secondary-light dark:bg-secondary-dark 
                 text-text-light dark:text-text-dark hover:opacity-80 transition-opacity"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className=" text-yellow-400" />
      ) : (
        <Sun className=" text-white" />
      )}
    </button>
  );
}
