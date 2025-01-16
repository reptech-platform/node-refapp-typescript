import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeleteAirlineStaffService from "../../services/airlinestaff/delete.airlinestaff.service";

// Tags and route for the controller
@Tags("AirlineStaff")
@Route("airlinestaff")
// This decorator ensures that AirlineStaffDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirlineStaffDeleteController)
export class AirlineStaffDeleteController extends Controller {
    // Injecting the IDeleteAirlineStaffService
    constructor(
        @inject("IDeleteAirlineStaffService") private deleteAirlineStaffService: IDeleteAirlineStaffService
    ) {
        super();
    }

    /**
     * Delete a Airline staff by their airlineCode
     * @param airlineCode 
     * @returns RequestResponse
     */
    @Delete("/:airlineCode/:userName")
    public async deleteAirlineStaff(@Path() airlineCode: string, @Path() userName: string): Promise<RequestResponse> {
        try {
            // Await the result of the get method from the deleteAirlineStaffService
            await this.deleteAirlineStaffService.deleteAirlineStaff(airlineCode, userName, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Airline staff ${airlineCode} and ${userName} deleted successfuly.` };

        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
