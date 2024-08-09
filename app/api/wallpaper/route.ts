import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'



export async function POST(req: NextRequest) {
  try {
    const { content, style } = await req.json()
    const prompt = `${content}, ${style}`

    const payload = {
      prompt: prompt,
      output_format: "jpeg"
    }

    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      formData,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
          ...formData.getHeaders()
        },
      }
    )

    if (response.status === 200) {
      return new NextResponse(response.data, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })
    } else {
      return new NextResponse(JSON.stringify({ error: 'Image generation failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}