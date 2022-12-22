import prisma from "../db";
import { withAuth } from "../utils";
export const Query = withAuth({
    getUser: (_parent: any, args: any) => {
        return prisma.user.findFirst({
            where: { id: Number(args.id) },
        });
    },
    getAllUsers: (_parent: any, args: any, context: any, info: any) => {
        console.log(context)
        return prisma.user.findMany();
    },

    getTrain: (_parent: any, args: any) => {
        return prisma.train.findFirst({
            where: { number: Number(args.number) },
        });
    },

    getAllTrains: (_parent: any) => {
        return prisma.train.findMany();
    },
    getRoute: (_parent: any, args: any) => {
        return prisma.route.findFirst({
            where: { number: Number(args.number) },
            include: { intermediate_stops: true }
        });
    },
    getAllRoutes: (_parent: any) => {
        return prisma.route.findMany();
    },
    getStation: (_parent: any, args: any) => {
        return prisma.station.findFirst({
            where: { name: args.name },
        });
    },
    getStationWithIntermediateStops: (_parent: any, args: any) => {
        return prisma.station.findFirst({
            where: { name: args.name },
            include: { routes: true }
        });
    },
    getAllStations: (_parent: any) => {
        return prisma.station.findMany();
    },
    getBooking: (_parent: any, args: any) => {
        return prisma.booking.findFirst({
            where: { id: (Number(args.id)) }
        });
    },
    getBookingWithRoute: (_parent: any, args: any) => {
        return prisma.booking.findFirst({
            where: { id: (Number(args.id)) },
            include: { Route: true }
        });
    },
    getRouteBookings: (_parent: any, args: any) => {
        return prisma.booking.findFirst({
            where: { route_number: (Number(args.route_number)), date: new Date(args.date) }
        });
    },
    getAllUserBookings: (_parent: any, args: any) => {
        return prisma.booking.findMany({
            where: { user_id: Number(args.user_id) }
        });
    },
});
