import { injectable } from "inversify";

interface IDocument {
    docName: string;
    docLocation: string;
    docFileType: string;
}

@injectable()
export class Document implements IDocument {
    constructor(
        public docName: string,
        public docLocation: string,
        public docFileType: string,
    ) { }
}