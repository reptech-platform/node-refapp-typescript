import { inject, injectable } from "inversify";
import IGetDocumentsRepository from "../../repositories/document/get.documents.repository";
import { IDocument } from "../../models/document.model";

export default interface IGetDocumentsService {
    // Fetches all Documents from the database.
    getDocuments(): Promise<IDocument[]>;
}

// This decorator ensures that DocumentsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetDocumentsService implements IGetDocumentsService {

    // Injecting the Helper service
    constructor(
        @inject("IGetDocumentsRepository") private getDocumentsRepository: IGetDocumentsRepository
    ) { }

    // Fetches all Documents from the database.
    public async getDocuments(): Promise<IDocument[]> {
        return await this.getDocumentsRepository.getDocuments();
    }

}