import { NextResponse } from "next/server";
import { addFeedback } from "@/lib/feedbackservice";

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.score === undefined) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    if (!body.usageLikelihood) {
      return NextResponse.json(
        { error: "Usage likelihood is required" },
        { status: 400 }
      );
    }

    if (!body.earlyAccess) {
      return NextResponse.json(
        { error: "Early access is required" },
        { status: 400 }
      );
    }

    const id = await addFeedback(body);

    return NextResponse.json({
      success: true,
      id,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Unable to save feedback",
      },
      {
        status: 500,
      }
    );
  }
}