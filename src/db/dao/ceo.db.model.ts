import mongoose, { Document, Schema } from "mongoose";
import DateOnlyFactory from "mongoose-dateonly";
import { LocationSchema, ILocationSchema } from "./location.db.model";
import Helper from "../../utils/helper.utils";
import { PersonAttachmentSchema, IPersonAttachmentSchema } from "./personattachment.db.model";

const DateOnly = DateOnlyFactory(mongoose);
/**
 * Interface to validate schema field construction
 */
export interface ICEOSchema extends Document {
    userName: String;
    firstName: String;
    middleName: String;
    lastName: String;
    income: Number;
    dateOfBirth: typeof DateOnly;
    gender: Number;
    age: Number,
    emails: String[];
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
    bestFriend: String;
    /**
     * Embeded collection of array inside the collection
     */
    personAttachments: [IPersonAttachmentSchema];
}

/**
 * Schema defination to store the document
 */
export const CEOSchema: Schema = new Schema({
    userName: { type: String },
    firstName: { type: String, default: null },
    middleName: { type: String, default: null },
    lastName: { type: String, default: null },
    income: { type: mongoose.Types.Decimal128, default: null },
    dateOfBirth: { type: DateOnly, default: null },
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
    bestFriend: { type: String, default: null },
    /**
     * Embeded collection of array inside the collection
     */
    personAttachments: [PersonAttachmentSchema]
}, {
    timestamps: true,
    /**
     * Disabled _id field from default schema
     */
    _id: false
});

/**
 * Defining combination key with multiple fields
 */
// CEOSchema.index({ userName: 1 }, { unique: true });

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(CEOSchema);

/**
 * Export as default schema with assigning interface validation
 */
// export default mongoose.model<IPersonSchema>("Person", PersonSchema, 'persons');