import { Controller, Body, Get, Post, Delete, Tags, Route, Path } from "tsoa";
import { provideSingleton, inject } from "../utils/provideSingleton";
import RequestResponse from "../utils/request.response";
import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";
import AirlineService from "../services/airline.service";
import PersonService from "../services/person.service";
import AirportStaffService from "../services/airlinestaff.service";

/**
 * Airline and Staff mapping controller
 */
@Tags("AirlinesStaff")
@Route("/airlineStaff")
@provideSingleton(AirlineStaffController)
export class AirlineStaffController extends Controller {

    constructor(
        @inject(AirportStaffService) private airportStaffService: AirportStaffService,
        @inject(AirlineService) private airlineService: AirlineService,
        @inject(PersonService) private personService: PersonService
    ) {
        super();
    }

    // Airline mapping actions

    /**
     * Define a GET endpoint with the path parameter 'airlineCode'
     * @param airlineCode 
     * @returns IPerson[] | RequestResponse
     */
    @Get("/:airlineCode/staff")
    public async getArilineStaffs(@Path() airlineCode: string): Promise<IPerson[] | RequestResponse> {

        try {

            // Validated the provided airline is exist in the database or not
            const isExist = await this.airlineService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the getArilineStaffs method from the airportStaffService
            return await this.airportStaffService.getArilineStaffs(airlineCode);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the path parameter 'airlineCode' and 'IPerson' body
     * @param airlineCode
     * @param body 
     * @returns RequestResponse
     */
    @Post("/:airlineCode/staff")
    public async addAirlineStaffs(@Path() airlineCode: string, @Body() body: IPerson[]): Promise<RequestResponse> {

        try {

            // Validated the provided airline is exist in the database or not
            const isExist = await this.airlineService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the addOrUpadateAirlineStaffs method from the airportStaffService
            await this.airportStaffService.addOrUpadateAirlineStaffs(airlineCode, body);

            // Return an success response with the status and status message
            return { status: 200, message: `Added trips to airline ${airlineCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    // Staff mapping actions

    /**
     * Define a GET endpoint with the path parameter 'userName'
     * @param userName 
     * @returns RequestResponse
     */
    @Get("/:userName/airline")
    public async getStaffAirlines(@Path() userName: string): Promise<IAirline[] | RequestResponse> {

        try {

            // Validated the provided staff is exist in the database or not
            const isExist = await this.personService.isPersonExist(userName);

            if (!isExist) {
                // If no staff is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} staff does not exist` };
            }

            // Await the result of the getStaffArilines method from the airportStaffService
            return await this.airportStaffService.getStaffArilines(userName);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the path parameter 'userName' and 'IAirline' body
     * @param userName 
     * @param body 
     * @returns RequestResponse
     */
    @Post("/:userName/airline")
    public async addStaffAirlines(@Path() userName: string, @Body() body: IAirline[]): Promise<RequestResponse> {

        try {

            // Validated the provided staff is exist in the database or not
            const isExist = await this.personService.isPersonExist(userName);

            if (!isExist) {
                // If no staff is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} staff does not exist` };
            }

            // Await the result of the addOrUpdateStaffAirlines method from the airportStaffService
            await this.airportStaffService.addOrUpdateStaffAirlines(userName, body);

            // Return an success response with the status and status message
            return { status: 200, message: `Added airline to a staff ${userName} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the path parameter 'airlineCode' and 'userName'
     * @param airlineCode 
     * @param userName 
     * @returns RequestResponse
     */
    @Delete("/:airlineCode/:userName")
    public async deleteStaffAirline(@Path() airlineCode: string, @Path() userName: string): Promise<RequestResponse> {

        try {

            // Validated the provided staff and airline is mapped in the database or not
            const isExist = await this.airportStaffService.isAirlineAndStaffExist(airlineCode, userName);

            if (!isExist) {
                // If no staff and airline is mapped , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided airline ${airlineCode} and staff ${userName} relation does not exist` };
            }

            // Await the result of the deleteStaffStaff method from the airportStaffService
            await this.airportStaffService.deleteStaffStaff(airlineCode, userName);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted a airline ${airlineCode} and staff ${userName} successfuly.` };

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

}