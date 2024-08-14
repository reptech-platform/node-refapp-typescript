import { injectable } from 'inversify';


export interface IGeographicPoint {
    latitude: number;
    longitude: number;
}

@injectable()
export class GeographicPoint implements IGeographicPoint {
    latitude: number;
    longitude: number;
    constructor() { }
}