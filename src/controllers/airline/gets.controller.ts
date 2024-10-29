import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IAirline } from "../../models/airline.model";
import IGetAirlinesService from "../../services/airline/get.airlines.service";

@Tags("Airlines")
@Route("airlines/all")
@provideSingleton(AirlineGetAllController)
export class AirlineGetAllController extends Controller {
    constructor(
        @inject("IGetAirlinesService") private getAirlinesService: IGetAirlinesService
    ) {
        super();
    }

    /**
     * Define a GET endpoint to get all Airlines
     * @returns IAirline[] | RequestResponse
     */
    @Get()
    public async getAirlines(): Promise<IAirline[] | RequestResponse> {

        try {

            // Await the result of the gets method from the getAirlinesService
            return await this.getAirlinesService.getAirlines();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
