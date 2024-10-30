import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import AutoIncrementFactory from "mongoose-sequence";
import { DocumentSchema, IDocumentSchema } from "./document.db.model";

const AutoIncrement = AutoIncrementFactory(mongoose);

/**
 * Interface to validate schema field construction
 */
export interface IPlanItemSchema extends Document {
    flightNumber: string;
    /**
     * Extended from complext public transport model
     */
    seatNumber: string;
    /**
     * Extended from complext base plan item model
     */
    planItemId: Number;
    confirmationCode: string;
    startsAt: Date;
    endsAt: Date;
    duaration: Number;
    /**
     * Referencing the _id from Airline collection
     */
    airLine: string
    /**
     * Referencing the _id from Airport collection
     */
    fromAirport: string;
    /**
     * Referencing the _id from Airport collection
     */
    toAirport: string;

    // Optional ticket document for the plan item, represented by the IDocument interface
    ticket?: number;
}

/**
 * Schema defination to store the document
 */
const PlanItemSchema: Schema = new Schema({
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
    airLine: { type: String, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    fromAirport: { type: Schema.Types.ObjectId, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    toAirport: { type: Schema.Types.ObjectId, default: null },

    // Optional ticket document for the plan item, represented by the IDocument interface
    ticket: { type: Number, default: null }
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

// const schemaModal = mongoose.model<IPlanItemSchema>("PlanItem", PlanItemSchema);

export default PlanItemSchema;