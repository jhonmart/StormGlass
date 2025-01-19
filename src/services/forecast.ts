import { Beach } from '@src/models/beach';
import { StormGlass } from '@src/clients/stormGlass';
import { ForecastPoint } from '@src/clients/stormGlassTypes';
import { InternalError } from '@src/utils/errors/internal-error';

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during ehe forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        if (points) {
          const enrichedBeachData = this.enrichedBeachData(points, beach);
          pointsWithCorrectSources.push(...enrichedBeachData);
        }
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (err) {
      if (err instanceof ForecastProcessingInternalError) {
        throw new ForecastProcessingInternalError(err.message);
      } else
        throw new ForecastProcessingInternalError('An unknown error occurred');
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
  ): BeachForecast[] {
    return points?.map((point) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find(
        (actualForecast) => actualForecast.time === point.time,
      );
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
