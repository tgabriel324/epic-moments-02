import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Buscar configuração ativa da CDN
    const { data: cdnSettings, error: cdnError } = await supabaseClient
      .from('cdn_settings')
      .select('cdn_url')
      .eq('is_active', true)
      .single()

    if (cdnError) {
      throw new Error('Erro ao buscar configurações da CDN')
    }

    const { url } = await req.json()
    
    if (!url) {
      throw new Error('URL não fornecida')
    }

    // Substituir URL do storage pela URL da CDN
    const cdnUrl = url.replace(
      'https://blkuxfxwmcqziczwgsds.supabase.co/storage/v1/object/public',
      cdnSettings.cdn_url
    )

    console.log('URL original:', url)
    console.log('URL da CDN:', cdnUrl)

    const response = {
      url,
      cdnUrl
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erro:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})