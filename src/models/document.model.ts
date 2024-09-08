import { injectable } from "inversify";

// Interface representing a document
export interface IDocument {
    // Unique identifier for the document
    docId: number;

    // Name of the document
    docName: string;

    // Location or path where the document is stored
    docLocation: string;

    // File type of the document
    docFileType: string;
}

// Class implementing the IDocument interface
@injectable()
export class Document implements IDocument {
    // Unique identifier for the document
    docId: number;

    // Name of the document
    docName: string;

    // Location or path where the document is stored
    docLocation: string;

    // File type of the document
    docFileType: string;

    // Constructor for the Document class
    constructor() { }
}
