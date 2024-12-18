import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import AirportLocationSchema, { IAirportLocationSchema } from "./airportlocation.db.model";

/**
 * Interface to validate schema field construction
 */
export interface IAirportSchema extends Document {
    name: string;
    icaoCode: string;
    iataCode: string;
    latitude: Number;
    longitude: Number;
    isInsideCity: Boolean;
    locationJSON: string;
    /**
     * Embeded collection inside the collection
     */
    location: IAirportLocationSchema;
    airline: string;
}

/**
 * Schema defination to store the document
 */
export const AirportSchema: Schema = new Schema({
    icaoCode: { type: String },
    iataCode: { type: String },
    name: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    isInsideCity: { type: Boolean, default: null },
    locationJSON: { type: String, default: null },
    /**
     * Embeded collection inside the collection
     */
    location: { type: AirportLocationSchema, default: null },
    /**
     * Referencing the _id from Airline collection
     */
    airline: { type: String, default: null }
}, {
    timestamps: true
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(AirportSchema);

/**
 * Export as default schema with assigning interface validation
 */
const schemaModal = mongoose.model<IAirportSchema>("Airport", AirportSchema);

export default schemaModal;