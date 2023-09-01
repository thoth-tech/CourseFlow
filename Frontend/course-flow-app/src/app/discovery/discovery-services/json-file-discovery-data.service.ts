// Angular Imports
import { Injectable } from '@angular/core';

// Enum Imports
import { EDiscoveryGroupUnitsBy } from 'src/app/enum/discoveryEnums';

// Interface Imports
import { IDiscoveryHierarchicalData, IDiscoveryDataService } from 'src/app/interfaces/discoveryInterfaces';

// JSON Data Imports
import  * as courseJsonData from "src/data/courseData.json";
import * as facultyBasedUnitJsonData from "src/data/units.json";

@Injectable({
  providedIn: 'root'
})
export class JsonFileDiscoveryDataService implements IDiscoveryDataService {

  // Json data as array of objects.
  courseDataArray: object[] = courseJsonData;
  facultyBasedUnitDataArray: object[] = facultyBasedUnitJsonData;

  // Cache the hierarchical data.
  discoveryCourseBasedHierarchicalData: IDiscoveryHierarchicalData | null = null;
  discoveryFacultyBasedHierarchicalData: IDiscoveryHierarchicalData | null = null;

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Reads and processes json data and returns an object containing data in an hierarchical structure.
   * @param groupUnitsByQuery Query parameter used to get the correct data hierarchical grouping.
   */
  getDiscoveryHierarchicalData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:
        
        if (this.discoveryFacultyBasedHierarchicalData) {

          return this.discoveryFacultyBasedHierarchicalData;
        }

        this.discoveryFacultyBasedHierarchicalData = this.getFacultyUnitDataAsHierarchicalData();
        return this.discoveryFacultyBasedHierarchicalData;
      
      case EDiscoveryGroupUnitsBy.course:

        if (this.discoveryCourseBasedHierarchicalData) {

          return this.discoveryCourseBasedHierarchicalData;
        }

        this.discoveryCourseBasedHierarchicalData = this.getCourseDataAsHierarchicalData();
        return this.discoveryCourseBasedHierarchicalData

      default:

        if (this.discoveryCourseBasedHierarchicalData) {

          return this.discoveryCourseBasedHierarchicalData;
        }
      
        this.discoveryCourseBasedHierarchicalData = this.getFacultyUnitDataAsHierarchicalData();
        return this.discoveryCourseBasedHierarchicalData;
    }

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
      description: "Find your ideal units by course.",
      group: "0",
      height: 3,
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
          height: 2,
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
            height: 1,
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
                height: 0,
                children: []
            }

            majorObject.children.push(unitObject)
        }); 

      });
    }

    return courseBasedHierarchicalData;
  }

  /**
   * Processes the data array from the unit json file and creates a hierarchy of nodes based on faculty.
   * @returns Hierarchical data based on faculty from unit json file.
   */
  getFacultyUnitDataAsHierarchicalData(): IDiscoveryHierarchicalData {

    let facultyNames: Record<string, string> = {
    
      "A": "Arts and Education",
      "E": "Arts and Education",
      "H": "Health",
      "M": "Business and Law",
      "S": "Science, Engineering and Built Environment",
      "F": "Other",
      "I": "Other",
      "L": "Other"
  }

    // Define the root node.
    let unitData: IDiscoveryHierarchicalData = {
        id: "root",
        name: 'Faculty',
        description: "Find your ideal unit based on faculty and unit codes",
        group: "0",
        height: 0,
        children: []
    }

    // Loop through all units.
    for (let index = 0; index < this.facultyBasedUnitDataArray.length; index++) {
        
        // The unit object containing data of a unit.
        const unitObject: any = this.facultyBasedUnitDataArray[index];

        // Get the unit code.
        let unitCode: string = unitObject.Code;

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
                height: 0,
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
                height: 0,
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
            height: 0,
            children: []
        }

        currentDisciplineObject.children.push(currentUnitObject)
    }

    return unitData;
  }
}