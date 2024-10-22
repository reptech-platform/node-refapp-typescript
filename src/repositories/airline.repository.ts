import { ClientSession } from "mongoose";
import { IAirline } from "../models/airline.model";
import RequestResponse from "../utils/request.response";
import { Search, SearchResults } from "../models/search.model";

// This decorator ensures that AirlinesRepository is a singleton, meaning only one instance of this service will be created and used throughout the application.
export default interface IAirlineRepository {

    // Method to check if an airline exists by its code
    isAirlineExist(airlineCode: string): Promise<boolean>;

    // Method to get a specific airline by its code
    getAirlineId(airlineCode: string): Promise<string>;

    // Method to get a specific airline airport id  by its code
    getAirlineAirportId(airlineCode: string): Promise<string>;

    // Method to get all airlines
    getAirlines(): Promise<IAirline[]>;

    // Method to get a specific airline by its code
    getAirline(airlineCode: string): Promise<IAirline>;

    // Method to get a specific airline along with its associated airports by airline ID
    getAirlineAirports(airlineCode: string): Promise<IAirline[]>;

    // Method to get all airlines along with its associated airports
    getAirlinesAirports(): Promise<IAirline[]>;

    // Method to create a new airline
    createAirline(airline: IAirline, session: ClientSession | undefined): Promise<IAirline>;

    // Updates an airline's information based on the provided airline code.
    updateAirline(airlineCode: string, airline: IAirline, session: ClientSession | undefined): Promise<IAirline | RequestResponse>;

    // Deletes an airline based on the provided airline code.
    deleteAirline(airlineCode: string, session: ClientSession | undefined): Promise<boolean>;

    // Deletes an airline based on the provided airline id.
    deleteAirlineById(_id: string, session: ClientSession | undefined): Promise<boolean>;

    // Searches for airlines based on the provided search criteria.
    searchAirline(search: Search): Promise<SearchResults>;

    // Counts the number of airlines based on the provided search criteria.
    searchAirlineCount(search: Search): Promise<number>;

    // Counts the total number of airlines in the collection.
    getAirlineCount(): Promise<number>;
}