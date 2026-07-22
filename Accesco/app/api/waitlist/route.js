import { NextResponse } from "next/server";
import { checkRateLimit } from "../_lib/otp-store";
import { sendWaitlistWelcomeEmail } from "@/lib/mailService";

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    // IP Rate Limit
    const ipCheck = checkRateLimit(
      `waitlist_ip:${clientIp}`,
      15,
      10 * 60
    );

    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests from this IP. Please try again later.",
        },
        {
          status: 429,
        }
      );
    }

    // Email Rate Limit
    const emailCheck = checkRateLimit(
      `waitlist_email:${email}`,
      1,
      24 * 60 * 60
    );

    if (!emailCheck.allowed) {
      return NextResponse.json(
        {
          error:
            "This email has already been added to the waitlist recently.",
        },
        {
          status: 429,
        }
      );
    }

    const result = await sendWaitlistWelcomeEmail({
      email,
      name,
    });
    console.log("WAITLIST MAIL RESULT:", result);

    if (!result.success) {
      console.error(result.error);

      return NextResponse.json(
        {
          error: result.error || "Failed to send email",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Confirmation email sent",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Waitlist email error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}