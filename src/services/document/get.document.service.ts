import { inject, injectable } from "inversify";
import IGetDocumentRepository from "../../repositories/document/get.document.repository";
import { IDocument } from "../../models/document.model";

// Interface for GetDocumentService
export default interface IGetDocumentService {
    // Method to get a specific document by its docId
    getDocument(docId: number): Promise<IDocument>;
}

// This decorator ensures that GetDocumentService is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetDocumentService implements IGetDocumentService {
    // Injecting the GetDocumentRepository service
    constructor(
        @inject("IGetDocumentRepository") private getDocumentRepository: IGetDocumentRepository
    ) { }

    // Method to get a specific document by its docId
    public async getDocument(docId: number): Promise<IDocument> {
        // Check if the Document exists. If not, throw an error.
        let isExist = await this.getDocumentRepository.isExist(docId);
        if (!isExist) {
            throw new Error(`Provided Document '${docId}' does not exist`);
        }
        // Retrieve and return the Document's information
        return await this.getDocumentRepository.getDocument(docId);
    }
}
