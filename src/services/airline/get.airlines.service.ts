import { inject, injectable } from "inversify";
import IGetAirlinesRepository from "../../repositories/airline/get.airlines.repository";
import { IAirlineRead } from "../../models/airline/airline.read.model";

export default interface IGetAirlinesService {
    // Fetches all Airlines from the database.
    getAirlines(): Promise<IAirlineRead[]>;
}

// This decorator ensures that AirlinesService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlinesService implements IGetAirlinesService {

    // Injecting the Helper service
    constructor(
        @inject("IGetAirlinesRepository") private getAirlinesRepository: IGetAirlinesRepository
    ) { }

    // Fetches all Airlines from the database.
    public async getAirlines(): Promise<IAirlineRead[]> {
        return await this.getAirlinesRepository.getAirlines();
    }

}