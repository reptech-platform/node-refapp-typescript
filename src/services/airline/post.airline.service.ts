import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreateAirlineRepository from "../../repositories/airline/post.airline.repository";
import IGetPersonRepository from "../../repositories/person/get.person.repository";
import { IAirlineAdd } from "../../models/airline/airline.add.model";
import { IAirlineRead } from "../../models/airline/airline.read.model";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IPerson } from "../../models/person.model";
import IGetAirportRepository from "../../repositories/airport/get.airport.repository";

// Interface for CreateAirlineService
export default interface ICreateAirlineService {
    // Method to create a new airline
    createAirline(airline: IAirlineAdd, dbSession: ClientSession | undefined): Promise<IAirlineRead>;
}

// This decorator ensures that CreateAirlineService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateAirlineService implements ICreateAirlineService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('ICreateAirlineRepository') private createAirlineRepository: ICreateAirlineRepository,
        @inject('IGetAirportRepository') private getAirportRepository: IGetAirportRepository,
        @inject('IGetPersonRepository') private getPersonRepository: IGetPersonRepository
    ) { }

    // Method to create a new airline
    public async createAirline(airline: IAirlineAdd, dbSession: ClientSession | undefined): Promise<IAirlineRead> {

        // Create new Airline schema object
        let newAirline: IAirlineSchema = new AirlineSchema();

        // Check if the Airline exists. If yes, throw an error.
        let isExist = await this.createAirlineRepository.isExist(airline.airlineCode);
        if (isExist) {
            throw new Error(`Provided Airline '${airline.airlineCode}' is already exist`);
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

        newAirline.airlineCode = airline.airlineCode;
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
        const results: IAirlineRead = await this.createAirlineRepository.createAirline(newAirline, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
