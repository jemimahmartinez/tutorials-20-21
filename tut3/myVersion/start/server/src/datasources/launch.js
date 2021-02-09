const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  async getAllLaunches() {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }

  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_size && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  async getLaunchById({ launchId }) {
    const response = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(response[0]);
  }

  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId })),
    );
  }
}

module.exports = LaunchAPI;

// NOTES:

// The `RESTDataSource` class automatically caches responses from REST resources with no additional setup.
// We call this feature 'partial query caching' - it enables you to take advantage of the caching logic that the REST API already exposes
// The `RESTDataSource` class provides heper methods that correspond to HTTP verbs like `GET` and `POST`

// `LaunchAPI` data source needs methods that enable it to fetch the data that incoming queries will request

//`getAllLaunches` method gets a list of all SpaceX launches
// The call to `this.get('launches') sends a `GET` request to `https://api.spacexdata.com/v2/launches` and stores the array of returned launches in `response`

// We use `this.launchReducer` method, which transforms returned launch data into the shape that our schema expects
// This approach decouples the structure of your schema from the structure of the various data sources that populate its fields
// Using a reducer like this enables the `getAllLaunches` method to remain concise as our definition of a `Launch` potentially changes and grows over time
// It also helps with testing the LaunchAPI class

// The `getLaunchById` method takes a launch's flight number and returns the data for the associated launch
// The `getLaunchesByIds` method returns of multiple calls to `getLaunchById`
