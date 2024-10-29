import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeleteAirportService from "../../services/airport/delete.airport.service";

// Tags and route for the controller
@Tags("Airports")
@Route("airports")
// This decorator ensures that AirportDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirportDeleteController)
export class AirportDeleteController extends Controller {
    // Injecting the IDeleteAirportService
    constructor(
        @inject("IDeleteAirportService") private deleteAirportService: IDeleteAirportService
    ) {
        super();
    }

    /**
     * Define a Delete endpoint with path paramters icaoCode and iataCode
     * @param icaoCode
     * @param iataCode
     * @returns RequestResponse
     */
    @Delete("/:icaoCode/:iataCode")
    public async getAirport(@Path() icaoCode: string, @Path() iataCode: string): Promise<RequestResponse> {

        try {
            // Await the result of the getAirport method from the airportService
            await this.deleteAirportService.deleteAirport(icaoCode, iataCode, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Airport ${icaoCode} and ${iataCode} deleted successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

}
