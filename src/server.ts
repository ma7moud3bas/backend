import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Request, Response } from 'express';
import schema from './schema';
import { createServer, Server } from 'http';
import { getUser } from './utils';
import { appUrl, frontendUrl } from './constants';

export interface AppContext {
    req: Request, res: Response, user: { isAuthorized: Boolean, userId: String }
}

export default async (port: number): Promise<Server> => {
    const app = express();
    const httpServer: Server = createServer(app);

    const corsOptions = { origin: ["https://studio.apollographql.com", appUrl, frontendUrl], credentials: true, methods: ["GET", "POST"], allowedHeaders: ["Access-Control-Allow-Credentials", "Authorization", "true", "Content-Type", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers"] }

    app.use('*', cors(corsOptions));

    const apolloServer = new ApolloServer<AppContext>({
        schema,
        context: async ({ req, res }) => {
            const token = req.headers.authorization || '';
            const user = await getUser(token);
            return { user, res, req };
        },
        csrfPrevention: true,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions });

    return new Promise<Server>(resolve => {
        httpServer.listen(port, () => {
            resolve(httpServer);
        });
    });
};
