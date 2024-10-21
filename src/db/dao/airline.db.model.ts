import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";

import { CEOSchema, ICEOSchema } from "./ceo.db.model";

/**
 * Interface to validate schema field construction
 */
export interface IAirlineSchema extends Document {
    airlineCode: String;
    name: String;
    logo: String;
    /**
     * Embeded collection inside the collection
     */
    CEO: ICEOSchema;
    /**
     * Referencing the _id from Airport collection
     */
    airportId: String;
}

/**
 * Schema defination to store the document
 */
export const AirlineSchema: Schema = new Schema({
    airlineCode: { type: String },
    name: { type: String, default: null },
    logo: { type: String, default: null },
    /**
     * Embeded collection inside the collection
     */
    CEO: { type: CEOSchema, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    airportId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

/**
 * Defining combination key with multiple fields
 */
AirlineSchema.index({ airlineCode: 1 }, { unique: true });

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(AirlineSchema);

/**
 * Export as default schema with assigning interface validation
 */
const schemaModal = mongoose.model<IAirlineSchema>("Airline", AirlineSchema);

export default schemaModal;