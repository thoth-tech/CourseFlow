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

    // Discipline tracker
    let disciplineData: any[] = [];

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

        // Get the 3 letter code which will be the discipline
        let disciplineCode = unitCode.substring(0, 3);

        // Check if it exists, if not, add it in
        if (!disciplineData.includes(disciplineCode)){
            disciplineData.push(disciplineCode);
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

    // Add in the discipline code
    disciplineData.forEach(data => {
        
        nodeData.unshift({
            id: data,
            name: data,
            group: 0,
            nodeLabelType: "Specialization",
            description: "",
        })
    })

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
        
        if (data.nodeLabelType === "Field") {
            return
        }

        if (data.nodeLabelType === "Unit") {
            
            linkData.push({
                source: data.id,
                target: data.id.substring(0, 3),
                lineLabelType: "Unit",
                distance: 0
            })
        }

        if (data.nodeLabelType === "Specialization" && data.id[0] !== "A") {
            linkData.push({
                source: data.id,
                target: data.id[0],
                lineLabelType: "Field",
                distance: 0
            })
        }


    });

    return linkData;
}