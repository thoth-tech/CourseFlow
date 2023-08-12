/**
 * Handler to load the unit json data.
 * This should not be required in the future once connected with the backend.
 */

// Imports
import { IDiscoveryTreeData } from '../interfaces/discoveryInterfaces';
import  * as jsonData from "../../data/unit_data.json"

// Exported method to get discovery data
export const getDiscoveryTreeData: IDiscoveryTreeData = processDiscoveryJsonData();

function processDiscoveryJsonData(): IDiscoveryTreeData  {

    // Better to not use any as a type but for now, should be fine as the backend will send back data in the required type once testing is done.
    let jsonDataAsArray: any[] = jsonData as any;

    // Faculty nodes
    let facultyData: IDiscoveryTreeData[] = [];

    // Process the data and get required information.
    for (let index = 0; index < jsonDataAsArray.length; index++) {

        // The unit object containing data of a unit from the json.
        const unitObject: any = jsonDataAsArray[index];;

        // Get the unit code
        let unitCode: string = unitObject["code"];

        // Get the first letter which will correspond to a faculty
        let facultyCode: string = unitCode[0];

        // Check if faculty already exists by checking against the id, if not, add it in.
        let facultyObject = facultyData.find((data) => data.name == facultyCode)
        
        if (!facultyObject) {

            facultyObject = {
                    
                name: facultyCode,
                children: [],
            }

            facultyData.push(facultyObject)
        }

        // Get the 3 letter code which will be the discipline
        let disciplineCode = unitCode.substring(0, 3);

        let disciplineObject = facultyObject?.children.find((data) => data.name === disciplineCode)

        if (!disciplineObject){
            
            disciplineObject = {
                name: disciplineCode,
                children: []
            }

            facultyObject?.children.push(disciplineObject)
        }

        disciplineObject.children.push({
            name: unitObject["code"], 
            children: []})
    }

    let discoveryData: IDiscoveryTreeData = {
        name: "root",
        children: facultyData
    }

    return discoveryData;
}