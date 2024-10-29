import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { Search, SearchResults } from "../../models/search.model";
import ISearchPersonTripService from "../../services/persontrip/search.persontrip.service";

@Tags("PersonTrips")
@Route("persontrip")
@provideSingleton(PersonTripSearchController)
export class PersonTripSearchController extends Controller {
    constructor(
        @inject("ISearchPersonTripService") private searchPersonTripService: ISearchPersonTripService
    ) {
        super();
    }

    /**
     * Define a POST endpoint to search PersonTrips count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchCount method from the searchPersonTripService
            return await this.searchPersonTripService.searchCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to search PersonTrips
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async search(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the search method from the searchPersonTripService
            return await this.searchPersonTripService.search(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}

