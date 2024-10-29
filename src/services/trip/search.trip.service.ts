import { inject, injectable } from "inversify";
import { Search, SearchResults } from "../../models/search.model";
import ISearchTripRepository from "../../repositories/trip/search.trip.repository";

// Interface for SearchTripService
export default interface ISearchTripService {
    // Searches for trips based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Counts the number of trips based on the provided search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchTripService implements ISearchTripService {
    // Injecting the TripRepository service
    constructor(
        @inject('ISearchTripRepository') private searchTripRepository: ISearchTripRepository
    ) { }

    // Searches for trips based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {
        return await this.searchTripRepository.search(search);
    }

    // Counts the number of trips based on the provided search criteria.
    public async searchCount(search: Search): Promise<number> {
        return await this.searchTripRepository.searchCount(search);
    }
}
