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
  facultyBasedUnitDataArray: object[] = facultyBasedUnitJsonData;

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Reads and processes json data and returns an object containing data in an hierarchical structure.
   * @param groupUnitsByQuery Query parameter used to get the correct data hierarchical grouping.
   */
  getDiscoveryHierarchicalData(groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {
    
    let discoveryHierarchicalData: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData;

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:
        
        discoveryHierarchicalData = this.getFacultyUnitDataAsHierarchicalData();

        break;
      
      case EDiscoveryGroupUnitsBy.course:

        discoveryHierarchicalData = this.getCourseDataAsHierarchicalData();
        break;

      case EDiscoveryGroupUnitsBy.related_units:

        // TODO To be implemented
        break;

      default:

        discoveryHierarchicalData = this.getFacultyUnitDataAsHierarchicalData();
        break;
    }

    return discoveryHierarchicalData;
  }

  /**
   * Get unit data by id.
   * 
   * @param id 
   * @param groupUnitsByQuery 
   * @returns 
   */
  getDiscoveryUnitDataById(id: string, groupUnitsByQuery: EDiscoveryGroupUnitsBy): IDiscoveryHierarchicalData {
    
    let discoveryHierarchicalUnitData: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData;

    switch (groupUnitsByQuery) {

      case EDiscoveryGroupUnitsBy.faculty:
        
      discoveryHierarchicalUnitData = this.getDetailedFacultyUnitData(id);

        break;
      
      case EDiscoveryGroupUnitsBy.course:

        // TODO to be implemented
        discoveryHierarchicalUnitData = this.getDetailedCourseUnitData(id);
        break;

      case EDiscoveryGroupUnitsBy.related_units:

        // TODO To be implemented
        break;

      default:

        discoveryHierarchicalUnitData = this.getDetailedFacultyUnitData(id);
        break;
    }

    return discoveryHierarchicalUnitData;
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
        children: []
    }

    // Loop through all units.
    for (let index = 0; index < this.facultyBasedUnitDataArray.length; index++) {
        
        // The unit object containing data of a unit.
        const unitObject: any = this.facultyBasedUnitDataArray[index];

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

  /**
   * Get detailed unit data with links to pre-reqs and co-reqs.
   * @param id Id of the unit.
   * @returns Unit hierarchical data with pre-req and co-reqs.
   */
  getDetailedFacultyUnitData(id: string): IDiscoveryHierarchicalData {

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
    for (let index = 0; index < this.facultyBasedUnitDataArray.length; index++) {
        
        let currentUnitAtIndex: any = this.facultyBasedUnitDataArray[index];

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

  /**
   * Get detailed unit data with links to pre-reqs and co-reqs.
   * @param id Id of the unit.
   * @returns Unit hierarchical data with pre-req and co-reqs.
   */
    getDetailedCourseUnitData(id: string): IDiscoveryHierarchicalData {

    // Find unit by the id
    let unitData: any = {};
    for (let index = 0; index < this.courseDataArray.length; index++) {
        
        let currentUnitAtIndex: any = this.courseDataArray[index];

        if (currentUnitAtIndex["code"] == id) {

            unitData = currentUnitAtIndex;
        }
    }

    let detailedUnitInformation: IDiscoveryHierarchicalData = {} as IDiscoveryHierarchicalData;

    // Set the root node to the unit we are trying to find.
    detailedUnitInformation = {
        id: unitData["code"],
        name: unitData["name"],
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
}