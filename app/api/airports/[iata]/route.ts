import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Airport from "@/models/Airport";

const AERODATA_API_KEY = process.env.AERODATA_API_KEY!;
const AERODATA_BASE_URL = process.env.AERODATA_BASE_URL!;

if (!AERODATA_API_KEY || !AERODATA_BASE_URL) {
  throw new Error('Missing required environment variables');
}

export async function GET(
  request: Request,
  context: { params: Promise<{ iata: string }> }
) {
  const { iata } = await context.params;

  if (!iata || iata.length !== 3) {
    return NextResponse.json({ error: "Invalid IATA code" }, { status: 400 });
  }

  try {
    await dbConnect();
    let airport = await Airport.findOne({ iata: iata.toUpperCase() });

    if (!airport) {
      const response = await fetch(`${AERODATA_BASE_URL}${iata}`, {
        headers: {
          "x-magicapi-key": AERODATA_API_KEY,
          accept: "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`AeroData API error: ${error}`);
        return NextResponse.json(
          { error: "Airport not found" },
          { status: 404 }
        );
      }

      const data = await response.json();
      airport = await Airport.create({
        icao: data.icao,
        iata: data.iata,
        shortName: data.shortName,
        fullName: data.fullName,
        municipalityName: data.municipalityName,
        location: data.location,
        elevation: data.elevation,
        country: data.country,
        continent: data.continent,
        timeZone: data.timeZone,
        urls: data.urls,
      });
    }

    return NextResponse.json(airport);
  } catch (error) {
    console.error('Airport API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
