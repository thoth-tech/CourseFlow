/**
 * Handler to load the graph properties data.
 */

// Data Type Imports
import { IDiscoveryGraphProperties } from '../interfaces/discoveryInterfaces';

// Function Exports
export const getGraphProperties : IDiscoveryGraphProperties = processJsonData();

// JSON Data Imports
import  * as graphData from "../../data/graphProperties.json"

// Function for Data Handling
function processJsonData() : IDiscoveryGraphProperties  {

    let graphProperties: IDiscoveryGraphProperties = graphData;

    return graphProperties;
}