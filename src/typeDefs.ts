import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    getUser(id: ID!): User
    getAllUsers: [User!]!
    getTrain(number: ID!): Train
    getAllTrains: [Train!]!
    getRoute(number: ID!): Route
    getAllRoutes: [Route!]!
    getStation(name: ID!): Station
    getStationWithIntermediateStops(name: ID!): Station
    getAllStations: [Station!]!
    getBooking(id: ID!): Booking
    getBookingWithRoute(id: ID!): Booking
    getRouteBookings(route_number: String, data: String): [Booking!]!
    getAllUserBookings(user_id: String): [Booking!]!
  }

  type Mutation {
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateUser(id: ID!, data: UserInput!): User!
    createUser(data: UserInput!): User!
    deleteUser(id: ID!): User!
    createTrain(data: TrainInput): Train!
    updateTrain(number: ID!, data: TrainInput): Train!
    deleteTrain(number: ID!): Train!
    createRoute(data: RouteInput): Route!
    updateRoute(number: ID!, data: RouteInput): Route!
    deleteRoute(number: ID!): Route!
    createBooking(data: BookingInput): Booking!
    updateBooking(id: ID!, data: BookingInput): Booking!
    deleteBooking(id: ID!): Booking!
    createStation(data: StationInput!): Station!
    updateStation(id: ID!, data: StationInput!): Station!
    assignStationToRoute(data: StationStopInput!): StationStop!
    removeStationFromRoute(stationName: String!, routeNumber: Int!): StationStop!
  }
  
  type AuthPayload {
    token: String
    user: User
  }

  input UserInput {
    name: String!
    email: String!
    image_url: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    image_url:String
  }

  input TrainInput {
    type: TrainType!
    class: TrainClass!
    number: ID!
  }

  type Train {
    number: ID!
    type: TrainType!
    class: TrainClass!
    route_number: Int
  }

  input RouteInput {
    trainNumber: Int!
    departure_time: DateTime!
    arrival_time: DateTime!
    departure_station: String!
    arrival_station: String!
    operational: Boolean!
  }

  type Route {
    number: ID!
    departure_time: Time!
    arrival_time: Time!
    departure_station: String!
    arrival_station: String!
    Bookings: [Booking!]
    intermediate_stops: [StationStop!]
    trainNumber: Int!
    operational: Boolean!
  }

  input StationStopInput {
    time: DateTime!
    stationName: String!
    routeNumber: Int!
  }

  type StationStop {
    time: Time!
    stationName: String!
    routeNumber: Int!
    Route: Route!
    assignedAt: String! 
    Station: Station!
  }

  input StationInput {
    name:String!
  }

  type Station {
    name:String!
    routes: [StationStop!]
  }

  input BookingInput {
    date: Date!
    user_id:Int!
    route_number:Int!
    departure_station:String!
    arrival_station: String!
    departure_time: DateTime!
    arrival_time: DateTime!
    seats: [JSON!]!
  }

  type Booking {
    id:ID!
    date: Date!
    user_id:Int!
    route_number:Int!
    departure_station:String!
    arrival_station: String!
    departure_time: Time!
    arrival_time: Time!
    seats: [JSON!]
  }


  enum TrainType {
    VIP
    EXPRESS
    ORDINARY
    RUSSIAN
    SLEEPER
  }

  enum TrainClass {
    A1
    A2
    A3
  }

`