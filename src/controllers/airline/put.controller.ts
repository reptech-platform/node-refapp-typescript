import { Controller, Body, Put, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IUpdateAirlineService from "../../services/airline/put.airline.service";
import { IAirlineUpdate } from "../../models/airline/airline.update.model";

@Tags("Airlines")
@Route("Airlines")
@provideSingleton(AirlineUpdateController)
export class AirlineUpdateController extends Controller {
    constructor(
        @inject("IUpdateAirlineService") private updateAirlineService: IUpdateAirlineService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with the parameter 'airlineCode' and body parameter 'IAirline'
     * @param airlineCode 
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:airlineCode")
    public async updateAirline(@Path() airlineCode: string, @Body() body: IAirlineUpdate): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updateAirlineService
            await this.updateAirlineService.updateAirline(airlineCode, body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated Airline ${airlineCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}