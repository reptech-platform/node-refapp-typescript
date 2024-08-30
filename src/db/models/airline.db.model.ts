import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { PersonSchema, IPersonSchema } from "./person.db.model";

export interface IAirlineSchema extends Document {
    airlineCode: String;
    name: String;
    logo: String;
    CEO: IPersonSchema;
    airportId: String;
}

export const AirlineSchema: Schema = new Schema({
    airlineCode: { type: String, default: null },
    name: { type: String, default: null },
    logo: { type: String, default: null },
    CEO: { type: PersonSchema, default: null },
    airportId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

new Helper().SetToJSON(AirlineSchema);

export default mongoose.model<IAirlineSchema>("Airline", AirlineSchema);