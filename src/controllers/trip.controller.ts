import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import TripsService from "../services/trip.service";
import RequestResponse from "../utils/request.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { ITrip } from "../models/trip.model";
import { Search, SearchResults } from "../models/search.model";

@Tags("Trips")
@Route("/trips")
@provideSingleton(TripsController)
export class TripsController extends Controller {

    constructor(
        @inject(TripsService) private tripsService: TripsService) {
        super();
    }

    /**
     * Define a GET endpoint to get all Get all list of trips
     * @returns ITrip[] | RequestResponse
     */
    @Get()
    public async getTrips(): Promise<ITrip[] | RequestResponse> {

        try {

            // Await the result of the getTrips method from the tripsService
            return await this.tripsService.getTrips();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint with the path parameter 'tripId'
     * @param tripId 
     * @returns ITrip | RequestResponse
     */
    @Get("/:tripId")
    public async getTrip(@Path() tripId: number): Promise<ITrip | RequestResponse> {

        try {

            // Validated the provided tripId is exist in the database or not
            const isExist = await this.tripsService.isTripExist(tripId);

            if (!isExist) {
                // If no trip is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${tripId} trip does not exist` };
            }

            // Await the result of the getTrip method from the tripsService
            return await this.tripsService.getTrip(tripId);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the body parameter 'ITrip'
     * @param body 
     * @returns RequestResponse
     */
    @Post()
    public async createTrip(@Body() body: ITrip): Promise<RequestResponse> {

        try {

            // Await the result of the createTrip method from the tripsService
            await this.tripsService.createTrip(body);

            // set the HTTP status to 201 (Created)
            this.setStatus(201);

            // Return an success response with the status and status message
            return { status: 201, message: `Added trip ${body.tripId} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a PUT endpoint with the parameter 'tripId' and body parameter 'ITrip'
     * @param tripId 
     * @param body 
     * @returns RequestResponse
     */
    @Put("/:tripId")
    public async updateTrip(@Path() tripId: number, @Body() body: ITrip): Promise<RequestResponse> {

        try {

            // Validated the provided tripId is exist in the database or not
            const isExist = await this.tripsService.isTripExist(tripId);

            if (!isExist) {
                // If no trip is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${tripId} trip does not exist` };
            }

            // Await the result of the updateTrip method from the tripsService
            await this.tripsService.updateTrip(tripId, body);

            // Return an success response with the status and status message
            return { status: 200, message: `Updated trip ${tripId} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the parameter 'tripId'
     * @param tripId 
     * @returns RequestResponse
     */
    @Delete("/:tripId")
    public async deleteTrip(@Path() tripId: number): Promise<RequestResponse> {

        try {

            // Validated the provided tripId is exist in the database or not
            const isExist = await this.tripsService.isTripExist(tripId);

            if (!isExist) {
                // If no trip is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${tripId} trip does not exist` };
            }

            // Await the result of the deleteTrip method from the tripsService
            await this.tripsService.deleteTrip(tripId);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted trip ${tripId} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a GET endpoint to get trips count
     * @returns number | RequestResponse
     */
    @Get("/records/count")
    public async getTripCount(): Promise<number | RequestResponse> {

        try {

            // Await the result of the getTripCount method from the tripsService
            return await this.tripsService.getTripCount();

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint to search persons count
     * @param body 
     * @returns number | RequestResponse
     */
    @Post("/search/count")
    public async searchTripCount(@Body() body: Search): Promise<number | RequestResponse> {

        try {

            // Await the result of the searchTripCount method from the tripsService
            return await this.tripsService.searchTripCount(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint to search trips
     * @param body 
     * @returns SearchResults | RequestResponse
     */
    @Post("/search")
    public async searchTrip(@Body() body: Search): Promise<SearchResults | RequestResponse> {

        try {

            // Await the result of the searchTrip method from the tripsService
            return await this.tripsService.searchTrip(body);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }
}
