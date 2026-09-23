import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null
      if (singleFile) {
        files.push(singleFile)
      } else {
        return NextResponse.json(
          { error: 'Lütfen yüklenecek en az bir dosya seçin' },
          { status: 400 }
        )
      }
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (!file || typeof file === 'string') continue
      if (!file.type.startsWith('image/')) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      let savedUrl: string | null = null

      // Check if Supabase Storage is configured and ready
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (
        supabaseUrl &&
        serviceKey &&
        !serviceKey.includes('placeholder') &&
        !serviceKey.includes('your-')
      ) {
        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(supabaseUrl, serviceKey)
          const ext = path.extname(file.name) || '.jpg'
          const filename = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`

          const { data, error } = await supabase.storage
            .from('catalog')
            .upload(filename, buffer, {
              contentType: file.type,
              upsert: true,
            })

          if (!error && data) {
            const { data: publicData } = supabase.storage
              .from('catalog')
              .getPublicUrl(filename)
            savedUrl = publicData.publicUrl
          }
        } catch (supaErr) {
          console.warn('Supabase storage upload skipped:', supaErr)
        }
      }

      // If not Vercel serverless, attempt local disk storage
      if (!savedUrl && !process.env.VERCEL) {
        try {
          const uploadDir = path.join(process.cwd(), 'public', 'uploads')
          await mkdir(uploadDir, { recursive: true })

          const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const ext = path.extname(originalName) || '.jpg'
          const base = path.basename(originalName, ext)
          const uniqueName = `${base}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`

          const filePath = path.join(uploadDir, uniqueName)
          await writeFile(filePath, buffer)
          savedUrl = `/uploads/${uniqueName}`
        } catch (fsErr: any) {
          console.warn('Filesystem write failed (falling back to data URI):', fsErr.message)
        }
      }

      // Fail-safe for Vercel / serverless read-only filesystem: Base64 Data URI
      if (!savedUrl) {
        const mimeType = file.type || 'image/jpeg'
        savedUrl = `data:${mimeType};base64,${buffer.toString('base64')}`
      }

      uploadedUrls.push(savedUrl)
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'Geçerli görsel dosyası yüklenemedi (PNG, JPG, WEBP desteklenir)' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Dosya yükleme başarısız oldu' },
      { status: 500 }
    )
  }
}
