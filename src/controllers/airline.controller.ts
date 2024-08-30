import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import AirportsService from "../services/airport.service";
import AirlinesService from "../services/airline.service";
import Helper from "../utils/helper.utils";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IAirline } from "../models/airline.model";
import { IAirport } from "../models/airport.model";
import { Search, SearchResults } from "../models/search.model";


@Tags("Airlines")
@Route("airlines")
@provideSingleton(AirlinesController)
export class AirlinesController extends Controller {

    constructor(
        @inject(AirportsService) private airportsService: AirportsService,
        @inject(AirlinesService) private airlinesService: AirlinesService,
        @inject(Helper) private helper: Helper) {
        super();
    }

    @Get("/")
    public async getAirlines(): Promise<IAirline[]> {
        return await this.airlinesService.getAirlines();
    }

    @Get("/:id")
    public async getAirline(@Path() id: string): Promise<IAirline> {
        return await this.airlinesService.getAirline(id);
    }

    @Post("/")
    @SuccessResponse("201", "Created")
    public async createAirline(@Body() body: IAirline): Promise<IAirline> {

        let airline: IAirline = body;
        const airport: IAirport | undefined = airline.airport;

        if (airport) {
            const tmp = await this.airportsService.createAirport(airport);
            airline.airportId = tmp._id;
        }

        return await this.airlinesService.createAirline(airline);
    }

    @Put("/:id")
    public async updateAirline(@Path() id: string, @Body() body: IAirline): Promise<IAirline> {
        return await this.airlinesService.updateAirline(id, body);
    }

    @Delete("/:id")
    public async deleteAirline(@Path() id: string): Promise<Boolean> {
        return await this.airlinesService.deleteAirline(id);
    }

    @Get("/records/count")
    public async getAirlinesCount(): Promise<number> {
        return await this.airlinesService.getAirlineCount();
    }

    @Post("/search/count")
    public async searchAirlinesCount(@Body() body: Search): Promise<number> {
        return await this.airlinesService.searchAirlineCount(body);
    }

    @Post("/search")
    public async searchAirline(@Body() body: Search): Promise<SearchResults> {
        return await this.airlinesService.searchAirline(body);
    }

    @Get("/airports")
    public async getAirlinesAirports(): Promise<IAirline[]> {
        return await this.airlinesService.getAirlinesAirports();
    }

    @Get("/:id/airports")
    public async getAirlineAirports(@Path() id: string): Promise<IAirline> {
        return await this.airlinesService.getAirlineAirports(id);
    }

}
