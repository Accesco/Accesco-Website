import { NextResponse } from "next/server";
import { fetchRoute } from "@/lib/routeEngine";

/**
 * POST /api/route
 *
 * Body:
 * {
 *   "from": {
 *      "lat":12.9716,
 *      "lng":77.5946
 *   },
 *   "to":{
 *      "lat":12.9352,
 *      "lng":77.6245
 *   }
 * }
 */

export async function POST(request) {
  try {
    const body = await request.json();

    const { from, to } = body;

    // ---------------- Validation ----------------

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          message: "from and to are required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof from.lat !== "number" ||
      typeof from.lng !== "number" ||
      typeof to.lat !== "number" ||
      typeof to.lng !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coordinates",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------- Fetch Route ----------------

    const route = await fetchRoute(from, to);

    return NextResponse.json(
      {
        success: true,

        input: {
          from,
          to,
        },

        route,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Route API Error :", error);

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
 * Health Check
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Route Engine",
    status: "Running",
  });
}