import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import PlanItemSchema, { IPlanItemSchema } from "./planitem.db.model";

/**
 * Interface to validate schema field construction
 */
export interface ITripSchema extends Document {
    tripId: Number;
    shareId: string,
    name: string;
    budget: Number;
    description: string;
    tags: string[];
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
const TripSchema: Schema = new Schema({
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
 * Generate unique sequence number before saving
 */
TripSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.tripId = await getNextSequenceValue();
    }
    next();
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(TripSchema);

const schemaModal = mongoose.model<ITripSchema>("Trip", TripSchema);

/**
 * Generate next sequence value
 * @returns number
 */
async function getNextSequenceValue() {
    const maxDoc = await schemaModal.findOne().sort({ tripId: -1 });
    let lastNumber: any = 0;
    if (maxDoc) lastNumber = maxDoc.tripId;
    return ++lastNumber;
}

export default schemaModal;