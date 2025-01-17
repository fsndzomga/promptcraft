import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface PromptCardProps {
  prompt: string
  onCopy: () => void
  onGenerate: () => void
}

export function PromptCard({ prompt, onCopy, onGenerate }: PromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Generated Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{prompt}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button onClick={onCopy} className="w-full">
          Copy to Clipboard
        </Button>
        <Button onClick={onGenerate} className="w-full bg-blue-500 text-white">
          Generate Images
        </Button>
      </CardFooter>
    </Card>
  )
}
