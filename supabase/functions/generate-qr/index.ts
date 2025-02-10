
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import QRCode from "https://esm.sh/qrcode@1.5.3"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { stampId, preview } = await req.json()
    
    if (!stampId) {
      throw new Error('stampId is required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Primeiro, buscar a estampa para obter o business_id
    const { data: stamp } = await supabase
      .from('stamps')
      .select('*, business_id')
      .eq('id', stampId)
      .single()

    if (!stamp) {
      throw new Error('Stamp not found')
    }

    // Agora buscar configurações do QR code usando o business_id da estampa
    const { data: settings } = await supabase
      .from('qr_code_settings')
      .select('*')
      .eq('business_id', stamp.business_id)
      .maybeSingle()

    // Valores padrão para configurações do QR code
    const defaultSettings = {
      foreground_color: '#000000',
      background_color: '#FFFFFF'
    }

    // Gerar URL para o QR code - agora apontando para a landing page
    const baseUrl = Deno.env.get('PUBLIC_SITE_URL') || 'https://epicmomentos.com'
    const qrUrl = `${baseUrl}/ar/landing/${stampId}`

    // Configurar opções do QR code usando settings ou valores padrão
    const qrOptions = {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: preview ? 300 : 1024,
      color: {
        dark: settings?.foreground_color || defaultSettings.foreground_color,
        light: settings?.background_color || defaultSettings.background_color
      }
    }

    console.log('Gerando QR code para URL:', qrUrl)

    // Gerar QR code como URL de dados
    const qrCode = await QRCode.toDataURL(qrUrl, qrOptions)

    return new Response(
      JSON.stringify({ qrCode }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error generating QR code:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
