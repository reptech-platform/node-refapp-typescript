import { inject, injectable } from "inversify";
import IGetAirlineRepository from "../../repositories/airline/get.airline.repository";
import { IAirline } from "../../models/airline.model";

// Interface for GetAirlineService
export default interface IGetAirlineService {
    // Method to get a specific airline by its code
    getAirline(airlineCode: string): Promise<IAirline>;
}

// This decorator ensures that GetAirlineService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlineService implements IGetAirlineService {
    // Injecting the GetAirlineRepository service
    constructor(
        @inject("IGetAirlineRepository") private getAirlineRepository: IGetAirlineRepository
    ) { }

    // Gets a Airline by their userName
    public async getAirline(airlineCode: string): Promise<IAirline> {
        // Check if the Airline exists. If not, throw an error.
        let isExist = await this.getAirlineRepository.isExist(airlineCode);
        if (!isExist) {
            throw new Error(`Provided Airline '${airlineCode}' does not exist`);
        }
        // Retrieve and return the Airline's information
        return await this.getAirlineRepository.getAirline(airlineCode);
    }
}
