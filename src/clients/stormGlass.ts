import { buildURL } from '@src/utils/fetch-url';
import { AxiosStatic, isAxiosError, AxiosError } from 'axios';
import {
  ForecastPoint,
  StormGlassForecastResponse,
  StormGlassPoint,
} from '@src/clients/stormGlassTypes';
import { InternalError } from '@src/utils/errors/internal-error';

export class ClientResquestError extends InternalError {
  constructor(messsage: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to StormGlass';
    super(`${internalMessage}: ${messsage}`);
  }
}

export class ClientResponseError extends InternalError {
  constructor(messsage: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${messsage}`);
  }
}

export class StormGlass {
  readonly stormGlassAPIUrl = 'https://api.stormglass.io/v2';
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[] | void> {
    const URL_COMPLETE = buildURL(this.stormGlassAPIUrl, {
      lat,
      lng,
      params: this.stormGlassAPIParams,
      source: this.stormGlassAPISource,
      end: 1592113802,
    });

    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        URL_COMPLETE,
        {
          headers: {
            Authorization: 'fake-token',
          },
        },
      );

      return this.normalizeResponse(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response && axiosError.response.status) {
        throw new ClientResponseError(
          `Error: ${JSON.stringify(axiosError.response.data)} Code: ${
            axiosError.response.status
          }`
        );
      } else if (err instanceof Error) {
        throw new ClientResquestError(err.message);
      } else throw new ClientResquestError('An unknown error occurred');
    }
  }

  private normalizeResponse(
    points: StormGlassForecastResponse,
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return Boolean(
      point.time &&
        point.swellDirection?.[this.stormGlassAPISource] &&
        point.swellHeight?.[this.stormGlassAPISource] &&
        point.swellPeriod?.[this.stormGlassAPISource] &&
        point.waveDirection?.[this.stormGlassAPISource] &&
        point.waveHeight?.[this.stormGlassAPISource] &&
        point.windDirection?.[this.stormGlassAPISource] &&
        point.windSpeed?.[this.stormGlassAPISource],
    );
  }
}
