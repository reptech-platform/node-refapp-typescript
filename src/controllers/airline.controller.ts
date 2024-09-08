import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import AirportsService from "../services/airport.service";
import AirlinesService from "../services/airline.service";
import Helper from "../utils/helper.utils";
import RequestResponse from "../utils/request.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IAirline } from "../models/airline.model";
import { IAirport } from "../models/airport.model";
import { Search, SearchResults } from "../models/search.model";

@Tags("Airlines")
@Route("airlines")
@provideSingleton(AirlinesController)
export class AirlinesController extends Controller {

    constructor(
        @inject(AirportsService) private airportsService: AirportsService,
        @inject(AirlinesService) private airlinesService: AirlinesService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    /**
     * Define a GET endpoint to get all airlines
     * @returns IAirline[] | RequestResponse
     */
    @Get()
    public async getAirlines(): Promise<IAirline[] | RequestResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airlinesService.getAirlines();

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
            const isExist = await this.airlinesService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the getAirline method from the airlinesService
            return await this.airlinesService.getAirline(airlineCode);

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

            let airline: IAirline = body;

            /*const airport: IAirport | undefined = airline.airports;
    
            if (airport) {
                const tmp = await this.airportsService.createAirport(airport);
                airline.airports = tmp;
            }*/

            await this.airlinesService.createAirline(airline);

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
            const isExist = await this.airlinesService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the getAirline method from the airlinesService
            await this.airlinesService.updateAirline(airlineCode, body);

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
            const isExist = await this.airlinesService.isAirlineExist(airlineCode);

            if (!isExist) {
                // If no airline is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${airlineCode} airline does not exist` };
            }

            // Await the result of the getAirline method from the airlinesService
            await this.airlinesService.deleteAirline(airlineCode);

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
     * Define a GET endpoint to get airlines count
     * @returns number | RequestResponse
     */
    @Get("/records/count")
    public async getAirlinesCount(): Promise<number | RequestResponse> {

        try {

            // Await the result of the getAirline method from the airlinesService
            return await this.airlinesService.getAirlineCount();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /* @Post("/search/count")
    public async searchAirlinesCount(@Body() body: Search): Promise<number> {
        return await this.airlinesService.searchAirlineCount(body);
    }

    @Post("/search")
    public async searchAirline(@Body() body: Search): Promise<SearchResults> {
        return await this.airlinesService.searchAirline(body);
    }

    @Get("/airports")
    public async getAirlinesAirports(): Promise<IAirline[]> {
        return await this.airlinesService.getAirlinesAirports();
    }

    @Get("/:id/airports")
    public async getAirlineAirports(@Path() id: string): Promise<IAirline> {
        return await this.airlinesService.getAirlineAirports(id);
    } */

}
