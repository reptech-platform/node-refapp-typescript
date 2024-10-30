import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import { IDocument } from "../../models/document.model";
import DbSession from "../../db/utils/dbsession.db";

// Interface for CreateDocumentRepository
export default interface ICreateDocumentRepository {
    // Method to create a new document
    createDocument(document: IDocumentSchema, session: ClientSession | undefined): Promise<IDocument>;
}

// This decorator ensures that CreateDocumentRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class CreateDocumentRepository implements ICreateDocumentRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Method to create a new airline
    public async createDocument(document: IDocumentSchema, session: ClientSession | undefined): Promise<IDocument> {

        // create the airline document with the new data.
        return await DocumentSchema.create([document], { session })
            .then((data: any) => {
                // Get the first item from the array or return an empty object
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IDocument;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Handle any errors that occur during the creation
                throw error;
            });
    }
}
