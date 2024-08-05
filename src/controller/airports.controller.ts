import * as express from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";
import TYPES from "../constants/types";
import Helper from "../utils/helper.utils";
import AirportsService from "services/airports.service";
import AirlinesService from "services/airlines.service";
import { IAirport } from "models/airport.model";

@controller("/airports")
export class AirportsController extends BaseHttpController {

    constructor(
        @inject(TYPES.AirportsService) private airportsService: AirportsService,
        @inject(TYPES.AirlinesService) private airlinesService: AirlinesService,
        @inject(TYPES.Helper) private helper: Helper) {
        super();
    }

    @httpGet("/")
    public async getAirports(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airportsService.getAirports();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/airlines")
    public async getAriportsAirlines(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airportsService.getAriportsAirlines();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id")
    public async getAirport(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airportsService.getAirport(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id/airlines")
    public async getAriportAirlines(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airportsService.getAriportAirlines(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost("/")
    public async createAirport(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {

        let airport: IAirport = JSON.parse(JSON.stringify(req.body));

        if (!this.helper.IsJsonNull(airport.airline)) {

            const tmp = await this.airlinesService.createAirline(airport.airline);
            airport.airlineId = tmp._id;
        }

        const content = await this.airportsService.createAirport(airport);

        const statusCode = 201;
        return this.json(content, statusCode);
    }

    @httpPut("/:id")
    public async updateAirport(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airportsService.updateAirport(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpDelete("/:id")
    public async deleteTrip(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airportsService.deleteAirport(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
