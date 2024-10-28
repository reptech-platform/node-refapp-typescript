import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateAirlineRepository from "../../repositories/airline/put.airline.repository";
import IGetPersonRepository from "../../repositories/person/get.person.repository";
import IGetAirportRepository from "../../repositories/airport/get.airport.repository";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";

import { IAirlineUpdate } from "../../models/airline/airline.update.model";
import { IAirlineRead } from "../../models/airline/airline.read.model";

// Interface for UpdateAirlineService
export default interface IUpdateAirlineService {
    // Updates an existing Airline by their userName and returns the updated Airline.
    updateAirline(userName: string, airline: IAirlineUpdate, dbSession: ClientSession | undefined): Promise<IAirlineRead>;
}

// This decorator ensures that UpdateAirlineService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirlineService implements IUpdateAirlineService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('IUpdateAirlineRepository') private updateAirlineRepository: IUpdateAirlineRepository,
        @inject('IGetAirportRepository') private getAirportRepository: IGetAirportRepository,
        @inject('IGetPersonRepository') private getPersonRepository: IGetPersonRepository

    ) { }

    // Updates an existing Airline by their userName and returns the updated Airline.
    public async updateAirline(airlineCode: string, airline: IAirlineUpdate, dbSession: ClientSession | undefined): Promise<IAirlineRead> {

        // Create new Airline schema object
        let newAirline: IAirlineSchema = new AirlineSchema();

        // Check if the Airline exists. If yes, throw an error.
        let isExist = await this.updateAirlineRepository.isExist(airlineCode);
        if (!isExist) {
            throw new Error(`Provided Airline '${airlineCode}' does not exist`);
        }

        // Check if CEO  is not null
        if (airline.CEO) {
            let isExist = await this.getPersonRepository.isExist(airline.CEO);
            if (!isExist) {
                throw new Error(`Provided CEO '${airline.CEO}' does not exist`);
            }
            const person: any = await this.getPersonRepository.getPerson(airline.CEO);

            newAirline.CEO = person;
        }

        // Check if airport is not null
        if (airline.airport) {
            const { icaoCode, iataCode } = airline.airport;
            if (icaoCode && iataCode) {
                let isExist = await this.getAirportRepository.isExist(icaoCode, iataCode);
                if (!isExist) {
                    throw new Error(`Provided airport '${airline.airport}' does not exist`);
                }
                newAirline.airportId = await this.getAirportRepository.getAirportId(icaoCode, iataCode);
            } else {
                throw new Error(`Provided airport '${airline.airport}' is invalid`);
            }
        }

        newAirline.airlineCode = airlineCode;
        if (airline.name) newAirline.name = airline.name;
        if (airline.logo) newAirline.logo = airline.logo;

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create airline document
        const results: IAirlineRead = await this.updateAirlineRepository.updateAirline(airlineCode, newAirline, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
