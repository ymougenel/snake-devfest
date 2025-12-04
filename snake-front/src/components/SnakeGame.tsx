import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;
const API_URL = import.meta.env.VITE_API_URL;

type Position = { x: number; y: number };
type Direction = { x: number; y: number };

export const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const directionRef = useRef(direction);

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const submitScore = async (finalScore: number) => {
    if (!playerName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score: finalScore,
          creationDate: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit score");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the API",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetGame = () => {
    if (!playerName.trim()) {
      toast({
        variant: "destructive",
        title: "Player name required",
        description: "Please enter your name before starting",
      });
      return;
    }
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood());
        setScore((prev) => prev + 10);
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [gameOver, isPlaying, food, generateFood]);

  // Submit score when game ends
  useEffect(() => {
    if (gameOver) {
      submitScore(score);
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      const key = e.key;
      const currentDir = directionRef.current;

      if (key === "ArrowUp" && currentDir.y === 0) {
        directionRef.current = { x: 0, y: -1 };
      } else if (key === "ArrowDown" && currentDir.y === 0) {
        directionRef.current = { x: 0, y: 1 };
      } else if (key === "ArrowLeft" && currentDir.x === 0) {
        directionRef.current = { x: -1, y: 0 };
      } else if (key === "ArrowRight" && currentDir.x === 0) {
        directionRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPlaying, moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-48"
              disabled={isPlaying}
              maxLength={20}
            />
            <div className="text-lg font-semibold">
              Score: <span className="text-primary">{score}</span>
            </div>
            <Button onClick={resetGame} variant="default" disabled={isSubmitting}>
              {isPlaying ? "Restart" : "Start Game"}
            </Button>
          </div>
        </div>

        <div
          className="relative bg-game-grid border-2 border-border rounded-lg overflow-hidden"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <div key={i} className="flex">
                {Array.from({ length: GRID_SIZE }).map((_, j) => (
                  <div
                    key={j}
                    className="border-[0.5px] border-muted"
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-game-snake rounded-sm transition-all duration-100"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                boxShadow: index === 0 ? "0 0 10px hsl(var(--game-glow))" : "none",
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute bg-game-food rounded-full animate-pulse"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              boxShadow: "0 0 10px hsl(var(--game-food))",
            }}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-destructive mb-2">Game Over!</h2>
                <p className="text-xl mb-4">Final Score: {score}</p>
                <Button onClick={resetGame} variant="default" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Play Again"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Use arrow keys to control the snake
        </p>
      </Card>
    </div>
  );
};
