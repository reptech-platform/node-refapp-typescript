import { injectable } from 'inversify';

// Interface representing a geographic point with latitude and longitude
export interface IGeographicPoint {
    // Latitude coordinate of the geographic point
    latitude: number;

    // Longitude coordinate of the geographic point
    longitude: number;
}

// Class implementing the IGeographicPoint interface
@injectable()
export class GeographicPoint implements IGeographicPoint {
    // Latitude coordinate of the geographic point
    latitude: number;

    // Longitude coordinate of the geographic point
    longitude: number;

    // Constructor for the GeographicPoint class
    constructor() { }
}
