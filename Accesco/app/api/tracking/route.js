import { NextResponse } from "next/server";
import {
  ORDER_STATUS,
  RIDER_STATUS,
} from "@/lib/trackingConstants";

import {
  calculateDistance,
  calculateETA,
} from "@/lib/etaEngine";

/**
 * Mock Tracking API
 * Used only for backend testing.
 * No Firestore required.
 */

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      orderId = "ORD1001",
      rider = {
        id: "RIDER001",
        name: "Rahul Kumar",
      },

      customer = {
        lat: 12.9352,
        lng: 77.6245,
      },

      riderLocation = {
        lat: 12.9716,
        lng: 77.5946,
      },

      speed = 25,
      traffic = 1.2,

      progress = 35,

      status = ORDER_STATUS.OUT_FOR_DELIVERY,
    } = body;

    //---------------------------------------
    // Distance
    //---------------------------------------

    const remainingDistance = calculateDistance(
      riderLocation.lat,
      riderLocation.lng,
      customer.lat,
      customer.lng
    );

    //---------------------------------------
    // ETA
    //---------------------------------------

    const eta = calculateETA(
      remainingDistance,
      speed,
      traffic
    );

    //---------------------------------------
    // Heading
    //---------------------------------------

    const heading =
      (
        Math.atan2(
          customer.lng - riderLocation.lng,
          customer.lat - riderLocation.lat
        ) *
        180
      ) /
      Math.PI;

    //---------------------------------------

    return NextResponse.json({
      success: true,

      order: {
        orderId,
        status,
      },

      rider: {
        id: rider.id,
        name: rider.name,
        status: RIDER_STATUS.ON_THE_WAY,
      },

      tracking: {
        latitude: riderLocation.lat,
        longitude: riderLocation.lng,

        heading: Math.round(heading),

        progress,

        currentSpeed: speed,

        remainingDistance:
          Number(remainingDistance.toFixed(2)),

        remainingETA: eta,

        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      {
        status: 500,
      }
    );
  }
}