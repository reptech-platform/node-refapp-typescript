import { inject, injectable } from "inversify";
import IGetAirportsRepository from "../../repositories/airport/get.airports.repository";
import { IAirport } from "../../models/airport.model";

export default interface IGetAirportsService {
    // Fetches all Airports from the database.
    getAirports(): Promise<IAirport[]>;
}

// This decorator ensures that AirportsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirportsService implements IGetAirportsService {

    // Injecting the Helper service
    constructor(
        @inject("IGetAirportsRepository") private getAirportsRepository: IGetAirportsRepository
    ) { }

    // Fetches all Airports from the database.
    public async getAirports(): Promise<IAirport[]> {
        return await this.getAirportsRepository.getAirports();
    }

}