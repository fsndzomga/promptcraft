import { OpenAI } from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
})

export async function POST(request: Request) {
  const { promptDetails } = await request.json()

  try {
    const response = await openai.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-405B-Instruct',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that generates detailed prompts for text-to-image models based on given details.'
        },
        {
          role: 'user',
          content: `Generate a detailed prompt for a text-to-image model based on these details: ${promptDetails}`
        }
      ]
    })

    const generatedPrompt = response.choices[0].message.content || 'Failed to generate prompt.'

    return new Response(JSON.stringify({ prompt: generatedPrompt }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error generating prompt:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
