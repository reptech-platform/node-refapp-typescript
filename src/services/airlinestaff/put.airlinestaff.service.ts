import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import { IAirlineStaff } from "../../models/airlinestaff.model";
import IUpdateAirlineStaffRepository from "../../repositories/airlinestaff/put.airlinestaff.repository";

// Interface for UpdateAirlineStaffService
export default interface IUpdateAirlineStaffService {
    // Method to create a new airline
    updateAirlineStaffs(airlineStaffs: IAirlineStaff[], dbSession: ClientSession | undefined): Promise<void>;
}

// This decorator ensures that UpdateAirlineStaffService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateAirlineStaffService implements IUpdateAirlineStaffService {
    // Injecting the AirlineRepository service
    constructor(
        @inject('IUpdateAirlineStaffRepository') private updateAirlineStaffRepository: IUpdateAirlineStaffRepository
    ) { }

    // Method to create a new airline
    public async updateAirlineStaffs(airlineStaffs: IAirlineStaff[], dbSession: ClientSession | undefined): Promise<void> {

        // Create new AirlineStaff schema object
        let newItems: any[] = [];

        // Check if airlineStaffs object is not null
        if (airlineStaffs && airlineStaffs.length > 0) {
            // Loop to check if each friend already exists in the database using their userName
            for (let index = 0; index < airlineStaffs.length; index++) {
                let { airlineCode, userName } = airlineStaffs[index];

                let _id = await this.updateAirlineStaffRepository.getKeyId(airlineCode, userName);
                if (!_id) {
                    throw new Error(`Provided airline staff '${airlineCode}' and '${userName}' does not exist`);
                }

                newItems.push({ _id, userName, airlineCode });
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
        await this.updateAirlineStaffRepository.updateAirlineStaffs(newItems, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }
}
