import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import { IPersonTrip } from "../../models/persontrip.model";
import IUpdatePersonTripRepository from "../../repositories/persontrip/put.persontrip.repository";

// Interface for UpdatePersonTripService
export default interface IUpdatePersonTripService {
    // Method to update person and trips mapping
    updatePersonTrips(personTrips: IPersonTrip[], dbSession: ClientSession | undefined): Promise<void>;
}

// This decorator ensures that UpdatePersonTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdatePersonTripService implements IUpdatePersonTripService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('IUpdatePersonTripRepository') private updatePersonTripRepository: IUpdatePersonTripRepository
    ) { }

    // Method to update person and trips mapping
    public async updatePersonTrips(personTrips: IPersonTrip[], dbSession: ClientSession | undefined): Promise<void> {

        // Create new PersonTrip schema object
        let newItems: any[] = [];

        // Check if airlineStaffs object is not null
        if (personTrips && personTrips.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < personTrips.length; index++) {
                let { tripId, userName } = personTrips[index];

                let _id = await this.updatePersonTripRepository.getKeyId(userName, tripId);
                if (!_id) {
                    throw new Error(`Provided person trip '${tripId}' and '${userName}' does not exist`);
                }

                newItems.push({ _id, userName, tripId });
            }
        } else {
            throw new Error(`Provided person trips are required`);
        }

        /**
         * This is mapping table. So, there is no update, It should delete the mapping and add it again
         * So skipping update option from here
         */

        /* // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create airlinestaff document
        await this.updatePersonTripRepository.updateTripAndPersonMapping(newItems, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        } */
    }
}
