import mongoose, { Document, Schema } from "mongoose";
import Helper from "../../utils/helper.utils";;

export interface IDocumentSchema extends Document {
    docName: string;
    docLocation: string;
    docFileType: string;
}

export const DocumentSchema: Schema = new Schema({
    docName: { type: String, default: null },
    docLocation: { type: String, default: null },
    docFileType: { type: String, default: null }
}, {
    timestamps: true
});

new Helper().SetToJSON(DocumentSchema);

export default mongoose.model<IDocumentSchema>("Document", DocumentSchema);