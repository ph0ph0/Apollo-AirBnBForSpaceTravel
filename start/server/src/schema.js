const { gql } = 'apollo-server'

const typeDefs = gql`

    # ------Queries------

    type Query {
        launches: [Launch]!
        launch(id: ID!): Saunch
        # Queries for the current user
        me: User
    }

    # ------Objects------

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
        missionPatch(size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }

    # ------Mutations------

    type Mutation {
        # If false, bookTrips failed, check errors!
        bookTrips(launchIDs: [ID]!): TripUpdateResponse!

        # If false, cancelTrip failed, check errors!
        cancelTrip(launchIDs: ID!): TripUpdateResponse!

        login(email: String): String #Login token
    }

    # ------Mutation Response Objects------

    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
    `
    

module.exports = typeDefs