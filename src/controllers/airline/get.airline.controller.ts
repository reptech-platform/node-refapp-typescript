import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetAirlineService from "../../services/airline/get.airline.service";
import { IAirline } from "../../models/airline.model";

// Tags and route for the controller
@Tags("Airlines")
@Route("airlines")
// This decorator ensures that AirlineGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirlineGetController)
export class AirlineGetController extends Controller {
    // Injecting the GetAirlineService
    constructor(
        @inject("IGetAirlineService") private getAirlineService: IGetAirlineService
    ) {
        super();
    }

    /**
     * Gets a Airline by their airlineCode
     * @param airlineCode 
     * @returns IAirline | RequestResponse
     */
    @Get("/:airlineCode")
    public async getAirline(@Path() airlineCode: string): Promise<IAirline | RequestResponse> {
        try {
            // Await the result of the get method from the getAirlineService
            return await this.getAirlineService.getAirline(airlineCode);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
