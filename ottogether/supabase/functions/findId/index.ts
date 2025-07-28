import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  // Validate request method
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Create service role client for admin operations
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { name, phone } = await req.json();

    // Validate input
    if (!name && !phone) {
      return new Response(JSON.stringify({ 
        error: 'Provide either name or phone number' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Search users by name in user_metadata
    const nameQuery = name 
      ? await supabase.auth.admin.listUsers({
          filter: {
            query: `user_metadata->>'name' = '${name}'`
          }
        })
      : null;

    // Search users by phone
    const phoneQuery = phone
      ? await supabase.auth.admin.listUsers({
          filter: {
            query: `user_metadata->>'phone' = '${phone}'`
          }
        })
      : null;
    // Combine results, prioritizing phone match
    const matchedUsers = phoneQuery?.data?.users.length 
      ? phoneQuery.data.users 
      : nameQuery?.data?.users || [];

    // Return matched user emails (safely)
    if (matchedUsers.length > 0) {
      const maskedEmails = matchedUsers.map(user => {
        const email = user.email || 'No email found';
        // Mask email for privacy
        return email.replace(/^(.)(.*)(@.*)$/, 
          (_, first, middle, domain) => 
            `${first}${'*'.repeat(middle.length)}${domain}`
        );
      });

      return new Response(JSON.stringify({ 
        message: 'Potential email(s) found',
        maskedEmails 
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // No users found
    return new Response(JSON.stringify({ 
      error: 'No matching users found' 
    }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Recovery error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});