import { injectable } from "inversify";
export interface IPersonAttachment {
    personId: string;
    documentId: string;
}

@injectable()
export class PersonAttachment implements IPersonAttachment {
    personId: string;
    documentId: string;
    constructor() { }
};
