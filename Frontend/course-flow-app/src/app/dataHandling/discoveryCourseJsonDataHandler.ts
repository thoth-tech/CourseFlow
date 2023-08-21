/**
 * Handler to load the unit json data.
 * This should not be required in the future once connected with the backend.
 */

// Data Type Imports
import { IDiscoveryFacultyJsonUnitData, IDiscoveryHierarchicalData } from '../interfaces/discoveryInterfaces';

// JSON Data Imports
import  * as unitDataJson from "../../data/courses.json"

// Function for Data Handling
export function getCourseDiscoveryUnitData() : IDiscoveryHierarchicalData  {

    let unitDataArray: object[] = unitDataJson;
    
    // Define the root node.
    let unitData: IDiscoveryHierarchicalData = {
        id: "root",
        name: 'Course',
        description: "Lorem Ipsum".repeat(200),
        group: "0",
        children: []
    }

    // Loop through all units.
    for (let index = 0; index < unitDataArray.length; index++) {
        
        // The unit object containing data of a unit.
        const currentObject: any = unitDataArray[index];
      
        // For now, due to the way the layout gets ruined if there is courses with no majors, I'll exclude them for now.
        if (currentObject["majors"].length === 0) {
            break;
        }

        // Local var for the majors
        let majors: IDiscoveryHierarchicalData[] = []

        // Create the object for the course
        let courseObject = {
            id:  currentObject["code"],
            name: currentObject["name"],
            description: currentObject["overview"],
            group: "1",
            children: majors
        }
        
        // Add the course to the root node.
        unitData.children.push(courseObject)

        // Loop through the majors
        currentObject["majors"].forEach((major:any) => {
            
            // Array for the units belonging to a major.
            let units: IDiscoveryHierarchicalData[] = []

            // Create the major object.
            let majorObject = {
                id: major["code"],
                name: major["name"],
                description: "",
                group: "2",
                children: units
            }

            // Attach the major to the current course in the outer iteration.
            courseObject.children.push(majorObject)

            // Loop through the units 
            major["units"].forEach((unit: any) => {
                
                // Create unit object
                let unitObject = {
                    id: unit,
                    name: unit,
                    description: "",
                    group: "3",
                    children: []
                }

                majorObject.children.push(unitObject)
            }); 

        });
    }

    return unitData;
}


// Function to find a unit by id, format the appropriate data and return it.
export function getDetailedCourseUnitData(id: string): IDiscoveryHierarchicalData {

    let unitDataArray: object[] = unitDataJson;

    // Find unit by the id
    let unitData: object = {};
    for (let index = 0; index < unitDataArray.length; index++) {
        
        let currentUnitAtIndex: any = unitDataArray[index];

        if (currentUnitAtIndex["code"] == id) {

            unitData = currentUnitAtIndex;
        }
    }

    let detailedUnitInformation: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData;

    // Set the root node to the unit we are trying to find.
    detailedUnitInformation = {
        id: id,
        name: id,
        description: "",
        group: "0",
        children: []
    }

    // Create the pre-req and co-req objects
    let preReqNode: IDiscoveryHierarchicalData = {
        
        id: "Pre-req",
        name: "Pre-req",
        description: "",
        group: "1",
        children: []
    }

    let coReqNode: IDiscoveryHierarchicalData = {
        
        id: "Co-req",
        name: "Co-req",
        description: "",
        group: "1",
        children: []
    }

    // Attach the pre-req and co-req nodes
    detailedUnitInformation.children.push(preReqNode)
    detailedUnitInformation.children.push(coReqNode)

    // The course json data lacks pre-req and co-req data but I'll add in nodes to also help with layout
    for (let index = 0; index < 10; index++) {
        
        preReqNode.children.push({
            id: index.toString(),
            name: index.toString(),
            description: "",
            group: "-1",
            children: []
        }) 

        coReqNode.children.push({
            id: index.toString(),
            name: index.toString(),
            description: "",
            group: "-1",
            children: []
        })
    }

    return detailedUnitInformation;
}