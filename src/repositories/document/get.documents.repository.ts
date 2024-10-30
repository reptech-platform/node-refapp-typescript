import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import { IDocument } from "../../models/document.model";

// Interface for GetDocumentsRepository
export default interface IGetDocumentsRepository {
    // Method to get all documents
    getDocuments(): Promise<IDocument[]>;
}

// This decorator ensures that GetDocumentsRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetDocumentsRepository implements IGetDocumentsRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to get all documents
    public async getDocuments(): Promise<IDocument[]> {

        return await DocumentSchema.find({}, { _id: 0 })
            .then((data: IDocumentSchema[]) => {
                // Uses the helper to process the Document.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IDocument[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
