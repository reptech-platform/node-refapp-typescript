import { Controller, Body, Get, Post, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../utils/request.response";
import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";
import IAirlineService from "../services/airline.interface";
import IPersonService from "../services/person.interface";
import { inject } from "inversify";
import IAirlineStaffService from "src/services/airlinestaff.interface";

/**
 * Airline and Staff mapping controller
 */
@Tags("AirlinesStaff")
@Route("/airlineStaff")
export class AirlineStaffController extends Controller {

    constructor(
        @inject("IAirlineStaffService") private airlineStaffService: IAirlineStaffService,
        @inject("IAirlineService") private airlineService: IAirlineService,
        @inject("IPersonService") private personService: IPersonService
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

            // Await the result of the getArilineStaffs method from the airlineStaffService
            return await this.airlineStaffService.getArilineStaffs(airlineCode);

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

            // Await the result of the addOrUpadateAirlineStaffs method from the airlineStaffService
            await this.airlineStaffService.addOrUpadateAirlineStaffs(airlineCode, body, undefined);

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

            // Await the result of the getStaffArilines method from the airlineStaffService
            return await this.airlineStaffService.getStaffArilines(userName);

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

            // Await the result of the addOrUpdateStaffAirlines method from the airlineStaffService
            await this.airlineStaffService.addOrUpdateStaffAirlines(userName, body, undefined);

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
            const isExist = await this.airlineStaffService.isAirlineAndStaffExist(airlineCode, userName);

            if (!isExist) {
                // If no staff and airline is mapped , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided airline ${airlineCode} and staff ${userName} relation does not exist` };
            }

            // Await the result of the deleteStaffStaff method from the airlineStaffService
            await this.airlineStaffService.deleteStaffStaff(airlineCode, userName, undefined);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted a airline ${airlineCode} and staff ${userName} successfuly.` };

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

}