import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface to validate schema field construction
 */
export interface IAirlineStaffSchema extends Document {
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
export const AirlineStaffSchema: Schema = new Schema({
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
const schemaModal = mongoose.model<IAirlineStaffSchema>("AirlineStaff", AirlineStaffSchema);

export default schemaModal;