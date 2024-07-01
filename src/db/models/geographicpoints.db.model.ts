import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";

export interface IGeographicPointSchema extends Document {
    latitude: Number;
    longitude: Number;
}

export const GeographicPointSchema: Schema = new Schema({
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
}, {
    _id:false
});

new Helper().SetToJSON(GeographicPointSchema);

// export default mongoose.model<IGeographicPointSchema>("GeographicPoint", GeographicPointSchema);