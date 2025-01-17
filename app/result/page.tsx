'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { usePromptAndImages } from '@/hooks/usePromptAndImages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Copy, Download } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

function LoadingImages() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-[4/3] w-full" />
          </CardContent>
          <CardFooter className="p-4 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ResultContent() {
  const {
    prompt,
    images,
    selectedImage,
    setSelectedImage,
    generateImages,
    isGenerating,
    hasCopied,
    copyToClipboard
  } = usePromptAndImages()

  const downloadSelectedImage = async () => {
    if (!selectedImage) return
    const response = await fetch(`/api/fetch-image?url=${encodeURIComponent(selectedImage)}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`mx-auto transition-all duration-300 ${isGenerating || images.length > 0 ? 'lg:max-w-7xl' : 'max-w-2xl'}`}>
        <div className={`grid transition-all duration-300 ${
          isGenerating || images.length > 0 ? 'lg:grid-cols-[400px,1fr] lg:gap-8' : ''
        }`}>
          {/* Prompt Section */}
          <Card className="lg:h-[85vh] lg:overflow-hidden flex flex-col mt-2">
            <CardHeader>
              <CardTitle>Your Generated Prompt</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <CardContent>
                <p className="text-lg leading-relaxed">{prompt}</p>
              </CardContent>
            </ScrollArea>
            <CardFooter className="border-t bg-card p-2 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {hasCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
              <Button
                onClick={generateImages}
                className="w-full sm:w-auto"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Images'}
              </Button>
            </CardFooter>
          </Card>

          {/* Images Section */}
          {(isGenerating || images.length > 0) && (
            <div className="p-4 lg:h-screen lg:overflow-auto">
              <div className="space-y-6">
                {isGenerating ? (
                  <LoadingImages />
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {images.map(({ model, url }, index) => (
                      <Card
                        key={index}
                        className={`overflow-hidden transition-all ${
                          selectedImage === url
                            ? 'ring-2 ring-primary ring-offset-2'
                            : ''
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="relative w-full h-64">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`AI generated image ${index + 1}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw,
                                      (max-width: 1200px) 50vw,
                                      800px"
                            />
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 flex-col sm:flex-row gap-2">
                          <p className="text-sm font-medium text-muted-foreground flex-1 text-center sm:text-left">
                            {model}
                          </p>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              onClick={() => setSelectedImage(url)}
                              variant={selectedImage === url ? "default" : "secondary"}
                              className="flex-1 sm:flex-none"
                            >
                              {selectedImage === url ? 'Selected' : 'Select'}
                            </Button>
                            {selectedImage === url && (
                              <Button
                                onClick={downloadSelectedImage}
                                variant="outline"
                                className="flex-1 sm:flex-none"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  )
}
