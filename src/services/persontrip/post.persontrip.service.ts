import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import { IPersonTrip } from "../../models/persontrip.model";
import ICreatePersonTripRepository from "../../repositories/persontrip/post.persontrip.repository";
import IGetPersonRepository from "../../repositories/person/get.person.repository";
import IGetTripRepository from "../../repositories/trip/get.trip.repository";

// Interface for CreatePersonTripService
export default interface IUpdatePersonTripService {
    // Method to create a new person and trip mapping
    createPersonTrips(personTrips: IPersonTrip[], dbSession: ClientSession | undefined): Promise<void>;
}

// This decorator ensures that CreatePersonTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdatePersonTripService implements IUpdatePersonTripService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('ICreatePersonTripRepository') private createPersonTripRepository: ICreatePersonTripRepository,
        @inject('IGetTripRepository') private getTripRepository: IGetTripRepository,
        @inject('IGetPersonRepository') private getPersonRepository: IGetPersonRepository
    ) { }

    // Method to create a new airline
    public async createPersonTrips(personTrips: IPersonTrip[], dbSession: ClientSession | undefined): Promise<void> {

        // Create new PersonTrip schema object
        let newItems: any[] = [];

        // Check if personTrips object is not null
        if (personTrips && personTrips.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < personTrips.length; index++) {
                let { tripId, userName } = personTrips[index];
                // Check if the PersonTrip exists. If not, throw an error.
                let isExist = await this.createPersonTripRepository.isExist(userName, tripId);
                if (!isExist) {
                    throw new Error(`Provided person trip '${tripId}' and '${userName}' is already exist`);
                }
                isExist = await this.getPersonRepository.isExist(userName);
                if (!isExist) {
                    throw new Error(`Provided person '${userName}' does not exist`);
                }

                isExist = await this.getTripRepository.isExist(tripId);
                if (!isExist) {
                    throw new Error(`Provided trip '${tripId}' does not exist`);
                }

                newItems.push({ userName, tripId });
            }
        } else {
            throw new Error(`Provided airline staffs are required`);
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

        // Create airlinestaff document
        await this.createPersonTripRepository.createTripAndPersonMapping(newItems, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }
}
