import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import ICreateDocumentRepository from "../../repositories/document/post.document.repository";
import { IDocument } from "../../models/document.model";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import fs from "fs";

// Interface for CreateDocumentService
export default interface ICreateDocumentService {
    // Method to create a new document
    createDocument(file: Express.Multer.File, dbSession: ClientSession | undefined): Promise<IDocument>;
}

// This decorator ensures that CreateDocumentService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateDocumentService implements ICreateDocumentService {
    // Injecting the DocumentRepository service
    constructor(
        @inject('ICreateDocumentRepository') private createDocumentRepository: ICreateDocumentRepository
    ) { }

    // Method to create a new document
    public async createDocument(file: Express.Multer.File, dbSession: ClientSession | undefined): Promise<IDocument> {
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

            // Create document
            const results: IDocument = await this.createDocumentRepository.createDocument(newItem, dbSession);

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
