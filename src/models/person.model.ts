import { injectable } from "inversify";
import { ILocation } from "./location.model";
import { Feature, PersonGender } from "../enums";
import { IDocument } from "./document.model";
import { ITrip } from "./trip.model";

// Interface representing a person and their details
export interface IPerson {

    // Optional unique identifier username of the person
    userName?: string;

    // Optional first name of the person
    firstName?: string;

    // Optional middle name of the person
    middleName?: string;

    // Optional last name of the person
    lastName?: string;

    // Optional income of the person
    income?: number;

    // Optional date of birth of the person
    dateOfBirth?: Date;

    // Optional gender of the person, represented by the PersonGender enum
    gender?: PersonGender;

    // Optional age of the person
    age?: number;

    // Optional array of email addresses of the person
    emails?: string[];

    // Optional array of document attachments related to the person, represented by the IDocument interface
    personAttachments?: IDocument[];

    // Optional best friend of the person, represented by the IPerson interface
    bestFriendId?: string;

    // Optional best friend, represented as another IPerson
    bestFriend?: IPerson;

    // Optional array of friends of the person, each represented by the IPerson interface
    friendsList?: string[];

    // Optional array of friends, represented as IPerson[]
    friends?: IPerson[];

    // Optional array of address information, each represented by the ILocation interface
    addressInfo?: ILocation[];

    // Optional home address of the person, represented by the ILocation interface
    homeAddress?: ILocation;

    // Optional favorite feature of the person, represented by the Feature enum
    favoriteFeature?: Feature;

    // Optional array of features of the person, each represented by the Feature enum
    features?: Feature[];

    // Optional array of trips of the person, each represented by the ITrip interface
    trips?: ITrip[];

    // Optional array of trip IDs
    tripIds?: number[];
}


// Class implementing the IPerson interface
@injectable()
export class Person implements IPerson {

    // Optional unique identifier username of the person
    userName?: string;

    // Optional first name of the person
    firstName?: string;

    // Optional middle name of the person
    middleName?: string;

    // Optional last name of the person
    lastName?: string;

    // Optional income of the person
    income?: number;

    // Optional date of birth of the person
    dateOfBirth?: Date;

    // Optional gender of the person, represented by the PersonGender enum
    gender?: PersonGender;

    // Optional age of the person
    age?: number;

    // Optional array of email addresses of the person
    emails?: string[];

    // Optional array of document attachments related to the person, represented by the IDocument interface
    personAttachments?: IDocument[];

    // Optional best friend of the person, represented by the IPerson interface
    bestFriendId?: string;

    // Optional best friend, represented as another IPerson
    bestFriend?: IPerson;

    // Optional array of friends of the person, each represented by the IPerson interface
    friendsList?: string[];

    // Optional array of friends, represented as IPerson[]
    friends?: IPerson[];

    // Optional array of address information, each represented by the ILocation interface
    addressInfo?: ILocation[];

    // Optional home address of the person, represented by the ILocation interface
    homeAddress?: ILocation;

    // Optional favorite feature of the person, represented by the Feature enum
    favoriteFeature?: Feature;

    // Optional array of features of the person, each represented by the Feature enum
    features?: Feature[];

    // Optional array of trips of the person, each represented by the ITrip interface
    trips?: ITrip[];

    // Optional array of trip IDs
    tripIds?: number[];

    // Constructor for the Person class
    constructor() { }
}
