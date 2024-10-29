import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IGetPersonRepository from "../../repositories/person/get.person.repository";
import IGetAirlineRepository from "../../repositories/airline/get.airline.repository";
import ICreateAirlineStaffRepository from "../../repositories/airlinestaff/post.airlinestaff.repository";
import { IAirlineStaff } from "../../models/airlinestaff.model";

// Interface for CreateAirlineStaffService
export default interface ICreateAirlineStaffService {
    // Method to create a new airline
    createAirlineStaffs(airlineStaffs: IAirlineStaff[], dbSession: ClientSession | undefined): Promise<void>;
}

// This decorator ensures that CreateAirlineStaffService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateAirlineStaffService implements ICreateAirlineStaffService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('ICreateAirlineStaffRepository') private createAirlineStaffRepository: ICreateAirlineStaffRepository,
        @inject('IGetAirlineRepository') private getAirlineRepository: IGetAirlineRepository,
        @inject('IGetPersonRepository') private getPersonRepository: IGetPersonRepository
    ) { }

    // Method to create a new airline
    public async createAirlineStaffs(airlineStaffs: IAirlineStaff[], dbSession: ClientSession | undefined): Promise<void> {

        // Create new AirlineStaff schema object
        let newItems: any[] = [];

        // Check if airlineStaffs object is not null
        if (airlineStaffs && airlineStaffs.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < airlineStaffs.length; index++) {
                let { airlineCode, userName } = airlineStaffs[index];
                // Check if the AirlineStaff exists. If not, throw an error.
                let isExist = await this.createAirlineStaffRepository.isExist(airlineCode, userName);
                if (!isExist) {
                    throw new Error(`Provided airline staff '${airlineCode}' and '${userName}' is already exist`);
                }
                isExist = await this.getPersonRepository.isExist(userName);
                if (!isExist) {
                    throw new Error(`Provided staff '${userName}' does not exist`);
                }

                isExist = await this.getAirlineRepository.isExist(airlineCode);
                if (!isExist) {
                    throw new Error(`Provided airline '${airlineCode}' does not exist`);
                }

                newItems.push({ userName, airlineCode });
            }
        } else {
            throw new Error(`Provided airline staffs are required`);
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create airlinestaff document
        await this.createAirlineStaffRepository.addStaffAirlines(newItems, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }
}
