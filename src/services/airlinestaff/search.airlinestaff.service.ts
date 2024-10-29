import { inject, injectable } from "inversify";
import { Search, SearchResults } from "../../models/search.model";
import ISearchAirlineRepository from "../../repositories/airline/search.airline.repository";

// Interface for SearchAirlineStaffService
export default interface ISearchAirlineStaffService {
    // Searches for AirlineStaffs based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Counts the number of AirlineStaffs based on the provided search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchAirlineService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchAirlineStaffService implements ISearchAirlineStaffService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('ISearchAirlineRepository') private searchAirlineRepository: ISearchAirlineRepository
    ) { }

    // Searches for AirlineStaffs based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {
        return await this.searchAirlineRepository.search(search);
    }

    // Counts the number of AirlineStaffs based on the provided search criteria.
    public async searchCount(search: Search): Promise<number> {
        return await this.searchAirlineRepository.searchCount(search);
    }
}
