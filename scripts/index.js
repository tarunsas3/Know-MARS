const previousWeatherToggle = document.querySelector(".show-previous-weather");
const previousWeather = document.querySelector(".previous-weather");

const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHighElement = document.querySelector(
  "[data-current-temp-high]"
);
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionText = document.querySelector("[data-wind-direction-text]");
const windDirectionArrow = document.querySelector(
  "[data-wind-direction-arrow]"
);

const previousSolTemplate = document.querySelector(
  "[data-previous-sol-template]"
);
const previousSolContainer = document.querySelector("[data-previous-sols]");

const unitToggle = document.querySelector("[data-unit-toggle]");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("fah");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

let selectedSolIndex;

getWeather().then((sols) => {
  selectedSolIndex = 0;
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateUnits();

  unitToggle.addEventListener("click", () => {
    let metricUnits = !isMetric();
    metricRadio.checked = metricUnits;
    imperialRadio.checked = !metricUnits;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });

  metricRadio.addEventListener("change", () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });

  imperialRadio.addEventListener("change", () => {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.innerText = selectedSol.sol;
  currentDateElement.innerText = displayDate(selectedSol.date);
  currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
  currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
  windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
  windDirectionText.innerText = selectedSol.windDirectionText;
  windDirectionArrow.style.setProperty(
    "--direction",
    `${displayDirection(selectedSol.windDirectionDegree)}deg`
  );
}

function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = "";
  sols.slice(0, 7).forEach((solData, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true);
    solContainer.querySelector("[data-sol]").innerText = solData.sol;
    solContainer.querySelector("[data-date]").innerText = displayDate(
      solData.date
    );
    solContainer.querySelector(
      "[data-temp-high]"
    ).innerText = displayTemperature(solData.maxTemp);
    solContainer.querySelector(
      "[data-temp-low]"
    ).innerText = displayTemperature(solData.minTemp);
    solContainer
      .querySelector("[data-select-button]")
      .addEventListener("click", () => {
        selectedSolIndex = index;
        displaySelectedSol(sols);
      });
    previousSolContainer.appendChild(solContainer);
  });
}

function displayDate(date) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var currentDate = date;
  var date = new Date(currentDate);
  var currentMonth = months[date.getUTCMonth()];
  var currentDay = date.getUTCDate();
  var currentDay = currentMonth + " " + currentDay;
  return currentDay;
}

var save = 0;

function displayDirection(degree) {
  save = Math.abs(degree);
  var result = Math.round((save * 66) / 3);
  return result;
}

function displayTemperature(temperature) {
  let returnTemp = temperature;
  if (!isMetric()) {
    returnTemp = (temperature - 32) * (5 / 9);
  }
  return Math.round(returnTemp);
}

function displaySpeed(speed) {
  let returnSpeed = speed;
  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }
  return Math.round(returnSpeed);
}

function getWeather() {
  return fetch(
    "https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json"
  )
    .then((res) => res.json())
    .then((data) => {
      data = data.soles;
      const { ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: data.sol,
          maxTemp: data.max_temp,
          minTemp: data.min_temp,
          windSpeed: data.max_gts_temp,
          windDirectionDegree: data.min_gts_temp,
          windDirectionCardinal: data.min_gts_temp,
          date: data.terrestrial_date,
        };
      });
    });
}

function updateUnits() {
  const speedUnits = document.querySelectorAll("[data-speed-unit]");
  const tempUnits = document.querySelectorAll("[data-temp-unit]");
  speedUnits.forEach((unit) => {
    unit.innerText = isMetric() ? "kph" : "mph";
  });
  tempUnits.forEach((unit) => {
    unit.innerText = isMetric() ? "C" : "F";
  });
}

function isMetric() {
  return metricRadio.checked;
}
