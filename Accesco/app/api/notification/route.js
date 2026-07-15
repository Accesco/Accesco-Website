import { NextResponse } from "next/server";

import {
  sendPreparing,
  sendPacked,
  sendAssigned,
  sendPickedUp,
  sendOutForDelivery,
  sendArriving,
  sendDelivered,
  sendCancelled,
  sendCartReminder,
} from "@/lib/notificationEngine";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      type,
      orderId,
      customerName,
      riderName,
      eta,
      remainingDistance,
      reason,
      itemCount,
    } = body;

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          message: "type is required",
        },
        {
          status: 400,
        }
      );
    }

    let notification;

    switch (type.toUpperCase()) {
      case "PREPARING":
        notification = sendPreparing({
          orderId,
          customerName,
        });
        break;

      case "PACKED":
        notification = sendPacked({
          orderId,
          customerName,
        });
        break;

      case "ASSIGNED":
        notification = sendAssigned({
          orderId,
          customerName,
          riderName,
        });
        break;

      case "PICKED_UP":
        notification = sendPickedUp({
          orderId,
          customerName,
          riderName,
        });
        break;

      case "OUT_FOR_DELIVERY":
        notification = sendOutForDelivery({
          orderId,
          customerName,
          riderName,
          eta,
          remainingDistance,
        });
        break;

      case "ARRIVING":
        notification = sendArriving({
          orderId,
          customerName,
          riderName,
          eta,
        });
        break;

      case "DELIVERED":
        notification = sendDelivered({
          orderId,
          customerName,
        });
        break;

      case "CANCELLED":
        notification = sendCancelled({
          orderId,
          customerName,
          reason,
        });
        break;

      case "CART_REMINDER":
        notification = sendCartReminder({
          customerName,
          itemCount,
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid notification type",
          },
          {
            status: 400,
          }
        );
    }

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Notification API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}