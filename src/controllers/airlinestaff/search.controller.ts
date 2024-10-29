import { Controller, Body, Post, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { Search, SearchResults } from "../../models/search.model";
import ISearchAirlineStaffService from "../../services/airlinestaff/search.airlinestaff.service";

@Tags("AirlineStaffs")
@Route("airlinestaff")
@provideSingleton(AirlineStaffSearchController)
export class AirlineStaffSearchController extends Controller {
    constructor(
        @inject("ISearchAirlineStaffService") private searchAirlineStaffService: ISearchAirlineStaffService
    ) {
        super();
    }

    /**
     * Define a POST endpoint to search AirlineStaffs count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchCount method from the searchAirlineStaffService
            return await this.searchAirlineStaffService.searchCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to search AirlineStaffs
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async search(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the search method from the searchAirlineStaffService
            return await this.searchAirlineStaffService.search(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}

