import { Controller, Get, Tags, Route, Path } from "tsoa";
import RequestResponse from "../../utils/request.response";
import { provideSingleton, inject } from "../../utils/provideSingleton";
import { IAirline } from "../../models/airline.model";
import IGetAirlineStaffService from "../../services/airlinestaff/get.airlinestaff.service";
import { IPerson } from "../../models/person.model";

// Tags and route for the controller
@Tags("AirlineStaff")
@Route("airlinestaff")
// This decorator ensures that AirlineStaffGetController is a singleton,
// meaning only one instance of this controller will be created and used throughout the application.
@provideSingleton(AirlineStaffGetController)
export class AirlineStaffGetController extends Controller {
    // Injecting the GetAirlineService
    constructor(
        @inject("IGetAirlineStaffService") private getAirlineStaffService: IGetAirlineStaffService
    ) {
        super();
    }

    /**
     * Gets a Airline staff by their airlineCode
     * @param airlineCode 
     * @returns IPerson[] | RequestResponse
     */
    @Get("/:airlineCode/staff")
    public async getAirlineStaffs(@Path() airlineCode: string): Promise<IPerson[] | RequestResponse> {
        try {
            // Await the result of the get method from the getAirlineStaffService
            return await this.getAirlineStaffService.getAirlineStaffs(airlineCode);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }

    /**
     * Gets a Airlines by their userName
     * @param userName 
     * @returns IAirline[] | RequestResponse
     */
    @Get("/:userName/airlines")
    public async getStaffAirlines(@Path() userName: string): Promise<IAirline[] | RequestResponse> {
        try {
            // Await the result of the get method from the getAirlineStaffService
            return await this.getAirlineStaffService.getStaffAirlines(userName);
        } catch (ex: any) {
            // Set the status to 400 if an error occurs
            this.setStatus(400);
            // Return an error message
            return { status: 400, message: ex.message };
        }
    }
}
