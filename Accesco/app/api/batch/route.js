import { NextResponse } from "next/server";
import { createBatches } from "@/lib/batchingEngine";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      orders = [],
      minOrders = 5,
      maxOrders = 6,
      includeForming = true,
    } = body;

    if (!Array.isArray(orders)) {
      return NextResponse.json(
        {
          success: false,
          message: "orders must be an array",
        },
        { status: 400 }
      );
    }

    const result = createBatches(orders, {
      minOrders,
      maxOrders,
      includeForming,
    });

    return NextResponse.json({
      success: true,
      totalOrders: orders.length,
      totalBatches: result.batches?.length || 0,
      batches: result.batches || [],
      forming: result.forming || [],
      orphans: result.orphans || [],
    });
  } catch (error) {
    console.error("Batch API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}