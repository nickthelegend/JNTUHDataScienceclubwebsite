import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📧 Email request received:", {
      to: body.to,
      subject: body.subject,
      htmlLength: body.html?.length || 0
    });

    // Hardcoded API key as requested
    const RESEND_API_KEY = "re_XeTDG597_NrzbcJjN9kLSi1hbhVobzgsJ";

    console.log("🔑 Using hardcoded API key");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "JNTUH Data Science Club <noreply@jntuhdatascienceclub.in>",
        to: [body.to],
        subject: body.subject,
        html: body.html,
      }),
    });

    const data = await response.json();

    console.log("📤 Resend API response:", {
      status: response.status,
      success: response.ok,
      data
    });

    if (!response.ok) {
      console.error("❌ Resend API error:", data);
      return NextResponse.json(
        { error: "Failed to send email", details: data },
        { status: response.status }
      );
    }

    console.log("✅ Email sent successfully");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("💥 Exception in send-email API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}