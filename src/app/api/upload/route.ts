import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      // Check single file fallback
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (!file || typeof file === 'string') continue

      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Sanitize filename and create unique timestamp
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const ext = path.extname(originalName) || '.jpg'
      const base = path.basename(originalName, ext)
      const uniqueName = `${base}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`

      const filePath = path.join(uploadDir, uniqueName)
      await writeFile(filePath, buffer)

      uploadedUrls.push(`/uploads/${uniqueName}`)
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
