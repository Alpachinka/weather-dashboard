import { z } from "zod";

export const CitySearchResultSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
});

export const GeoSearchResponseSchema = z.object({
  results: z.array(CitySearchResultSchema).optional(),
});

export const WeatherResponseSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    apparent_temperature: z.number(),
    precipitation: z.number().optional(),
    weather_code: z.number(),
    wind_speed_10m: z.number(),
    surface_pressure: z.number().optional(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    wind_speed_10m: z.array(z.number()).optional(),
    precipitation_probability: z.array(z.number()).optional(),
    weather_code: z.array(z.number()),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    precipitation_sum: z.array(z.number()).optional(),
    wind_speed_10m_max: z.array(z.number()).optional(),
    uv_index_max: z.array(z.number()).optional(),
    sunrise: z.array(z.string()).optional(),
    sunset: z.array(z.string()).optional(),
  }),
});
