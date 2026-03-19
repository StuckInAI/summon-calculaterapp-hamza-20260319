import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { Calculation } from "@/entities/Calculation";

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const calculationRepository = AppDataSource.getRepository(Calculation);
    const calculations = await calculationRepository.find({
      order: { timestamp: "DESC" },
      take: 50,
    });

    return NextResponse.json(calculations);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const calculationRepository = AppDataSource.getRepository(Calculation);
    await calculationRepository.clear();

    return NextResponse.json({ message: "History cleared" });
  } catch (error) {
    console.error("Error clearing history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
