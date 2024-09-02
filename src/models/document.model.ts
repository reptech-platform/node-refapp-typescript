import { injectable } from "inversify";

export interface IDocument {
    docid: string;
    docName: string;
    docLocation: string;
    docFileType: string;
}

@injectable()
export class Document implements IDocument {
    docid: string;
    docName: string;
    docLocation: string;
    docFileType: string;
    constructor() { }
}