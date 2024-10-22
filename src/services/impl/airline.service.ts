import { IAirline } from "../../models/airline.model";
import { IAirport } from "../../models/airport.model";
import { Search, SearchResults } from "../../models/search.model";
import RequestResponse from "../../utils/request.response";
import Helper from "../../utils/helper.utils";
import { inject, injectable } from "inversify";
import IAirlineService from "../airline.interface";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IAirlineRepository from "../../repositories/airline.repository";
import IAirportRepository from "../../repositories/airport.repository";

// This decorator ensures that AirlinesService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class AirlineService implements IAirlineService {

    // Injecting the Helper and AirportsService service
    constructor(
        @inject(Helper) private helper: Helper,
        @inject("IAirlineRepository") private airlineRepository: IAirlineRepository,
        @inject('IAirportRepository') private airportRepository: IAirportRepository
    ) {
    }

    // Method to check if an airline exists by its code
    public async isAirlineExist(airlineCode: string): Promise<boolean> {
        return await this.airlineRepository.isAirlineExist(airlineCode);
    }

    // Method to get a specific airline by its code
    public async getAirlineId(airlineCode: string): Promise<string> {
        return await this.airlineRepository.getAirlineId(airlineCode);
    }

    // Method to get a specific airline airport id  by its code
    public async getAirlineAirportId(airlineCode: string): Promise<string> {
        return await this.airlineRepository.getAirlineAirportId(airlineCode);
    }

    // Method to get all airlines
    public async getAirlines(): Promise<IAirline[]> {
        return await this.airlineRepository.getAirlines();
    }

    // Method to get a specific airline by its code
    public async getAirline(airlineCode: string): Promise<IAirline> {
        return await this.airlineRepository.getAirline(airlineCode);
    }

    // Method to get a specific airline along with its associated airports by airline ID
    public async getAirlineAirports(airlineCode: string): Promise<IAirline[]> {
        return await this.airlineRepository.getAirlineAirports(airlineCode);

    }

    // Method to get all airlines along with its associated airports
    public async getAirlinesAirports(): Promise<IAirline[]> {
        return await this.airlineRepository.getAirlinesAirports();
    }

    // Method to create a new airline
    public async createAirline(airline: IAirline, dbSession: ClientSession | undefined): Promise<IAirline> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Retrieve the airport information from the airline object, which may be undefined
        let airport: IAirport | undefined = airline.airports;

        if (airport) {
            // Check if the airport already exists in the database using its icaoCode and  iataCode
            const isExist = await this.airportRepository.isAirportExist(airport.icaoCode, airport.iataCode);

            // If the airport does not exist, create a new airport entry in the database
            if (!isExist) {
                // Create the airport and assign it to the airline object
                airport = await this.airportRepository.createAirport(airport, dbSession);

                // map airport id to airline airportid
                airline.airportId = airport['_id'];
            } else {
                // Retrieve the airport using the icaoCode and iataCode and assign it to the airline object
                airline.airportId = await this.airportRepository.getAirportId(airport.icaoCode, airport.iataCode);
            }
        }

        // Create airline document
        const results: IAirline = await this.airlineRepository.createAirline(airline, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Updates an airline's information based on the provided airline code.
    public async updateAirline(airlineCode: string, airline: IAirline, dbSession: ClientSession | undefined): Promise<IAirline | RequestResponse> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Retrieve the airport information from the airline object, which may be undefined
        const airport: IAirport | undefined = airline.airports;

        if (airport) {
            // Check if the airport already exists in the database using its icaoCode and  iataCode
            const isExist = await this.airportRepository.isAirportExist(airport.icaoCode, airport.iataCode);

            // If the airport does not exist, throw error message
            if (!isExist) {
                // Abort the transaction if it was started in this call
                if (!inCarryTransact) {
                    await DbSession.Abort(dbSession);
                }
                throw { status: 400, message: `Provided ${airport.icaoCode} and ${airport.iataCode} airport does not exist` };
            }

            // Retrieve the airport ID using the icaoCode and  iataCode and assign it to the airline object
            airline.airportId = await this.airportRepository.getAirportId(airport.icaoCode, airport.iataCode);

            // Update airport object using the icaoCode and  iataCode in the database
            await this.airportRepository.updateAirport(airport.icaoCode, airport.iataCode, airport, dbSession);
        }

        const results: IAirline | RequestResponse = await this.airlineRepository.updateAirline(airlineCode, airline, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;

    }

    // Deletes an airline based on the provided airline code.
    public async deleteAirline(airlineCode: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Retrieve the airport id information from the database, which may be undefined
        const airportId: string = await this.getAirlineAirportId(airlineCode);

        // Check if the airportId exists in the database using its airportId
        if (!this.helper.IsNullValue(airportId)) {
            // Delete airport in the database using airport id
            await this.airportRepository.deleteAirportById(airportId, dbSession);
        }

        const results: boolean = await this.airlineRepository.deleteAirline(airlineCode, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes an airline based on the provided airline id.
    public async deleteAirlineById(_id: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: boolean = await this.airlineRepository.deleteAirlineById(_id, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Searches for airlines based on the provided search criteria.
    public async searchAirline(search: Search): Promise<SearchResults> {
        return await this.airlineRepository.searchAirline(search);
    }

    // Counts the number of airlines based on the provided search criteria.
    public async searchAirlineCount(search: Search): Promise<number> {
        return await this.airlineRepository.searchAirlineCount(search);
    }

    // Counts the total number of airlines in the collection.
    public async getAirlineCount(): Promise<number> {
        return await this.airlineRepository.getAirlineCount();
    }
}