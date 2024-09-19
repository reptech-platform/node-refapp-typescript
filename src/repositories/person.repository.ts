import { Error } from "mongoose";
import PersonSchema, { IPersonSchema } from "../db/models/person.db.model";
import Helper from "../utils/helper.utils";
import { IPerson } from "../models/person.model";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IPersonAttachmentSchema } from "src/db/models/personattachment.db.model";

// This decorator ensures that PersonsService is a singleton, meaning only one instance of this service will be created and used throughout the application.
@provideSingleton(PersonRepository)
export default class PersonRepository {

    // Injecting the Helper service
    constructor(@inject(Helper) private helper: Helper) { }

    // Checks if a person with the given userName exists in the database.
    public async isPersonExist(userName: string): Promise<boolean> {
        return await PersonSchema.find({ userName }, { _id: 1 })
            .then((data: IPersonSchema[]) => {
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

    // Fetches all persons from the database, excluding the _id field.
    public async getPersons(): Promise<IPerson[]> {
        return await PersonSchema.find({}, { _id: 0 })
            .then((data: IPersonSchema[]) => {
                // Uses the helper to process the array of persons.
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPerson[];
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Fetches a single person by their userName, excluding the _id field.
    public async getPerson(userName: string): Promise<IPerson> {
        return await PersonSchema.find({ userName }, { _id: 0 })
            .then((data: IPersonSchema[]) => {
                // Uses the helper to process the person.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Creates a new person in the database.
    public async createPerson(person: IPerson): Promise<IPerson> {

        // create new person entry in the database
        let newPerson = await PersonSchema.create(person)
            .then((data: any) => {
                return data as IPerson;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });

        /* // Retrieve the trip information from the person object, which may be undefined
        const trips: ITrip[] | undefined = person.trips;

        if (trips && trips.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripsService.addOrUpadatePersonTrips(person.userName, trips);
        } */

        // Returns newly created person object
        return newPerson;
    }

    // Updates an existing person by their userName and returns the updated person.
    public async updatePerson(userName: string, person: any): Promise<IPerson> {

        let updatedPerson = await PersonSchema.findOneAndUpdate({ userName }, person, { new: true })
            .then((data: any) => {
                // Uses the helper to process the updated person.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });

        /* // Retrieve the trip information from the person object, which may be undefined
        const trips: ITrip[] | undefined = person.trips;

        if (trips && trips.length > 0) {
            // Add or update trips and map the person trips
            await this.personTripsService.addOrUpadatePersonTrips(userName, trips);
        } */

        return updatedPerson;
    }

    // Updates or adds documents to a person's attachments.
    public async updatePersonDocument(userName: string, document: any): Promise<IPerson> {
        return await PersonSchema.findOne({ userName })
            .then((data: any) => {
                document.forEach((x: IPersonAttachmentSchema) => {
                    // If docId exists, update the document; otherwise, add it to the array.
                    let index = data.personAttachments.findIndex((z: any) => z.docId === x.docId);
                    if (index > -1) {
                        data.personAttachments[index] = x;
                    } else {
                        data.personAttachments.push(x);
                    }
                });
                data.save();
                // Uses the helper to process the updated person.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Deletes documents from a person's attachments.
    public async deletePersonDocument(userName: string, document: any): Promise<IPerson> {
        return await PersonSchema.findOne({ userName })
            .then((data: any) => {
                let existingDocuments: IPersonAttachmentSchema[] = data.personAttachments;
                document.forEach((x: IPersonAttachmentSchema) => {
                    existingDocuments = existingDocuments.filter((z: any) => z.docId !== x.docId);
                });
                data.personAttachments = existingDocuments;
                data.save();
                // Uses the helper to process the updated person.
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPerson;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }

    // Deletes a person by their userName.
    public async deletePerson(userName: string): Promise<boolean> {

        let boolDeleted: boolean = await PersonSchema.findOneAndDelete({ userName })
            .then(() => {
                // Returns true if the deletion is successful.
                return true;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });

        // delete all person trips from the database
        // await this.personTripsService.deleteAllPersonTrips(userName);

        return boolDeleted;
    }

    // Searches for persons based on the provided search criteria.
    public async searchPerson(search: Search): Promise<SearchResults> {

        // Initialize variables for sorting, matching, limiting, and skipping.
        let $sort: any = undefined, $match: any = undefined, $limit: any = undefined, $skip: any = undefined;

        // Check if the sort array is not null and process each sort criterion.
        if (!this.helper.IsArrayNull(search.sort)) {
            search.sort?.forEach((e: SortBy) => {
                let sortBy: SortBy = new SortBy(e);
                // Build the sort object dynamically.
                $sort = { ...$sort, [sortBy.name]: sortBy.getOrder() };
            });
        }

        // Check if the filter array is not null and process each filter criterion.
        if (!this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                // Build the match object dynamically.
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Check if the pagination object is not null and set limit and skip values.
        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        // Get the total record count for the search criteria.
        let recordCount = await this.searchPersonCount(search);

        // Initialize the aggregation pipeline.
        let $pipeline: any = [];

        // Add match, sort, limit, and skip stages to the pipeline if they exist.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Execute the aggregation pipeline on the PersonSchema.
        return await PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                // Create a new SearchResults object.
                let results: SearchResults = new SearchResults();
                // Set the count and data properties of the results.
                results.count = recordCount;
                results.data = this.helper.GetItemFromArray(data, -1, []);
                // Return the search results.
                return results;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }

    // Counts the number of persons based on the provided search criteria.
    public async searchPersonCount(search: Search): Promise<number> {

        // Initialize the match object for filtering.
        let $match = {};

        // Check if the search object and filter array are not null.
        if (!this.helper.IsNullValue(search) && !this.helper.IsArrayNull(search.filter)) {
            search.filter?.forEach((e: FilterBy) => {
                let filterBy: FilterBy = new FilterBy(e);
                // Build the match object dynamically based on the filter criteria.
                $match = { ...$match, [filterBy.name]: filterBy.getQuery() };
            });
        }

        // Define the aggregation pipeline for counting documents.
        let $pipeline = [
            { $match }, // Match stage to filter documents.
            { $group: { _id: null, recordCount: { $sum: 1 } } }, // Group stage to count documents.
            { $project: { _id: 0 } } // Project stage to format the output.
        ];

        // Execute the aggregation pipeline on the PersonSchema.
        return await PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                // Extract the record count from the aggregation result.
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }

    // Counts the total number of persons in the collection.
    public async getPersonCount(): Promise<number> {

        // Define the aggregation pipeline for counting all documents.
        let $pipeline = [
            { $group: { _id: null, recordCount: { $sum: 1 } } }, // Group stage to count documents.
            { $project: { _id: 0 } } // Project stage to format the output.
        ];

        // Execute the aggregation pipeline on the PersonSchema.
        return await PersonSchema.aggregate($pipeline)
            .then((data: IPersonSchema[]) => {
                // Extract the record count from the aggregation result.
                let dbRst = this.helper.GetItemFromArray(data, 0, { recordCount: 0 });
                return dbRst.recordCount as number;
            })
            .catch((error: Error) => {
                // Throw an error if the aggregation operation fails.
                throw error;
            });
    }

}