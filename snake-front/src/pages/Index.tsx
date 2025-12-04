import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SnakeGame } from "@/components/SnakeGame";
import { ScoreTable } from "@/components/ScoreTable";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"game" | "score">("game");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {activeTab === "game" ? <SnakeGame /> : <ScoreTable />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
