import { inject, injectable } from "inversify";
import IGetAirlinesRepository from "../../repositories/airline/get.airlines.repository";
import { IAirlineStaff } from "../../models/airlinestaff.model";

export default interface IGetAirlinesStaffService {
    // Fetches all AirlineStaffs from the database.
    getAirlinesAndStaffs(): Promise<IAirlineStaff[]>;
}

// This decorator ensures that GetAirlinesStaffService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlinesStaffService implements IGetAirlinesStaffService {

    // Injecting the Helper service
    constructor(
        @inject("IGetAirlinesRepository") private getAirlinesRepository: IGetAirlinesRepository
    ) { }

    // Fetches all AirlineStaffs from the database.
    public async getAirlinesAndStaffs(): Promise<IAirlineStaff[]> {
        return await this.getAirlinesRepository.getAirlinesAndStaffs();
    }

}