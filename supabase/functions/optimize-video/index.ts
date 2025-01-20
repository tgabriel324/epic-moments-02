import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.12.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('Optimizing video:', file.name)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg()
    await ffmpeg.load()

    // Write input file to memory
    await ffmpeg.writeFile('input.mp4', buffer)

    // Run FFmpeg command to optimize video
    // -c:v libx264: Use H.264 codec
    // -crf 28: Constant Rate Factor (18-28 is a good range, lower = better quality)
    // -preset medium: Encoding speed preset
    // -c:a aac: Use AAC audio codec
    // -b:a 128k: Audio bitrate
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c:v', 'libx264',
      '-crf', '28',
      '-preset', 'medium',
      '-c:a', 'aac',
      '-b:a', '128k',
      'output.mp4'
    ])

    // Read the output file
    const optimizedData = await ffmpeg.readFile('output.mp4')
    const optimizedBuffer = new Uint8Array(optimizedData)

    // Create optimized file
    const optimizedFile = new File(
      [optimizedBuffer],
      file.name,
      { type: 'video/mp4' }
    )

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const filePath = `${crypto.randomUUID()}.mp4`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, optimizedFile, {
        contentType: 'video/mp4',
        cacheControl: '31536000',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
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
    console.error('Error processing video:', error)
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