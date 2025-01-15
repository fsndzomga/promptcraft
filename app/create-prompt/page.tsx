'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const steps = [
  {
    name: 'Subject',
    description: 'What do you want to generate?',
    options: ['Person', 'Animal', 'Character', 'Location', 'Object']
  },
  {
    name: 'Medium',
    description: 'What type of artwork?',
    options: ['Photo', 'Painting', 'Illustration', 'Sculpture', 'Doodle', 'Tapestry']
  },
  {
    name: 'Environment',
    description: 'Where is the subject located?',
    options: ['Indoors', 'Outdoors', 'On the moon', 'Underwater', 'In the city']
  },
  {
    name: 'Lighting',
    description: 'How is the scene lit?',
    options: ['Soft', 'Ambient', 'Overcast', 'Neon', 'Studio lights']
  },
  {
    name: 'Color',
    description: 'What is the color scheme?',
    options: ['Vibrant', 'Muted', 'Bright', 'Monochromatic', 'Colorful', 'Black and white', 'Pastel']
  },
  {
    name: 'Mood',
    description: 'What is the overall mood?',
    options: ['Sedate', 'Calm', 'Raucous', 'Energetic']
  },
  {
    name: 'Composition',
    description: 'How is the image composed?',
    options: ['Portrait', 'Headshot', 'Closeup', 'Birds-eye view']
  },
]

export default function CreatePrompt() {
  const [currentStep, setCurrentStep] = useState(0)
  const [promptData, setPromptData] = useState<Record<string, string>>({})
  const [finalPrompt, setFinalPrompt] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelection = (value: string) => {
    setPromptData({ ...promptData, [steps[currentStep].name.toLowerCase()]: value })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGeneratePrompt = async () => {
    setIsLoading(true)
    const promptDetails = Object.entries(promptData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptDetails }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate prompt')
      }

      const data = await response.json()
      setGeneratedPrompt(data.prompt)
    } catch (error) {
      console.error('Error generating prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    const promptToUse = finalPrompt || generatedPrompt
    window.location.href = `/result?prompt=${encodeURIComponent(promptToUse)}`
  }

  if (currentStep === steps.length-1) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Final Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Now write your prompt using these details:</p>
              <ul className="list-disc pl-5 mb-4">
                {Object.entries(promptData).map(([key, value]) => (
                  <li key={key}>{`${key}: ${value}`}</li>
                ))}
              </ul>
              <Button onClick={handleGeneratePrompt} disabled={isLoading} className="w-full mb-4">
                {isLoading ? 'Generating...' : 'Generate Example Prompt'}
              </Button>
              {generatedPrompt && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Generated Example:</p>
                  <p className="text-sm bg-gray-100 p-2 rounded">{generatedPrompt}</p>
                </div>
              )}
              <Textarea
                placeholder="Write your final prompt here if you want to add some details. You can copy the generated one and edit it."
                value={finalPrompt}
                onChange={(e) => setFinalPrompt(e.target.value)}
                className="w-full h-32"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full">
                Finish
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{steps[currentStep].description}</p>
            <RadioGroup onValueChange={handleSelection} value={promptData[steps[currentStep].name.toLowerCase()]}>
              {steps[currentStep].options.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!promptData[steps[currentStep].name.toLowerCase()]}>
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
