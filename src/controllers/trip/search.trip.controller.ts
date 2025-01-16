import { Controller, Body, Post, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { Search, SearchResults } from "../../models/search.model";
import ISearchTripService from "../../services/trip/search.trip.service";

@Tags("Trips")
@Route("trips")
@provideSingleton(TripSearchController)
export class TripSearchController extends Controller {
    constructor(
        @inject("ISearchTripService") private searchTripService: ISearchTripService
    ) {
        super();
    }

    /**
     * Define a POST endpoint to search Trips count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchCount method from the searchTripService
            return await this.searchTripService.searchCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to search Trips
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async search(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the search method from the searchTripService
            return await this.searchTripService.search(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}

