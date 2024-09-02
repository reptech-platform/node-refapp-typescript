import { injectable } from "inversify";
import { ILocation } from "./location.model";
import { ITrip } from "./trip.model";
import { Feature, PersonGender } from "../enums";
import { IDocument } from "./document.model";

/**
 * Interface to validate model field construction
 */
export interface IPerson {
    userName?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    income?: number,
    dateOfBirth?: Date,
    gender?: PersonGender,
    age?: number,
    emails?: string[],
    personAttachments: IDocument[];
    bestFriend: IPerson;
    friends: IPerson[];
    addressInfo?: ILocation[],
    homeAddress?: ILocation,
    favoriteFeature?: Feature,
    features?: Feature[],
    trips?: ITrip[]
}

/**
 * Model defination for Data transfer object
 */
@injectable()
export class Person implements IPerson {
    _id: string;
    userName?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    income?: number;
    dateOfBirth?: Date;
    gender?: PersonGender;
    age?: number;
    emails?: string[];
    personAttachments: IDocument[];
    bestFriend: IPerson;
    friends: IPerson[];
    addressInfo?: ILocation[];
    homeAddress?: ILocation;
    favoriteFeature?: Feature;
    features?: Feature[];
    trips?: ITrip[];

    constructor() { }

}