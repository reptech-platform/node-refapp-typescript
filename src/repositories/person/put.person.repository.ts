import { ClientSession, Error } from "mongoose";
import PersonSchema, { IPersonSchema } from "../../db/dao/person.db.model";
import Helper from "../../utils/helper.utils";
import { injectable, inject } from "inversify";
import DbSession from "../../db/utils/dbsession.db";
import { IPerson } from "../../models/person.model";

// Interface for UpdatePersonRepository
export default interface IUpdatePersonRepository {
    // Updates an existing person by their userName and returns the updated person.
    updatePerson(userName: string, person: IPersonSchema, session: ClientSession | undefined): Promise<IPerson>;

    // Checks if a person with the given userName exists in the database.
    isExist(userName: string): Promise<boolean>;
}

// This decorator ensures that UpdatePersonRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class UpdatePersonRepository implements IUpdatePersonRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a person with the given userName exists in the database.
    public async isExist(userName: string): Promise<boolean> {
        return await PersonSchema.find({ userName }, { _id: 1 })
            .then((data: any[]) => {
                // Uses the helper to process the array of persons.
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the person exists, otherwise false.
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Updates an existing person by their userName and returns the updated person.
    public async updatePerson(userName: string, person: IPersonSchema, session: ClientSession | undefined): Promise<IPerson> {

        // Remove new id while updating the collection
        person = JSON.parse(JSON.stringify(person));
        delete person['_id'];

        // Update person details in the database
        let updatedPerson = await PersonSchema.findOneAndUpdate({ userName }, person, { new: true, session })
            .then((data: any) => {
                // Uses the helper to process the updated person
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Abort Client Session if there's an error
                DbSession.Abort(session);
                // Throws an error if the operation fails
                throw error;
            });

        // Returns the updated person object
        return updatedPerson;
    }
}
