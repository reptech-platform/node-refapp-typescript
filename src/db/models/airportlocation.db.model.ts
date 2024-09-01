import { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";
import { GeographicPointSchema, IGeographicPointSchema } from "./geographicpoint.db.model";
import { CitySchema, ICitySchema } from "./city.db.model";

/**
 * Complex type collection
 * Contains all field information which are extended from the model
 */

/**
 * Interface to validate schema field construction
 */
export interface IAirportLocationSchema extends Document {
    /**
     * Embeded collection inside the collection
     */
    loc: IGeographicPointSchema;
    /**
     * Extended from complext type of Location model
     */
    address: String;
    /**
     * Embeded collection inside the collection extend from location model
     */
    city: ICitySchema;
}

/**
 * Schema defination to store the document
 */
export const AirportLocationSchema: Schema = new Schema({
    /**
     * Embeded collection inside the collection
     */
    loc: { type: GeographicPointSchema, default: null },
    /**
     * Extended from complext type of Location model
     */
    address: { type: String, default: null },
    /**
     * Embeded collection inside the collection extend from location model
     */
    city: { type: CitySchema, default: null }

}, {
    /**
     * Disabled _id field from default schema
     */
    _id: false
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(AirportLocationSchema);

// export default mongoose.model<IAirportLocationSchema>("AirportLocation", AirportLocationSchema);