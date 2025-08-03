import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId 필요" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("comment").delete().eq("user_id", userId);
    await supabase.from("favorite_movies").delete().eq("user_id", userId);
    await supabase.from("quotes_like").delete().eq("user_id", userId);
    await supabase.from("review_like").delete().eq("user_id", userId);
    await supabase.from("profile").delete().eq("user_id", userId);
    await supabase.from("review").delete().eq("user_id", userId);
    await supabase.from("quotes").delete().eq("user_id", userId);

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("❌ deleteUser unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || JSON.stringify(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
