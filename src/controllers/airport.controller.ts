import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../utils/request.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import AirportsService from "../services/airport.service";
import { IAirport } from "../models/airport.model";
import { Search, SearchResults } from "../models/search.model";

@Tags("Airports")
@Route("airports")
@provideSingleton(AirportsController)
export class AirportsController extends Controller {

    constructor(
        @inject(AirportsService) private airportsService: AirportsService) {
        super();
    }

    /**
     * Define a GET endpoint to get all airports
     * @returns IAirport[] | RequestResponse
     */
    @Get()
    public async getAirports(): Promise<IAirport[] | RequestResponse> {

        try {

            // Await the result of the getAirports method from the airportsService
            return await this.airportsService.getAirports();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint with path paramters icaoCode and iataCode
     * @param icaoCode
     * @param iataCode
     * @returns IAirport | RequestResponse
     */
    @Get("/:icaoCode/:iataCode")
    public async getAirport(@Path() icaoCode: string, @Path() iataCode: string): Promise<IAirport | RequestResponse> {

        try {

            // Validated the provided Airport is exist in the database or not
            const isExist = await this.airportsService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the getAirport method from the airportsService
            return await this.airportsService.getAirport(icaoCode, iataCode);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the body parameter 'IAirport'
     * @param body 
     * @returns IAirport | RequestResponse
     */
    @Post()
    public async createAirport(@Body() body: IAirport): Promise<IAirport | RequestResponse> {

        try {

            // Await the result of the createAirport method from the airportsService
            await this.airportsService.createAirport(body);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added airport ${body.icaoCode} and ${body.iataCode} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Define a PUT endpoint with path paramters icaoCode and iataCode
     * @param icaoCode
     * @param iataCode
     * @param body 
     * @returns IAirport | RequestResponse
     */
    @Put("/:icaoCode/:iataCode")
    public async updateAirport(@Path() icaoCode: string, @Path() iataCode: string, @Body() body: IAirport): Promise<IAirport | RequestResponse> {

        try {

            // Validated the provided Airport is exist in the database or not
            const isExist = await this.airportsService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the updateAirport method from the airportsService
            await this.airportsService.updateAirport(icaoCode, iataCode, body);

            return { status: 200, message: `Updated airport ${icaoCode} and ${iataCode} successfuly` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the path parameter icaoCode and iataCode
     * @param icaoCode 
     * @param iataCode 
     * @returns boolean | RequestResponse
     */
    @Delete("/:icaoCode/:iataCode")
    public async deleteAirport(@Path() icaoCode: string, @Path() iataCode: string): Promise<boolean | RequestResponse> {

        try {

            // Validated the provided Airport is exist in the database or not
            const isExist = await this.airportsService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the deleteAirport method from the airportsService
            await this.airportsService.deleteAirport(icaoCode, iataCode);

            return { status: 200, message: `Deleted airport ${icaoCode} and ${iataCode} successfuly` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint
     * @returns IAirport[] | RequestResponse
     */
    @Get("/airlines")
    public async getAriportsAirlines(): Promise<IAirport[] | RequestResponse> {

        try {

            // Await the result of the getAriportsAirlines method from the airportsService
            return await this.airportsService.getAriportsAirlines();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint with the path parameter airportid
     * @param id 
     * @returns IAirport | RequestResponse
     */
    @Get("/:icaoCode/:iataCode/airlines")
    public async getAriportAirlines(@Path() icaoCode: string, @Path() iataCode: string): Promise<IAirport | RequestResponse> {

        try {

            // Validated the provided Airport is exist in the database or not
            const isExist = await this.airportsService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the getAriportAirlines method from the airportsService
            return await this.airportsService.getAriportAirlines(icaoCode, iataCode);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint
     * @returns number | RequestResponse
     */
    @Get("/records/count")
    public async getAirportCount(): Promise<number | RequestResponse> {

        try {

            // Await the result of the getAirportCount method from the airportsService
            return await this.airportsService.getAirportCount();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the body parameter search
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchAirportCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchAirportCount method from the airportsService
            return await this.airportsService.searchAirportCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the body parameter search
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async searchAirport(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the searchAirport method from the airportsService
            return await this.airportsService.searchAirport(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
