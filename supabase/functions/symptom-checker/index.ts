import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || symptoms.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Invalid symptoms' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

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
    const ai_response = result.choices?.[0]?.message?.content || 'No response.';

    await supabase.from('symptom_logs').insert([{ symptoms, ai_response }]);

    return new Response(JSON.stringify({ result: ai_response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unexpected error occurred.' }), { status: 500 });
  }
});
