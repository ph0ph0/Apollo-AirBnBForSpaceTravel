const { paginateResults } = require('./utils.js')

module.exports = {
    Query: {
        launchesQuery: async (_, { pageSize = 20, after}, {dataSources}) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches()
            // We want these in reverse chron order
            allLaunches.reverse()
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches
            })
            return {
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                // if the cursor of the end of the paginated results is the same as the last item
                // in _all_ results, then there are no more results after this
                hasMore: launches.length ? launches[launches.length -1].cursor !== allLaunches[allLaunches.length -1].cursor : false,
                launches: launches
            }
        },
        launchQuery: ((_, {id}, {dataSources}) => {
            return dataSources.launchAPI.getLaunchByID({launchId: id})
        }),
        meQuery: ((_, __, {dataSources}) => {
            return dataSources.userAPI.findOrCreateUser()
        }),    
    },
    Mission: {
        missionPatch: (mission, {size} = {size: 'LARGE'}) =>{
            return size === 'SMALL' ? mission.missionPatchSmall : mission.missionPatchLarge
        }
    },
    Launch: {
        isBooked: (launch, _, {dataSources} ) => {
            return dataSources.userAPI.isBookedOnLaunch({launchId: launch.id})
        }
    },
    User: {
        trips: (_, __, {dataSources}) => {
            //Get ids of launches by user
            const launchIds = dataSources.userAPI.getLaunchIdsByUser()

            if (!launchIds.length) return []

            //Get those launches from the server
            return dataSources.launchAPI.getLaunchesByIds({launchIds: launchIds})
        }
    },
    Mutation: {
        login: async (_, {email}, {dataSources}) => {
            let user = await dataSources.userAPI.findOrCreateUser({email})
            if (user) return Buffer.from(email).toString('base64')
        },
        bookTrips: async  (_, {launchIds}, {dataSources}) => {
            const results = await dataSources.userAPI.bookTrips({launchIds: launchIds})
            const launches = await dataSources.launchAPI.getLaunchesByIDs({launchIds})

            //Needs to return a TripUpdateResponse shaped object
            return {
                success: results && results.length === launchIds.length,
                message: results.length === launchIds.length 
                    ? 'Trips booked successfully' 
                    : `The following trips couldn't be booked ${launchIds.filter(id => !results.includes(id))}`,
                launches
            }
        },
        cancelTrip: async (_, {launchId}, {dataSources}) => {
            const result = await dataSources.userAPI.cancelTrip({launchId: launchId})

            if (!result) {
                return {
                    success: false,
                    message: 'Failed to cancel trip'
                }
            }

            const launch = await dataSources.launchAPI.getLaunchByID({launchId})
            //Needs to return a TripUpdateResponse shaped object
            return {
                success: true,
                message: 'Trip cancelled',
                launches: [launch]
            }
        }
    }
}
