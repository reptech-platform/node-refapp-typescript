import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface to validate schema field construction
 */
export interface IPersonTripSchema extends Document {
    /**
     * Referencing the userName from Person collection
     */
    userName: string;
    /**
     * Referencing the tripId from Trip collection
     */
    tripId: Number;
}

/**
 * Schema defination to store the document
 */
const PersonTripSchema: Schema = new Schema({
    /**
     * Referencing the userName from Person collection
     */
    userName: { type: String },
    /**
     * Referencing the tripId from Trip collection
     */
    tripId: { type: Number }
}, {
    timestamps: true
});

/**
 * Export as default schema with assigning interface validation
 */
const schemaModal = mongoose.model<IPersonTripSchema>("PersonTrip", PersonTripSchema);

export default schemaModal;