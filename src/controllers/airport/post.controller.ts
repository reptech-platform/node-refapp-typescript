import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import ICreateAirportService from "../../services/airport/post.airport.service";
import { IAirport } from "../../models/airport.model";

@Tags("Airports")
@Route("airports")
@provideSingleton(AirportCreateController)
export class AirportCreateController extends Controller {
    constructor(
        @inject("ICreateAirportService") private createAirportService: ICreateAirportService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'IAirport'
     * @param body 
     * @returns IAirport | RequestResponse
     */
    @Post()
    public async createAirport(@Body() body: IAirport): Promise<IAirport | RequestResponse> {

        try {

            // Await the result of the createAirport method from the createAirportService
            await this.createAirportService.createAirport(body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added airport ${body.icaoCode} and ${body.iataCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }
}
