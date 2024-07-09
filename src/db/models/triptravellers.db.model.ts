import mongoose, { Document, Schema } from "mongoose";

export interface ITripTravellerSchema extends Document {
    personId: string;
    tripId: string;
}

export const TripTravellerSchema: Schema = new Schema({
    personId: { type: Schema.Types.ObjectId, default: null },
    tripId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

export default mongoose.model<ITripTravellerSchema>("TripTraveller", TripTravellerSchema);