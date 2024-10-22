import { ClientSession } from "mongoose";
import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";

export default interface IAirlineStaffRepository {

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean>;

    // This method get multiple staff to a airline.
    getArilineStaffs(airlineCode: string): Promise<IPerson[]>;

    // This method adds multiple staff for a airline.
    addOrUpadateAirlineStaffs(mapItems: [] | any[], session: ClientSession | undefined): Promise<void>;

    // This method deletes a staff for a ailine.
    deleteStaffStaff(airlineCode: string, userName: string, session: ClientSession | undefined): Promise<void>;

    // This method deletes a all staffs for a airline.
    deleteAllAirlineStaff(airlineCode: string, session: ClientSession | undefined): Promise<void>;

    // This method get multiple staff to a airline.
    getStaffArilines(userName: string): Promise<IAirline[]>;

    // This method adds multiple airlines to a staff.
    addOrUpdateStaffAirlines(mapItems: [] | any[], session: ClientSession | undefined): Promise<void>;

    // This method deletes a all airlines for a staff.
    deleteAllStaffAirlines(userName: string, session: ClientSession | undefined): Promise<void>;

}