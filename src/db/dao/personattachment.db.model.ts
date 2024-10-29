import { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";

/**
 * Interface to validate schema field construction
 */
export interface IPersonAttachmentSchema extends Document {
    // Unique identifier for the document
    docId: number;

    // Name of the document
    docName: string;

    // Location or path where the document is stored
    docLocation: string;

    // File type of the document
    docFileType: string;
}

/**
 * Schema defination to store the document
 */
const PersonAttachmentSchema: Schema = new Schema({
    // Unique identifier for the document
    docId: { type: Number },

    // Name of the document
    docName: { type: String, default: null },

    // Location or path where the document is stored
    docLocation: { type: String, default: null },

    // File type of the document
    docFileType: { type: String, default: null }
}, {
    _id: false
});

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(PersonAttachmentSchema);

/**
 * Export as default schema with assigning interface validation
 */
// const schemaModal = mongoose.model<IPersonAttachmentSchema>("PersonAttachment", PersonAttachmentSchema);

export default PersonAttachmentSchema;