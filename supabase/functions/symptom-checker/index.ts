/// <reference types="https://deno.land/std@0.192.0/types.d.ts" />
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { symptoms } = await req.json();
    if (!symptoms || symptoms.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Invalid symptoms' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const supabase = createClient(
      'https://mhtiewmkkugfbmukftfg.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const openaiRes = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
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
              content:
                'You are a helpful but cautious medical assistant. Always remind the user to consult a professional.',
            },
            {
              role: 'user',
              content: `Symptoms: ${symptoms}`,
            },
          ],
          temperature: 0.5,
        }),
      }
    );

    const payload = await openaiRes.json();
    const ai_response =
      payload.choices?.[0]?.message?.content?.trim() || 'No response.';

    // log to Supabase
    const { error: insertError } = await supabase
      .from('symptom_logs')
      .insert([{ symptoms, ai_response }]);
    if (insertError) console.error(insertError);

    return new Response(JSON.stringify({ result: ai_response }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
