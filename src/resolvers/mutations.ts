import { Booking, Route, Station, StationStop, Train, User } from "@prisma/client";
import prisma from "../db";
import bcrypt from "bcryptjs"
import jwt, { Secret } from "jsonwebtoken"
import { withAuth } from "../utils";
import { AppContext } from "../server";
const APP_SECRET = process.env.APP_SECRET as String as Secret


const authorizedMutations = withAuth({
    updateUser: (parent: any, args: { id: String, data: User }) => {
        return prisma.user.update({
            where: { id: Number(args.id) },
            data: { ...args.data },
        });
    },

    createUser: (parent: any, args: { data: User }) => {
        return prisma.user.create({
            data: { ...args.data },
        });
    },

    deleteUser: (parent: any, args: { id: string }) => {
        return prisma.user.delete({
            where: { id: Number(args.id) }
        });
    },

    createStation: (parent: any, args: { data: Station }) => {
        return prisma.station.create({
            data: { ...args.data }
        })
    },

    updateStation: (parent: any, args: { name: String, data: Station }) => {
        return prisma.station.update({
            where: { name: String(args.name) },
            data: { ...args.data }
        })
    },

    assignStationToRoute: (parent: any, args: { data: StationStop }) => {
        return prisma.stationStop.create({
            data: { ...args.data, assignedAt: new Date(new Date().toISOString()) }

        })
    },

    removeStationFromRoute: (parent: any, args: { routeNumber: StationStop["routeNumber"], stationName: StationStop["stationName"] }) => {
        return prisma.stationStop.delete({
            where: {
                routeNumber_stationName: {
                    routeNumber: args.routeNumber,
                    stationName: args.stationName
                }
            }

        })
    },

    createTrain: (parent: any, args: { data: Train }) => {
        return prisma.train.create({
            data: { ...args.data, number: Number(args.data.number) },
        });
    },

    updateTrain: (parent: any, args: { number: String, data: Train }) => {
        return prisma.train.update({
            where: { number: Number(args.number) },
            data: { ...args.data },
        });
    },

    deleteTrain: (parent: any, args: { number: String }) => {
        return prisma.train.delete({
            where: { number: Number(args.number) }
        });
    },

    createRoute: (parent: any, args: { data: Route }) => {
        return prisma.route.create({
            data: {
                ...args.data,
                "departure_time": new Date(args.data.departure_time),
                "arrival_time": new Date(args.data.arrival_time),
            },
        });
    },

    updateRoute: (parent: any, args: { data: Route, number: string }) => {
        return prisma.route.update({
            where: { number: Number(args.number) },
            data: { ...args.data },
        });
    },

    deleteRoute: (parent: any, args: { number: string }) => {
        return prisma.route.delete({
            where: { number: Number(args.number) }
        });
    },

    createBooking: (parent: any, args: { data: Booking }) => {
        return prisma.booking.create({
            data: { ...args.data },
        });
    },

    updateBooking: (parent: any, args: { data: Booking, id: String }) => {
        return prisma.booking.update({
            where: { id: Number(args.id) },
            data: { ...args.data },
        });
    },

    deleteBooking: (parent: any, args: { id: String }) => {
        return prisma.booking.delete({
            where: { id: Number(args.id) }
        });
    }
})

const unAuthorizedMutations = {
    signup: async (_parent: any, args: User & { password: string }, context: AppContext) => {
        const password = await bcrypt.hash(args.password, 10)
        const user = await prisma.user.create({
            data: { ...args, password },
        })
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
        context.res.cookie("railway_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 8600,
        });
        return {
            token,
            user,
        }
    },

    login: async (_parent: any, args: { email: User["email"], password: User["password"] }) => {
        const user = await prisma.user.findFirst({ where: { email: args.email } })
        if (!user) {
            throw new Error('No such user found')
        }
        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
        return {
            token,
            user,
        }
    },
}
export const Mutation = {
    ...authorizedMutations,
    ...unAuthorizedMutations
};