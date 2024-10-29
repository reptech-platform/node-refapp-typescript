import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { ITrip } from "../../models/trip.model";
import IGetPersonTripsService from "../../services/persontrip/get.persontrips.service";
import { IPerson } from "../../models/person.model";

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
     * @returns ITrip[] | RequestResponse
     */
    @Get("/trips")
    public async getAllPersonTrips(): Promise<ITrip[] | RequestResponse> {
        try {
            // Await the result of the get method from the setAirlinesStaffService
            return await this.getPersonTripsService.getAllPersonTrips();
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }

    /**
     * Gets all travellers
     * @returns IPerson[] | RequestResponse
     */
    @Get("/persons")
    public async getAllTripTravellers(): Promise<IPerson[] | RequestResponse> {
        try {
            // Await the result of the get method from the setAirlinesStaffService
            return await this.getPersonTripsService.getAllTripTravellers();
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
