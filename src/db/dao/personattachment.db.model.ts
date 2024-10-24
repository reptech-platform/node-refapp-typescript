import mongoose, { Document, Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import Helper from "../../utils/helper.utils";;
const AutoIncrement = AutoIncrementFactory(mongoose);

/**
 * Interface to validate schema field construction
 */
export interface IPersonAttachmentSchema extends Document {
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
export const PersonAttachmentSchema: Schema = new Schema({
    /**
     * Auto increment id
     */
    docId: { type: Number },
    docName: { type: String, default: null },
    docLocation: { type: String, default: null },
    docFileType: { type: String, default: null }
}, {
    _id: false
});

/**
 * Define auto increment number
 */
// PersonAttachmentSchema.plugin(AutoIncrement, { inc_field: 'docId' });

/**
 * Setting function to onvert $numberDecimal to actual decimal values
 */
new Helper().SetToJSON(PersonAttachmentSchema);

/**
 * Export as default schema with assigning interface validation
 */
// export default mongoose.model<IPersonAttachmentSchema>("PersonAttachment", PersonAttachmentSchema);