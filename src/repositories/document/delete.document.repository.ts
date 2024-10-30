import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import DocumentSchema, { IDocumentSchema } from "../../db/dao/document.db.model";
import DbSession from "../../db/utils/dbsession.db";

// Interface for DeleteDocumentRepository
export default interface IDeleteDocumentRepository {
    // Deletes a document by its docId.
    deleteDocument(docId: number, session: ClientSession | undefined): Promise<boolean>;

    // Checks if a document with the given docId exists.
    isExist(docId: number): Promise<boolean>;
}

// This decorator ensures that DeleteDocumentRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteDocumentRepository implements IDeleteDocumentRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a document with the given docId exists.
    public async isExist(docId: number): Promise<boolean> {
        return await DocumentSchema.find({ docId }, { _id: 1 })
            .then((data: IDocumentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the airline exists, otherwise false.
                return !this.helper.IsNullValue(results._id);
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    // Deletes a document by its docId.
    public async deleteDocument(docId: number, session: ClientSession | undefined): Promise<boolean> {
        return await DocumentSchema.findOneAndDelete({ docId }, { session })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Handle any errors that occur during the creation
                throw error;
            });
    }
}
