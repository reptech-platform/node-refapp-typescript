import { Controller, Body, Put, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IUpdateTripService from "../../services/trip/put.trip.service";
import { ITrip } from "../../models/trip.model";

@Tags("Trips")
@Route("trips")
@provideSingleton(TripUpdateController)
export class TripUpdateController extends Controller {
    constructor(
        @inject("IUpdateTripService") private updateTripService: IUpdateTripService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with the parameter 'airlineCode' and body parameter 'ITrip[]'
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:tripId")
    public async updateTrip(@Path() tripId: number, @Body() body: ITrip): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updateTripService
            await this.updateTripService.updateTrip(tripId, body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated Trip successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
