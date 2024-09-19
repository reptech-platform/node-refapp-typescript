import { Search, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IAirport } from "../models/airport.model";
import { IAirline } from "../models/airline.model";
import AirportRepository from "../repositories/airport.repository";

// This decorator ensures that AirportsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(AirportService)
export default class AirportService {

    // Injecting the Helper service
    constructor(
        // AirlinesService has a circular dependency
        @inject(AirportRepository) private airportRepository: AirportRepository
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
    public async createAirport(airport: IAirport): Promise<IAirport> {

        // Retrieve the airline information from the airport object, which may be undefined
        const airline: IAirline | undefined = airport.airlines;

        /* if (airline) {
            // Check if the airline already exists in the database using its airline code
            const isExist = await this.airlinesService.isAirlineExist(airline.airlineCode);

            // If the airline does not exist, create a new airline entry in the database
            if (!isExist) {
                await this.airlinesService.createAirline(airline);
            }

            // Retrieve the airline ID using the airline code and assign it to the airport object
            airport.airlineId = await this.airlinesService.getAirlineId(airline.airlineCode);
        } */

        return await this.airportRepository.createAirport(airport);
    }

    // Updates an airport's information based on the provided ICAO and IATA codes.
    public async updateAirport(icaoCode: string, iataCode: string, airport: IAirport): Promise<IAirport> {

        // Retrieve the airline information from the airport object, which may be undefined
        const airline: IAirline | undefined = airport.airlines;

        /* if (airline) {
            // Check if the airline already exists in the database using its airline code
            const isExist = await this.airlinesService.isAirlineExist(airline.airlineCode);

            // If the airline does not exist, throw error message
            if (!isExist) {
                throw { status: 400, message: `Provided ${airline.airlineCode} airline does not exist` };
            }

            // Retrieve the airline ID using the airline code and assign it to the airport object
            airport.airlineId = await this.airlinesService.getAirlineId(airline.airlineCode);

            // Update airport object using the icaoCode and  iataCode in the database
            await this.airlinesService.updateAirline(airline.airlineCode, airline);
        } */

        return await this.airportRepository.updateAirport(icaoCode, iataCode, airport);
    }

    // Deletes an airport based on the provided ICAO and IATA codes.
    public async deleteAirport(icaoCode: string, iataCode: string): Promise<boolean> {

        // Retrieve the airline id information from the database, which may be undefined
        const airlineId: string = await this.getAirportAirlineId(icaoCode, iataCode);

        // Check if the airlineId exists in the database using its airlineId
        /* if (!this.helper.IsNullValue(airlineId)) {
            // Delete airline in the database using airline id
            await this.airlinesService.deleteAirlineById(airlineId);
        } */

        return await this.airportRepository.deleteAirport(icaoCode, iataCode);
    }

    // Deletes an airport based on the provided airport id.
    public async deleteAirportById(_id: string): Promise<boolean> {
        return await this.airportRepository.deleteAirportById(_id);
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
}
