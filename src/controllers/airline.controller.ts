import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import AirlineService from "../services/airline.service";
import RequestResponse from "../utils/request.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IAirline } from "../models/airline.model";
import { Search, SearchResults } from "../models/search.model";

@Tags("Airlines")
@Route("airlines")
@provideSingleton(AirlineController)
export class AirlineController extends Controller {

    constructor(@inject(AirlineService) private airlineService: AirlineService) {
        super();
    }

    /**
     * Define a GET endpoint to get all airlines
     * @returns IAirline[] | RequestResponse
     */
    @Get()
    public async getAirlines(): Promise<IAirline[] | RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlineService
            return await this.airlineService.getAirlines();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint with the path parameter 'airlineCode'
     * @param airlineCode 
     * @returns IAirline | RequestResponse
     */
    @Get("/:airlineCode")
    public async getAirline(@Path() airlineCode: string): Promise<IAirline | RequestResponse> {

        try {

            // Validated the provided Airline is exist in the database or not
            const isExist = await this.airlineService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the getAirline method from the airlineService
            return await this.airlineService.getAirline(airlineCode);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the body parameter 'IAirline'
     * @param body 
     * @returns RequestResponse
     */
    @Post()
    public async createAirline(@Body() body: IAirline): Promise<RequestResponse> {

        try {

            // Await the result of the createAirline method from the airlineService
            await this.airlineService.createAirline(body);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added airline ${body.airlineCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a PUT endpoint with the path parameter airlineCode and body parameter 'IAirline'
     * @param airlineCode 
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:airlineCode")
    public async updateAirline(@Path() airlineCode: string, @Body() body: IAirline): Promise<RequestResponse> {

        try {

            // Validated the provided Airline is exist in the database or not
            const isExist = await this.airlineService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the updateAirline method from the airlineService
            await this.airlineService.updateAirline(airlineCode, body);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated airline ${airlineCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the path parameter airlineCode
     * @param airlineCode
     * @returns RequestResponse
     */
    @Delete("/:airlineCode")
    public async deleteAirline(@Path() airlineCode: string): Promise<Boolean | RequestResponse> {

        try {

            // Validated the provided Airline is exist in the database or not
            const isExist = await this.airlineService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the getAirline method from the airlineService
            await this.airlineService.deleteAirline(airlineCode);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted airline ${airlineCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint to get airports for a airline
     * @param airlineCode 
     * @returns IAirline[]
     */
    @Get("/airports")
    public async getAirlinesAirports(): Promise<IAirline[] | RequestResponse> {

        try {

            // Await the result of the getAirlinesAirports method from the airlineService
            return await this.airlineService.getAirlinesAirports();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to get airports for a airline
     * @param airlineCode 
     * @returns IAirline[]
     */
    @Get("/:airlineCode/airports")
    public async getAirlineAirports(@Path() airlineCode: string): Promise<IAirline[]> {
        return await this.airlineService.getAirlineAirports(airlineCode);
    }

    /**
     * Define a GET endpoint to get airlines count
     * @returns number | RequestResponse
     */
    @Get("/records/count")
    public async getAirlinesCount(): Promise<number | RequestResponse> {

        try {

            // Await the result of the getAirlineCount method from the airlineService
            return await this.airlineService.getAirlineCount();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint to search airlines count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchAirlinesCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchAirlineCount method from the airlineService
            return await this.airlineService.searchAirlineCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a POST endpoint to search airlines
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async searchAirline(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the searchAirline method from the airlineService
            return await this.airlineService.searchAirline(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

}
