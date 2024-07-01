import { injectable } from "inversify";
import { ILocation } from "./location.model";
import { ITrip } from "./trips.model";

export interface IPerson {
    userName: string,
    firstName: string,
    middleName: string,
    lastName: string,
    income: number,
    dateOfBirth: Date,
    gender: PersonGender,
    age: number,
    emails: string[],
    addressInfo: ILocation[],
    homeAddress: ILocation,
    favoriteFeature: Feature,
    features: Feature[],
    trips: ITrip[] | []
}


@injectable()
export class Person implements IPerson {

    userName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    income: number;
    dateOfBirth: Date;
    gender: PersonGender;
    age: number;
    emails: string[];
    addressInfo: ILocation[];
    homeAddress: ILocation;
    favoriteFeature: Feature;
    features: Feature[];
    trips: ITrip[] | [];

    constructor() { }

}