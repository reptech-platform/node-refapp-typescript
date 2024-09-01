import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface to validate schema field construction
 */
export interface IAirportStaffSchema extends Document {
    /**
     * Referencing the userName from Person collection
     */
    userName: string;
    /**
     * Referencing the airline code from Airline collection
     */
    airlineCode: String;
}

/**
 * Schema defination to store the document
 */
export const AirportStaffSchema: Schema = new Schema({
    /**
     * Referencing the userName from Person collection
     */
    userName: { type: String },
    /**
     * Referencing the airline code from Airline collection
     */
    airlineCode: { type: String }
}, {
    timestamps: true
});

/**
 * Export as default schema with assigning interface validation
 */
export default mongoose.model<IAirportStaffSchema>("AirportStaff", AirportStaffSchema);