import { ITrip } from "../../models/trip.model";
import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateTripRepository from "../../repositories/trip/put.trip.repository";
import TripSchema, { ITripSchema } from "../../db/dao/trip.db.model";
import Helper from "../../utils/helper.utils";
import IGetAirportRepository from "../../repositories/airport/get.airport.repository";
import IGetAirlineRepository from "../../repositories/airline/get.airline.repository";

// Interface for UpdateTripService
export default interface IUpdateTripService {
    // Updates an existing trip by their tripId and returns the updated trip.
    updateTrip(tripId: number, trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip>;
}

// This decorator ensures that UpdateTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateTripService implements IUpdateTripService {
    // Injecting the TripRepository service
    constructor(
        @inject('Helper') private helper: Helper,
        @inject('IUpdateTripRepository') private updateTripRepository: IUpdateTripRepository,
        @inject('IGetAirportRepository') private getAirportRepository: IGetAirportRepository,
        @inject('IGetAirlineRepository') private getAirlineRepository: IGetAirlineRepository
    ) { }

    // Updates an existing trip by their tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip> {

        // Check if the trip exists. If not, throw an error.
        let isExist = await this.updateTripRepository.isExist(tripId);
        if (!isExist) {
            throw new Error(`Provided trip '${tripId}' does not exist`);
        }

        let newItem: ITripSchema = new TripSchema();

        // Map trip model into schema object
        const keys = Object.keys(trip);
        for (let i = 0; i < keys.length; i++) {
            if (trip[keys[i]]) {
                newItem[keys[i]] = trip[keys[i]];
            }
        }

        // Check any Plan items are passed
        if (trip.planItems && !this.helper.IsArrayNull(trip.planItems)) {

            // Loop to check if each planitem has valid details
            for (let index = 0; index < trip.planItems.length; index++) {
                let { airLine, fromAirport, toAirport } = trip.planItems[index];

                let isExist: boolean = false;

                // Check Airline
                if (airLine) {
                    isExist = await this.getAirlineRepository.isExist(airLine.airlineCode);
                    if (!isExist) {
                        throw new Error(`Provided airline '${airLine.airlineCode}' does not exist`);
                    }

                    newItem.planItems[index].airLine = airLine.airlineCode;
                }

                let icaoCode: any, iataCode: any;

                // Get icao and iata values from fromAirport object
                if (fromAirport && !this.helper.IsJsonNull(fromAirport)) {
                    icaoCode = fromAirport.icaoCode;
                    iataCode = fromAirport.iataCode;
                }

                if (icaoCode && iataCode) {
                    let isExist = await this.getAirportRepository.isExist(icaoCode, iataCode);
                    if (!isExist) {
                        throw new Error(`Provided from airport '${icaoCode}' and '${iataCode}' does not exist`);
                    }

                    newItem.planItems[index].fromAirport = await this.getAirportRepository.getAirportId(icaoCode, iataCode);
                }

                icaoCode = undefined; iataCode = undefined;

                // Get icao and iata values from toAirport object
                if (toAirport && !this.helper.IsJsonNull(toAirport)) {
                    icaoCode = toAirport.icaoCode;
                    iataCode = toAirport.iataCode;
                }

                if (icaoCode && iataCode) {
                    let isExist = await this.getAirportRepository.isExist(icaoCode, iataCode);
                    if (!isExist) {
                        throw new Error(`Provided to airport '${icaoCode}' and '${iataCode}' does not exist`);
                    }
                    newItem.planItems[index].toAirport = await this.getAirportRepository.getAirportId(icaoCode, iataCode);
                }

            }

        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Update the trip entry in the database
        let results = await this.updateTripRepository.updateTrip(tripId, newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Return the updated trip object
        return results;
    }
}
