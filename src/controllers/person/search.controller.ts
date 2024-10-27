import { Controller, Body, Post, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { Search, SearchResults } from "../../models/search.model";
import ISearchPersonService from "../../services/person/search.person.service";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonSearchController)
export class PersonSearchController extends Controller {
    constructor(
        @inject("ISearchPersonService") private searchPersonService: ISearchPersonService
    ) {
        super();
    }

    /**
     * Define a POST endpoint to search persons count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchCount method from the searchPersonService
            return await this.searchPersonService.searchCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to search persons
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async search(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the search method from the searchPersonService
            return await this.searchPersonService.search(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}

