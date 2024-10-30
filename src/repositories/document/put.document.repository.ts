import { ClientSession, Error } from "mongoose";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import { IDocument } from "../../models/document.model";
import DbSession from "../../db/utils/dbsession.db";

// Interface for UpdateDocumentRepository
export default interface IUpdateDocumentRepository {
    // Updates an document
    updateDocument(docId: number, document: IDocumentSchema, session: ClientSession | undefined): Promise<IDocument>;

    // Method to check if a document exists by its docId
    isExist(docId: number): Promise<boolean>;
}

// This decorator ensures that UpdateDocumentRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdateDocumentRepository implements IUpdateDocumentRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to check if an airline exists by its code
    public async isExist(docId: number): Promise<boolean> {
        return await DocumentSchema.find({ docId }, { _id: 1 })
            .then((data: IDocumentSchema[]) => {
                // Get the first item from the array or return an object with _id: null
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Check if the _id is not null
                if (!this.helper.IsNullValue(results._id)) return true;
                return results._id;
            })
            .catch((error: Error) => {
                // Handle any errors that occur during the query
                throw error;
            });
    }

    // Updates an airline's information based on the provided airline code.
    public async updateDocument(docId: number, document: IDocumentSchema, session: ClientSession | undefined): Promise<IDocument> {

        document = JSON.parse(JSON.stringify(document));
        delete document['_id'];
        // Find and update the airline document with the new data.
        return await DocumentSchema.findOneAndUpdate({ docId }, document, { new: true, session })
            .then((data: any) => {
                // Extract the first item from the data array using a helper function.
                let results = this.helper.GetItemFromArray(data, 0, {});
                // Return the results cast as an IDocument object.
                return results as IDocument;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throw an error if the update operation fails.
                throw error;
            });
    }
}
