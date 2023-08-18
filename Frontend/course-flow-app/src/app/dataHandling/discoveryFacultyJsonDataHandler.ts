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

// Function Exports
export const getFacultyDiscoveryUnitData : IDiscoveryHierarchicalData = processJsonData();

// Function for Data Handling
function processJsonData() : IDiscoveryHierarchicalData  {

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