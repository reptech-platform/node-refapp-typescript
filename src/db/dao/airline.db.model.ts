import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { PersonSchema, IPersonSchema } from './person.db.model';

/**
 * Interface to validate schema field construction
 */
export interface IAirlineSchema extends Document {
    airlineCode: string;
    name: string;
    logo: string;
    /**
     * Embeded collection inside the collection
     * If the CEO is updated in the person's collection that will not be reflected in this collection
     */
    CEO: IPersonSchema;
    /**
     * Referencing the _id from Airport collection
     */
    airportId: string;
}

/**
 * Schema defination to store the document
 */
const AirlineSchema: Schema = new Schema({
    airlineCode: { type: String },
    name: { type: String, default: null },
    logo: { type: String, default: null },
    /**
     * Embeded collection inside the collection
     */
    CEO: { type: PersonSchema, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    airportId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(AirlineSchema);

/**
 * Export as default schema with assigning interface validation
 */
const schemaModal = mongoose.model<IAirlineSchema>("Airline", AirlineSchema);

export default schemaModal;