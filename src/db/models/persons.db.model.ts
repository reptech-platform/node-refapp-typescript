import mongoose, { Document, Schema } from "mongoose";
import { LocationSchema, ILocationSchema } from "./locations.db.model";
import Helper from "../../utils/helper.utils";;

export interface IPersonSchema extends Document {
    userName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    income: number;
    dateOfBirth: Date;
    gender: number;
    age: number,
    emails: string[];
    addressInfo: [ILocationSchema];
    homeAddress: ILocationSchema;
    favoriteFeature: number;
    features: number[];
}

export const PersonSchema: Schema = new Schema({
    userName: { type: String, default: null },
    firstName: { type: String, default: null },
    middleName: { type: String, default: null },
    lastName: { type: String, default: null },
    income: { type: mongoose.Types.Decimal128, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: { type: Number, default: null },
    age: { type: Number, default: null },
    emails: [{ type: String, default: null }],
    addressInfo: [{ type: LocationSchema, default: null }],
    homeAddress: { type: LocationSchema, default: null },
    favoriteFeature: { type: Number, default: null },
    features: [{ type: Number, default: null }],
}, {
    timestamps: true
});

new Helper().SetToJSON(PersonSchema);

export default mongoose.model<IPersonSchema>("Person", PersonSchema, 'persons');