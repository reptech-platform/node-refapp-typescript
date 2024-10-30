import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeletePersonTripService from "../../services/persontrip/delete.persontrip.service";

// Tags and route for the controller
@Tags("PersonTrips")
@Route("persontrip")
// This decorator ensures that PersonTripDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(PersonTripDeleteController)
export class PersonTripDeleteController extends Controller {
    // Injecting the IDeletePersonTripService
    constructor(
        @inject("IDeletePersonTripService") private deletePersonTripService: IDeletePersonTripService
    ) {
        super();
    }

    /**
     * Delete a trips for a traveller
     * @param userName 
     * @param tripId
     * @returns RequestResponse
     */
    @Delete("/:userName/:tripId")
    public async getPersonTrips(@Path() userName: string, @Path() tripId: number): Promise<RequestResponse> {
        try {
            // Await the result of the get method from the deletePersonTripService
            await this.deletePersonTripService.deletePersonTrip(userName, tripId, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Person trip ${userName} and ${tripId} deleted successfuly.` };

        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
