import { Error } from "mongoose";
import Helper from "../utils/helper.utils";
import PersonAttachmentSchema, { IPersonAttachmentSchema } from "../db/models/personattachments.db.model";
import { Search, SortBy, FilterBy, Pagination, SearchResults } from "../models/search.model";
import { provideSingleton, inject } from "../utils/provideSingleton";
import { IPersonAttachment } from "../models/personattachment.model";

@provideSingleton(PersonAttachmentsService)
export default class PersonAttachmentsService {

    constructor(@inject(Helper) private helper: Helper) {
    }

    public async getPersonsAttachments(): Promise<IPersonAttachment[]> {
        return PersonAttachmentSchema.find()
            .then((data: IPersonAttachmentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPersonAttachment[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonAttachments(personId: string): Promise<IPersonAttachment[]> {
        return PersonAttachmentSchema.find({ personId: personId })
            .then((data: IPersonAttachmentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPersonAttachment[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonAttachmentById(id: string): Promise<IPersonAttachment> {
        return PersonAttachmentSchema.find({ _id: id })
            .then((data: IPersonAttachmentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPersonAttachment;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonAttachmentByDocId(documentId: string): Promise<IPersonAttachment> {
        return PersonAttachmentSchema.find({ documentId: documentId })
            .then((data: IPersonAttachmentSchema[]) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPersonAttachment;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createPersonAttachment(personAttachment: IPersonAttachmentSchema): Promise<IPersonAttachment> {
        return PersonAttachmentSchema.create(personAttachment)
            .then((data: IPersonAttachmentSchema) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPersonAttachment;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updatePersonAttachment(id: string, person: any): Promise<IPersonAttachment> {
        return PersonAttachmentSchema.findOneAndUpdate({ _id: id }, person, { new: true })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IPersonAttachment;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deletePersonAttachment(id: string): Promise<boolean> {
        return PersonAttachmentSchema.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deletePersonAttachmentByDocId(documentId: string): Promise<boolean> {
        return PersonAttachmentSchema.findOneAndDelete({ documentId: documentId })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}