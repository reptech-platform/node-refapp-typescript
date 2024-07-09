import * as express from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";
import TYPES from "../constants/types";
import PersonsService from "../services/persons.service";
import PersonTripsService from "../services/persontrips.service";
import TripService from "../services/trips.service";
import Helper from "../utils/helper.utils";
import { IPerson } from "../models/psersons.model";

@controller("/persons")
export class PersonsController extends BaseHttpController {
    constructor(@inject(TYPES.PersonsService) private personsService: PersonsService,
        @inject(TYPES.TripsService) private tripService: TripService,
        @inject(TYPES.PersonTripsService) private personTripsService: PersonTripsService,
        @inject(TYPES.Helper) private helper: Helper
    ) {
        super();
    }

    @httpGet("/")
    public async getPersons(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.personsService.getPersons();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/trips")
    public async getPersonsTrips(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const contentDb = await this.personsService.getPersonsTrips();
        const content = contentDb as IPerson;
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id")
    public async getPerson(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.personsService.getPerson(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id/trips")
    public async getPersonTrips(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const contentDb = await this.personsService.getPersonTrips(req.params.id);
        const content = contentDb as IPerson;
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost("/")
    public async createPerson(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {

        let person: IPerson = JSON.parse(JSON.stringify(req.body));
        let personTrips: any[] = [];

        if (!this.helper.IsArrayNull(person.trips)) {

            for (var iTraveller = 0; iTraveller < person.trips.length; iTraveller++) {
                const tmp = await this.tripService.createTrip(person.trips[iTraveller]);
                const mapItem = { tripId: tmp._id, personId: null };
                personTrips.push(mapItem);
            };

        }

        const content = await this.personsService.createPerson(person);

        if (!this.helper.IsArrayNull(personTrips)) {

            personTrips.forEach(x => x.personId = content._id);
            await this.personTripsService.createPersonTrips(personTrips);

        }

        const statusCode = 201;
        return this.json(content, statusCode);

    }

    @httpPut("/:id")
    public async updatePerson(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.personsService.updatePerson(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpDelete("/:id")
    public async deletePerson(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.personsService.deletePerson(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
