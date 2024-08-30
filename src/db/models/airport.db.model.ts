import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { IAirportLocationSchema, AirportLocationSchema } from "./airportlocation.db.model";

export interface IAirportSchema extends Document {
    name: String;
    icaoCode: String;
    iataCode: String;
    latitude: Number;
    longitude: Number;
    isInsideCity: Boolean;
    locationJSON: String;
    location: IAirportLocationSchema;
    airlineId: String;
}

export const AirportSchema: Schema = new Schema({
    name: { type: String, default: null },
    icaoCode: { type: String, default: null },
    iataCode: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    isInsideCity: { type: Boolean, default: null },
    locationJSON: { type: String, default: null },
    location: { type: AirportLocationSchema, default: null },
    airlineId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

new Helper().SetToJSON(AirportSchema);

export default mongoose.model<IAirportSchema>("Airport", AirportSchema);