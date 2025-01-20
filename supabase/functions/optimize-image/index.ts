import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Encoder, Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('Optimizing image:', file.name)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Decode image
    const image = await Image.decode(buffer)

    // Resize maintaining aspect ratio
    const MAX_SIZE = 800
    if (image.width > MAX_SIZE || image.height > MAX_SIZE) {
      const ratio = Math.min(MAX_SIZE / image.width, MAX_SIZE / image.height)
      image.resize(
        Math.round(image.width * ratio),
        Math.round(image.height * ratio)
      )
    }

    // Encode to WebP with quality 80
    const optimizedBuffer = await image.encodeWebP(80)

    const optimizedFile = new File(
      [optimizedBuffer],
      file.name.replace(/\.[^/.]+$/, '.webp'),
      { type: 'image/webp' }
    )

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const filePath = `${crypto.randomUUID()}.webp`
    
    const { data, error: uploadError } = await supabase.storage
      .from('stamps')
      .upload(filePath, optimizedFile, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('stamps')
      .getPublicUrl(filePath)

    return new Response(
      JSON.stringify({ 
        success: true,
        filePath,
        publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=31536000'
        }
      }
    )
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
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