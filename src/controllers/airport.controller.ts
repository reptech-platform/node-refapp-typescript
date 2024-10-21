import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import RequestResponse from "../utils/request.response";
import { IAirport } from "../models/airport.model";
import { Search, SearchResults } from "../models/search.model";
import { inject } from "inversify";
import IAirportService from "../services/airport.interface";

@Tags("Airports")
@Route("airports")
export class AirportController extends Controller {

    constructor(
        @inject("IAirportService") private airportService: IAirportService) {
        super();
    }

    /**
     * Define a GET endpoint to get all airports
     * @returns IAirport[] | RequestResponse
     */
    @Get()
    public async getAirports(): Promise<IAirport[] | RequestResponse> {

        try {

            // Await the result of the getAirports method from the airportService
            return await this.airportService.getAirports();

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
            const isExist = await this.airportService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the getAirport method from the airportService
            return await this.airportService.getAirport(icaoCode, iataCode);

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

            // Await the result of the createAirport method from the airportService
            await this.airportService.createAirport(body, undefined);

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
            const isExist = await this.airportService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the updateAirport method from the airportService
            await this.airportService.updateAirport(icaoCode, iataCode, body, undefined);

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
            const isExist = await this.airportService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the deleteAirport method from the airportService
            await this.airportService.deleteAirport(icaoCode, iataCode, undefined);

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

            // Await the result of the getAriportsAirlines method from the airportService
            return await this.airportService.getAriportsAirlines();

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
            const isExist = await this.airportService.isAirportExist(icaoCode, iataCode);

            if (!isExist) {
                // If no airport is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${icaoCode} and ${iataCode} airport does not exist` };
            }

            // Await the result of the getAriportAirlines method from the airportService
            return await this.airportService.getAriportAirlines(icaoCode, iataCode);

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

            // Await the result of the getAirportCount method from the airportService
            return await this.airportService.getAirportCount();

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

            // Await the result of the searchAirportCount method from the airportService
            return await this.airportService.searchAirportCount(body);

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

            // Await the result of the searchAirport method from the airportService
            return await this.airportService.searchAirport(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
