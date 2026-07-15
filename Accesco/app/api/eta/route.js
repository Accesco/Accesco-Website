import { NextResponse } from "next/server";
import { calculateETA } from "@/lib/etaEngine";

/**
 * POST /api/eta
 *
 * Body:
 * {
 *   "distance": 12,
 *   "speed": 30,
 *   "traffic": 1.2
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "input": {
 *      "distance":12,
 *      "speed":30,
 *      "traffic":1.2
 *   },
 *   "eta":29
 * }
 */

export async function POST(request) {
  try {
    const body = await request.json();

    let {
      distance,
      speed = 25,
      traffic = 1,
    } = body;

    distance = Number(distance);
    speed = Number(speed);
    traffic = Number(traffic);

    // ---------------- Validation ----------------

    if (!Number.isFinite(distance) || distance < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid distance",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(speed) || speed <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid speed",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(traffic) || traffic <= 0) {
      traffic = 1;
    }

    // ---------------- ETA ----------------

    const eta = calculateETA(
      distance,
      speed,
      traffic
    );

    return NextResponse.json(
      {
        success: true,

        input: {
          distance,
          speed,
          traffic,
        },

        eta,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("ETA API Error :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Optional GET endpoint
 * Useful for checking whether API is alive
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    service: "ETA Engine",
    status: "Running",
  });
}