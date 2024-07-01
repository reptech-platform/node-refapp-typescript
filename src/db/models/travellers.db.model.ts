import mongoose, { Document, Schema } from "mongoose";

export interface ITravellerSchema extends Document {
    personId: string;
    tripId: string;
}

export const TravellerSchema: Schema = new Schema({
    personId: { type: Schema.Types.ObjectId, default: null },
    tripId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

export default mongoose.model<ITravellerSchema>("Traveller", TravellerSchema);