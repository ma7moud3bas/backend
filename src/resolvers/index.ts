import { DateTimeResolver, TimeResolver, } from "graphql-scalars";
import { Mutation } from "./mutations";
import { Query } from "./query";

export const resolvers = {
    Time: TimeResolver,
    DateTime: DateTimeResolver,
    Mutation: Mutation,
    Query: Query,
};