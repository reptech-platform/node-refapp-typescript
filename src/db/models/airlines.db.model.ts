import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { PersonSchema, IPersonSchema } from "./persons.db.model";

export interface IAirLineSchema extends Document {
    airlineCode: String;
    name: String;
    logo: String;
    CEO: IPersonSchema;
}

export const AirLineSchema: Schema = new Schema({
    airlineCode: { type: String, default: null },
    name: { type: String, default: null },
    logo: { type: String, default: null },
    CEO: { type: PersonSchema, default: null }
}, {
    _id:false
});

new Helper().SetToJSON(AirLineSchema);

// export default mongoose.model<IAirLineSchema>("Airline", AirLineSchema);