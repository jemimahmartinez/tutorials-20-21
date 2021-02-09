const { gql } = require('apollo-server');

const typeDefs = gql`
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
    token: String
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  type Query {
    launches( # replace the current launches query with this one.
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the last item in the list.
  Pass this cursor to the launches query to dfetch results after these.
  """
  type LaunchConnection { # add this below the Query type as an additional type
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
`;

module.exports = typeDefs;

// NOTES:

// Launch type is a collection of fields, each field has a type of its own
// (a field's type can be either an object type or a scalar type - primitive that resolves to a single value)
// `!` after a declared field's type means "this field's value can never be null"
// `!` after an array = the array cannot be null, but it can be empty

// When you query for a field that takes an argument, the field's value can vary depending on the provided argument's value (e.g. missionPatch(size) in Mission)

// This `Query` type defines three available queries for clients to execute: `launches`, `launch`, and `me`
// The `Launches` query will return an array of all upcoming `Launches`
// The `Launch` query will return a single `Launch` that corresponds to the `id` argument provided to the query
// The `me` query will return details for the `User` that's currently logged in

// This `Mutation` type defines three available mutations for clients to execute: `bookTrips`, `cancelTrip`, and `login`
// The `bookTrips` mutation enables a logged-in user to book a trip on one or more `Launches` (specified by an array of launch IDs)
// The `cancelTrip` mutation enables a logged-in user to cancel a trip that they previously booked
// The `login` mutation enables a user to log in by providing their email address

// Now, `Query.launches` takes in two parameters(`pageSize` and `after`) and returns a `LaunchConnection` object.
// The `LaunchConnection` includes:
// A list of `launches` (the actual data requested by a query)
// A `cursor` that indicates the current position in the data set
// A `hasMore` boolean that indicates whether the data set contains any more items beyond those included in `launches`
