import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetTripsService from "../../services/trip/get.trips.service";
import { ITrip } from "../../models/trip.model";

// Tags and route for the controller
@Tags("Trips")
@Route("trips/all")
// This decorator ensures that TripGetAllController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(TripGetAllController)
export class TripGetAllController extends Controller {
    // Injecting the IGetTripsService
    constructor(
        @inject("IGetTripsService") private getTripsService: IGetTripsService
    ) {
        super();
    }

    /**
     * Gets a Airline staff by their airlineCode
     * @returns ITrip[] | RequestResponse
     */
    @Get()
    public async getAllTrips(): Promise<ITrip[] | RequestResponse> {
        try {
            // Await the result of the get method from the getTripsService
            return await this.getTripsService.getAllTrips();
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
