import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { FlightSchema, IFlightSchema } from "./flights.db.model";

export interface ITripSchema extends Document {
    shareId: string,
    name: string;
    description: string;
    tags: string[];
    startAt: Date;
    endsAt: Date;
    startTime: Date;
    endTime: Date;
    cost: Number;
    budget: Number;
    flights: IFlightSchema[]
}

export const TripSchema: Schema = new Schema({
    shareId: { type: mongoose.Types.UUID, default: new mongoose.Types.UUID() },
    name: { type: String, default: null },
    description: { type: String, default: null },
    tags: [{ type: String, default: null }],
    startAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    cost: { type: mongoose.Types.Decimal128, default: null },
    budget: { type: mongoose.Types.Decimal128, default: null },
    flights: [{ type: FlightSchema, default: null }]
}, {
    timestamps: true
});

new Helper().SetToJSON(TripSchema);

export default mongoose.model<ITripSchema>("Trip", TripSchema);