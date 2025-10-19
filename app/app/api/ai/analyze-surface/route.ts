
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { bounds, center, zoom } = await request.json();

    if (!bounds || !center) {
      return NextResponse.json(
        { error: 'Map data is required' },
        { status: 400 }
      );
    }

    // Calculate approximate area in square feet
    const latDiff = bounds.north - bounds.south;
    const lngDiff = bounds.east - bounds.west;
    
    // Rough calculation (this is simplified, real calculation would use Haversine formula)
    const approxArea = Math.abs(latDiff * lngDiff * 363000000); // Convert to sq ft approximately

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are analyzing an asphalt surface area for estimation purposes.

Area Details:
- Approximate Size: ${Math.round(approxArea).toLocaleString()} square feet
- Location: ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}
- Zoom Level: ${zoom}

Based on typical asphalt surfaces, provide:
1. Most likely surface type (parking lot, driveway, road, etc.)
2. Estimated condition (Excellent, Good, Fair, Poor)
3. Recommended services (sealcoating, crack repair, line striping, etc.)
4. Cost estimate range per service

Provide response in JSON format with these fields:
{
  "surfaceType": "string",
  "area": number,
  "condition": "string",
  "confidence": number (0-100),
  "recommendations": ["array of services"],
  "estimatedCost": { "min": number, "max": number }
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Clean up the response to extract JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const analysis = JSON.parse(text);
      analysis.area = Math.round(approxArea);
      
      return NextResponse.json(analysis);
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      return NextResponse.json({
        surfaceType: 'Asphalt Parking Lot',
        area: Math.round(approxArea),
        condition: 'Fair',
        confidence: 75,
        recommendations: [
          'Sealcoating (recommended every 2-3 years)',
          'Crack repair for visible cracks',
          'Line striping refresh',
        ],
        estimatedCost: {
          min: Math.round(approxArea * 0.15),
          max: Math.round(approxArea * 0.35),
        },
      });
    }
  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze surface' },
      { status: 500 }
    );
  }
}
