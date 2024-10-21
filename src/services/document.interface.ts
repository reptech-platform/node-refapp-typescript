import { ClientSession } from "mongoose";
import { IDocumentSchema } from "../db/dao/document.db.model";
import { IDocument } from "../models/document.model";

export default interface IDocumentService {

    // Fetches all documents from the database
    getDocuments(): Promise<IDocument[]>;

    // Fetches a single document by its docId.
    getDocument(docId: number): Promise<IDocument>;

    // Creates a new document in the database.
    createDocument(document: IDocumentSchema, dbSession: ClientSession | undefined): Promise<IDocument>;

    // Updates an existing document by its docId and returns the updated document.
    updateDocument(docId: number, person: any, dbSession: ClientSession | undefined): Promise<IDocument>;

    // Deletes a document by its docId.
    deleteDocument(docId: number, dbSession: ClientSession | undefined): Promise<boolean>;
}
