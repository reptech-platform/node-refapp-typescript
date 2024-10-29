import { inject, injectable } from "inversify";
import IGetAirlineStaffRepository from "../../repositories/airlinestaff/get.airlinestaff.repository";
import { IPerson } from "../../models/person.model";
import { IAirline } from "../../models/airline.model";

// Interface for GetAirlineStaffService
export default interface IGetAirlineStaffService {
    // This method get multiple staff for a airline.
    getArilineStaffs(airlineCode: string): Promise<IPerson[]>;

    // This method get multiple airlines for a staff.
    getStaffAirlines(userName: string): Promise<IAirline[]>;
}

// This decorator ensures that GetAirlineStaffService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetAirlineStaffService implements IGetAirlineStaffService {
    // Injecting the GetAirlineStaffRepository service
    constructor(
        @inject("IGetAirlineStaffRepository") private getAirlineStaffRepository: IGetAirlineStaffRepository
    ) { }

    // This method get multiple staff for a airline.
    public async getArilineStaffs(airlineCode: string): Promise<IPerson[]> {
        // Check if the AirlineStaff exists. If not, throw an error.
        let isExist = await this.getAirlineStaffRepository.isExist(airlineCode, null);
        if (!isExist) {
            throw new Error(`Provided AirlineStaff '${airlineCode}' does not exist`);
        }
        // Retrieve and return the AirlineStaff's information
        return await this.getAirlineStaffRepository.getAirlineStaffs(airlineCode);
    }

    // This method get multiple airlines for a staff.
    public async getStaffAirlines(userName: string): Promise<IAirline[]> {
        // Check if the AirlineStaff exists. If not, throw an error.
        let isExist = await this.getAirlineStaffRepository.isExist(null, userName);
        if (!isExist) {
            throw new Error(`Provided AirlineStaff '${userName}' does not exist`);
        }
        // Retrieve and return the AirlineStaff's information
        return await this.getAirlineStaffRepository.getStaffAirlines(userName);
    }
}
