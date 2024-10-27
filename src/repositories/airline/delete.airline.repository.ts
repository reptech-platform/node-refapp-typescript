import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../../utils/helper.utils";
import AirlineSchema, { IAirlineSchema } from "../../db/dao/airline.db.model";

// Interface for DeleteAirlineRepository
export default interface IDeleteAirlineRepository {
    // Deletes an airline by its code.
    deleteAirline(airlineCode: string, session: ClientSession | undefined): Promise<boolean>;

    // Checks if an airline with the given code exists.
    isAirlineExist(airlineCode: string): Promise<boolean>;
}

// This decorator ensures that DeleteAirlineRepository is a singleton,
// meaning only one instance of this service will be created and used throughout the application.
@injectable()
export class DeleteAirlineRepository implements IDeleteAirlineRepository {
    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if an airline with the given code exists.
    public async isAirlineExist(airlineCode: string): Promise<boolean> {
        return await AirlineSchema.find({ airlineCode }, { _id: 1 })
            .then((data: IAirlineSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                // Returns true if the airline exists, otherwise false.
                return !this.helper.IsNullValue(results._id);
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    // Deletes an airline by its code.
    public async deleteAirline(airlineCode: string, session: ClientSession | undefined): Promise<boolean> {
        return await AirlineSchema.findOneAndDelete({ airlineCode }, { session })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
