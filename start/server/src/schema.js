const { gql } = require('apollo-server')

const typeDefs = gql`

    # ------Queries------

    type Query {
        launchesQuery(
            # The no. of pages to show. Must be greater than 1. Default 20
            pageSize: Int
            # If you add a query here, it will only return results _after_ this query
            after: String
             ): LaunchConnection!
        launchQuery(id: ID!): Launch
        # Queries for the current user
        meQuery: User
        Mission: Mission
    }

    # ------Objects------

    """
    Simple wrapper around our launches that contains a cursor to the last item in the list
    Pass this query to the launchesQuery to fetch results after these.
    """
    type LaunchConnection {
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }

    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }

    type Rocket {
        id: ID!
        name: String
        type: String
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch]!
    }

    type Mission {
        name: String
        missionPatch(mission: String, size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }

    # ------Mutations------

    type Mutation {
        # If false, bookTrips failed, check errors!
        bookTrips(launchIds: [ID]!): TripUpdateResponse!

        # If false, cancelTrip failed, check errors!
        cancelTrip(launchId: ID!): TripUpdateResponse!

        login(email: String): String #Login token
    }

    # ------Mutation Response Objects------

    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }`
    
    

module.exports = typeDefs