import { injectable } from "inversify";
import { ILocation } from "./location.model";
import { ITrip } from "./trip.model";
import { Feature, PersonGender } from "../enums";
import { IDocument } from "./document.model";

export interface IPerson {
    _id: string;
    userName?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    income?: number,
    dateOfBirth?: Date,
    gender?: PersonGender,
    age?: number,
    emails?: string[],
    /* Person Attachments are embeded */
    personAttachments: IDocument[];
    bestFriend: IPerson;
    friends: IPerson[];
    addressInfo?: ILocation[],
    homeAddress?: ILocation,
    favoriteFeature?: Feature,
    features?: Feature[],
    trips?: ITrip[]
}


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