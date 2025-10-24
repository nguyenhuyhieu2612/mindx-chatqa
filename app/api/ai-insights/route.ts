import { NextResponse } from "next/server";
import { contextTracker, logContextBehavior } from "@/lib/ai/context-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ai-insights
 * 
 * Returns insights about AI's context fetching behavior
 */
export async function GET() {
  try {
    const insights = contextTracker.getInsights();
    const recentEvents = contextTracker.getRecentEvents(20);
    
    return NextResponse.json({
      success: true,
      data: {
        insights,
        recentEvents,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-insights/clear
 * 
 * Clear tracking data
 */
export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    if (action === "clear") {
      contextTracker.clear();
      return NextResponse.json({
        success: true,
        message: "Tracking data cleared",
      });
    }
    
    if (action === "log") {
      logContextBehavior();
      return NextResponse.json({
        success: true,
        message: "Logged to console",
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Invalid action. Use 'clear' or 'log'",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in AI insights action:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

