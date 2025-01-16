import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { ITrip } from "../../models/trip.model";
import IGetPersonTripService from "../../services/persontrip/get.persontrip.service";
import { IPerson } from "../../models/person.model";

// Tags and route for the controller
@Tags("PersonTrips")
@Route("persontrip")
// This decorator ensures that PersonTripGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(PersonTripGetController)
export class PersonTripGetController extends Controller {
    // Injecting the IGetPersonTripsService
    constructor(
        @inject("IGetPersonTripService") private getPersonTripService: IGetPersonTripService
    ) {
        super();
    }

    /**
     * Gets a trips for a traveller
     * @param userName 
     * @returns ITrip[] | RequestResponse
     */
    @Get("/:userName/trip")
    public async getPersonTrips(@Path() userName: string): Promise<ITrip[] | RequestResponse> {
        try {
            // Await the result of the get method from the getPersonTripService
            return await this.getPersonTripService.getPersonTrips(userName);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }

    /**
     * Gets a trips for a traveller
     * @param tripId 
     * @returns IPerson[] | RequestResponse
     */
    @Get("/:tripId/person")
    public async getTripTravellers(@Path() tripId: number): Promise<IPerson[] | RequestResponse> {
        try {
            // Await the result of the get method from the getPersonTripService
            return await this.getPersonTripService.getTripTravellers(tripId);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
