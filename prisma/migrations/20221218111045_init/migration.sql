-- CreateEnum
CREATE TYPE "TrainType" AS ENUM ('VIP', 'EXPRESS', 'ORDINARY', 'RUSSIAN', 'SLEEPER');

-- CreateEnum
CREATE TYPE "TrainClass" AS ENUM ('A1', 'A2', 'A3');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "train" (
    "number" INTEGER NOT NULL,
    "type" "TrainType" NOT NULL,
    "class" "TrainClass" NOT NULL,

    CONSTRAINT "train_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "route" (
    "number" SERIAL NOT NULL,
    "departure_time" TIME NOT NULL,
    "arrival_time" TIME NOT NULL,
    "departure_station" TEXT NOT NULL,
    "arrival_station" TEXT NOT NULL,
    "trainNumber" INTEGER NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "route_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "station_stop" (
    "time" TIME NOT NULL,
    "stationName" TEXT NOT NULL,
    "routeNumber" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "station_stop_pkey" PRIMARY KEY ("routeNumber","stationName")
);

-- CreateTable
CREATE TABLE "station" (
    "name" TEXT NOT NULL,

    CONSTRAINT "station_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "user_id" INTEGER NOT NULL,
    "route_number" INTEGER NOT NULL,
    "departure_station" TEXT NOT NULL,
    "arrival_station" TEXT NOT NULL,
    "departure_time" TIME NOT NULL,
    "arrival_time" TIME NOT NULL,
    "seats" JSONB[],

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "route_trainNumber_key" ON "route"("trainNumber");

-- AddForeignKey
ALTER TABLE "route" ADD CONSTRAINT "route_trainNumber_fkey" FOREIGN KEY ("trainNumber") REFERENCES "train"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "station_stop" ADD CONSTRAINT "station_stop_stationName_fkey" FOREIGN KEY ("stationName") REFERENCES "station"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "station_stop" ADD CONSTRAINT "station_stop_routeNumber_fkey" FOREIGN KEY ("routeNumber") REFERENCES "route"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_route_number_fkey" FOREIGN KEY ("route_number") REFERENCES "route"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
