/// <reference types="https://deno.land/std@0.192.0/types.d.ts" />

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log("🔐 OPENAI_API_KEY:", Deno.env.get("OPENAI_API_KEY")); // For debugging secrets (optional)

serve(async (req) => {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || symptoms.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Invalid symptoms' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ Hardcoded Supabase URL
    const supabase = createClient(
      'https://mhtiewmkkugfbmukftfg.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 🧠 OpenAI Request
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful but cautious medical assistant. Always remind the user to consult a professional.',
          },
          {
            role: 'user',
            content: `Symptoms: ${symptoms}`,
          },
        ],
        temperature: 0.5,
      }),
    });

    const result = await openaiRes.json();
    console.log('🧠 OpenAI response:', result);

    const ai_response = result.choices?.[0]?.message?.content || 'No response.';

    const { error: insertError } = await supabase.from('symptom_logs').insert([
      { symptoms, ai_response },
    ]);

    if (insertError) {
      console.error('❌ Supabase insert error:', insertError);
    }

    return new Response(JSON.stringify({ result: ai_response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Unexpected error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
