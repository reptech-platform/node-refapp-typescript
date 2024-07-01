import mongoose, { Document, Schema } from "mongoose";

export interface ILocationSchema extends Document {
    address: string;
    name: string;
    countryRegion: string;
    region: string;
}

export const LocationSchema: Schema = new Schema({
    name: { type: String, default: null },
    address: { type: String, default: null },
    countryRegion: { type: String, default: null },
    region: { type: String, default: null }
}, {
    _id: false
});

// export default mongoose.model<ILocationSchema>("Location", LocationSchema);