import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken'
const APP_SECRET = process.env.APP_SECRET

export function getUser(Authorization: String) {
    try {
        if (Authorization) {
            const token = Authorization.replace('Bearer ', '')
            const result: any = jwt.verify(token, APP_SECRET as string)
            return { isAuthorized: result.userId ? true : false, userId: result.userId }
        }
    } catch (e) {
        return null
    }
    return null
}


export const withAuth = <T extends { [key: string]: Function }>(methods: T): T => {
    return Object.fromEntries(Object.entries(methods).map(([key, method]) => {
        const newMethod: typeof method = (parent: any, args: any, context: any, info: any) => {
            if (context.user?.isAuthorized) {
                return method(parent, args, context, info)
            } else {
                throw new GraphQLError("you must be logged in to query this schema", {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                });
            }
        }
        return [key, newMethod]
    })) as T
}
