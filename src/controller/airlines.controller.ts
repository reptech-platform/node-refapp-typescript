import * as express from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";
import TYPES from "../constants/types";
import Helper from "../utils/helper.utils";
import AirportsService from "services/airports.service";
import AirlinesService from "services/airlines.service";
import { IAirline } from "models/airlines.model";

@controller("/airlines")
export class AirlinesController extends BaseHttpController {

    constructor(
        @inject(TYPES.AirportsService) private airportsService: AirportsService,
        @inject(TYPES.AirlinesService) private airlinesService: AirlinesService,
        @inject(TYPES.Helper) private helper: Helper) {
        super();
    }

    @httpGet("/")
    public async getAirlines(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airlinesService.getAirlines();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/airports")
    public async getAirlinesAirports(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airlinesService.getAirlinesAirports();
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id")
    public async getAirline(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airlinesService.getAirline(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpGet("/:id/airports")
    public async getAirlineAirports(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airlinesService.getAirlineAirports(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpPost("/")
    public async createAirport(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {

        let airline: IAirline = JSON.parse(JSON.stringify(req.body));

        if (!this.helper.IsJsonNull(airline.airport)) {

            const tmp = await this.airportsService.createAirport(airline.airport);
            airline.airportId = tmp._id;
        }

        const content = await this.airlinesService.createAirline(airline);

        const statusCode = 201;
        return this.json(content, statusCode);
    }

    @httpPut("/:id")
    public async updateAirline(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airlinesService.updateAirline(req.params.id, req.body);
        const statusCode = 200;
        return this.json(content, statusCode);
    }

    @httpDelete("/:id")
    public async deleteAirline(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JsonResult> {
        const content = await this.airlinesService.deleteAirline(req.params.id);
        const statusCode = 200;
        return this.json(content, statusCode);
    }
}
