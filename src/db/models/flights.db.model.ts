import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { AirLineSchema, IAirLineSchema } from "./airlines.db.model";
import { AirportSchema, IAirportSchema } from "./airports.db.model";

export interface IFlightSchema extends Document {
    flightNumber: String;
    seatNumber: String;
    confirmationCode: String;
    startsAt: Date;
    endsAt: Date;
    duaration: String;
    airLine: IAirLineSchema;
    fromAirport: IAirportSchema;
    toAirport: IAirportSchema;
}

export const FlightSchema: Schema = new Schema({
    flightNumber: { type: String, default: null },
    seatNumber: { type: String, default: null },
    confirmationCode: { type: String, default: null },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    duaration: { type: String, default: null },
    airLine: { type: AirLineSchema, default: null },
    fromAirport: { type: AirportSchema, default: null },
    toAirport: { type: AirportSchema, default: null }
}, {
    timestamps: true
});

new Helper().SetToJSON(FlightSchema);

// export default mongoose.model<IFlightSchema>("Flight", FlightSchema);