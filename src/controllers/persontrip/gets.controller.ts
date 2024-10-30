import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetPersonTripsService from "../../services/persontrip/get.persontrips.service";
import { IPersonTrip } from "../../models/persontrip.model";

// Tags and route for the controller
@Tags("PersonTrips")
@Route("persontrip/all")
// This decorator ensures that PersonTripGetAllController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(PersonTripGetAllController)
export class PersonTripGetAllController extends Controller {
    // Injecting the IGetPersonTripsService
    constructor(
        @inject("IGetPersonTripsService") private getPersonTripsService: IGetPersonTripsService
    ) {
        super();
    }

    /**
     * Gets all trips
     * @returns IPersonTrip[] | RequestResponse
     */
    @Get()
    public async getAllPersonsAndTrips(): Promise<IPersonTrip[] | RequestResponse> {
        try {
            // Await the result of the get method from the getPersonTripsService
            return await this.getPersonTripsService.getAllPersonsAndTrips();
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
