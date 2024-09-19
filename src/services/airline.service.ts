import { provideSingleton, inject } from "../utils/provideSingleton";
import { IAirline } from "../models/airline.model";
import { IAirport } from "../models/airport.model";
import { Search, SearchResults } from "../models/search.model";
import RequestResponse from "../utils/request.response";
import AirlineRepository from "../repositories/airline.repository";

// This decorator ensures that AirlinesService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(AirlineService)
export default class AirlineService {

    // Injecting the Helper and AirportsService service
    constructor(
        // AirportsService has a circular dependency
        @inject(AirlineRepository) private airlineRepository: AirlineRepository) {
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
    public async createAirline(airline: IAirline): Promise<IAirline> {

        // Retrieve the airport information from the airline object, which may be undefined
        const airport: IAirport | undefined = airline.airports;

        /* if (airport) {
            // Check if the airport already exists in the database using its icaoCode and  iataCode
            const isExist = await this.airportsService.isAirportExist(airport.icaoCode, airport.iataCode);

            // If the airport does not exist, create a new airport entry in the database
            if (!isExist) {
                await this.airportsService.createAirport(airport);
            }

            // Retrieve the airport ID using the icaoCode and  iataCode and assign it to the airline object
            airline.airportId = await this.airportsService.getAirportId(airport.icaoCode, airport.iataCode);
        } */

        return await this.airlineRepository.createAirline(airline);
    }

    // Updates an airline's information based on the provided airline code.
    public async updateAirline(airlineCode: string, airline: IAirline): Promise<IAirline | RequestResponse> {

        // Retrieve the airport information from the airline object, which may be undefined
        const airport: IAirport | undefined = airline.airports;

        /* if (airport) {
            // Check if the airport already exists in the database using its icaoCode and  iataCode
            const isExist = await this.airportsService.isAirportExist(airport.icaoCode, airport.iataCode);

            // If the airport does not exist, throw error message
            if (!isExist) {
                throw { status: 400, message: `Provided ${airport.icaoCode} and ${airport.iataCode} airport does not exist` };
            }

            // Retrieve the airport ID using the icaoCode and  iataCode and assign it to the airline object
            airline.airportId = await this.airportsService.getAirportId(airport.icaoCode, airport.iataCode);

            // Update airport object using the icaoCode and  iataCode in the database
            await this.airportsService.updateAirport(airport.icaoCode, airport.iataCode, airport);
        } */

        return await this.airlineRepository.updateAirline(airlineCode, airline);
    }

    // Deletes an airline based on the provided airline code.
    public async deleteAirline(airlineCode: string): Promise<boolean> {

        // Retrieve the airport id information from the database, which may be undefined
        const airportId: string = await this.getAirlineAirportId(airlineCode);

        // Check if the airportId exists in the database using its airportId
        /* if (!this.helper.IsNullValue(airportId)) {
            // Delete airport in the database using airport id
            await this.airportsService.deleteAirportById(airportId);
        } */

        return await this.airlineRepository.deleteAirline(airlineCode);
    }

    // Deletes an airline based on the provided airline id.
    public async deleteAirlineById(_id: string): Promise<boolean> {
        return await this.airlineRepository.deleteAirlineById(_id);
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