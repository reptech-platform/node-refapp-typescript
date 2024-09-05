import { Controller, Body, Get, Post, Put, Delete, Tags, Route, Path, SuccessResponse } from "tsoa";
import Helper from "../utils/helper.utils";
import ErrorResponse from "../utils/error.response";
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

    @Get()
    public async getAirports(): Promise<IAirport[] | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.getAirports();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/:icaoCode/:iataCode")
    public async getAirport(@Path() icaoCode: string, @Path() iataCode: string): Promise<IAirport | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.getAirport(icaoCode, iataCode);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Post()
    @SuccessResponse("201", "Created")
    public async createAirport(@Body() body: IAirport): Promise<IAirport | ErrorResponse> {

        let airport: IAirport = body;

        /* const airline: IAirline | undefined = airport.airlines;

        if (airline) {
            const tmp = await this.airlinesService.createAirline(airline);
            airport.airlines = tmp;
        } */

        return await this.airportsService.createAirport(airport);
    }

    @Put("/:icaoCode/:iataCode")
    public async updateAirport(@Path() icaoCode: string, @Path() iataCode: string, @Body() body: IAirport): Promise<IAirport | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.updateAirport(icaoCode, iataCode, body);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Delete("/:icaoCode/:iataCode")
    public async deleteAirport(@Path() icaoCode: string, @Path() iataCode: string): Promise<boolean | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.deleteAirport(icaoCode, iataCode);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/records/count")
    public async getAirportCount(): Promise<number | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.getAirportCount();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Post("/search/count")
    public async searchAirportCount(@Body() body: Search): Promise<number | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.searchAirportCount(body);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Post("/search")
    public async searchAirport(@Body() body: Search): Promise<SearchResults | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.searchAirport(body);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }


    @Get("/airlines")
    public async getAriportsAirlines(): Promise<IAirport[] | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.getAriportsAirlines();

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }

    @Get("/:id/airlines")
    public async getAriportAirlines(@Path() id: string): Promise<IAirport | ErrorResponse> {

        try {

            // Await the result of the getAirlines method from the airlinesService
            return await this.airportsService.getAriportAirlines(id);

        } catch (ex: any) {

            this.setStatus(400);
            return { status: 400, message: ex.message };

        }
    }
}
