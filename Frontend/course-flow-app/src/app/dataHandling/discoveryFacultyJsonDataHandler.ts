/**
 * Handler to load the unit json data.
 * This should not be required in the future once connected with the backend.
 */

// Data Type Imports
import { IDiscoveryFacultyJsonUnitData, IDiscoveryHierarchicalData } from '../interfaces/discoveryInterfaces';

// JSON Data Imports
import  * as unitDataJson from "../../data/unit_data.json"

// Faculty Mapping
const facultyNames: Record<string, string> = {
    
    "A": "Arts and Education",
    "E": "Arts and Education",
    "H": "Health",
    "M": "Business and Law",
    "S": "Science, Engineering and Built Environment",
    "F": "Other",
    "I": "Other",
    "L": "Other"
}

// Function for Data Handling
export function getFacultyDiscoveryUnitData() : IDiscoveryHierarchicalData  {

    let unitDataArray: object[] = unitDataJson;
    
    // Define the root node.
    let unitData: IDiscoveryHierarchicalData = {
        id: "root",
        name: 'Faculty',
        description: "Find your ideal unit based on faculty and unit codes",
        group: "0",
        children: []
    }

    // Loop through all units.
    for (let index = 0; index < unitDataArray.length; index++) {
        
        // The unit object containing data of a unit.
        const unitObject: IDiscoveryFacultyJsonUnitData = unitDataArray[index] as IDiscoveryFacultyJsonUnitData;

        // Get the unit code.
        let unitCode: string = unitObject.code;

        // Get the first letter which will correspond to a faculty and map to the faculty mapping record.
        let facultyCode: string = unitCode[0];
        let facultyName = facultyNames[facultyCode];

        // Get the 3-lettered discipline code.
        let disciplineCode: string = unitCode.substring(0, 3);

        // Check if faculty already exists within the unitData children data. If not, add it in.
        let currentFacultyObject: IDiscoveryHierarchicalData | undefined = unitData.children.find(
            (facultyObject: IDiscoveryHierarchicalData) => facultyObject.id === facultyName);
        
        if (currentFacultyObject == null) {

            // Create a new faculty object.
            currentFacultyObject = {
                id: facultyName,
                name: facultyName,
                description: "",
                group: "1",
                children: []
            }

            // Add it to the unit data.
            unitData.children.push(currentFacultyObject)
        }

        // Search the faculty object for the discipline object.
        let currentDisciplineObject: IDiscoveryHierarchicalData | undefined = currentFacultyObject.children.find(
            (disciplineObject: IDiscoveryHierarchicalData) => disciplineObject.id === disciplineCode);

        if (currentDisciplineObject == null) {

            // Create a new discipline object.
            currentDisciplineObject = {
                id: disciplineCode,
                name: disciplineCode,
                description: "",
                group: "2",
                children: []
            }

            // Add to the faculty object
            currentFacultyObject.children.push(currentDisciplineObject);
        }

        // Add the unit - I won't bother checking if units exist as they should be unique.
        let currentUnitObject: IDiscoveryHierarchicalData = {
            id: unitCode,
            name: `${unitObject.code}: ${unitObject.title}`,
            description: unitObject.description,
            group: "3",
            children: []
        }

        currentDisciplineObject.children.push(currentUnitObject)
    }

    return unitData;
}

// Function to find a unit by id, format the appropriate data and return it.
export function getDetailedFacultyUnitData(id: string): IDiscoveryHierarchicalData {
    let unitDataArray: object[] = unitDataJson;

    // Set the root node to the unit we are trying to find.
    let detailedUnitInformation: IDiscoveryHierarchicalData = {
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
    detailedUnitInformation.children.push(preReqNode);
    detailedUnitInformation.children.push(coReqNode);

    // Find unit by the id
    let unitData: any = {};
    for (let index = 0; index < unitDataArray.length; index++) {
        
        let currentUnitAtIndex: any = unitDataArray[index];

        if (currentUnitAtIndex["code"] == id) {

            unitData = currentUnitAtIndex;
        }
    }

    // The faculty json data has prereq info inside the contraints
    let contraints: any = unitData["constraints"];
    
    for (let index = 0; index < contraints.length; index++) {
        
        if (contraints[index].get("type") === "prerequisites") {

            preReqNode.children.push(contraints[index].get("units"))
        }
    }

    return detailedUnitInformation;
}