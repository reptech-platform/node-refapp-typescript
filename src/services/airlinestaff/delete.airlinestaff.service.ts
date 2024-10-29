import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeleteAirlineStaffRepository from "../../repositories/airlinestaff/delete.airlinestaff.repository";

export default interface IDeleteAirlineStaffService {
    // Deletes a AirlineStaff by their airlineCode and username.
    deleteAirlineStaff(airlineCode: string, userName: string, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that DeleteAirlineStaffService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirlineStaffService implements IDeleteAirlineStaffService {

    // Injecting the Helper service
    constructor(
        @inject('IDeleteAirlineStaffRepository') private deleteAirlineStaffRepository: IDeleteAirlineStaffRepository
    ) { }

    // Deletes a AirlineStaff by their airlineCode and username.
    public async deleteAirlineStaff(airlineCode: string, userName: string, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the AirlineStaff exists. If not, throw an error.
        let isExist = await this.deleteAirlineStaffRepository.isExist(airlineCode, userName);
        if (!isExist) {
            throw new Error(`Provided airline staff '${airlineCode}' and '${userName}' does not exist`);
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

        let results: boolean = await this.deleteAirlineStaffRepository.deleteAirlineStaff(airlineCode, userName, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}