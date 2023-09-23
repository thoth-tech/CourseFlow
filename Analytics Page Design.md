# CourseFlow - Analytics Page Design

---

## Overview

CourseFlow was created with the goal of providing a user-friendly program to assist students in understanding their courses and fulfilling their requirements for graduation. The website will provide students accessible and tailored information to aid them in making informed choices and selecting the best units for their educational journeys, and meeting their course prerequisites. Therefore, the **Analytics Page** plays a crucial part in the project, as it provides users with important information, and students can use this to visualise their performance since the start of university.

## Explanation and Flow

Concept of the Analytics Page is straightforward, it will use relevant information gathered from the CourseMap page to show the progress of the student.

![Alt text](image-1.png) **(Must add link to GitHub directory in future)**

As seen above, information will be displayed in the Analytics Page through a user interface that students can glance easily to retrieve information such as their completed/remaining units, their course progress and their calculated Weighted Average Mark(WAM).

![Alt text](image-2.png) **(Must add link to GitHub directory in future)**

Pie Charts will be the main display method for information for the units within the course. The remaining sections of the page will display information such as:

- Course Information
- Unit Information
- Results
- Estimated WAM

## Course Information

Course Information will be displayed below the pie chart along with a progress bar. It will display the toal amount of credit points accumulated by the student, along with the box containing important unit information for students, these include:

- Core Units
- Electives
- Minors
- 0-Credit Point Units
- Student Handbook Link

## Implementation Planning

![Alt text](image-3.png) **(Must add link to GitHub directory in future)**

When entering the Analytics Page, students will first see the Pie Chart then other sections such as Results or Estimated WAM. The Pie Chart is interactable, and students can view more information about their units based on 3 statuses:

- Completed
- On-Going
- Remaining

### Completed Units

![Alt text](image-4.png) **(Must add link to GitHub directory in future)**

### On-Going Units

![Alt text](image-5.png) **(Must add link to GitHub directory in future)**

### Remaining Units

![Alt text](image-6.png) **(Must add link to GitHub directory in future)**

Each card will contain information about the unit, clicking on the card will direct users to the unit page site if it is available. Additionally, the card section will also feature a scroll bar if there are more than 6 cards.

Multiple methods can be used to implement the pie chart using Angular. One option includes using [*ng2-charts Package*](https://www.npmjs.com/package/ng2-charts) to add the chart. It is compatible with with multiple versions of Angular, and is a useful option to create this feature.

## Summary

The Analytics Page is an fundamental feature in the CourseFlow project, as it will present crucial information to its users, to view information as a glance and see their progress within their course and educational journey. It provides them easy access to all information regarding their course progress and helps them see the next steps required for completing their studies. It is an important tool to use for making informed decisions and making clear goals for their university experience.

## Figma Link

Figma Prototype [here](https://www.figma.com/proto/smb4NtanK3yvxyvcwZZaoz/Draft---CourseFlow?page-id=0%3A1&type=design&node-id=173-9263&viewport=833%2C-340%2C0.37&t=WFalE0NHy08DxY9k-1&scaling=scale-down&starting-point-node-id=173%3A9263&show-proto-sidebar=1)
