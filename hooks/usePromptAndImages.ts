import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Image {
  model: string
  url: string
}

export function usePromptAndImages() {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam))
    }
  }, [searchParams])

  const generateImages = async () => {
    try {
      setIsGenerating(true)
      setSelectedImage(null)

      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptDetails: prompt })
      })

      if (!response.ok) {
        throw new Error('Failed to generate images')
      }

      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error generating images:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  return {
    prompt,
    images,
    selectedImage,
    setSelectedImage,
    generateImages,
    isGenerating,
    hasCopied,
    copyToClipboard
  }
}
