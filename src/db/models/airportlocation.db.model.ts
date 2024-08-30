import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { GeographicPointSchema, IGeographicPointSchema } from "./geographicpoint.db.model";
import { CitySchema, ICitySchema } from "./city.db.model";

export interface IAirportLocationSchema extends Document {
    loc: IGeographicPointSchema;
    address: String;
    city: ICitySchema;
}

export const AirportLocationSchema: Schema = new Schema({
    loc: { type: GeographicPointSchema, default: null },
    address: { type: String, default: null },
    city: { type: CitySchema, default: null }

}, {
    _id: false
});

new Helper().SetToJSON(AirportLocationSchema);

// export default mongoose.model<IAirportLocationSchema>("AirportLocation", AirportLocationSchema);