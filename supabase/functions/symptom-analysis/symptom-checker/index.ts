/// <reference types="https://deno.land/std@0.192.0/types.d.ts" />
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { symptoms } = await req.json();
    if (!symptoms || symptoms.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Invalid symptoms' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Initialize Supabase service role client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Call OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful but cautious medical assistant. Always remind the user to consult a professional.' },
          { role: 'user', content: `Symptoms: ${symptoms}` }
        ],
        temperature: 0.5
      })
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      throw new Error(`OpenAI API error: ${err}`);
    }
    const { choices } = await openaiRes.json();
    const ai_response = choices?.[0]?.message?.content?.trim() || 'No response.';

    // Log to Supabase
    const { error: insertError } = await supabase
      .from('symptom_logs')
      .insert([{ symptoms, ai_response }]);
    if (insertError) console.error('Supabase insert error:', insertError.message);

    return new Response(JSON.stringify({ data: ai_response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (err: any) {
    console.error('Function error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
