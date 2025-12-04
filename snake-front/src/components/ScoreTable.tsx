import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

type Score = {
  playerName: string;
  creationDate: string;
  score: number;
};

export const ScoreTable = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();
        setScores(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to connect to the API",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-card/80 backdrop-blur-sm border-border overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">High Scores</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary hover:bg-secondary">
                  <TableHead className="font-bold text-foreground">Rank</TableHead>
                  <TableHead className="font-bold text-foreground">Player Name</TableHead>
                  <TableHead className="font-bold text-foreground">Date</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading scores...
                    </TableCell>
                  </TableRow>
                ) : scores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No scores available
                    </TableCell>
                  </TableRow>
                ) : (
                  scores.map((entry, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <span
                          className={
                            index === 0
                              ? "text-primary font-bold text-lg"
                              : index === 1
                              ? "text-accent font-bold"
                              : index === 2
                              ? "text-accent/70 font-bold"
                              : ""
                          }
                        >
                          #{index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{entry.playerName}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.creationDate}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {entry.score}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};
