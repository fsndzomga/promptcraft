import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Extract the image URL from the query string: /api/fetch-image?url=<IMAGE_URL>
    const { searchParams } = new URL(req.url)
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
      return new NextResponse(
        JSON.stringify({ error: "Missing 'url' query parameter" }),
        { status: 400 }
      )
    }

    // Fetch the remote image
    const imageResponse = await fetch(imageUrl)

    // If the remote fetch fails or returns a 4xx/5xx status
    if (!imageResponse.ok) {
      return new NextResponse(
        JSON.stringify({
          error: `Failed to fetch image. Status: ${imageResponse.status}`,
        }),
        { status: imageResponse.status }
      )
    }

    // Convert the response to ArrayBuffer (or you could also use a readable stream)
    const imageBlob = await imageResponse.arrayBuffer()

    // Derive content type from the original response, fallback to octet-stream
    const contentType = imageResponse.headers.get("content-type") || "application/octet-stream"

    // Return the image with CORS headers
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        // Optional: Add more headers if needed
      },
      // You can override status if you'd like, e.g. 200
      status: 200,
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    )
  }
}
