import { Search, SearchResults } from "../models/search.model";
import { IAirport } from "../models/airport.model";
import { ClientSession } from "mongoose";

export default interface IAirportService {

    // Method to check if an airport exists by its ICAO and IATA codes
    isAirportExist(icaoCode: string, iataCode: string): Promise<boolean>;

    // Method to get a specific airport by its ICAO and IATA codes
    getAirportId(icaoCode: string, iataCode: string): Promise<string>;

    // Method to get a specific airport airline id by its ICAO and IATA codes
    getAirportAirlineId(icaoCode: string, iataCode: string): Promise<string>;

    // Method to get all airports
    getAirports(): Promise<IAirport[]>;

    // Method to get a specific airport by its ICAO and IATA codes
    getAirport(icaoCode: string, iataCode: string): Promise<IAirport>;

    // Method to get a specific airport along with its associated airlines by airport ID
    getAriportAirlines(icaoCode: string, iataCode: string): Promise<IAirport>;

    // Method to get all airports along with their associated airlines
    getAriportsAirlines(): Promise<IAirport[]>;

    // Method to create a new airport
    createAirport(airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport>;

    // Updates an airport's information based on the provided ICAO and IATA codes.
    updateAirport(icaoCode: string, iataCode: string, airport: IAirport, dbSession: ClientSession | undefined): Promise<IAirport>;

    // Deletes an airport based on the provided ICAO and IATA codes.
    deleteAirport(icaoCode: string, iataCode: string, dbSession: ClientSession | undefined): Promise<boolean>;

    // Deletes an airport based on the provided airport id.
    deleteAirportById(_id: string, dbSession: ClientSession | undefined): Promise<boolean>;

    // Searches for airports based on the provided search criteria.
    searchAirport(search: Search): Promise<SearchResults>;

    // Counts the number of airports based on the provided search criteria.
    searchAirportCount(search: Search): Promise<number>;

    // Counts the total number of airports in the collection.
    getAirportCount(): Promise<number>;
}
