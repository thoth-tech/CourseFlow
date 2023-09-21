// Angular Imports
import { Injectable } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryNodeData, IDiscoveryDataService } from 'src/app/interfaces/discoveryInterfaces';

// JSON Data Imports
import facultyData from "src/data/precalculatedPositionExample.json";

@Injectable({
  providedIn: 'root'
})
export class JsonFileDiscoveryDataService implements IDiscoveryDataService {

  facultyDataList: object[] = facultyData

  /**
   * Constructor
   */
  constructor() {}

  getDiscoveryNodeData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryNodeData[] {

    let data: IDiscoveryNodeData[] = [] as IDiscoveryNodeData[];

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:
        
        data = this.facultyDataList as IDiscoveryNodeData[];
        break;
      
      case EDiscoveryGroupUnitsBy.course:

        break;

      default:

        break;
    }

    return data;
  }
}