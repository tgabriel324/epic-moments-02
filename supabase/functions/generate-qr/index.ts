import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import QRCode from 'npm:qrcode'
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
    const { stampId } = await req.json()
    
    if (!stampId) {
      throw new Error('Stamp ID is required')
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Buscar a estampa para obter o business_id
    console.log('Buscando informações da estampa:', stampId)
    const { data: stamp, error: stampError } = await supabase
      .from('stamps')
      .select('business_id')
      .eq('id', stampId)
      .single()

    if (stampError || !stamp) {
      console.error('Erro ao buscar estampa:', stampError)
      throw new Error('Stamp not found')
    }

    // Buscar configurações de QR code do negócio
    console.log('Buscando configurações de QR code para business:', stamp.business_id)
    const { data: settings, error: settingsError } = await supabase
      .from('qr_code_settings')
      .select('*')
      .eq('business_id', stamp.business_id)
      .single()

    // Generate QR code URL that points to the AR view
    const arViewUrl = `${new URL(req.url).origin}/ar/view/${stampId}`
    console.log('Generating QR code for URL:', arViewUrl)

    // Configurações padrão do QR code
    const qrOptions = {
      width: 400,
      margin: 2,
      color: {
        dark: settings?.foreground_color || '#000000',
        light: settings?.background_color || '#ffffff'
      }
    }

    // Gerar QR code como data URL
    const qrCodeDataUrl = await QRCode.toDataURL(arViewUrl, qrOptions)

    return new Response(
      JSON.stringify({ 
        qrCode: qrCodeDataUrl,
        settings: settings || null 
      }),
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})