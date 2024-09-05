import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse, Response } from "tsoa";
import AirportsService from "../services/airport.service";
import AirlinesService from "../services/airline.service";
import Helper from "../utils/helper.utils";
import ErrorResponse from "../utils/error.response";
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

    // This decorator maps HTTP GET requests to the getAirlines method
    @Get()
    public async getAirlines(): Promise<IAirline[] | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airlinesService.getAirlines();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/:airlineCode")
    public async getAirline(@Path() airlineCode: string): Promise<IAirline | ErrorResponse> {

        try {

            // Await the result of the getAirline method from the airlinesService
            return await this.airlinesService.getAirline(airlineCode);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Post()
    @SuccessResponse("201", "Created")
    public async createAirline(@Body() body: IAirline): Promise<IAirline | ErrorResponse> {

        try {

            let airline: IAirline = body;

            /*const airport: IAirport | undefined = airline.airports;
    
            if (airport) {
                const tmp = await this.airportsService.createAirport(airport);
                airline.airports = tmp;
            }*/

            return await this.airlinesService.createAirline(airline);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }

    }

    @Put("/:airlineCode")
    public async updateAirline(@Path() airlineCode: string, @Body() body: IAirline): Promise<IAirline | ErrorResponse> {

        try {

            // Await the result of the getAirline method from the airlinesService
            return await this.airlinesService.updateAirline(airlineCode, body);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Delete("/:airlineCode")
    public async deleteAirline(@Path() airlineCode: string): Promise<Boolean | ErrorResponse> {

        try {

            // Await the result of the getAirline method from the airlinesService
            return await this.airlinesService.deleteAirline(airlineCode);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/records/count")
    public async getAirlinesCount(): Promise<number | ErrorResponse> {

        try {

            // Await the result of the getAirline method from the airlinesService
            return await this.airlinesService.getAirlineCount();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    /* @Post("/search/count")
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
    } */

}
