import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { name, phone } = await req.json();

    if (!name || !phone) {
      return new Response(JSON.stringify({ error: "이름과 전화번호를 모두 입력하세요." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Auth 유저 전체 불러오기
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Auth 조회 오류:", error);
      return new Response(JSON.stringify({ error: "유저 조회 실패" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // user_metadata에서 name과 phone이 일치하는 유저 찾기
    const matchedUser = users.users.find(
      (u) =>
        u.user_metadata?.name === name &&
        u.user_metadata?.phone === phone
    );

    if (!matchedUser) {
      return new Response(JSON.stringify({ error: "일치하는 계정 정보를 찾을 수 없습니다." }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 이메일 마스킹
    const email = matchedUser.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "이메일 정보를 찾을 수 없습니다." }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const [local, domain] = email.split("@");
    const masked = local.slice(0, 3) + "*".repeat(local.length - 3) + "@" + domain;

    return new Response(JSON.stringify({ maskedEmail: masked }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "서버 에러 발생" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
