import mongoose from 'mongoose';

const AirportSchema = new mongoose.Schema({
  icao: { type: String, required: true, unique: true },
  iata: { type: String, required: true, unique: true },
  shortName: { type: String, required: true },
  fullName: { type: String, required: true },
  municipalityName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  elevation: {
    meter: { type: Number, required: true },
    km: { type: Number, required: true },
    mile: { type: Number, required: true },
    nm: { type: Number, required: true },
    feet: { type: Number, required: true }
  },
  country: {
    code: { type: String, required: true },
    name: { type: String, required: true }
  },
  continent: {
    code: { type: String, required: true },
    name: { type: String, required: true }
  },
  timeZone: { type: String, required: true },
  urls: {
    webSite: { type: String },
    wikipedia: { type: String },
    twitter: { type: String },
    liveAtc: { type: String },
    flightRadar: { type: String },
    googleMaps: { type: String }
  }
});

export default mongoose.models.Airport || mongoose.model('Airport', AirportSchema);
