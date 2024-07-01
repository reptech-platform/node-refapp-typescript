import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { IAirportLocationSchema, AirportLocationSchema } from "./airportlocations.db.model";

export interface IAirportSchema extends Document {
    name: String;
    icaoCode: String;
    iataCode: String;
    latitude: Number;
    longitude: Number;
    isInsideCity: Boolean;
    locationJSON: String;
    location: IAirportLocationSchema;
}

export const AirportSchema: Schema = new Schema({
    name: { type: String, default: null },
    icaoCode: { type: String, default: null },
    iataCode: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    isInsideCity: { type: Boolean, default: null },
    locationJSON: { type: String, default: null },
    location: { type: AirportLocationSchema, default: null }

}, {
    _id:false
});

new Helper().SetToJSON(AirportSchema);

// export default mongoose.model<IAirportSchema>("Airport", AirportSchema);