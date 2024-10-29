import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import ICreateTripService from "../../services/trip/post.trip.service";
import { ITrip } from "../../models/trip.model";

@Tags("Trips")
@Route("trips")
@provideSingleton(TripCreateController)
export class TripCreateController extends Controller {
    constructor(
        @inject("ICreateTripService") private createTripService: ICreateTripService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'ITrip'
     * @param body 
     * @returns RequestResponse
     */
    @Post()
    public async createTrip(@Body() body: ITrip): Promise<RequestResponse> {

        try {

            // Await the result of the create method from the createTripService
            await this.createTripService.createTrip(body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added airline staffs successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }
}
