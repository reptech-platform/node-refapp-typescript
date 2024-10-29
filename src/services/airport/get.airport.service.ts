import { inject, injectable } from "inversify";
import IGetAirportRepository from "../../repositories/airport/get.airport.repository";
import { IAirport } from "../../models/airport.model";

// Interface for GetAirportService
export default interface IGetAirportService {
    // Method to get a specific Airport by its code
    getAirport(icaoCode: string, iataCode: string): Promise<IAirport>;
}

// This decorator ensures that GetAirportService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirportService implements IGetAirportService {
    // Injecting the GetAirportRepository service
    constructor(
        @inject("IGetAirportRepository") private getAirportRepository: IGetAirportRepository
    ) { }

    // Gets a Airport by their userName
    public async getAirport(icaoCode: string, iataCode: string): Promise<IAirport> {
        // Check if the Airport exists. If not, throw an error.
        let isExist = await this.getAirportRepository.isExist(icaoCode, iataCode);
        if (!isExist) {
            throw new Error(`Provided Airport '${icaoCode}' and '${iataCode}' does not exist`);
        }
        // Retrieve and return the Airport's information
        return await this.getAirportRepository.getAirport(icaoCode, iataCode);
    }
}
