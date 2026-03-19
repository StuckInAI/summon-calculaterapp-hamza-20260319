"use client";

import { useState, useEffect } from "react";
import Calculator from "@/components/Calculator";
import HistoryPanel from "@/components/HistoryPanel";

type Calculation = {
  id: number;
  expression: string;
  result: string;
  timestamp: string;
};

export default function Home() {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCalculation = (expression: string, result: string) => {
    const newCalculation: Calculation = {
      id: Date.now(), // temporary ID until refetched
      expression,
      result,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newCalculation, ...prev]);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Modern Calculator
        </h1>
        <p className="text-gray-300">A fullstack calculator with persistent history</p>
      </header>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <Calculator onNewCalculation={handleNewCalculation} />
        </div>
        <div className="lg:w-1/2">
          <HistoryPanel history={history} loading={loading} />
        </div>
      </div>
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>Built with Next.js 14, TypeORM, SQLite, and Tailwind CSS</p>
      </footer>
    </main>
  );
}
