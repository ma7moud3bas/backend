import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers/index';
import { typeDefs } from './typeDefs';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';

const executableSchema = makeExecutableSchema({
    typeDefs: [typeDefs, ...scalarTypeDefs],
    resolvers: resolvers
});
export default executableSchema;
