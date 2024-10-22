import { IDocumentSchema } from "../../db/dao/document.db.model";
import { IDocument } from "../../models/document.model";
import { inject, injectable } from "inversify";
import IDocumentService from "../document.interface";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import Helper from "../../utils/helper.utils";
import IDocumentRepository from "../../repositories/document.repository";

// This decorator ensures that DocumentsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class DocumentService implements IDocumentService {

    // Injecting the Helper service
    constructor(
        @inject("IDocumentRepository") private documentRepository: IDocumentRepository) { }

    // Fetches all documents from the database
    public async getDocuments(): Promise<IDocument[]> {
        return await this.documentRepository.getDocuments();
    }

    // Fetches a single document by its docId.
    public async getDocument(docId: number): Promise<IDocument> {
        return await this.documentRepository.getDocument(docId);
    }

    // Creates a new document in the database.
    public async createDocument(document: IDocumentSchema, dbSession: ClientSession | undefined): Promise<IDocument> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: IDocument = await this.documentRepository.createDocument(document, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;

    }

    // Updates an existing document by its docId and returns the updated document.
    public async updateDocument(docId: number, person: any, dbSession: ClientSession | undefined): Promise<IDocument> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: IDocument = await this.documentRepository.updateDocument(docId, person, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

    // Deletes a document by its docId.
    public async deleteDocument(docId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        const results: boolean = await this.documentRepository.deleteDocument(docId, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }
}
