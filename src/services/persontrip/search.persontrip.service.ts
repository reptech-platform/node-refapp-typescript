import { inject, injectable } from "inversify";
import { Search, SearchResults } from "../../models/search.model";
import ISearchPersonTripRepository from "../../repositories/persontrip/search.persontrip.repository";

// Interface for SearchPersonTripService
export default interface ISearchPersonTripService {
    // Searches for PersonTrips based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Counts the number of PersonTrips based on the provided search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchPersonTripService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchPersonTripService implements ISearchPersonTripService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('ISearchPersonTripRepository') private searchPersonTripRepository: ISearchPersonTripRepository
    ) { }

    // Searches for PersonTrips based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {
        return await this.searchPersonTripRepository.search(search);
    }

    // Counts the number of PersonTrips based on the provided search criteria.
    public async searchCount(search: Search): Promise<number> {
        return await this.searchPersonTripRepository.searchCount(search);
    }
}
