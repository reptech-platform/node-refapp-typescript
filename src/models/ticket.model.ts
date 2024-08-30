import { injectable } from "inversify";
export interface ITicket {
    planItemId: string;
    documentId: string;
}

@injectable()
export class Ticket implements ITicket {
    planItemId: string;
    documentId: string;
    constructor() { }
};
