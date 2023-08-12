/**
 * Handler to load the unit json data.
 * This should not be required in the future once connected with the backend.
 */

// Imports
import { IDiscoveryData, 
         IDiscoveryDisciplineData, IDiscoveryUnitData,
         IDiscoveryNodeData, IDiscoveryLinkData } from '../interfaces/discoveryInterfaces';
import  * as jsonData from "../../data/unit_data.json"

// Exported method to get discovery data
export const getDiscoveryData: IDiscoveryData = processDiscoveryJsonData();

function processDiscoveryJsonData(): IDiscoveryData  {

    let test: IDiscoveryDisciplineData = {}

    // Better to not use any as a type but for now, should be fine as the backend will send back data in the required type once testing is done.
    let jsonDataAsArray: any[] = jsonData as any;

    // Faculty nodes
    let facultyData: IDiscoveryNodeData[] = [];

    // Discipline nodes
    let disciplineData: IDiscoveryDisciplineData = {};

    // Unit nodes
    let unitData: IDiscoveryUnitData = {};

    // Process the data and get required information.
    for (let index = 0; index < jsonDataAsArray.length; index++) {

        // The unit object containing data of a unit from the json.
        const unitObject: any = jsonDataAsArray[index];;

        // Get the unit code
        let unitCode: string = unitObject["code"];

        // Get the first letter which will correspond to a faculty
        let facultyCode: string = unitCode[0];

        // Check if faculty already exists by checking against the id, if not, add it in.
        if (!facultyData.find((data) => data.id == facultyCode)) {

            facultyData.push({
                    
                    id: facultyCode,
                    name: "Insert Faculty Name",
                    group: 3,
                    nodeLabelType: "Faculty",
                    description: "Insert faculty description here.",
                }
            )
        }

        // Get the 3 letter code which will be the discipline
        let disciplineCode = unitCode.substring(0, 3);

        // Key into the discipline data and push a new discipline node entry.
        if (!(facultyCode in disciplineData)){
            disciplineData[facultyCode] = [];
        }

        if (!disciplineData[facultyCode].find((data) => data.id === disciplineCode)){
            
            disciplineData[facultyCode].push({
                id: disciplineCode,
                name: "Insert Discipline Name",
                group: 2,
                nodeLabelType: "Discipline",
                description: "Insert discipline description here.",
            })
        }

        // Key into the unit data and push a new unit node entry.
        if (!(disciplineCode in unitData)){
            unitData[disciplineCode] = [];
        }

        if (!unitData[disciplineCode].find((data) => data.id === unitCode)) {

            unitData[disciplineCode].push({
                id: unitObject["code"],
                name: unitObject["title"],
                group: 1,
                nodeLabelType: "Unit",
                description: "",
            })
        }


    }

    let discoveryData: IDiscoveryData = {
        facultyNodes: facultyData,
        disciplineNodes: disciplineData,
        unitNodes: unitData
    }

    return discoveryData;
}