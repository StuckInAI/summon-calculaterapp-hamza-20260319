import { evaluate } from "mathjs";

export function evaluateExpression(expression: string): string {
  if (!expression.trim()) {
    throw new Error("Expression cannot be empty");
  }

  // Replace human-friendly operators with mathjs compatible ones
  const sanitized = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s+/g, "");

  // Validate expression to prevent security issues
  const validChars = /^[0-9+\-*/.()\s]+$/;
  if (!validChars.test(sanitized)) {
    throw new Error("Invalid characters in expression");
  }

  // Prevent division by zero explicitly
  if (sanitized.includes("/0")) {
    const parts = sanitized.split("/");
    if (parts[1] === "0" || parts[1].startsWith("0.")) {
      throw new Error("Division by zero");
    }
  }

  try {
    const result = evaluate(sanitized);
    if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
      throw new Error("Invalid calculation result");
    }
    // Round to 10 decimal places to avoid floating point weirdness
    const rounded = Math.round(result * 1e10) / 1e10;
    return rounded.toString();
  } catch (error) {
    throw new Error("Invalid mathematical expression");
  }
}
