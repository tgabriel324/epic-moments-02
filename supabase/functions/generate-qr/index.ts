import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import QRCode from 'npm:qrcode'

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

    // Generate QR code URL that points to the AR view
    const arViewUrl = `${new URL(req.url).origin}/ar/view/${stampId}`
    console.log('Generating QR code for URL:', arViewUrl)

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(arViewUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })

    return new Response(
      JSON.stringify({ qrCode: qrCodeDataUrl }),
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