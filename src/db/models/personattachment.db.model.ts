import mongoose, { Document, Schema } from "mongoose";

export interface IPersonAttachmentSchema extends Document {
    personId: string;
    documentId: string;
}

export const PersonAttachmentSchema: Schema = new Schema({
    personId: { type: Schema.Types.ObjectId, default: null },
    documentId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

export default mongoose.model<IPersonAttachmentSchema>("PersonAttachment", PersonAttachmentSchema);