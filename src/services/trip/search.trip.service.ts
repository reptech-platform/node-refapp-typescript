import { inject, injectable } from "inversify";
import { Search, SearchResults } from "../../models/search.model";
import ISearchPersonRepository from "../../repositories/person/search.person.repository";

// Interface for SearchPersonService
export default interface ISearchPersonService {
    // Searches for persons based on the provided search criteria.
    search(search: Search): Promise<SearchResults>;

    // Counts the number of persons based on the provided search criteria.
    searchCount(search: Search): Promise<number>;
}

// This decorator ensures that SearchPersonService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class SearchPersonService implements ISearchPersonService {
    // Injecting the PersonRepository service
    constructor(
        @inject('ISearchPersonRepository') private searchPersonRepository: ISearchPersonRepository
    ) { }

    // Searches for persons based on the provided search criteria.
    public async search(search: Search): Promise<SearchResults> {
        return await this.searchPersonRepository.search(search);
    }

    // Counts the number of persons based on the provided search criteria.
    public async searchCount(search: Search): Promise<number> {
        return await this.searchPersonRepository.searchCount(search);
    }
}
