import { provideSingleton, inject } from "../utils/provideSingleton";
import { IPerson } from "../models/person.model";
import { IAirline } from "../models/airline.model";
import AirlineStaffRepository from "../repositories/airlinestaff.repository";

// This decorator ensures that AirlineStaffsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(AirlineStaffService)
export default class AirlineStaffService {

    // Injecting the Helper, PersonsService and TripService services
    constructor(
        @inject(AirlineStaffRepository) private airlineStaffRepository: AirlineStaffRepository
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
    public async addOrUpadateAirlineStaffs(airlineCode: string, persons: IPerson[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        /* if (persons && persons.length > 0) {
            // Loop Check if the persons already exists in the database using its userName
            for (let index = 0; index < persons.length; index++) {

                // Read person based on index loop
                let currentPerson = persons[index];

                // Check the person is exist in the database
                let isExist = await this.personsService.isPersonExist(currentPerson.userName);

                if (!isExist) {
                    // If the person does not exist, create a new person entry in the database
                    currentPerson = await this.personsService.createPerson(currentPerson);
                } else {
                    // If the person exist, update person entry in the database
                    await this.personsService.updatePerson(currentPerson.userName, currentPerson);
                }

                // Check airline and person is already mapped
                isExist = await this.isAirlineAndStaffExist(airlineCode, currentPerson.userName);

                if (!isExist) {
                    // Add userName to array of id list for person airline mapping
                    mapItems.push({ airlineCode, userName: currentPerson.userName });
                }
            }
        } */

        return await this.airlineStaffRepository.addOrUpadateAirlineStaffs(mapItems);
    }

    // This method deletes a staff for a ailine.
    public async deleteStaffStaff(airlineCode: string, userName: string): Promise<void> {
        return await this.airlineStaffRepository.deleteStaffStaff(airlineCode, userName);
    }

    // This method deletes a all staffs for a airline.
    public async deleteAllAirlineStaff(airlineCode: string): Promise<void> {
        return await this.airlineStaffRepository.deleteAllAirlineStaff(airlineCode);
    }

    // This method get multiple staff to a airline.
    public async getStaffArilines(userName: string): Promise<IAirline[]> {
        return await this.airlineStaffRepository.getStaffArilines(userName);
    }

    // This method adds multiple airlines to a staff.
    public async addOrUpdateStaffAirlines(userName: string, airlines: IAirline[] | any[]): Promise<void> {

        let mapItems: any[] = [];

        /* if (airlines && airlines.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < airlines.length; index++) {

                // Read traveller based on index loop
                let currentAirline = airlines[index];

                // Check the traveller is exist in the database
                let isExist = await this.airlinesService.isAirlineExist(currentAirline.airlineCode);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentAirline = await this.airlinesService.createAirline(currentAirline);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.airlinesService.updateAirline(currentAirline.airlineCode, currentAirline);
                }

                // Check person and trip is already mapped
                isExist = await this.isAirlineAndStaffExist(currentAirline.airlineCode, userName);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ airlineCode: currentAirline.airlineCode, userName });
                }
            }
        } */

        return await this.airlineStaffRepository.addOrUpdateStaffAirlines(mapItems);
    }

    // This method deletes a all airlines for a staff.
    public async deleteAllStaffAirlines(userName: string): Promise<void> {
        return await this.airlineStaffRepository.deleteAllStaffAirlines(userName);
    }

}