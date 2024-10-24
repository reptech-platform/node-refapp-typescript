import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import AutoIncrementFactory from "mongoose-sequence";
import { AirlineSchema, IAirlineSchema } from "./airline.db.model";
import { DocumentSchema, IDocumentSchema } from "./document.db.model";

const AutoIncrement = AutoIncrementFactory(mongoose);

/**
 * Interface to validate schema field construction
 */
export interface IPlanItemSchema extends Document {
    flightNumber: String;
    /**
     * Extended from complext public transport model
     */
    seatNumber: String;
    /**
     * Extended from complext base plan item model
     */
    planItemId: Number;
    confirmationCode: String;
    startsAt: Date;
    endsAt: Date;
    duaration: Number;
    /**
     * Referencing the _id from Airline collection
     */
    airLine: IAirlineSchema;
    /**
     * Referencing the _id from Airport collection
     */
    fromAirport: String;
    /**
     * Referencing the _id from Airport collection
     */
    toAirport: String;

    // Optional ticket document for the plan item, represented by the IDocument interface
    ticket?: IDocumentSchema;
}

/**
 * Schema defination to store the document
 */
export const PlanItemSchema: Schema = new Schema({
    flightNumber: { type: String, default: null },
    /**
     * Extended from complext public transport model
     */
    seatNumber: { type: String, default: null },
    /**
     * Extended from complext base plan item model
     */
    planItemId: { type: Number },
    confirmationCode: { type: String, default: null },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    duaration: { type: Number, default: null },
    /**
     * Referencing the _id from Airline collection
     */
    airLine: { type: AirlineSchema, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    fromAirportId: { type: Schema.Types.ObjectId, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    toAirportId: { type: Schema.Types.ObjectId, default: null },

    // Optional ticket document for the plan item, represented by the IDocument interface
    ticket: { type: DocumentSchema, default: null }
}, {
    timestamps: true,
    /**
     * Disabled _id field from default schema
     */
    _id: false
});


/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(PlanItemSchema);

/**
 * Define auto increment number
 */
PlanItemSchema.plugin(AutoIncrement, { inc_field: 'planItemId' });

//export default mongoose.model<IPlanItemSchema>("PlanItem", PlanItemSchema);