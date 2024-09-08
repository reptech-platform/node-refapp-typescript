import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path } from "tsoa";
import { provideSingleton, inject } from "../utils/provideSingleton";
import RequestResponse from "../utils/request.response";
import PersonTripsService from "../services/persontrip.service";
import TripsService from "../services/trip.service";
import PersonsService from "../services/person.service";
import { IPerson } from "../models/person.model";
import { ITrip } from "../models/trip.model";

/**
 * Person and Trip mapping controller
 */
@Tags("Trips")
@Route("/persontrip")
@provideSingleton(PersonTripController)
export class PersonTripController extends Controller {

    constructor(
        @inject(PersonTripsService) private personTripsService: PersonTripsService,
        @inject(PersonsService) private personsService: PersonsService,
        @inject(TripsService) private tripsService: TripsService
    ) {
        super();
    }

    // Person mapping actions

    /**
     * Define a GET endpoint with the path parameter 'userName'
     * Get all trips for a person
     * @param userName 
     * @returns ITrip[] | RequestResponse
     */
    @Get("/person/:userName")
    public async getPersonTrips(@Path() userName: string): Promise<ITrip[] | RequestResponse> {

        try {

            // Validated the provided person is exist in the database or not
            const isExist = await this.personsService.isPersonExist(userName);

            if (!isExist) {
                // If no person is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} person does not exist` };
            }

            // Call the getPersonTrips method from personsService with the provided userName
            // Await the result and return it
            return await this.personTripsService.getPersonTrips(userName);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the path parameter 'userName' and 'Trip' body
     * Add trips to the existing persion
     * @param userName
     * @param body 
     * @returns RequestResponse
     */
    @Post("/person/:userName")
    public async addPersonTrips(@Path() userName: string, @Body() body: ITrip[]): Promise<RequestResponse> {

        try {

            // Validated the provided person is exist in the database or not
            const isExist = await this.personsService.isPersonExist(userName);

            if (!isExist) {
                // If no person is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} person does not exist` };
            }

            // Call the addPersonTrips method from personsService with the provided userName and list of trips
            // Await the result and return it
            await this.personTripsService.addPersonTrips(userName, body);

            // Return an success response with the status and status message
            return { status: 200, message: `Added trips to person ${userName} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the path parameter 'userName' and 'tripId'
     * Delete a trip from a person
     * @param userName 
     * @param tripId 
     * @returns RequestResponse
     */
    @Delete("/person/:userName/:tripId")
    public async deletePersonTrip(@Path() userName: string, @Path() tripId: number): Promise<RequestResponse> {

        try {

            // Validated the provided person and trip is mapped in the database or not
            const isExist = await this.personTripsService.isPersonAndTripExist(userName, tripId);

            if (!isExist) {
                // If no person and trip is mapped , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} and ${tripId} relation does not exist` };
            }

            // Call the deletePersonTrip method from personsService with the provided tripId
            // Await the result and return it
            await this.personTripsService.deletePersonTrip(tripId);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted a trip for a person ${userName} successfuly.` };

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    // Trip mapping actions

    /**
     * Define a GET endpoint with the path parameter 'tripId'
     * Get all travellers for a trip
     * @param tripId 
     * @returns IPerson[] | RequestResponse
     */
    @Get("/trip/:tripId")
    public async getTripTravellers(@Path() tripId: number): Promise<IPerson[] | RequestResponse> {

        try {

            // Validated the provided trip is exist in the database or not
            const isExist = await this.tripsService.isTripExist(tripId);

            if (!isExist) {
                // If no trip is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${tripId} trip does not exist` };
            }

            // Call the getTripTravellers method from personsService with the provided tripId
            // Await the result and return it
            return await this.personTripsService.getTripTravellers(tripId);

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a POST endpoint with the path parameter 'tripId' and 'Person' body
     * Add travellers to the existing trip
     * @param tripId 
     * @param body 
     * @returns RequestResponse
     */
    @Post("/trip/:tripId")
    public async addTripTravellers(@Path() tripId: number, @Body() body: IPerson[]): Promise<RequestResponse> {

        try {

            // Validated the provided trip is exist in the database or not
            const isExist = await this.tripsService.isTripExist(tripId);

            if (!isExist) {
                // If no trip is exist , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${tripId} trip does not exist` };
            }

            // Call the addTripTravellers method from personsService with the provided tripId and list of persons
            // Await the result and return it
            await this.personTripsService.addTripTravellers(tripId, body);

            // Return an success response with the status and status message
            return { status: 200, message: `Added travellers to a trip ${tripId} successfuly.` };

        } catch (ex: any) {

            // If an error occurs, set the HTTP status to 400 (Bad Request)
            this.setStatus(400);

            // Return an error response with the status and error message
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Define a DELETE endpoint with the path parameter 'tripId' and 'userName'
     * Delete a traveller from a trip
     * @param userName 
     * @param tripId 
     * @returns RequestResponse
     */
    @Delete("/trip/:tripId/:userName")
    public async deleteTripTraveller(@Path() userName: string, @Path() tripId: number): Promise<RequestResponse> {

        try {

            // Validated the provided person and trip is mapped in the database or not
            const isExist = await this.personTripsService.isPersonAndTripExist(userName, tripId);

            if (!isExist) {
                // If no person and trip is mapped , set the HTTP status to 400 (Bad Request)
                this.setStatus(400);

                // Return an error response with the status and error message
                return { status: 400, message: `Provided ${userName} and ${tripId} relation does not exist` };
            }

            // Call the deleteTripTraveller method from personsService with the provided userName
            // Await the result and return it
            await this.personTripsService.deleteTripTraveller(userName);

            // Return an success response with the status and status message
            return { status: 200, message: `Deleted a trip for a person ${userName} successfuly.` };

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }
}