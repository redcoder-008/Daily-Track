import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const amount = formData.get('amount') as string
    const billDate = formData.get('billDate') as string
    const tags = formData.get('tags') as string

    if (!file) {
      throw new Error('No file provided')
    }

    console.log('Uploading file:', file.name, 'for user:', user.id)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bills')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    console.log('File uploaded successfully:', uploadData.path)

    // Save bill record to database
    const billData = {
      user_id: user.id,
      title: title || file.name,
      file_path: uploadData.path,
      file_type: file.type,
      amount: amount ? parseFloat(amount) : null,
      bill_date: billDate || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : null,
    }

    const { data: billRecord, error: billError } = await supabase
      .from('bills')
      .insert(billData)
      .select()
      .single()

    if (billError) {
      console.error('Bill save error:', billError)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('bills').remove([fileName])
      throw billError
    }

    console.log('Bill record created:', billRecord.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        bill: billRecord,
        message: 'Bill uploaded successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error uploading bill:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to upload bill' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})