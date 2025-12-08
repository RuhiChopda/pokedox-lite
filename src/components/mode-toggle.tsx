import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Apply theme on load + whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full transition-all duration-300 hover:scale-110",
        "bg-secondary text-secondary-foreground shadow-sm"
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all animate-in fade-in" />
      ) : (
        <Moon className="h-5 w-5 rotate-0 scale-100 transition-all animate-in fade-in" />
      )}
    </Button>
  );
}
