'use client'

import { useState } from 'react'
import Image from 'next/image'

const styles = [
  { name: '动漫', prompt: 'anime style, vibrant colors, detailed artwork' },
  { name: '写实', prompt: 'photorealistic, high detail, natural lighting' },
  { name: '抽象', prompt: 'abstract art, bold colors, geometric shapes' },
  { name: '科幻', prompt: 'sci-fi, futuristic, high-tech, space themed' },
  { name: '水彩', prompt: 'watercolor painting, soft edges, pastel colors' }
]

export default function Home() {
  const [content, setContent] = useState('')
  const [style, setStyle] = useState(styles[0])
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateWallpaper = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, style: style.prompt }),
      })
      
      if (response.ok) {
        const blob = await response.blob()
        setImageUrl(URL.createObjectURL(blob))
      } else {
        console.error('Wallpaper generation failed')
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setIsLoading(false)
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">AI 壁纸生成器</h1>
      <div className="mb-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="描述你想要的壁纸内容"
          className="w-full p-2 border rounded shadow-sm"
        />
      </div>
      <div className="mb-4">
        <select
          value={style.name}
          onChange={(e) => setStyle(styles.find(s => s.name === e.target.value) || styles[0])}
          className="w-full p-2 border rounded shadow-sm"
        >
          {styles.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={generateWallpaper}
        disabled={isLoading || !content}
        className="w-full p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? '生成中...' : '生成壁纸'}
      </button>
      {imageUrl && (
        <div className="mt-6">
          <Image src={imageUrl} alt="生成的壁纸" width={512} height={512} className="rounded shadow-lg" />
        </div>
      )}
    </main>
  )
}