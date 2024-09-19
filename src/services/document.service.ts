import { IDocumentSchema } from "../db/models/document.db.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IDocument } from "../models/document.model";
import DocumentRepository from "../repositories/document.repository";

// This decorator ensures that DocumentsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(DocumentService)
export default class DocumentService {

    // Injecting the Helper service
    constructor(@inject(DocumentRepository) private documentRepository: DocumentRepository) { }

    // Fetches all documents from the database
    public async getDocuments(): Promise<IDocument[]> {
        return await this.documentRepository.getDocuments();
    }

    // Fetches a single document by its docId.
    public async getDocument(docId: number): Promise<IDocument> {
        return await this.documentRepository.getDocument(docId);
    }

    // Creates a new document in the database.
    public async createDocument(document: IDocumentSchema): Promise<IDocument> {
        return await this.documentRepository.createDocument(document);
    }

    // Updates an existing document by its docId and returns the updated document.
    public async updateDocument(docId: number, person: any): Promise<IDocument> {
        return await this.documentRepository.updateDocument(docId, person);
    }

    // Deletes a document by its docId.
    public async deleteDocument(docId: number): Promise<boolean> {
        return await this.documentRepository.deleteDocument(docId);
    }
}
