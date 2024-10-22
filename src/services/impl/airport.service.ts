import { Search, SearchResults } from "../../models/search.model";
import { IAirport } from "../../models/airport.model";
import { IAirline } from "../../models/airline.model";
import Helper from "../../utils/helper.utils";
import { inject, injectable } from "inversify";
import IAirportService from "../airport.interface";
import IAirlineService from "../airline.interface";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import { iocContainer } from "../../ioc";
import IAirportRepository from "../../repositories/airport.repository";

// This decorator ensures that AirportsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class AirportService implements IAirportService {

    // Injecting the Helper service
    constructor(
        // AirlinesService has a circular dependency
        @inject(Helper) private helper: Helper,
        @inject("IAirportRepository") private airportRepository: IAirportRepository
    ) { }

    // Method to check if an airport exists by its ICAO and IATA codes
    public async isAirportExist(icaoCode: string, iataCode: string): Promise<boolean> {
        return await this.airportRepository.isAirportExist(icaoCode, iataCode);
    }

    // Method to get a specific airport by its ICAO and IATA codes
    public async getAirportId(icaoCode: string, iataCode: string): Promise<string> {
        return await this.airportRepository.getAirportId(icaoCode, iataCode);
    }

    // Method to get a specific airport airline id by its ICAO and IATA codes
    public async getAirportAirlineId(icaoCode: string, iataCode: string): Promise<string> {
        return await this.airportRepository.getAirportAirlineId(icaoCode, iataCode);
    }

    // Method to get all airports
    public async getAirports(): Promise<IAirport[]> {
        return await this.airportRepository.getAirports();
    }

    // Method to get a specific airport by its ICAO and IATA codes
    public async getAirport(icaoCode: string, iataCode: string): Promise<IAirport> {
        return await this.airportRepository.getAirport(icaoCode, iataCode);
    }

    // Method to get a specific airport along with its associated airlines by airport ID
    public async getAriportAirlines(icaoCode: string, iataCode: string): Promise<IAirport> {
        return await this.airportRepository.getAriportAirlines(icaoCode, iataCode);
    }

    // Method to get all airports along with their associated airlines
    public async getAriportsAirlines(): Promise<IAirport[]> {
        return await this.airportRepository.getAriportsAirlines();
    }

    // Method to create a new airport
    public async createAirport(airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Retrieve the airline information from the airport object, which may be undefined
        let airline: IAirline | undefined = airport.airlines;

        if (airline) {
            // Check if the airline already exists in the database using its airline code
            const isExist = await this.airlineService().isAirlineExist(airline.airlineCode);

            // If the airline does not exist, create a new airline entry in the database
            if (!isExist) {
                // Create the airline and assign it to the airport object
                airline = await this.airlineService().createAirline(airline, dbSession);

                // map airline id to airport airlineId
                airport.airlineId = airport['_id'];
            } else {
                // Retrieve the airline ID using the airline code and assign it to the airport object
                airport.airlineId = await this.airlineService().getAirlineId(airline.airlineCode);
            }
        }

        const results: IAirport = await this.airportRepository.createAirport(airport, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Updates an airport's information based on the provided ICAO and IATA codes.
    public async updateAirport(icaoCode: string, iataCode: string, airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Retrieve the airline information from the airport object, which may be undefined
        let airline: IAirline | undefined = airport.airlines;

        if (airline) {
            // Check if the airline already exists in the database using its airline code
            const isExist = await this.airlineService().isAirlineExist(airline.airlineCode);

            // If the airline does not exist, throw error message
            if (!isExist) {
                // Abort the transaction if it was started in this call
                if (!inCarryTransact) {
                    await DbSession.Abort(dbSession);
                }
                throw { status: 400, message: `Provided ${airline.airlineCode} airline does not exist` };
            }

            // Retrieve the airline ID using the airline code and assign it to the airport object
            airport.airlineId = await this.airlineService().getAirlineId(airline.airlineCode);

            // Update airport object using the icaoCode and  iataCode in the database
            await this.airlineService().updateAirline(airline.airlineCode, airline, dbSession);
        }

        const results: IAirport = await this.airportRepository.updateAirport(icaoCode, iataCode, airport, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes an airport based on the provided ICAO and IATA codes.
    public async deleteAirport(icaoCode: string, iataCode: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Retrieve the airline id information from the database, which may be undefined
        const airlineId: string = await this.getAirportAirlineId(icaoCode, iataCode);

        // Check if the airlineId exists in the database using its airlineId
        if (!this.helper.IsNullValue(airlineId)) {
            // Delete airline in the database using airline id
            await this.airlineService().deleteAirlineById(airlineId, dbSession);
        }

        const results: boolean = await this.airportRepository.deleteAirport(icaoCode, iataCode, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes an airport based on the provided airport id.
    public async deleteAirportById(_id: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Delete the airport record
        const results: boolean = await this.airportRepository.deleteAirportById(_id, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;

    }

    // Searches for airports based on the provided search criteria.
    public async searchAirport(search: Search): Promise<SearchResults> {
        return await this.airportRepository.searchAirport(search);
    }

    // Counts the number of airports based on the provided search criteria.
    public async searchAirportCount(search: Search): Promise<number> {
        return await this.airportRepository.searchAirportCount(search);
    }

    // Counts the total number of airports in the collection.
    public async getAirportCount(): Promise<number> {
        return await this.airportRepository.getAirportCount();
    }

    private airlineService(): IAirlineService {
        return iocContainer.get("IAirlineService");
    }
}
