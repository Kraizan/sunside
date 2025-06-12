import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Airport from '@/models/Airport';

const AERODATA_API_KEY = process.env.NEXT_PUBLIC_AERODATA_API_KEY!;
const AERODATA_BASE_URL = process.env.NEXT_PUBLIC_AERODATA_BASE_URL!;

export async function GET(
  request: Request,
  { params }: { params: { iata: string } }
) {
  const { iata } = params;
  
  await dbConnect();
  
  let airport = await Airport.findOne({ iata });
  
  if (!airport) {
    const response = await fetch(`${AERODATA_BASE_URL}${iata}`, {
      headers: {
        'x-magicapi-key': AERODATA_API_KEY,
        'accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Airport not found' },
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
      urls: data.urls
    });
  }
  
  return NextResponse.json(airport);
}
