import { inject, injectable } from "inversify";
import { Search, SearchResults } from "../../models/search.model";
import ISearchAirportRepository from "../../repositories/airport/search.airport.repository";

// Interface for SearchAirportService
export default interface ISearchAirportService {
    // Searches for Airports based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Counts the number of Airports based on the provided search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchAirportService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchAirportService implements ISearchAirportService {
    // Injecting the AirportRepository service
    constructor(
        @inject('ISearchAirportRepository') private searchAirportRepository: ISearchAirportRepository
    ) { }

    // Searches for Airports based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {
        return await this.searchAirportRepository.search(search);
    }

    // Counts the number of Airports based on the provided search criteria.
    public async searchCount(search: Search): Promise<number> {
        return await this.searchAirportRepository.searchCount(search);
    }
}
