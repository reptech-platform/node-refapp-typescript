import mongoose, { Document, Schema } from "mongoose";
import AutoIncrement from "mongoose-sequence";
import Helper from "../../utils/helper.utils";;

/**
 * Interface to validate schema field construction
 */
export interface IDocumentSchema extends Document {
    /**
     * Auto increment docId
     */
    docId: Number,
    docName: String;
    docLocation: String;
    docFileType: String;
}

/**
 * Schema defination to store the document
 */
export const DocumentSchema: Schema = new Schema({
    /**
     * Auto increment id
     */
    docId: { type: Number },
    docName: { type: String, default: null },
    docLocation: { type: String, default: null },
    docFileType: { type: String, default: null }
}, {
    timestamps: true,
    _id: false
});

/**
 * Define auto increment number
 */
DocumentSchema.plugin(AutoIncrement, { inc_field: 'docId' });

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(DocumentSchema);

/**
 * Export as default schema with assigning interface validation
 */
export default mongoose.model<IDocumentSchema>("Document", DocumentSchema);