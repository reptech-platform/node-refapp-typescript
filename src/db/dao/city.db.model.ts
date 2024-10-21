import { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";

/**
 * Complex type collection
 */

/**
 * Interface to validate schema field construction
 */
export interface ICitySchema extends Document {
    name: String;
    countryRegion: String;
    region: String;
}

/**
 * Schema defination to store the document
 */
export const CitySchema: Schema = new Schema({
    name: { type: String, default: null },
    countryRegion: { type: String, default: null },
    region: { type: String, default: null }
}, {
    /**
     * Disabled _id field from default schema
     */
    _id: false
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(CitySchema);

// export default mongoose.model<ICitySchema>("City", CitySchema);