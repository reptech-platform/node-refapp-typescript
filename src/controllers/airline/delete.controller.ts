import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeleteAirlineService from "../../services/airline/delete.airline.service";

// Tags and route for the controller
@Tags("Airlines")
@Route("airlines")
// This decorator ensures that AirlineDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirlineDeleteController)
export class AirlineDeleteController extends Controller {
    // Injecting the IDeleteAirlineService
    constructor(
        @inject("IDeleteAirlineService") private deleteAirlineService: IDeleteAirlineService
    ) {
        super();
    }

    /**
     * Delete a Airline by their airlineCode
     * @param airlineCode 
     * @returns IAirline | RequestResponse
     */
    @Delete("/:airlineCode")
    public async deleteAirline(@Path() airlineCode: string): Promise<RequestResponse> {
        try {
            // Await the result of the get method from the deleteAirlineService
            await this.deleteAirlineService.deleteAirline(airlineCode, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added persion ${airlineCode} successfuly.` };

        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
