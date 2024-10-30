import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../../db/utils/dbsession.db";
import IDeleteDocumentRepository from "../../repositories/document/delete.document.repository";

export default interface IDeleteDocumentService {
    // Deletes a Document by their docId.
    deleteDocument(docId: number, dbSession: ClientSession | undefined): Promise<boolean>;
}

// This decorator ensures that DeleteDocumentService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteDocumentService implements IDeleteDocumentService {

    // Injecting the Helper service
    constructor(
        @inject('IDeleteDocumentRepository') private deleteDocumentRepository: IDeleteDocumentRepository
    ) { }

    // Deletes a Document by their docId.
    public async deleteDocument(docId: number, dbSession: ClientSession | undefined): Promise<boolean> {

        // Check if the Document exists. If not, throw an error.
        let isExist = await this.deleteDocumentRepository.isExist(docId);
        if (!isExist) {
            throw new Error(`Provided document '${docId}' does not exist`);
        }

        // Flag to indicate if this function created the session
        let inCarryTransact: boolean = false;

        // Check if a session is provided; if not, create a new one
        if (!dbSession) {
            dbSession = await DbSession.Session();
            DbSession.Start(dbSession);
        } else {
            inCarryTransact = true;
        }

        let results: boolean = await this.deleteDocumentRepository.deleteDocument(docId, dbSession);

        // Commit the transaction if it was started in this call
        if (!inCarryTransact) {
            await DbSession.Commit(dbSession);
        }

        return results;
    }

}