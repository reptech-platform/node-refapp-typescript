import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetTripService from "../../services/trip/get.trip.service";
import { ITrip } from "../../models/trip.model";

// Tags and route for the controller
@Tags("Trips")
@Route("trips")
// This decorator ensures that TripGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(TripGetController)
export class TripGetController extends Controller {
    // Injecting the IGetTripService
    constructor(
        @inject("IGetTripService") private getTripService: IGetTripService
    ) {
        super();
    }

    /**
     * Gets a trip by their tripId
     * @param tripId 
     * @returns ITrip | RequestResponse
     */
    @Get("/:tripId")
    public async getTrip(@Path() tripId: number): Promise<ITrip | RequestResponse> {
        try {
            // Await the result of the get method from the getTripService
            return await this.getTripService.getTrip(tripId);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
