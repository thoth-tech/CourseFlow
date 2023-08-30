export interface Unit {
    Code: string;
    Name: string;
    Type: string;
    Content: string;
    CreditPoints: string;
    Prerequisite: string;
    ULOs: string[];
    GLOs: string[];
    Assessment: {
      Description: string;
      Weight: number;
      WeekDue: string;
    }[];
  }
  