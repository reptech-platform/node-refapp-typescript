import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import TripService from "../services/trip.service";
import PersonsService from "../services/person.service";
import ErrorResponse from "../utils/error.response";
//import TripTravellersService from "../services/triptraveller.service";
import Helper from "../utils/helper.utils";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { ITrip } from "../models/trip.model";
import { Search, SearchResults } from "../models/search.model";
import { IPerson } from "../models/person.model";

@Tags("Trips")
@Route("/trips")
@provideSingleton(TripsController)
export class TripsController extends Controller {

    constructor(
        @inject(TripService) private tripService: TripService,
        @inject(PersonsService) private personsService: PersonsService,
        //@inject(TripTravellersService) private tripTravellersService: TripTravellersService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    /**
     * Get all list of trips
     * @returns 
     */
    @Get()
    public async getTrips(): Promise<ITrip[] | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.tripService.getTrips();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Get specific trip by passing the tripId
     * @param tripId 
     * @returns 
     */
    @Get("/:tripId")
    public async getTrip(@Path() tripId: string): Promise<ITrip | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.tripService.getTrip(tripId);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Create new trip along with travellers
     * @param body 
     * @returns 
     */

    @Post()
    @SuccessResponse("201", "Created")
    public async createTrip(@Body() body: ITrip): Promise<ITrip | ErrorResponse> {

        try {
            let trip: ITrip = body;
            /* let travellersId: any[] = [];
    
            const persons: IPerson[] | undefined = trip.travellers;
    
            if (persons && !this.helper.IsArrayNull(persons)) {
    
                for (var iTraveller = 0; iTraveller < persons.length; iTraveller++) {
                    const tmp = await this.personsService.createPerson(persons[iTraveller]);
                    const mapItem = { personId: tmp.userName, tripId: null };
                    travellersId.push(mapItem);
                };
    
            } */

            const content = await this.tripService.createTrip(trip);

            /* if (!this.helper.IsArrayNull(travellersId)) {
                travellersId.forEach(x => x.tripId = content.tripId);
                await this.tripTravellersService.createTravellers(travellersId);
            } */

            return content;

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Update existing trip
     * @param tripId 
     * @param body 
     * @returns 
     */
    @Put("/:tripId")
    public async updateTrip(@Path() tripId: string, @Body() body: ITrip): Promise<ITrip | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.tripService.updateTrip(tripId, body);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Delete Trip 
     */

    @Delete("/:tripId")
    public async deleteTrip(@Path() tripId: string): Promise<boolean | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.tripService.deleteTrip(tripId);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Get list of trips
     * @returns 
     */
    @Get("/records/count")
    public async getTripCount(): Promise<number | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.tripService.getTripCount();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * 
     * @param body 
     * @returns 
     */
    /* @Post("/search/count")
    public async searchTripCount(@Body() body: Search): Promise<number> {
        return await this.tripService.searchTripCount(body);
    } */

    /**
     * 
     * @param body 
     * @returns 
     */
    /* @Post("/search")
    public async searchTrip(@Body() body: Search): Promise<SearchResults> {
        return await this.tripService.searchTrip(body);
    } */

    /**
     * Get All trips and their travellers
     * @returns 
     */
    /* @Get("/travellers")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    } */

    /**
     * Delete traveller from trip travellers
     * @returns 
     */
    /* @Delete("/travellers/${tripId}/{$travellerId")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    } */

    /**
     * Update traveller for trip traveller
     * @returns 
     */
    /* @Patch("/travellers/${tripId}/{$travellerId")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    } */

    /**
     * Add new traveller to trip travellers
     * @returns 
     */
    /* @Post("/travellers/${tripId}")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    } */

    /**
     * Get specific trip's travellers
     * @param id 
     * @returns 
     */
    /* @Get("/:tripId/travellers")
    public async getTripTravellers(@Path() id: string): Promise<ITrip> {
        return await this.tripService.getTripTravellers(id);
    } */
}
