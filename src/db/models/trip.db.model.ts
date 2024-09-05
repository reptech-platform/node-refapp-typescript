import mongoose, { Document, Schema } from "mongoose";
import DateOnlyFactory from "mongoose-dateonly";
import AutoIncrementFactory from "mongoose-sequence";
import Helper from "../../utils/helper.utils";
import { PlanItemSchema, IPlanItemSchema } from "./planitem.db.model";

const AutoIncrement = AutoIncrementFactory(mongoose);
const DateOnly = DateOnlyFactory(mongoose);

/**
 * Interface to validate schema field construction
 */
export interface ITripSchema extends Document {
    tripId: Number;
    shareId: String,
    name: String;
    budget: Number;
    description: String;
    tags: String[];
    startAt: Date;
    endsAt: Date;
    startTime: Date;
    endTime: Date;
    cost: Number;
    planItems: IPlanItemSchema[]
}

/**
 * Schema defination to store the document
 */
export const TripSchema: Schema = new Schema({
    tripId: { type: Number },
    shareId: { type: mongoose.Types.UUID, default: new mongoose.Types.UUID() },
    name: { type: String, default: null },
    budget: { type: mongoose.Types.Decimal128, default: null },
    description: { type: String, default: null },
    tags: [{ type: String, default: null }],
    startAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    startTime: {
        type: Date, default: null,
        /* validate: {
            validator: function (v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // Validates HH:MM format
            },
            message: (props: { value: any; }) => `${props.value} is not a valid time format!`
        } */
    },
    endTime: {
        type: Date, default: null,
        /* validate: {
            validator: function (v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // Validates HH:MM format
            },
            message: (props: { value: any; }) => `${props.value} is not a valid time format!`
        } */
    },
    cost: { type: mongoose.Types.Decimal128, default: null },
    planItems: [{ type: PlanItemSchema, default: null }]
}, {
    timestamps: true,
    /**
     * Disabled _id field from default schema
     */
    // _id: false
});

/**
 * Define auto increment number
 */
TripSchema.plugin(AutoIncrement, { inc_field: 'tripId' });

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(TripSchema);

/**
 * Export as default schema with assigning interface validation
 */
export default mongoose.model<ITripSchema>("Trip", TripSchema);