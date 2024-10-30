import { Controller, Body, Put, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IUpdateAirlineStaffService from "../../services/airlinestaff/put.airlinestaff.service";
import { IAirlineStaff } from "../../models/airlinestaff.model";

@Tags("AirlineStaff")
@Route("airlinestaff")
@provideSingleton(AirlineStaffUpdateController)
export class AirlineStaffUpdateController extends Controller {
    constructor(
        @inject("IUpdateAirlineStaffService") private updateAirlineStaffService: IUpdateAirlineStaffService
    ) {
        super();
    }

    /**
     * Define a PUT endpoint with the parameter 'airlineCode' and body parameter 'IAirlineStaff[]'
     * @param body 
     * @returns RequestResponse
     */
    @Put()
    public async updateAirlineStaffs(@Body() body: IAirlineStaff[]): Promise<RequestResponse> {

        try {

            // Await the result of the update method from the updateAirlineStaffService
            await this.updateAirlineStaffService.updateAirlineStaffs(body, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Airline staffs are update successfuly..` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
