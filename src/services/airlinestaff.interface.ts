import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";
import { ClientSession } from "mongoose";

export default interface IAirlineStaffService {

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean>;

    // This method get multiple staff to a airline.
    getArilineStaffs(airlineCode: string): Promise<IPerson[]>;

    // This method adds multiple staff for a airline.
    addOrUpadateAirlineStaffs(airlineCode: string, persons: IPerson[] | any[], dbSession: ClientSession | undefined): Promise<void>;

    // This method deletes a staff for a ailine.
    deleteStaffStaff(airlineCode: string, userName: string, dbSession: ClientSession | undefined): Promise<void>;

    // This method deletes a all staffs for a airline.
    deleteAllAirlineStaff(airlineCode: string, dbSession: ClientSession | undefined): Promise<void>;

    // This method get multiple staff to a airline.
    getStaffArilines(userName: string): Promise<IAirline[]>;

    // This method adds multiple airlines to a staff.
    addOrUpdateStaffAirlines(userName: string, airlines: IAirline[] | any[], dbSession: ClientSession | undefined): Promise<void>;

    // This method deletes a all airlines for a staff.
    deleteAllStaffAirlines(userName: string, dbSession: ClientSession | undefined): Promise<void>;

}