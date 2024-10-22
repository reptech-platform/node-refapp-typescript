import { ClientSession, Error } from "mongoose";
import Document, { IDocumentSchema } from "../../db/dao/document.db.model";
import Helper from "../../utils/helper.utils";
import { IDocument } from "../../models/document.model";
import { injectable, inject } from "inversify";
import IDocumentRepository from "../document.repository";

// This decorator ensures that DocumentsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class DocumentRepository implements IDocumentRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Fetches all documents from the database
    public async getDocuments(): Promise<IDocument[]> {
        return await Document.find({}, { _id: 0 })
            .then((data: IDocumentSchema[]) => {
                // Uses the helper to process the array of documents.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IDocument[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Fetches a single document by its docId.
    public async getDocument(docId: number): Promise<IDocument> {
        return await Document.find({ docId }, { _id: 0 })
            .then((data: IDocumentSchema[]) => {
                // Uses the helper to process the document.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Creates a new document in the database.
    public async createDocument(document: IDocumentSchema, session: ClientSession | undefined): Promise<IDocument> {
        return await Document.create([document], { session })
            .then((data: any) => {
                // Converts the document to a plain object and removes the _id field.
                let results = JSON.parse(JSON.stringify(data));
                delete results['_id'];
                return results as IDocument;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Updates an existing document by its docId and returns the updated document.
    public async updateDocument(docId: number, person: any, session: ClientSession | undefined): Promise<IDocument> {
        return await Document.findOneAndUpdate({ docId }, person, { new: true, session })
            .then((data: any) => {
                // Uses the helper to process the updated document.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Deletes a document by its docId.
    public async deleteDocument(docId: number, session: ClientSession | undefined): Promise<boolean> {
        return await Document.findOneAndDelete({ docId }, { session })
            .then(() => {
                // Returns true if the deletion is successful.
                return true;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
