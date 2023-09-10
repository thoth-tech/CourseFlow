export interface Unit {
  Code: string;
  Name: string;
  Type: string;
  Overview: String;
  UnitChairT1: String;
  UnitChairT2: String;
  UnitChairT3: String;
  Melbourne: String;
  Geelong: String;
  Online: String;
  CreditPoints: string;
  Availability: String;
  Prerequisite: string;
  Hurdle: String;
  OnCampusLearning1: String;
  OnCampusLearning2: String;
  OnCampusLearning3: String;
  CloudLearning1: String;
  CloudLearning2: String;
  CloudLearning3: String;
  Content: string;
  Note: String;
  ULOs: string[];
  GLOs: string[];
  Assessment: {
    Description: string;
    Weight: number;
    WeekDue: string;
  }[];
}
