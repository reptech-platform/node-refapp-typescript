import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateAirlineRepository from "../../repositories/airline/put.airline.repository";
import IGetPersonRepository from "../../repositories/person/get.person.repository";
import IGetAirportRepository from "../../repositories/airport/get.airport.repository";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";
import { IAirline } from "../../models/airline.model";
import Helper from "../../utils/helper.utils";

// Interface for UpdateAirlineService
export default interface IUpdateAirlineService {
    // Updates an existing Airline by their userName and returns the updated Airline.
    updateAirline(userName: string, airline: IAirline, dbSession: ClientSession | undefined): Promise<IAirline>;
}

// This decorator ensures that UpdateAirlineService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirlineService implements IUpdateAirlineService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('Helper') private helper: Helper,
        @inject('IUpdateAirlineRepository') private updateAirlineRepository: IUpdateAirlineRepository,
        @inject('IGetAirportRepository') private getAirportRepository: IGetAirportRepository,
        @inject('IGetPersonRepository') private getPersonRepository: IGetPersonRepository
    ) { }

    // Updates an existing Airline by their userName and returns the updated Airline.
    public async updateAirline(airlineCode: string, airline: IAirline, dbSession: ClientSession | undefined): Promise<IAirline> {

        // Create new Airline schema object
        let newItem: IAirlineSchema = new AirlineSchema();

        // Map airline model into schema object
        const keys = Object.keys(airline);
        for (let i = 0; i < keys.length; i++) {
            if (airline[keys[i]]) {
                newItem[keys[i]] = airline[keys[i]];
            }
        }

        // Check if the Airline exists. If yes, throw an error.
        let isExist = await this.updateAirlineRepository.isExist(airlineCode);
        if (!isExist) {
            throw new Error(`Provided Airline '${airlineCode}' does not exist`);
        }

        // Check CEO and ceoName both are passed
        if (!this.helper.IsJsonNull(airline.CEO) && !this.helper.IsNullValue(airline.ceoName)) {
            throw new Error(`Provid CEO or ceoName`);
        }

        let ceoName: any = airline.ceoName;

        // Check if CEO  is not null
        if (!this.helper.IsJsonNull(airline.CEO)) {
            ceoName = airline.CEO?.userName;
            if (this.helper.IsNullValue(ceoName)) {
                throw new Error(`Provid CEO name is required`);
            }
        }

        // Check ceoName and update
        if (!this.helper.IsNullValue(ceoName)) {

            // Check ceoName is exist from person's collection
            let isExist = await this.getPersonRepository.isExist(ceoName);
            if (!isExist) {
                throw new Error(`Provided CEO '${ceoName}' does not exist`);
            }

            // Get CEO details to embed the object
            const person: any = await this.getPersonRepository.getPerson(ceoName);

            newItem.CEO = person;
        }

        // Check airport and airportId both are passed
        if (!this.helper.IsJsonNull(airline.airport) && !this.helper.IsJsonNull(airline.airportId)) {
            throw new Error(`Provid airport or airportId`);
        }

        let icaoCode: any, iataCode: any;

        // Get icao and iata values from airportId object
        if (!this.helper.IsJsonNull(airline.airportId)) {
            icaoCode = airline.airportId?.icaoCode;
            iataCode = airline.airportId?.iataCode;
        }

        // Get icao and iata values from airport object
        if (!this.helper.IsJsonNull(airline.airport)) {
            icaoCode = airline.airport?.icaoCode;
            iataCode = airline.airport?.iataCode;
        }

        if (icaoCode && iataCode) {
            let isExist = await this.getAirportRepository.isExist(icaoCode, iataCode);
            if (!isExist) {
                throw new Error(`Provided airport '${icaoCode}' and '${iataCode}' does not exist`);
            }

            newItem.airportId = await this.getAirportRepository.getAirportId(icaoCode, iataCode);
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

        // Create airline document
        const results: IAirline = await this.updateAirlineRepository.updateAirline(airlineCode, newItem, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
