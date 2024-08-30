import mongoose, { Document, Schema } from "mongoose";

export interface IPersonTripSchema extends Document {
    personId: string;
    tripId: string;
}

export const PersonTripSchema: Schema = new Schema({
    personId: { type: Schema.Types.ObjectId, default: null },
    tripId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

export default mongoose.model<IPersonTripSchema>("PersonTrip", PersonTripSchema);