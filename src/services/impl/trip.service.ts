
import { ClientSession } from "mongoose";
import { ITrip } from "../../models/trip.model";
import { Search, SearchResults } from "../../models/search.model";
import MapItem from "../../utils/mapitems";
import { IPerson } from "../../models/person.model";
import DbSession from "../../db/utils/dbsession.db";
import ITripService from "../trip.interface";
import { inject, injectable } from "inversify";
import ITripRepository from "../../repositories/trip.repository";
import { IPlanItem } from "../../models/planitem.model";
import Helper from "../../utils/helper.utils";
import { IAirport } from "../../models/airport.model";
import IPersonRepository from "../../repositories/person.repository";
import IPersonTripRepository from "../../repositories/persontrip.repository";
import IAirportRepository from "../../repositories/airport.repository";

// This decorator ensures that TripsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class TripService implements ITripService {

    // Injecting the Helper service
    constructor(
        @inject(Helper) private helper: Helper,
        @inject("ITripRepository") private tripRepository: ITripRepository,
        @inject("IPersonRepository") private personRepository: IPersonRepository,
        @inject('IPersonTripRepository') private personTripRepository: IPersonTripRepository,
        @inject('IAirportRepository') private airportRepository: IAirportRepository

    ) { }

    // Checks if a trip with the given tripId exists in the database.
    public async isTripExist(tripId: number): Promise<boolean> {
        return await this.tripRepository.isTripExist(tripId);
    }

    // Fetches all trips from the database, excluding the _id field.
    public async getTrips(): Promise<ITrip[]> {
        return await this.tripRepository.getTrips();
    }

    // Fetches a single trip by its tripId, excluding the _id field.
    public async getTrip(tripId: number): Promise<ITrip> {
        return await this.tripRepository.getTrip(tripId);
    }

    // Creates a new trip in the database.
    public async createTrip(trip: ITrip, dbSession: ClientSession | undefined): Promise<ITrip> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create all airports and airlines
        // Retrieve the planitem information from the trip object, which may be undefined
        const planItems: IPlanItem[] | undefined = trip.planItems;

        if (planItems && planItems.length > 0) {

            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < planItems.length; index++) {

                // Read traveller based on index loop
                let planItem = planItems[index];

                // Create from airport
                let airport: IAirport | undefined = planItem.fromAirport;
                if (airport && !this.helper.IsNullValue(airport)) {
                    let airportId = await this.airportRepository.getAirportId(airport.iataCode, airport.iataCode);
                    if (this.helper.IsNullValue(airportId)) {
                        airport = await this.airportRepository.createAirport(airport, dbSession);
                        airportId = airport['_id'];
                    }
                    planItem.fromAirportId = airportId;
                }

                // Create to airport
                airport = planItem.toAirport;
                if (airport && !this.helper.IsNullValue(airport)) {
                    let airportId = await this.airportRepository.getAirportId(airport.iataCode, airport.iataCode);
                    if (this.helper.IsNullValue(airportId)) {
                        airport = await this.airportRepository.createAirport(airport, dbSession);
                        airportId = airport['_id'];
                    }
                    planItem.toAirportId = airportId;
                }

                planItems[index] = planItem;
            }
        }

        trip.planItems = planItems;

        // Create trip by passing session
        let newTrip = await this.tripRepository.createTrip(trip, dbSession);

        const tripId: number | undefined = newTrip.tripId;

        // Retrieve the travellers information from the trip object, which may be undefined
        const travellers: IPerson[] | undefined = trip.travellers;

        let mapItems: MapItem[] = [];

        if (tripId && travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personRepository.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personRepository.createPerson(currentTraveller, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personRepository.updatePerson(currentTraveller.userName, currentTraveller, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.personTripRepository.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }

            if (mapItems && mapItems.length > 0) {
                // Add or update trips and map the person trips
                await this.personTripRepository.mapPersonsAndTrips(mapItems, dbSession);
            }
        }

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        // Returns newly created trip object
        return newTrip;
    }

    // Updates an existing trip by its tripId and returns the updated trip.
    public async updateTrip(tripId: number, trip: any, dbSession: ClientSession | undefined): Promise<ITrip> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        // Create all airports and airlines
        // Retrieve the planitem information from the trip object, which may be undefined
        const planItems: IPlanItem[] | undefined = trip.planItems;

        if (planItems && planItems.length > 0) {

            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < planItems.length; index++) {

                // Read traveller based on index loop
                let planItem = planItems[index];

                // Create from airport
                let airport: IAirport | undefined = planItem.fromAirport;
                if (airport && !this.helper.IsNullValue(airport)) {
                    let airportId = await this.airportRepository.getAirportId(airport.iataCode, airport.iataCode);
                    if (this.helper.IsNullValue(airportId)) {
                        airport = await this.airportRepository.createAirport(airport, dbSession);
                        airportId = airport['_id'];
                    }
                    planItem.fromAirportId = airportId;
                }

                // Create to airport
                airport = planItem.toAirport;
                if (airport && !this.helper.IsNullValue(airport)) {
                    let airportId = await this.airportRepository.getAirportId(airport.iataCode, airport.iataCode);
                    if (this.helper.IsNullValue(airportId)) {
                        airport = await this.airportRepository.createAirport(airport, dbSession);
                        airportId = airport['_id'];
                    }
                    planItem.toAirportId = airportId;
                }

                planItems[index] = planItem;
            }
        }

        trip.planItems = planItems;

        let updatedTrip = await this.tripRepository.updateTrip(tripId, trip, dbSession);

        // Retrieve the travellers information from the trip object, which may be undefined
        const travellers: IPerson[] | undefined = trip.travellers;

        let mapItems: MapItem[] = [];

        if (travellers && travellers.length > 0) {
            // Loop Check if the travellers are already exists in the database using its tripId
            for (let index = 0; index < travellers.length; index++) {

                // Read traveller based on index loop
                let currentTraveller = travellers[index];

                // Check the traveller is exist in the database
                let isExist = await this.personRepository.isPersonExist(currentTraveller.userName);

                if (!isExist) {
                    // If the traveller does not exist, create a new traveller entry in the database
                    currentTraveller = await this.personRepository.createPerson(currentTraveller, dbSession);
                } else {
                    // If the trip exist, update trip entry in the database
                    await this.personRepository.updatePerson(currentTraveller.userName, currentTraveller, dbSession);
                }

                // Check person and trip is already mapped
                isExist = await this.personTripRepository.isPersonAndTripExist(currentTraveller.userName, tripId);

                if (!isExist) {
                    // Add tripId to array of id list for person trip mapping
                    mapItems.push({ userName: currentTraveller.userName, tripId });
                }
            }
        }

        if (mapItems && mapItems.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripRepository.mapPersonsAndTrips(mapItems, dbSession);
        }

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return updatedTrip;
    }

    // Deletes a trip by its tripId.
    public async deleteTrip(tripId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        let boolDeleted: boolean = await this.tripRepository.deleteTrip(tripId, dbSession);

        // delete all trip travellers from the database
        await this.personTripRepository.deleteAllTripTravellers(tripId, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return boolDeleted;
    }

    // Searches for trips based on the provided search criteria.
    public async searchTrip(search: Search): Promise<SearchResults> {
        return await this.tripRepository.searchTrip(search);
    }

    // Gets the total count of trips matching the search criteria.
    public async searchTripCount(search: Search): Promise<number> {
        return await this.tripRepository.searchTripCount(search);
    }

    // This method returns the total count of trips in the database.
    public async getTripCount(): Promise<number> {
        return await this.tripRepository.getTripCount();
    }

}