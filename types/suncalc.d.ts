declare module 'suncalc3' {
    export interface ISunPosition {
      azimuth: number;             // radians
      altitude: number;            // radians
      zenith: number;              // radians
      azimuthDegrees: number;      // degrees
      altitudeDegrees: number;     // degrees
      zenithDegrees: number;       // degrees
      declination: number;         // degrees
    }
  
    export interface ISunTimeDef {
      value: Date;
    }
  
    export interface ISunTimeList {
      solarNoon: ISunTimeDef;
      nadir: ISunTimeDef;
      goldenHourDawnStart: ISunTimeDef;
      goldenHourDawnEnd: ISunTimeDef;
      goldenHourDuskStart: ISunTimeDef;
      goldenHourDuskEnd: ISunTimeDef;
      sunriseStart: ISunTimeDef;
      sunriseEnd: ISunTimeDef;
      sunsetStart: ISunTimeDef;
      sunsetEnd: ISunTimeDef;
      blueHourDawnStart: ISunTimeDef;
      blueHourDawnEnd: ISunTimeDef;
      blueHourDuskStart: ISunTimeDef;
      blueHourDuskEnd: ISunTimeDef;
      civilDawn: ISunTimeDef;
      civilDusk: ISunTimeDef;
      nauticalDawn: ISunTimeDef;
      nauticalDusk: ISunTimeDef;
      amateurDawn: ISunTimeDef;
      amateurDusk: ISunTimeDef;
      astronomicalDawn: ISunTimeDef;
      astronomicalDusk: ISunTimeDef;
  
      // Deprecated fields
      dawn?: ISunTimeDef;
      dusk?: ISunTimeDef;
      nightEnd?: ISunTimeDef;
      night?: ISunTimeDef;
      nightStart?: ISunTimeDef;
      goldenHour?: ISunTimeDef;
      sunset?: ISunTimeDef;
      sunrise?: ISunTimeDef;
      goldenHourEnd?: ISunTimeDef;
      goldenHourStart?: ISunTimeDef;
    }
  
    export function getPosition(
      date: Date | number,
      latitude: number,
      longitude: number
    ): ISunPosition;
  
    export function getSunTimes(
      date: Date | number,
      latitude: number,
      longitude: number,
      height?: number,
      addDeprecated?: boolean,
      inUTC?: boolean
    ): ISunTimeList;
  
    const SunCalc: {
      getPosition: typeof getPosition;
      getSunTimes: typeof getSunTimes;
    };
  
    export default SunCalc;
  }
  