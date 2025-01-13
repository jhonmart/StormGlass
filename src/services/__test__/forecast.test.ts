import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import { Beach, BeachPosition, Forecast } from '@src/services/forecast';
import { expected as expectedResponse } from '@src/services/__test__/fixtures/forecast_response_data.json';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  it('should return the forecast for a list of beaches', async () => {
    StormGlass.prototype.fetchPoints = jest
      .fn()
      .mockResolvedValue(stormGlassNormalizedResponseFixture);

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];
    const forecast = new Forecast(new StormGlass());
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
