import mongoose, { Document, Schema } from "mongoose";
import { CitySchema, ICitySchema } from "./cities.db.model";

export interface ILocationSchema extends Document {
    address: string;
    city: ICitySchema;
}

export const LocationSchema: Schema = new Schema({
    address: { type: String, default: null },
    city: { type: CitySchema, default: null },
}, {
    _id: false
});

// export default mongoose.model<ILocationSchema>("Location", LocationSchema);