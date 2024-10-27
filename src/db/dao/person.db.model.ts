import mongoose, { Document, Schema } from "mongoose";
import DateOnlyFactory from "mongoose-dateonly";
import LocationSchema, { ILocationSchema } from "./location.db.model";
import Helper from "../../utils/helper.utils";
import PersonAttachmentSchema, { IPersonAttachmentSchema } from "./personattachment.db.model";

const DateOnly = DateOnlyFactory(mongoose);

const helper = new Helper();

/**
 * Interface to validate schema field construction
 */
export interface IPersonSchema extends Document {
    userName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    income: Number;
    dateOfBirth: Date;
    gender: Number;
    age: Number,
    emails: string[];
    /**
     * Embeded collection of array inside the collection
     */
    addressInfo: [ILocationSchema];
    /**
     * Embeded collection inside the collection
     */
    homeAddress: ILocationSchema;
    favoriteFeature: Number;
    features: Number[];
    /**
     * Referencing the userName from Person collection
     */
    bestFriendId: string;
    /**
     * Referencing the userName from Person collection
     */
    friendsList: [string];
    /**
     * Embeded collection of array inside the collection
     */
    personAttachments: [IPersonAttachmentSchema];
}

/**
 * Schema defination to store the document
 */
export const PersonSchema: Schema = new Schema({
    userName: { type: String },
    firstName: { type: String, default: null },
    middleName: { type: String, default: null },
    lastName: { type: String, default: null },
    income: { type: mongoose.Types.Decimal128, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: { type: Number, default: null },
    age: { type: Number, default: null },
    emails: [{ type: String, default: null }],
    /**
     * Embeded collection of array inside the collection
     */
    addressInfo: [{ type: LocationSchema, default: null }],
    /**
     * Embeded collection inside the collection
     */
    homeAddress: { type: LocationSchema, default: null },
    favoriteFeature: { type: Number, default: null },
    features: [{ type: Number, default: null }],
    /**
     * Referencing the userName from Person collection
     */
    bestFriendId: { type: String, default: null },
    /**
     * Referencing the userName from Person collection
     */
    friendsList: [String],
    /**
     * Embeded collection of array inside the collection
     */
    personAttachments: [PersonAttachmentSchema]
}, {
    timestamps: true,
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
helper.SetToJSON(PersonSchema);

/**
 * Export as default schema with assigning interface validation
 */
const schemaModal = mongoose.model<IPersonSchema>("Person", PersonSchema, 'persons');

export default schemaModal;