import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import ICreateAirlineService from "../../services/airline/post.airline.service";
import { IAirlineAdd } from "../../models/airline/airline.add.model";

@Tags("Airlines")
@Route("Airlines")
@provideSingleton(AirlineCreateController)
export class AirlineCreateController extends Controller {
    constructor(
        @inject("ICreateAirlineService") private createAirlineService: ICreateAirlineService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'IAirlineAdd'
     * @param body 
     * @returns 
     */
    @Post()
    public async createAirline(@Body() body: IAirlineAdd): Promise<RequestResponse> {

        try {

            // Await the result of the create method from the createAirlineService
            await this.createAirlineService.createAirline(body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added persion ${body.airlineCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }
}
