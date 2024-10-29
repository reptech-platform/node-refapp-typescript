import { inject, injectable } from "inversify";
import IGetAirlineStaffsRepository from "../../repositories/airlinestaff/get.airlinestaffs.repository";
import { IAirlineStaff } from "../../models/airlinestaff.model";

export default interface IGetAirlineStaffsService {
    // Fetches all AirlineStaffs from the database.
    getAirlinesAndStaffs(): Promise<IAirlineStaff[]>;
}

// This decorator ensures that GetAirlineStaffsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlineStaffsService implements IGetAirlineStaffsService {

    // Injecting the Helper service
    constructor(
        @inject("IGetAirlineStaffsRepository") private getAirlineStaffsRepository: IGetAirlineStaffsRepository
    ) { }

    // Fetches all AirlineStaffs from the database.
    public async getAirlinesAndStaffs(): Promise<IAirlineStaff[]> {
        return await this.getAirlineStaffsRepository.getAllAirlineStaffs();
    }

}