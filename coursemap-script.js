var courseNumberOfYears = document.getElementById("course-type-select").value;
var courseSelect = document.getElementById("course-type-select");
var previousCredit = document.getElementById("previous-credit");
var UnitsInProgress = document.getElementById("units-in-progress");
var studyPace = document.getElementById("study-pace").value;
var paceSelect = document.getElementById("study-pace");


function yearsPrinter() {
    var studyPace = document.getElementById("study-pace").value;
    var multiplier = (studyPace === 'part-time') ? 2 : 1;

    var coursemapContainer = document.querySelector('.coursemap-container');
    // Clear any existing year containers
    coursemapContainer.innerHTML = '';
    

    // Create divs for the selected number of years and append them to the container
    for (var i = 0; i < (courseNumberOfYears * multiplier); i++) {
        var div = document.createElement('div');
        coursemapContainer.appendChild(div);
        // Create a new yearContainer element
        var yearContainer = document.createElement('div');
        yearContainer.className = 'year-container';
        // Append the yearContainer to the div
        div.appendChild(yearContainer);

        var yearTextContainer = document.createElement('div');
        yearTextContainer.className = 'year-text';
        var yearText = document.createTextNode('Year ' + (i + 1));
        yearTextContainer.appendChild(yearText);
        yearContainer.appendChild(yearTextContainer);


        var trimesterBucket = document.createElement('div');
        trimesterBucket.className = 'trimester-bucket';
        yearContainer.appendChild(trimesterBucket);
    }
}
// Call the yearsPrinter function initially to create the default number of years


function trimesterPrinter() {
    // Get all year-container elements
    var trimesterBuckets = document.querySelectorAll('.trimester-bucket');
    // Loop through each year-container element
    for (var i = 0; i < trimesterBuckets.length; i++) {
      var trimesterBucket = trimesterBuckets[i];
      // Create four unit circle elements and append them to the trimester-bucket within year-container
        for (var j = 0; j < 2; j++) {
            var trimesterContainer = document.createElement('div');
            trimesterContainer.className = 'trimester-container';
            trimesterBucket.appendChild(trimesterContainer);


            var trimesterTextContainer = document.createElement('div');
            trimesterTextContainer.className = 'trimester-text';
            var trimesterText = document.createTextNode("Tri " + (j+1));
            trimesterTextContainer.appendChild(trimesterText);
            trimesterContainer.appendChild(trimesterTextContainer);

        }
    }
}

function UnitCirclePrinter() {
    var trimesterContainers = document.querySelectorAll(".trimester-container");
    var studyPace = document.getElementById("study-pace").value;
    var previousCredit = parseInt(document.getElementById("previous-credit").value);
    var UnitsInProgress = parseInt(document.getElementById("units-in-progress").value);

    var multiplier = (studyPace === 'part-time') ? 0.5 : 1;
    var unitsPerTrimester = 4;

    for (var i = 0; i < trimesterContainers.length; i++) {
        var trimesterContainer = trimesterContainers[i];
        
        for (var j = 0; j < (unitsPerTrimester * multiplier); j++) {
            var unitCircle = document.createElement('div');
            unitCircle.className = 'unit-circle';
            unitCircle.classList.add('upcoming'); 

            if (previousCredit > 0 && previousCredit) {
                unitCircle.classList.remove('upcoming');
                unitCircle.classList.add("complete");
                previousCredit--;
            }
            else if (UnitsInProgress > 0 && UnitsInProgress <= 4) {
                unitCircle.classList.remove('upcoming');
                unitCircle.classList.add("in-progress");
                UnitsInProgress--;
            }

            trimesterContainer.appendChild(unitCircle);
        }
    }
}


// Could possibly put all the below text into a single function 
// That returns the percentage variables as an array of values. 
// Condenses code. 
function calculateUpcomingUnits() {
    // Calculates the percentage of units that have the class 'upcoming'
    var unitCircles = document.getElementsByClassName("unit-circle").length;
    var upcomingUnitCircles = document.getElementsByClassName("unit-circle upcoming").length;

    var upcomingUnitPercentage = (upcomingUnitCircles / unitCircles) * 100;
    return upcomingUnitPercentage;
}


function calculateInProgressUnits() {
    // Calculates the percentage of units that have the class 'upcoming'
    var unitCircles = document.getElementsByClassName("unit-circle").length;
    var inProgressUnitCircles = document.getElementsByClassName("unit-circle in-progress").length;

    var inProgressUnitPercentage = (inProgressUnitCircles / unitCircles) * 100;
    return inProgressUnitPercentage;
}

function calculateCompleteUnits() {
    // Calculates the percentage of units that have the class 'upcoming'
    var unitCircles = document.getElementsByClassName("unit-circle").length;
    var completeUnitCircles = document.getElementsByClassName("unit-circle complete").length;

    var completeUnitPercentage = (completeUnitCircles / unitCircles) * 100;
    return completeUnitPercentage;
}

// Calculate the percentages and update the progress bar
function updateProgressBar() {
    var unitCircles = document.getElementsByClassName("unit-circle").length;

    var upcomingUnitPercentage = (calculateUpcomingUnits());
    var inProgressUnitPercentage = (calculateInProgressUnits());
    var completeUnitPercentage = (calculateCompleteUnits());

    var completeSection = document.querySelector(".complete");
    var inProgressSection = document.querySelector(".in-progress");
    var upcomingSection = document.querySelector(".upcoming");

    completeSection.style.width = completeUnitPercentage + "%";
    inProgressSection.style.width = inProgressUnitPercentage + "%";
    upcomingSection.style.width = upcomingUnitPercentage + "%";
}



// Displays modal when unit circle is clicked
$(document).ready(function() {
    // When the div with class 'unit-circle' is clicked, show the modal
    $('.unit-circle').click(function() {
        $('#unit-modal-template').css('display', 'block');
    });
  
    // When the close button or outside the modal is clicked, hide the modal
    $('.close, .unit-modal').click(function() {
        $('#unit-modal-template').css('display', 'none');
    });
});






// Calling all functions when webpage loads
yearsPrinter();
trimesterPrinter();
UnitCirclePrinter();
calculateUpcomingUnits();
updateProgressBar();


// Runs all functions when an event has occurred.
function updateDisplay() {
    yearsPrinter();
    trimesterPrinter();
    UnitCirclePrinter();
    updateProgressBar();

    $(document).ready(function() {
        // When the div with class 'unit-circle' is clicked, show the modal
        $('.unit-circle').click(function() {
            $('#unit-modal-template').css('display', 'block');
        });
      
        // When the close button or outside the modal is clicked, hide the modal
        $('.close, .unit-modal').click(function() {
            $('#unit-modal-template').css('display', 'none');
        });
    });
}

UnitsInProgress.addEventListener('change', updateDisplay);
previousCredit.addEventListener('change', updateDisplay);

courseSelect.addEventListener('change', function() {
    courseNumberOfYears = courseSelect.value;
    updateDisplay();
});

paceSelect.addEventListener('change', function() {
    studyPace = paceSelect.value;
    updateDisplay();
});

