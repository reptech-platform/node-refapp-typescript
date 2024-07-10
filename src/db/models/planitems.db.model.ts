import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { AirlineSchema, IAirlineSchema } from "./airlines.db.model";
import { AirportSchema, IAirportSchema } from "./airports.db.model";

export interface IPlanItemSchema extends Document {
    flightNumber: String;
    seatNumber: String;
    confirmationCode: String;
    startsAt: Date;
    endsAt: Date;
    duaration: String;
    airLine: IAirlineSchema;
    fromAirport: IAirportSchema;
    toAirport: IAirportSchema;
}

export const PlanItemSchema: Schema = new Schema({
    flightNumber: { type: String, default: null },
    seatNumber: { type: String, default: null },
    confirmationCode: { type: String, default: null },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    duaration: { type: String, default: null },
    airLine: { type: AirportSchema, default: null },
    fromAirport: { type: AirportSchema, default: null },
    toAirport: { type: AirportSchema, default: null }
}, {
    timestamps: true
});

new Helper().SetToJSON(PlanItemSchema);

//export default mongoose.model<IPlanItemSchema>("PlanItem", PlanItemSchema);