import { Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import { IDocument } from "../../models/document.model";

// Interface for GetDocumentRepository
export default interface IGetDocumentRepository {
    // Method to get a specific document by its docId
    getDocument(docId: number): Promise<IDocument>;

    // Method to check if an document exists by its docId
    isExist(docId: number): Promise<boolean>;
}

// This decorator ensures that GetDocumentRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class GetDocumentRepository implements IGetDocumentRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an document exists by its docId
    public async isExist(docId: Number): Promise<boolean> {
        return await DocumentSchema.find({ docId }, { _id: 1 })
            .then((data: IDocumentSchema[]) => {
                // Get the first item from the array or return an object with _id: null
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Check if the _id is not null
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Method to get a specific document by its docId
    public async getDocument(docId: number): Promise<IDocument> {

        return await DocumentSchema.find({ docId }, { _id: 0 })
            .then((data: IDocumentSchema[]) => {
                // Uses the helper to process the Document.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
