import { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";

/**
 * Complex type collection
 */

/**
 * Interface to validate schema field construction
 */
export interface IGeographicPointSchema extends Document {
    latitude: Number;
    longitude: Number;
}

/**
 * Schema defination to store the document
 */
const GeographicPointSchema: Schema = new Schema({
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
}, {
    /**
     * Disabled _id field from default schema
     */
    _id: false
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(GeographicPointSchema);

/**
 * Export as default schema with assigning interface validation
 */
// const schemaModal = mongoose.model<IGeographicPointSchema>("GeographicPoint", GeographicPointSchema);

export default GeographicPointSchema;