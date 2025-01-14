import { Controller, Body, Put, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IUpdatePersonTripService from "../../services/persontrip/put.persontrip.service";
import { IPersonTrip } from "../../models/persontrip.model";

@Tags("PersonTrips")
@Route("persontrip")
@provideSingleton(PersonTripUpdateController)
export class PersonTripUpdateController extends Controller {
    constructor(
        @inject("IUpdatePersonTripService") private updatePersonTripService: IUpdatePersonTripService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with the body parameter 'IPersonTrip[]'
     * @param body 
     * @returns RequestResponse
     */
    @Put()
    public async updateAirlineStaff(@Body() body: IPersonTrip[]): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updatePersonTripService
            await this.updatePersonTripService.updatePersonTrips(body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated PersonTrip successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
