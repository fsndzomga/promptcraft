'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResultPage() {
  const [prompt, setPrompt] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam))
    }
  }, [searchParams])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        alert('Prompt copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{prompt}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={copyToClipboard} className="w-full">
              Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

