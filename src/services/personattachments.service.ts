import { inject, injectable } from "inversify";
import { Error, default as mongoose } from "mongoose";
import Helper from "../utils/helper.utils";
import TYPES from "../constants/types";
import PersonAttachment, { IPersonAttachmentSchema } from "../db/models/personattachments.db.model";

@injectable()
export default class PersonAttachmentsService {

    constructor(@inject(TYPES.Helper) private helper: Helper) {
    }

    public async getPersonAttachments(): Promise<IPersonAttachmentSchema[]> {
        return PersonAttachment.find()
            .then((data: IPersonAttachmentSchema[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonAttachment(id: string): Promise<IPersonAttachmentSchema[]> {
        return PersonAttachment.find({ _id: id })
            .then((data: IPersonAttachmentSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getPersonAttachmentByDocId(id: string): Promise<IPersonAttachmentSchema[]> {
        return PersonAttachment.find({ documentId: id })
            .then((data: IPersonAttachmentSchema[]) => {
                return this.helper.GetItemFromArray(data, 0, {});
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createPersonAttachment(personAttachment: IPersonAttachmentSchema): Promise<IPersonAttachmentSchema> {
        return PersonAttachment.create(personAttachment)
            .then((data: IPersonAttachmentSchema) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async updatePersonAttachment(id: string, person: any): Promise<IPersonAttachmentSchema> {
        return PersonAttachment.findOneAndUpdate({ _id: id }, person, { new: true })
            .then((data: any) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deletePersonAttachment(id: string): Promise<boolean> {
        return PersonAttachment.findOneAndDelete({ _id: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async deletePersonAttachmentByDocId(id: string): Promise<boolean> {
        return PersonAttachment.findOneAndDelete({ documentId: id })
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}