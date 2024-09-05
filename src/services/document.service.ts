import { Error } from "mongoose";
import Document, { IDocumentSchema } from "../db/models/document.db.model";
import Helper from "../utils/helper.utils";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IDocument } from "../models/document.model";

@provideSingleton(DocumentsService)
export default class DocumentsService {

    constructor(@inject(Helper) private helper: Helper) {
    }

    public async getDocuments(): Promise<IDocument[]> {
        return Document.find({}, { _id: 0 })
            .then((data: IDocumentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IDocument[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getDocument(docId: number): Promise<IDocument> {
        return Document.find({ docId }, { _id: 0 })
            .then((data: IDocumentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createDocument(document: IDocumentSchema): Promise<IDocument> {
        return Document.create(document)
            .then((data: IDocumentSchema) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateDocument(docId: number, person: any): Promise<IDocument> {
        return Document.findOneAndUpdate({ docId }, person, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteDocument(docId: number): Promise<boolean> {
        return Document.findOneAndDelete({ docId })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}