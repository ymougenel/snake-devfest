import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  activeTab: "game" | "score";
  onTabChange: (tab: "game" | "score") => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
          My snake game
        </h1>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "game" ? "default" : "ghost"}
            onClick={() => onTabChange("game")}
            className="transition-all"
          >
            Game
          </Button>
          <Button
            variant={activeTab === "score" ? "default" : "ghost"}
            onClick={() => onTabChange("score")}
            className="transition-all"
          >
            Score
          </Button>
        </div>

        <a
          href="https://github.com/ymougenel/project"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-primary transition-colors"
        >
          <Github className="h-6 w-6" />
        </a>
      </div>
    </nav>
  );
};
