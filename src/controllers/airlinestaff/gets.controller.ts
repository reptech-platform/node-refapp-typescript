import { Controller, Get, Tags, Route } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import IGetAirlinesStaffService from "../../services/airlinestaff/get.airlinestaffs.service";
import { IAirlineStaff } from "../../models/airlinestaff.model";

// Tags and route for the controller
@Tags("AirlineStaff")
@Route("airlinestaff/all")
// This decorator ensures that AirlineStaffGetAllController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirlineStaffGetAllController)
export class AirlineStaffGetAllController extends Controller {
    // Injecting the GetAirlineService
    constructor(
        @inject("IGetAirlinesStaffService") private getAirlinesStaffService: IGetAirlinesStaffService
    ) {
        super();
    }

    /**
     * Gets a Airline staff by their airlineCode
     * @returns IAirlineStaff[] | RequestResponse
     */
    @Get()
    public async getAirlineStaffs(): Promise<IAirlineStaff[] | RequestResponse> {
        try {
            // Await the result of the get method from the getAirlinesStaffService
            return await this.getAirlinesStaffService.getAirlinesAndStaffs();
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
