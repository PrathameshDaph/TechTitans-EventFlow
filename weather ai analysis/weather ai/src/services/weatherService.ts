import { WeatherCondition, WeatherForecastHour, RiskLevel } from '../types';
import { DEMO_WEATHER_BASELINE } from '../data/demoData';

// Coordinates for Stadium Locations (Default: Ahmedabad Narendra Modi Stadium)
export const STADIUM_LOCATIONS = [
  { id: 'ahmedabad', name: 'Narendra Modi Stadium, Ahmedabad', lat: 23.0917, lon: 72.5975 },
  { id: 'melbourne', name: 'Melbourne Cricket Ground, Melbourne', lat: -37.8200, lon: 144.9834 },
  { id: 'london', name: 'Lord\'s Cricket Ground, London', lat: 51.5298, lon: -0.1722 },
  { id: 'mumbai', name: 'Wankhede Stadium, Mumbai', lat: 18.9389, lon: 72.8258 },
  { id: 'barbados', name: 'Kensington Oval, Barbados', lat: 13.1044, lon: -59.6231 },
];

export async function fetchLiveWeather(
  locationId: string = 'ahmedabad',
  customApiKey?: string
): Promise<{ current: WeatherCondition; forecast: WeatherForecastHour[] }> {
  const loc = STADIUM_LOCATIONS.find((l) => l.id === locationId) || STADIUM_LOCATIONS[0];

  try {
    // Open-Meteo open weather API (requires no secret API keys, highly reliable for real-time global weather)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,surface_pressure,apparent_temperature&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,visibility&forecast_days=1&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API returned status ${response.status}`);
    }

    const data = await response.json();
    const currentData = data.current;
    const hourlyData = data.hourly;

    const currentPrecip = currentData.precipitation || currentData.rain || 0;
    const currentRainProb = hourlyData.precipitation_probability ? hourlyData.precipitation_probability[0] || 35 : 35;
    const currentWind = Math.round(currentData.wind_speed_10m || 15);
    const currentTemp = Math.round(currentData.temperature_2m || 28);
    const currentHumid = Math.round(currentData.relative_humidity_2m || 65);
    const currentPressure = Math.round(currentData.surface_pressure || 1012);

    let conditionText = 'Clear & Mild';
    if (currentPrecip > 25) conditionText = 'Heavy Torrential Downpour';
    else if (currentPrecip > 8) conditionText = 'Moderate Steady Rain';
    else if (currentPrecip > 0.5) conditionText = 'Light Scatter Showers';
    else if (currentRainProb > 50) conditionText = 'Overcast / High Rain Risk';
    else conditionText = 'Partly Cloudy';

    const current: WeatherCondition = {
      temperature: currentTemp,
      rainfall: Math.max(0.5, currentPrecip),
      rainProbability: currentRainProb,
      windSpeed: currentWind,
      humidity: currentHumid,
      visibility: 8.5,
      stormProbability: Math.min(100, Math.round(currentRainProb * 0.7)),
      uvIndex: 4,
      pressure: currentPressure,
      dewPoint: Math.round(currentTemp - (100 - currentHumid) / 5),
      conditionText,
      source: 'LIVE_API',
      locationName: loc.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Build hourly forecast timeline: NOW, +30 MIN, +1 HR, +2 HR, +3 HR
    const timeLabels = ['NOW', '+30 MIN', '+1 HR', '+2 HR', '+3 HR'];
    const forecast: WeatherForecastHour[] = timeLabels.map((timeLabel, index) => {
      const idx = Math.min(index, hourlyData.precipitation ? hourlyData.precipitation.length - 1 : 0);
      const rain = Number((hourlyData.precipitation ? hourlyData.precipitation[idx] || (currentPrecip * (1 + index * 0.2)) : 5).toFixed(1));
      const rainP = hourlyData.precipitation_probability ? hourlyData.precipitation_probability[idx] || (currentRainProb + index * 5) : 40;
      const temp = hourlyData.temperature_2m ? Math.round(hourlyData.temperature_2m[idx]) : currentTemp;
      const wind = hourlyData.wind_speed_10m ? Math.round(hourlyData.wind_speed_10m[idx]) : currentWind;

      let risk: RiskLevel = 'LOW';
      if (rain > 30 || rainP > 75) risk = 'HIGH';
      else if (rain > 10 || rainP > 50) risk = 'MODERATE';

      return {
        timeLabel,
        temp,
        rainfall: rain,
        rainProb: rainP,
        wind,
        condition: rain > 15 ? 'Rainstorm' : rain > 2 ? 'Scattered Rain' : 'Cloudy',
        risk
      };
    });

    return { current, forecast };
  } catch (error) {
    console.warn('Weather API failed, falling back to realistic DEMO MODE:', error);
    return getDemoWeatherData();
  }
}

export function getDemoWeatherData(overrideRainfall?: number): { current: WeatherCondition; forecast: WeatherForecastHour[] } {
  const rain = overrideRainfall !== undefined ? overrideRainfall : DEMO_WEATHER_BASELINE.rainfall;
  
  let conditionText = 'Light Scatter Showers';
  if (rain >= 50) conditionText = 'Severe Monsoon Storm Band';
  else if (rain >= 25) conditionText = 'Heavy Downpour & Gusts';
  else if (rain >= 10) conditionText = 'Scattered Showers';
  else conditionText = 'Partly Cloudy with Humidity';

  const current: WeatherCondition = {
    ...DEMO_WEATHER_BASELINE,
    rainfall: rain,
    conditionText,
    source: 'DEMO_MODE',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const forecast: WeatherForecastHour[] = [
    { timeLabel: 'NOW', temp: 28, rainfall: rain, rainProb: Math.min(95, rain * 2 + 20), wind: 18, condition: conditionText, risk: rain > 40 ? 'HIGH' : rain > 15 ? 'MODERATE' : 'LOW' },
    { timeLabel: '+30 MIN', temp: 27, rainfall: Math.round(rain * 1.2), rainProb: Math.min(98, rain * 2.2 + 25), wind: 22, condition: 'Intensifying Cells', risk: rain > 30 ? 'HIGH' : 'MODERATE' },
    { timeLabel: '+1 HR', temp: 26, rainfall: Math.round(rain * 1.35), rainProb: 88, wind: 26, condition: 'Peak Ingress Rain', risk: 'HIGH' },
    { timeLabel: '+2 HR', temp: 26, rainfall: Math.round(rain * 0.75), rainProb: 62, wind: 19, condition: 'Tapering Showers', risk: 'MODERATE' },
    { timeLabel: '+3 HR', temp: 27, rainfall: Math.round(rain * 0.35), rainProb: 40, wind: 14, condition: 'Clearing Skies', risk: 'LOW' }
  ];

  return { current, forecast };
}
