"use client";

import { useState } from "react";
import { evaluateExpression } from "@/lib/calculator";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CalculatorProps {
  onNewCalculation: (expression: string, result: string) => void;
}

const buttonClasses = "h-16 rounded-xl text-xl font-semibold transition-all duration-200 active:scale-95 shadow-lg";
const numberButtonClasses = "bg-gray-800 hover:bg-gray-700";
const operatorButtonClasses = "bg-blue-600 hover:bg-blue-500";
const equalsButtonClasses = "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 col-span-2";
const clearButtonClasses = "bg-red-600 hover:bg-red-500";
const backspaceButtonClasses = "bg-amber-600 hover:bg-amber-500";
const decimalButtonClasses = "bg-gray-800 hover:bg-gray-700";

export default function Calculator({ onNewCalculation }: CalculatorProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleButtonClick = (value: string) => {
    setError("");
    if (value === "=") {
      if (!input.trim()) return;
      try {
        const evalResult = evaluateExpression(input);
        setResult(evalResult);
        saveCalculation(input, evalResult);
      } catch (err: any) {
        setError(err.message || "Invalid expression");
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
      setError("");
    } else if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      // Prevent multiple decimal points in a number
      if (value === ".") {
        const parts = input.split(/[+\-*/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) return;
      }
      setInput((prev) => prev + value);
    }
  };

  const saveCalculation = async (expression: string, result: string) => {
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression, result }),
      });
      if (response.ok) {
        onNewCalculation(expression, result);
      }
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  const buttons = [
    { label: "7", value: "7", className: numberButtonClasses },
    { label: "8", value: "8", className: numberButtonClasses },
    { label: "9", value: "9", className: numberButtonClasses },
    { label: "÷", value: "/", className: operatorButtonClasses },
    { label: "4", value: "4", className: numberButtonClasses },
    { label: "5", value: "5", className: numberButtonClasses },
    { label: "6", value: "6", className: numberButtonClasses },
    { label: "×", value: "*", className: operatorButtonClasses },
    { label: "1", value: "1", className: numberButtonClasses },
    { label: "2", value: "2", className: numberButtonClasses },
    { label: "3", value: "3", className: numberButtonClasses },
    { label: "-", value: "-", className: operatorButtonClasses },
    { label: "0", value: "0", className: numberButtonClasses },
    { label: ".", value: ".", className: decimalButtonClasses },
    { label: "C", value: "C", className: clearButtonClasses },
    { label: "⌫", value: "⌫", className: backspaceButtonClasses },
    { label: "+", value: "+", className: operatorButtonClasses },
    { label: "=", value: "=", className: equalsButtonClasses },
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
      <div className="mb-6">
        <div className="text-right text-gray-400 text-sm mb-1">Expression</div>
        <div className="bg-gray-950 p-4 rounded-xl text-2xl md:text-3xl font-mono h-20 overflow-x-auto overflow-y-hidden flex items-center justify-end">
          {input || "0"}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-right text-gray-400 text-sm mb-1">Result</div>
        <div className="bg-gray-950 p-4 rounded-xl text-3xl md:text-4xl font-bold h-20 overflow-x-auto overflow-y-hidden flex items-center justify-end">
          {error ? (
            <span className="text-red-400">{result}</span>
          ) : (
            <span className="text-green-400">{result || "0"}</span>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-400 text-center text-sm p-2 bg-red-900/30 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleButtonClick(btn.value)}
            className={twMerge(clsx(buttonClasses, btn.className))}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="mt-6 text-gray-400 text-sm text-center">
        <p>Click operators (+, -, ×, ÷) and numbers to build expressions</p>
      </div>
    </div>
  );
}
