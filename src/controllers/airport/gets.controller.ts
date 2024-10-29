import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IAirport } from "../../models/airport.model";
import IGetAirportsService from "../../services/airport/get.airports.service";

@Tags("Airports")
@Route("airports/all")
@provideSingleton(AirportGetAllController)
export class AirportGetAllController extends Controller {
    constructor(
        @inject("IGetAirportsService") private getAirportsService: IGetAirportsService
    ) {
        super();
    }

    /**
     * Define a GET endpoint to get all Airports
     * @returns IAirport[] | RequestResponse
     */
    @Get()
    public async getAirports(): Promise<IAirport[] | RequestResponse> {

        try {

            // Await the result of the gets method from the getAirportsService
            return await this.getAirportsService.getAirports();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
