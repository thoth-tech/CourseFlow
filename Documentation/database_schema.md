# CourseFlow Database Schema

### Student
```js
{
    ID: Integer,
    name: String,
    enrolled_stream_id: Integer,
    enrolled_units: [String]
}
```
| Field    | Type   | Description         | Options |
|----------|--------|---------------------|---------|
| ID       | Integer|                     |         |
| name     | String |                     |         |
| enrolled_stream_id|String|Stream ID that the student is enrolled in||
| enrolled_units|[String]|Array of [unit](#unit) codes that the student is enrolled in||

### Course
Used to describe a course/major/minor/specialization etc.
```js
{
    ID: Integer,
    code: String,
    handbook_url: String,
    constraints: [Constraint Object]
}
```
| Field    | Type   | Description         | Options |
|----------|--------|---------------------|---------|
| ID       | Integer|                     |         |
| code     | String |                     |         |
| handbook_url|String|URL to the official handbook webpage for this stream||
| constraints|[Constraint object]|Array of [Constraint](#constraints) objects that describe the rules for completing this stream||

### Unit
```js
{
    ID: Integer,
    code: String,
    level: Integer,
    credit_points: Float,
    description: String,
    handbook_url: String,
    timetable: [String],
    constraints: [Constraint Object]
}
```
| Field         | Type                | Description   | Options   |
|:--------------|:--------------------|:--------------|:----------|
| ID            | Integer             |               |           |
| code          | String              |               |           |
| level         | Integer             |               |           |
| credit_points | Float               |               |           |
| description   | String              |Description of the unit from the handbook|           |
| handbook_url  | String              |URL to the official handbook webpage for this unit||
| timetable     | [String]            |The study periods that this unit is available in. Format: year-period e.g.: 2023-T2||
| constraints   | [Constraint Object] |Array of [Constraint](#constraints) objects that describe the enrollment rules for enroling in this unit||

### Constraints
#### Base constraint
All constraint documents will have this in common
```js
{
    ID: Integer,
    type: String
}
```
| Field   | Type    | Description   | Options   |
|:--------|:--------|:--------------|:----------|
| ID      | Integer |               |           |
| type    | String  |Discriminator, used to tell what kind of constraint the constraint is|pass_any, pass_all, minimum_wam, stream_enrollment, mutually_exclusive_units, corequisites, prerequisites, max_units, min_units|

#### Pass any constraint
```js
{
    ID: Integer,
    type: "pass_any",
    constraints: [Constraint Object]
}
```

| Field       | Type                | Description   | Options   |
|:------------|:--------------------|:--------------|:----------|
| ID          | Integer             |               |           |
| type        | String              |Always "pass_any" for this constraint|pass_any|
| constraints | [Constraint Object] |Array of [Constraint](#constraints) objects that all need to be passed for this constraint to pass|           |

#### Pass All Constraint

```js
{
    ID: Integer,
    type: "pass_all",
    constraints: [Constraint Object]
}
```
| Field       | Type                | Description   | Options   |
|:------------|:--------------------|:--------------|:----------|
| ID          | Integer             |               |           |
| type        | String              |Always "pass_all" for this constraint|pass_all|
| constraints | [Constraint Object] |Array of [Constraint](#constraints) objects where any constraint needs to be passed for this constraint to pass||

#### Minimum WAM Constraint

```js
{
    ID: Integer,
    type: "minimum_wam",
    minimum_wam: Integer
}
```
| Field       | Type          | Description   | Options   |
|:------------|:--------------|:--------------|:----------|
| ID          | Integer       |               |           |
| type        | String        |Always "minimum_wam" for this constraint|minimum_wam|
| minimum_wam | Integer       |The minimum WAM needed for this constraint to pass|           |

#### Sequence Enrollment Constraint

```js
{
    ID: Integer,
    type: "stream_enrollment",
    stream_id: Integer
}
```
| Field     | Type                | Description   | Options   |
|:----------|:--------------------|:--------------|:----------|
| ID        | Integer             |               |           |
| type      | String              |Always "stream_enrollment" for this constraint|stream_enrollment|
| stream_id | Integer             |The stream ID the student must be enrolled in|           |

#### Mutually Exclusive Units Constraint

```js
{
    ID: Integer,
    type: "mutually_exclusive_units",
    units: [String]
}
```
| Field   | Type                       | Description   | Options   |
|:--------|:---------------------------|:--------------|:----------|
| ID      | Integer                    |               |           |
| type    | String                     |Always "mutually_exclusive_units" for this constraint|mutually_exclusive_units|
| units     | [String]   |Array of [unit](#unit) codes. If the student has completed any of these units, this constraint will fail.|           |


#### Corequisites Constraint

```js
{
    ID: Integer,
    type: "corequisites",
    units: [String]
}
```
| Field   | Type           | Description   | Options   |
|:--------|:---------------|:--------------|:----------|
| ID      | Integer        |               |           |
| type    | String         |Always "corequisites" for this constraint|corequisites|
| units   | [String]       |Array of [unit](#unit) codes. The student must have completed or be enroled in all of these units|           |


#### Prerequisites Constraint

```js
{
    ID: Integer,
    type: "prerequisites",
    units: [String]
}
```
| Field   | Type            | Description   | Options   |
|:--------|:----------------|:--------------|:----------|
| ID      | Integer         |               |           |
| type    | String          |Always "prerequisites" for this constraint|prerequisites|
| units   | [String]        |Array of [unit](#unit) codes. The student must have completed all these units.|           |


#### Maximum Number of Units Constraint

```js
{
    ID: Integer,
    type: "max_units",
    units: [String],
    max_units: Integer
}
```
| Field     | Type        | Description   | Options   |
|:----------|:------------|:--------------|:----------|
| ID        | Integer     |               |           |
| type      | String      |Always "max_units" for this constraint|max_units|
| units     | [String]    |Array of [unit](#unit) codes.|           |
| max_units | Integer     |               |           |

#### Minimum Number of Units Constraint
```js
{
    ID: Integer,
    type: "min_units",
    units: [String],
    min_units: Integer
}
```
| Field     | Type        | Description   | Options   |
|:----------|:------------|:--------------|:----------|
| ID        | Integer     |               |           |
| type      | String      |Always "min_units" for this constraint|min_units|
| units     | [String]   |Array of [unit](#unit) codes.|           |
| min_units | Integer     |               |           |
