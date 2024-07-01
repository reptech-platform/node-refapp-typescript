import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Document, { IDocumentSchema } from "../db/models/documents.db.model";
import Helper from "../utils/helper.utils";
import TYPES from "../constants/types";

@injectable()
export default class DocumentsService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async getDocuments(): Promise<IDocumentSchema[]> {
        return Document.find()
            .then((data: IDocumentSchema[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getDocument(id: string): Promise<IDocumentSchema[]> {
        return Document.find({ _id: id })
            .then((data: IDocumentSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createDocument(document: IDocumentSchema): Promise<IDocumentSchema> {
        return Document.create(document)
            .then((data: IDocumentSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updateDocument(id: string, person: any): Promise<IDocumentSchema> {
        return Document.findOneAndUpdate({ _id: id }, person, { new: true })
            .then((data: any) => {
                return data;
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