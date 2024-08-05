import * as express from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";
import TYPES from "../constants/types";
import TripService from "../services/trips.service";
import Helper from "../utils/helper.utils";
import { ITrip } from "../models/trips.model";
import PersonsService from "../services/persons.service";
import TripTravellersService from "../services/triptravellers.service";

@controller("/trips")
export class TripsController extends BaseHttpController {

    constructor(
        @inject(TYPES.TripsService) private tripService: TripService,
        @inject(TYPES.PersonsService) private personsService: PersonsService,
        @inject(TYPES.TripTravellersService) private tripTravellersService: TripTravellersService,
        @inject(TYPES.Helper) private helper: Helper) {
        super();
    }

    @httpGet("/")
    public async getTrips(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.tripService.getTrips();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/travellers")
    public async getPersonsTrips(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const contentDb = await this.tripService.getTripsTravellers();
        const content = contentDb as ITrip;
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id")
    public async getTrip(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.tripService.getTrip(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id/travellers")
    public async getTripTravellers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const contentDb = await this.tripService.getTripTravellers(req.params.id);

        const content = contentDb as ITrip;
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost("/")
    public async createTrip(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {

        let trip: ITrip = JSON.parse(JSON.stringify(req.body));
        let travellersId: any[] = [];

        if (!this.helper.IsArrayNull(trip.travellers)) {

            for (var iTraveller = 0; iTraveller < trip.travellers.length; iTraveller++) {
                const tmp = await this.personsService.createPerson(trip.travellers[iTraveller]);
                const mapItem = { personId: tmp._id, tripId: null };
                travellersId.push(mapItem);
            };

        }

        const content = await this.tripService.createTrip(req.body);

        if (!this.helper.IsArrayNull(travellersId)) {

            travellersId.forEach(x => x.tripId = content._id);
            await this.tripTravellersService.createTravellers(travellersId);

        }

        const statusCode = 201;
        return this.json(content, statusCode);
    }

    @httpPut("/:id")
    public async updateTrip(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.tripService.updateTrip(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpDelete("/:id")
    public async deleteTrip(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.tripService.deleteTrip(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
