import { injectable } from 'inversify';


export interface IGeographicPoint {
    latitude: Number;
    longitude: Number;
}

@injectable()
export class GeographicPoint implements IGeographicPoint {
    latitude: Number;
    longitude: Number;
    constructor() { }
}