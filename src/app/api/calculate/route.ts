import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { Calculation } from "@/entities/Calculation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || !result) {
      return NextResponse.json(
        { error: "Expression and result are required" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const calculation = new Calculation();
    calculation.expression = expression;
    calculation.result = result;
    calculation.timestamp = new Date();

    const calculationRepository = AppDataSource.getRepository(Calculation);
    await calculationRepository.save(calculation);

    return NextResponse.json(
      { message: "Calculation saved", calculation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving calculation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
