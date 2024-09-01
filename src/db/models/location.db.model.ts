import { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { CitySchema, ICitySchema } from "./city.db.model";

/**
 * Complex type collection
 */

/**
 * Interface to validate schema field construction
 */
export interface ILocationSchema extends Document {
    address: string;
    /**
     * Embeded collection inside the collection
     */
    city: ICitySchema;
}

export const LocationSchema: Schema = new Schema({
    address: { type: String, default: null },
    /**
     * Embeded collection inside the collection
     */
    city: { type: CitySchema, default: null },
}, {
    _id: false
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(LocationSchema);


// export default mongoose.model<ILocationSchema>("Location", LocationSchema);