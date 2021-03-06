const { RESTDataSource } = require('apollo-datasource-rest')

class LaunchAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'https://api.spacexdata.com/v2/'
    }

    async getAllLaunches() {
        const response = await this.get('launches')
        return Array.isArray(response) ? response.map((launch) => this.launchReducer(launch)) : []
    }

    async getLaunchByID({launchId}) {
        const response = await this.get('launches', {flight_number: launchId})
        return this.launchReducer(response[0])
    }

    async getLaunchesByIDs({launchIds}) {
        return Promise.all(
            launchIds.map((launchId) => this.getLaunchByID({launchId}))
        )
    }

    launchReducer(launch) {
        
        let mission = {
            name: launch.mission_name,
            missionPatchSmall: launch.links.mission_patch_small,
            missionPatchLarge: launch.links.mission_patch
        }

        let rocket = {
            id : launch.rocket.rocket_id,
            name: launch.rocket.rocket_name,
            type: launch.rocket.rocket_type
        }

        //Here cursor is used for pagination and indicates from where the next set of paginated data should be obtained.
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: mission,
            rocket: rocket
        }
    }
}

module.exports = LaunchAPI
