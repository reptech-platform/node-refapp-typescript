import { Controller, Body, Post, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import ICreateAirlineStaffService from "../../services/airlinestaff/post.airlinestaff.service";
import { IAirlineStaff } from "../../models/airlinestaff.model";

@Tags("AirlineStaff")
@Route("airlinestaff")
@provideSingleton(AirlineStaffCreateController)
export class AirlineStaffCreateController extends Controller {
    constructor(
        @inject("ICreateAirlineStaffService") private createAirlineStaffService: ICreateAirlineStaffService
    ) {
        super();
    }

    /**
     * Define a POST endpoint with the body parameter 'IAirlineStaff[]'
     * @param body 
     * @returns RequestResponse
     */
    @Post()
    public async createAirlineStaffs(@Body() body: IAirlineStaff[]): Promise<RequestResponse> {

        try {

            // Await the result of the create method from the createAirlineStaffService
            await this.createAirlineStaffService.createAirlineStaffs(body, undefined);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Airline staffs are added successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }
}
