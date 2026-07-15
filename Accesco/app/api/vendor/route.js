import { NextResponse } from "next/server";
import { getNearestVendor } from "@/lib/vendorEngine";

export async function POST(req) {
  try {
    const body = await req.json();

    const { customer, vendors } = body;

    if (!customer || !Array.isArray(vendors)) {
      return NextResponse.json(
        {
          success: false,
          message: "customer and vendors are required",
        },
        { status: 400 }
      );
    }

    const result = getNearestVendor(customer, vendors);

    return NextResponse.json({
      success: true,
      input: {
        customer,
        totalVendors: vendors.length,
      },
      nearestVendor: result.vendor,
      distance: result.distance,
      estimatedTravelTime: result.travelTime,
    });
  } catch (error) {
    console.error("Vendor API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}