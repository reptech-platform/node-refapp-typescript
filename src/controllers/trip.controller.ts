import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import TripService from "../services/trip.service";
import PersonsService from "../services/person.service";
import TripTravellersService from "../services/triptraveller.service";
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
        @inject(TripTravellersService) private tripTravellersService: TripTravellersService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    /**
     * Get all trips along with travellers
     * @returns 
     */
    @Get("/")
    public async getTrips(): Promise<ITrip[]> {
        return await this.tripService.getTrips();
    }

    /**
     * Get specific trip by passing the trip id
     * @param id 
     * @returns 
     */
    @Get("/:id")
    public async getTrip(@Path() id: string): Promise<ITrip> {
        return await this.tripService.getTrip(id);
    }

    /**
     * Create new trip along with travellers
     * @param body 
     * @returns 
     */

    @Post("/")
    @SuccessResponse("201", "Created")
    public async createTrip(@Body() body: ITrip): Promise<ITrip> {

        let trip: ITrip = body;
        let travellersId: any[] = [];

        const persons: IPerson[] | undefined = trip.travellers;

        if (persons && !this.helper.IsArrayNull(persons)) {

            for (var iTraveller = 0; iTraveller < persons.length; iTraveller++) {
                const tmp = await this.personsService.createPerson(persons[iTraveller]);
                const mapItem = { personId: tmp.userName, tripId: null };
                travellersId.push(mapItem);
            };

        }

        const content = await this.tripService.createTrip(trip);

        if (!this.helper.IsArrayNull(travellersId)) {
            travellersId.forEach(x => x.tripId = content.tripId);
            await this.tripTravellersService.createTravellers(travellersId);
        }

        return content;
    }

    /**
     * Update existing trip
     * @param id 
     * @param body 
     * @returns 
     */
    @Put("/:id")
    public async updateTrip(@Path() id: string, @Body() body: ITrip): Promise<ITrip> {
        return await this.tripService.updateTrip(id, body);
    }

    /**
     * Delete Trip 
     */

    @Delete("/:id")
    public async deleteTrip(@Path() id: string): Promise<boolean> {
        return await this.tripService.deleteTrip(id);
    }

    /**
     * Get list of trips
     * @returns 
     */
    @Get("/records/count")
    public async getTripCount(): Promise<number> {
        return await this.tripService.getTripCount();
    }

    /**
     * 
     * @param body 
     * @returns 
     */
    @Post("/search/count")
    public async searchTripCount(@Body() body: Search): Promise<number> {
        return await this.tripService.searchTripCount(body);
    }

    /**
     * 
     * @param body 
     * @returns 
     */
    @Post("/search")
    public async searchTrip(@Body() body: Search): Promise<SearchResults> {
        return await this.tripService.searchTrip(body);
    }

    /**
     * Get All trips and their travellers
     * @returns 
     */
    @Get("/travellers")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    }

    /**
     * Delete traveller from trip travellers
     * @returns 
     */
    @Delete("/travellers/${tripId}/{$travellerId")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    }

    /**
     * Update traveller for trip traveller
     * @returns 
     */
    @Patch("/travellers/${tripId}/{$travellerId")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    }

    /**
     * Add new traveller to trip travellers
     * @returns 
     */
    @Post("/travellers/${tripId}")
    public async getTripsTravellers(): Promise<ITrip[]> {
        return await this.tripService.getTripsTravellers();
    }

    /**
     * Get specific trip's travellers
     * @param id 
     * @returns 
     */
    @Get("/:tripId/travellers")
    public async getTripTravellers(@Path() id: string): Promise<ITrip> {
        return await this.tripService.getTripTravellers(id);
    }
}
