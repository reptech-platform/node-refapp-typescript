import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";

export interface ICitySchema extends Document {
    name: String;
    countryRegion: String;
    region: String;
}

export const CitySchema: Schema = new Schema({
    name: { type: String, default: null },
    countryRegion: { type: String, default: null },
    region: { type: String, default: null }
}, {
    _id:false
});

new Helper().SetToJSON(CitySchema);

// export default mongoose.model<ICitySchema>("City", CitySchema);