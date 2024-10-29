import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import ICreatePersonTripService from "../../services/persontrip/post.persontrip.service";
import { IPersonTrip } from "../../models/persontrip.model";

@Tags("PersonTrips")
@Route("persontrip")
@provideSingleton(PersonTripCreateController)
export class PersonTripCreateController extends Controller {
    constructor(
        @inject("ICreatePersonTripService") private createPersonTripService: ICreatePersonTripService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'IPersonTrip[]'
     * @param body 
     * @returns RequestResponse
     */
    @Post()
    public async createPersonTrips(@Body() body: IPersonTrip[]): Promise<RequestResponse> {

        try {

            // Await the result of the create method from the createPersonTripService
            await this.createPersonTripService.createPersonTrips(body, undefined);

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
