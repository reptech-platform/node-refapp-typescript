import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import Helper from "../utils/helper.utils";
import { provideSingleton, inject } from "../utils/provideSingleton";
import AirportsService from "../services/airport.service";
import AirlinesService from "../services/airline.service";
import { IAirport } from "../models/airport.model";
import { Search, SearchResults } from "../models/search.model";
import { IAirline } from "../models/airline.model";

@Tags("Airports")
@Route("airports")
@provideSingleton(AirportsController)
export class AirportsController extends Controller {

    constructor(
        @inject(AirportsService) private airportsService: AirportsService,
        @inject(AirlinesService) private airlinesService: AirlinesService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    @Get("/")
    public async getAirports(): Promise<IAirport[]> {
        return await this.airportsService.getAirports();
    }

    @Get("/:id")
    public async getAirport(@Path() id: string): Promise<IAirport> {
        return await this.airportsService.getAirport(id);
    }

    @Post("/")
    @SuccessResponse("201", "Created")
    public async createAirport(@Body() body: IAirport): Promise<IAirport> {

        let airport: IAirport = body;

        const airline: IAirline | undefined = airport.airlines;

        if (airline) {
            const tmp = await this.airlinesService.createAirline(airline);
            airport.airlines = tmp;
        }

        return await this.airportsService.createAirport(airport);
    }

    @Put("/:id")
    public async updateAirport(@Path() id: string, @Body() body: IAirport): Promise<IAirport> {
        return await this.airportsService.updateAirport(id, body);
    }

    @Delete("/:id")
    public async deleteAirport(@Path() id: string): Promise<boolean> {
        return await this.airportsService.deleteAirport(id);
    }

    @Get("/records/count")
    public async getAirportCount(): Promise<number> {
        return await this.airportsService.getAirportCount();
    }

    @Post("/search/count")
    public async searchAirportCount(@Body() body: Search): Promise<number> {
        return await this.airportsService.searchAirportCount(body);
    }

    @Post("/search")
    public async searchAirport(@Body() body: Search): Promise<SearchResults> {
        return await this.airportsService.searchAirport(body);
    }


    @Get("/airlines")
    public async getAriportsAirlines(): Promise<IAirport[]> {
        return await this.airportsService.getAriportsAirlines();
    }

    @Get("/:id/airlines")
    public async getAriportAirlines(@Path() id: string): Promise<IAirport> {
        return await this.airportsService.getAriportAirlines(id);
    }
}
