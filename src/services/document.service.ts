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
        return Document.find()
            .then((data: IDocumentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IDocument[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getDocument(id: string): Promise<IDocument> {
        return Document.find({ _id: id })
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

    public async updateDocument(id: string, person: any): Promise<IDocument> {
        return Document.findOneAndUpdate({ _id: id }, person, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deleteDocument(id: string): Promise<boolean> {
        return Document.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}