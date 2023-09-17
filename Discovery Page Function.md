# CourseFlow - Discovery Page Design

---

## Overview

The Discovery Page is a part of the CourseFlow website where students will be able to visualise all of Deakin University's units. It will resemble '[Map of Reddit](https://anvaka.github.io/map-of-reddit/?x=18239&y=12514&z=29055.0602231602&v=2)' where similar units are grouped together, this includes nodes, links and descriptions of the units.

## Key Features

- Massive interactable map featuring Units(Grouped by various kinds of categories such as faculty or specialisations) and is able to be panned, displaying details about units and specialisations.
- Provides user with settings to change display in terms of grouping and display type
- Detail panel for specialisations and units via nodes.

## Front End Map Graph

When the user enters the front end page, the intended outcome for the page will be for it to run an end-point get request to retrieve data from the back-end, which then node data containing unit information with the respective connections to other unit data will be sent to the front-end. The retrieval of said data will occur via a service which is shown in the image below:

![Alt text](image-7.png)

Currently the prototype uses a JSON file to hold data to be used within the prototype and will move to a get request from the backend in the future.

The other core code involved here  will be a component that will be used to render the nodes from the retrieved data onto the webpage for users to view. The key thing for this section is that this component will utilize the service, which implementation will be injected into the component via its interface that it is bound to. This section is shown below:

![Alt text](image-8.png)

Once the backend is ready and we are ready to make the switch, we can easily create a new implementation of the service and swap out said implementation in the app module as shown below:

![Alt text](image-9.png)

Swapping of implementation occurs within the providers section:

```angular
providers: [
    { provide: IDiscoveryDataServiceInjector, useClass: JsonFileDiscoveryDataService}
],
```

## Display Settings

Display settings will appear on the left side of the screen,where two sections will appear for the general map:

- Group Units by (Specialisations/Faculty)
- Display Type (Node/Text)

Nodes will be interactable and when clicked will show a description of the unit. In/Out-connections will be used dynamically create related groupings or units as buttons. These buttons are clickable and will make the user transition to the unit/grouped node.

## Comments

- Previously, the graph used a Force-Directed method to create the graph, which is caused issues such as making the website slow and laggy, causing unpredictable node layouts.
- Best visuals for the map requires working with smaller amounts of data.
- Force-Directed methods require some maths knowledge to find optimal values for the graph simulation.
- We have moved to pre-calculated values of node positions which will now rely on the backend algorithms to provide the appropriate positions for clusters to lay out the nodes.
