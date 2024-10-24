import { IPerson } from "../../models/person.model";
import { IAirline } from "../../models/airline.model";
import { inject, injectable } from "inversify";
import IAirlineStaffService from "../airlinestaff.interface";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IAirlineStaffRepository from "../../repositories/airlinestaff.repository";
import IPersonRepository from "../../repositories/person.repository";
import IAirlineRepository from "../../repositories/airline.repository";

// This decorator ensures that AirlineStaffsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class AirlineStaffService implements IAirlineStaffService {

    // Injecting the Helper, PersonsService and TripService services
    constructor(
        @inject("IAirlineStaffRepository") private airlineStaffRepository: IAirlineStaffRepository,
        @inject("IPersonRepository") private personRepository: IPersonRepository,
        @inject("IAirlineRepository") private airlineRepository: IAirlineRepository
    ) { }

    // This method checks if a person with the given userName is associated with a airline with the given airlineCode.
    public async isAirlineAndStaffExist(airlineCode: string, userName: string): Promise<boolean> {
        return await this.airlineStaffRepository.isAirlineAndStaffExist(airlineCode, userName);
    }

    // This method get multiple staff to a airline.
    public async getArilineStaffs(airlineCode: string): Promise<IPerson[]> {
        return await this.airlineStaffRepository.getArilineStaffs(airlineCode);
    }

    // This method adds multiple staff for a airline.
    public async addOrUpadateAirlineStaffs(airlineCode: string, persons: IPerson[] | any[], dbSession: ClientSession | undefined): Promise<void> {

        let mapItems: any[] = [];

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        if (persons && persons.length > 0) {
            // Loop Check if the persons already exists in the database using its userName
            for (let index = 0; index < persons.length; index++) {

                // Read person based on index loop
                let currentPerson = persons[index];

                // Check the person is exist in the database
                let isExist = await this.personRepository.isPersonExist(currentPerson.userName);

                if (!isExist) {
                    // If the person does not exist, create a new person entry in the database
                    currentPerson = await this.personRepository.createPerson(currentPerson, dbSession);
                } else {
                    // If the person exist, update person entry in the database
                    await this.personRepository.updatePerson(currentPerson.userName, currentPerson, dbSession);
                }

                // Check airline and person is already mapped
                isExist = await this.isAirlineAndStaffExist(airlineCode, currentPerson.userName);

                if (!isExist) {
                    // Add userName to array of id list for person airline mapping
                    mapItems.push({ airlineCode, userName: currentPerson.userName });
                }
            }
        }

        await this.airlineStaffRepository.addOrUpadateAirlineStaffs(mapItems, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

    }

    // This method deletes a staff for a ailine.
    public async deleteStaffStaff(airlineCode: string, userName: string, dbSession: ClientSession | undefined): Promise<void> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        await this.airlineStaffRepository.deleteStaffStaff(airlineCode, userName, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }

    // This method deletes a all staffs for a airline.
    public async deleteAllAirlineStaff(airlineCode: string, dbSession: ClientSession | undefined): Promise<void> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        await this.airlineStaffRepository.deleteAllAirlineStaff(airlineCode, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }

    // This method get multiple staff to a airline.
    public async getStaffArilines(userName: string): Promise<IAirline[]> {
        return await this.airlineStaffRepository.getStaffArilines(userName);
    }

    // This method adds multiple airlines to a staff.
    public async addOrUpdateStaffAirlines(userName: string, airlines: IAirline[] | any[], dbSession: ClientSession | undefined): Promise<void> {

        let mapItems: any[] = [];

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        if (airlines && airlines.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < airlines.length; index++) {

                // Read traveller based on index loop
                let currentAirline = airlines[index];

                // Check the traveller is exist in the database
                let isExist = await this.airlineRepository.isAirlineExist(currentAirline.airlineCode);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentAirline = await this.airlineRepository.createAirline(currentAirline, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.airlineRepository.updateAirline(currentAirline.airlineCode, currentAirline, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.isAirlineAndStaffExist(currentAirline.airlineCode, userName);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ airlineCode: currentAirline.airlineCode, userName });
                }
            }
        }

        await this.airlineStaffRepository.addOrUpdateStaffAirlines(mapItems, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }

    // This method deletes a all airlines for a staff.
    public async deleteAllStaffAirlines(userName: string, dbSession: ClientSession | undefined): Promise<void> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        await this.airlineStaffRepository.deleteAllStaffAirlines(userName, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }
    }

}