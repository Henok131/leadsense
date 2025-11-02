// Simple test version for initial deployment verification
// Uses Supabase Edge Function serve() pattern
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const data = await req.json();
    console.log("Received:", data);
    
    return new Response(
      JSON.stringify({ 
        status: "ok", 
        received: data,
        message: "autoScoreLead function is working!",
        timestamp: new Date().toISOString()
      }), 
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

