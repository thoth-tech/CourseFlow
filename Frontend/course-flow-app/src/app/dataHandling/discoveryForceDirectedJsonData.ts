/**
 * Handler to load the unit json data.
 * This should not be required in the future once connected with the backend.
 */

import { IDiscoveryNodeData, IDiscoveryLinkData } from '../interfaces/discoveryInterfaces';
import  * as unitData from "../../data/unit_data.json"

// Node data
let nodeData: IDiscoveryNodeData[] = [];

// Link data
let linkData: IDiscoveryLinkData[] = [];

export function discoveryNodesForceDirectedJsonData() : IDiscoveryNodeData[]  {

    // Better to not use any as a type but for now, should be fine as the backend will send back data in the required type once testing is done.
    let unitDataArray: any[] = unitData as any;

    // Faculty tracker
    let facultyData: any[] = [];

    for (let index = 0; index < unitDataArray.length; index++) {
        
        // The unit object containing data of a unit.
        const unitObject: any = unitDataArray[index];

        // Get the unit code
        let unitCode: string = unitObject["code"];

        // Get the first letter which will correspond to a faculty
        let facultyCode = unitCode[0];

        // Check if faculty already exists, if not, add it in.
        if (!facultyData.includes(facultyCode)) {

            facultyData.push(facultyCode)
        }

        // Add the required data into the node data array
        nodeData.push({
            id: unitObject["code"],
            name: unitObject["title"],
            group: 1,
            nodeLabelType: "Unit",
            description: "",
        })
    }

    // Add in the faculty nodes
    facultyData.forEach(data => {
        
        nodeData.unshift({
            id: data,
            name: data,
            group: 0,
            nodeLabelType: "Field",
            description: "",
        })
    });


    return nodeData;
}

export function discoveryLinksForceDirectedJsonData() : IDiscoveryLinkData[]  {

    nodeData.forEach(data => {
        
        linkData.push({
            source: data.id,
            target: data.id[0],
            lineLabelType: "",
            distance: 100
        })
    });

    return linkData;
}