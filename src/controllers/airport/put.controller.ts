import { Controller, Body, Put, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IUpdateAirportService from "../../services/airport/put.airport.service";
import { IAirport } from "../../models/airport.model";

@Tags("Airports")
@Route("airports")
@provideSingleton(AirportUpdateController)
export class AirportUpdateController extends Controller {
    constructor(
        @inject("IUpdateAirportService") private updateAirportService: IUpdateAirportService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with path paramters icaoCode and iataCode
     * @param icaoCode
     * @param iataCode
     * @param body 
     * @returns IAirport | RequestResponse
     */
    @Put("/:icaoCode/:iataCode")
    public async updateAirport(@Path() icaoCode: string, @Path() iataCode: string, @Body() body: IAirport): Promise<IAirport | RequestResponse> {

        try {
            // Await the result of the updateAirport method from the updateAirportService
            await this.updateAirportService.updateAirport(icaoCode, iataCode, body, undefined);

            // Return an success response with the status and status message
            return { status: 201, message: `Airport ${icaoCode} and ${iataCode} updated successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

}
