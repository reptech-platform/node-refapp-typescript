import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import PersonsService from "../services/person.service";
import TripService from "../services/trip.service";
import Helper from "../utils/helper.utils";
import ErrorResponse from "../utils/error.response";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IPerson } from "../models/person.model";
import { Search, SearchResults } from "../models/search.model";
import { ITrip } from "../models/trip.model";
import PersonTripsService from "../services/persontrip.service";

@Tags("Persons")
@Route("persons")
@provideSingleton(PersonsController)
export class PersonsController extends Controller {
    constructor(
        @inject(PersonsService) private personsService: PersonsService,
        @inject(PersonTripsService) private personTripsService: PersonTripsService,
        @inject(TripService) private tripService: TripService,
        @inject(Helper) private helper: Helper
    ) {
        super();
    }

    /**
     * Get all list of persons
     * @returns
     */
    @Get()
    public async getPersons(): Promise<IPerson[] | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.personsService.getPersons();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Get the specific person details
     * @param userName
     * @returns 
     */
    @Get("/:userName")
    public async getPerson(@Path() userName: string): Promise<IPerson | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.personsService.getPerson(userName);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Create the person with trips
     * @param body 
     * @returns 
     */
    @Post()
    @SuccessResponse("201", "Created")
    public async createPerson(@Body() body: IPerson): Promise<IPerson | ErrorResponse> {

        try {
            let person: IPerson = body;
            /* let personTrips: any[] = [];
    
            const trips: ITrip[] | undefined = person.trips;
    
            if (trips && !this.helper.IsArrayNull(trips)) {
    
                for (var iTrip = 0; iTrip < trips.length; iTrip++) {
                    const tmp = await this.tripService.createTrip(trips[iTrip]);
                    const mapItem = { personId: null, tripId: tmp.tripId };
                    personTrips.push(mapItem);
                };
    
            } */

            const content = await this.personsService.createPerson(person);

            /* if (!this.helper.IsArrayNull(personTrips)) {
    
                personTrips.forEach(x => x.personId = content.userName);
                await this.personTripsService.createPersonTrips(personTrips);
    
            } */

            return content;

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }

    }

    /**
     * Update existing persion
     * @param userName 
     * @param body 
     * @returns 
     */
    @Put("/:userName")
    public async updatePerson(@Path() userName: string, @Body() body: IPerson): Promise<IPerson | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.personsService.updatePerson(userName, body);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Delete existig persion
     * @param userName 
     * @returns 
     */
    @Delete("/:userName")
    public async deletePerson(@Path() userName: string): Promise<boolean | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.personsService.deletePerson(userName);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /**
     * Get persons count
     */
    @Get("/records/count")
    public async getPersonCount(): Promise<number | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.personsService.getPersonCount();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /*

    @Post("/search/count")
    public async searchPersonCount(@Body() body: Search): Promise<number> {
        return await this.personsService.searchPersonCount(body);
    }

    @Post("/search")
    public async searchPerson(@Body() body: Search): Promise<SearchResults> {
        return await this.personsService.searchPerson(body);
    } */

    /*
    Get All persons and their trips
     */
    /* @Get("/trips")
    public async getPersonsTrips(): Promise<IPerson[]> {
        return await this.personsService.getPersonsTrips();
    } */

    /*
     * Get specific person's trips
     */
    /* @Get("/:id/trips")
    public async getPersonTrips(@Path() id: string): Promise<IPerson> {
        return await this.personsService.getPersonTrips(id);
    } */
}
