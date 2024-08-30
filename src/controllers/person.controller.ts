import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import PersonsService from "../services/person.service";
import TripService from "../services/trip.service";
import Helper from "../utils/helper.utils";
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

    @Get()
    public async getPersons(): Promise<IPerson[]> {
        return await this.personsService.getPersons();
    }

    @Get("/:id")
    public async getPerson(@Path() id: string): Promise<IPerson> {
        return await this.personsService.getPerson(id);
    }

    @Post("/")
    @SuccessResponse("201", "Created")
    public async createPerson(@Body() body: IPerson): Promise<IPerson> {

        let person: IPerson = body;
        let personTrips: any[] = [];

        const trips: ITrip[] | undefined = person.trips;

        if (trips && !this.helper.IsArrayNull(trips)) {

            for (var iTrip = 0; iTrip < trips.length; iTrip++) {
                const tmp = await this.tripService.createTrip(trips[iTrip]);
                const mapItem = { personId: null, tripId: tmp._id };
                personTrips.push(mapItem);
            };

        }

        const content = await this.personsService.createPerson(person);

        if (!this.helper.IsArrayNull(personTrips)) {

            personTrips.forEach(x => x.personId = content._id);
            await this.personTripsService.createPersonTrips(personTrips);

        }

        return content;

    }

    @Put("/:id")
    public async updatePerson(@Path() id: string, @Body() body: IPerson): Promise<IPerson> {
        return await this.personsService.updatePerson(id, body);
    }

    @Delete("/:id")
    public async deletePerson(@Path() id: string): Promise<boolean> {
        return await this.personsService.deletePerson(id);
    }

    @Get("/records/count")
    public async getPersonCount(): Promise<number> {
        return await this.personsService.getPersonCount();
    }

    @Post("/search/count")
    public async searchPersonCount(@Body() body: Search): Promise<number> {
        return await this.personsService.searchPersonCount(body);
    }

    @Post("/search")
    public async searchPerson(@Body() body: Search): Promise<SearchResults> {
        return await this.personsService.searchPerson(body);
    }

    @Get("/trips")
    public async getPersonsTrips(): Promise<IPerson[]> {
        return await this.personsService.getPersonsTrips();
    }

    @Get("/:id/trips")
    public async getPersonTrips(@Path() id: string): Promise<IPerson> {
        return await this.personsService.getPersonTrips(id);
    }
}
