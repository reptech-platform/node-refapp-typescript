import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetAirportService from "../../services/airport/get.airport.service";
import { IAirportRead } from "../../models/airport/airport.read.model";

// Tags and route for the controller
@Tags("Airports")
@Route("airports")
// This decorator ensures that AirportGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirportGetController)
export class AirportGetController extends Controller {
    // Injecting the GetAirportService
    constructor(
        @inject("IGetAirportService") private getAirportService: IGetAirportService
    ) {
        super();
    }

    /**
     * Define a GET endpoint with path paramters icaoCode and iataCode
     * @param icaoCode
     * @param iataCode
     * @returns IAirport | RequestResponse
     */
    @Get("/:icaoCode/:iataCode")
    public async getAirport(@Path() icaoCode: string, @Path() iataCode: string): Promise<IAirportRead | RequestResponse> {

        try {
            // Await the result of the getAirport method from the airportService
            return await this.getAirportService.getAirport(icaoCode, iataCode);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

}
