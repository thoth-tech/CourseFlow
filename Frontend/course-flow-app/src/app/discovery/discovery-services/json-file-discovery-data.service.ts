// Angular Imports
import { Injectable } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryHierarchicalData, IDiscoveryDataService } from 'src/app/interfaces/discoveryInterfaces';

// JSON Data Imports
import  * as courseJsonData from "src/data/course_data.json";
import * as facultyBasedUnitJsonData from "src/data/faculty_based_unit_data.json";

@Injectable({
  providedIn: 'root'
})
export class JsonFileDiscoveryDataService implements IDiscoveryDataService {

  // Json data as array of objects.
  courseDataArray: object[] = courseJsonData;

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Reads and processes json data and returns an object containing data in an hierarchical structure.
   * @param groupUnitsByQuery Query parameter used to get the correct data hierarchical grouping.
   */
  getDiscoveryHierarchicalData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {
    
    return this.getCourseDataAsHierarchicalData();
  }

  /**
   * Get unit data by id.
   * 
   * @param id 
   * @param groupUnitsByQuery 
   * @returns 
   */
  getDiscoveryUnitDataById(id: string): IDiscoveryHierarchicalData {
    
    return {} as IDiscoveryHierarchicalData;
  }


  /**
   * Processes the data array from the course json file and creates a hierarchy of nodes.
   * @returns Hierarchical data based on course data from course json file.
   */
  getCourseDataAsHierarchicalData(): IDiscoveryHierarchicalData {

    // Define the root node.
    let courseBasedHierarchicalData: IDiscoveryHierarchicalData = {
      id: "root",
      name: 'Course',
      description: "",
      group: "0",
      children: []
    }
  
    // Loop through all courses.
    for (let index = 0; index < this.courseDataArray.length; index++) {
        
      // The unit object containing data of a unit.
      const courseData: any = this.courseDataArray[index];
      
      // For now, due to the way the layout gets ruined if there is courses with no majors, I'll exclude them for now.
      if (courseData["majors"].length === 0) {
        break;
      }

      // Local var for the majors
      let majors: IDiscoveryHierarchicalData[] = []

      // Create the object for the course
      let courseObject = {
          id:  courseData["code"],
          name: courseData["name"],
          description: courseData["overview"],
          group: "1",
          children: majors
      }
        
      // Add the course to the root node.
      courseBasedHierarchicalData.children.push(courseObject)

      // Loop through the majors
      courseData["majors"].forEach((major:any) => {
            
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

    return courseBasedHierarchicalData;
  }


}



