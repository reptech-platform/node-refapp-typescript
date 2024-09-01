import { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import AutoIncrement from "mongoose-sequence";

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
    airLine: String;
    /**
     * Referencing the _id from Airport collection
     */
    fromAirport: String;
    /**
     * Referencing the _id from Airport collection
     */
    toAirport: String;
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
    duaration: { type: String, default: null },
    /**
     * Referencing the _id from Airline collection
     */
    airLine: { type: String, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    fromAirport: { type: String, default: null },
    /**
     * Referencing the _id from Airport collection
     */
    toAirport: { type: String, default: null }
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