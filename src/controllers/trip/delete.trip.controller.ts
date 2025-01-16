import { Controller, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IDeleteTripService from "../../services/trip/delete.trip.service";
import { ITrip } from "../../models/trip.model";

// Tags and route for the controller
@Tags("Trips")
@Route("trips")
// This decorator ensures that TripDeleteController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(TripDeleteController)
export class TripDeleteController extends Controller {
    // Injecting the IDeleteTripService
    constructor(
        @inject("IDeleteTripService") private deleteTripService: IDeleteTripService
    ) {
        super();
    }

    /**
     * Delete a trip by their tripId
     * @param tripId 
     * @returns RequestResponse
     */
    @Delete("/:tripId")
    public async getTrip(@Path() tripId: number): Promise<ITrip | RequestResponse> {
        try {
            // Await the result of the get method from the deleteTripService
            await this.deleteTripService.deleteTrip(tripId, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Record deleted successfuly.` };
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
