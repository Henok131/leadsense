// Simple test version for initial deployment verification
// Once this works, we'll use the full implementation

export async function handler(req: Request): Promise<Response> {
  try {
    const data = await req.json();
    console.log("Received:", data);
    
    return new Response(
      JSON.stringify({ 
        status: "ok", 
        received: data,
        message: "autoScoreLead function is working!"
      }), 
      {
        headers: { "Content-Type": "application/json" },
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
}

