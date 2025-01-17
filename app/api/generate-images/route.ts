import { OpenAI } from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
})

interface CustomImageGenerateParams extends OpenAI.ImageGenerateParams {
  extra_body?: {
    response_extension: string;
    width: number;
    height: number;
    num_inference_steps: number;
    seed: number;
  };
}

export async function POST(request: Request) {
  const { promptDetails } = await request.json()

  const listOfModels = [
    { model: "black-forest-labs/flux-schnell", steps: 16 },
    { model: "black-forest-labs/flux-dev", steps: 16 },
    { model: "stability-ai/sdxl", steps: 64 }
  ]

  try {
    const imageRequests = listOfModels.map(({ model, steps }) =>
      openai.images.generate({
        model,
        prompt: promptDetails,
        response_format: "url",
        extra_body: {
          response_extension: "webp",
          width: 512,
          height: 512,
          num_inference_steps: steps,
          seed: -1,
        },
      } as CustomImageGenerateParams)
    )

    const responses = await Promise.all(imageRequests)

    const results = responses.map((response, index) => {
      const imageUrl = response.data?.[0]?.url || ''
      return { model: listOfModels[index].model, url: imageUrl }
    })

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error generating images:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
