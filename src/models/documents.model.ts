import { injectable } from "inversify";

export interface IDocument {
    _id: string;
    docName: string;
    docLocation: string;
    docFileType: string;
}

@injectable()
export class Document implements IDocument {
    _id: string;
    docName: string;
    docLocation: string;
    docFileType: string;
    constructor() { }
}