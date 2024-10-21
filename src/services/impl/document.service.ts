import { IDocumentSchema } from "../../db/dao/document.db.model";
import { IDocument } from "../../models/document.model";
import DocumentRepository from "../../repositories/document.repository";
import { inject, injectable } from "inversify";
import IDocumentService from "../document.interface";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import Helper from "../../utils/helper.utils";

// This decorator ensures that DocumentsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export default class DocumentService implements IDocumentService {

    // Injecting the Helper service
    constructor(
        @inject(Helper) private helper: Helper,
        @inject(DocumentRepository) private documentRepository: DocumentRepository) { }

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

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        const results: IDocument = await this.documentRepository.createDocument(document, dbSession);

        DbSession.Commit(dbSession);

        return results;

    }

    // Updates an existing document by its docId and returns the updated document.
    public async updateDocument(docId: number, person: any, dbSession: ClientSession | undefined): Promise<IDocument> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        const results: IDocument = await this.documentRepository.updateDocument(docId, person, dbSession);

        DbSession.Commit(dbSession);

        return results;
    }

    // Deletes a document by its docId.
    public async deleteDocument(docId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Create a new session for transaction if session is null
        if (this.helper.IsNullValue(dbSession)) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        }

        const results: boolean = await this.documentRepository.deleteDocument(docId, dbSession);

        DbSession.Commit(dbSession);

        return results;
    }
}
