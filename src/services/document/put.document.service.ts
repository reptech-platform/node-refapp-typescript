import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IUpdateDocumentRepository from "../../repositories/document/put.document.repository";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import { IDocument } from "../../models/document.model";
import fs from "fs";

// Interface for UpdateDocumentService
export default interface IUpdateDocumentService {
    // Updates an existing Document by their docId and returns the updated Document.
    updateDocument(docId: number, file: Express.Multer.File, dbSession: ClientSession | undefined): Promise<IDocument>;
}

// This decorator ensures that UpdateDocumentService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateDocumentService implements IUpdateDocumentService {
    // Injecting the DocumentRepository service
    constructor(
        @inject('IUpdateDocumentRepository') private updateDocumentRepository: IUpdateDocumentRepository
    ) { }

    // Updates an existing Document by their docId and returns the updated Document.
    public async updateDocument(docId: number, file: Express.Multer.File, dbSession: ClientSession | undefined): Promise<IDocument> {

        try {

            const uploadFolder = "./uploads/";

            if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

            const fileName = file.filename || file.originalname;
            const uploadPath = "./uploads/" + file.originalname;

            // Create new Document schema object
            let newItem: IDocumentSchema = new DocumentSchema();

            newItem.docName = fileName;
            newItem.docFileType = file.mimetype;
            newItem.docLocation = uploadPath;

            // Flag to indicate if this function created the session
            let inCarryTransact: boolean = false;

            // Check if a session is provided; if not, create a new one
            if (!dbSession) {
                dbSession = await DbSession.Session();
                DbSession.Start(dbSession);
            } else {
                inCarryTransact = true;
            }

            // Update document
            const results: IDocument = await this.updateDocumentRepository.updateDocument(docId, newItem, dbSession);

            // Commit the transaction if it was started in this call
            if (!inCarryTransact) {
                await DbSession.Commit(dbSession);
            }

            return results;

        } catch (error: any) {
            throw error;
        }
    }
}
