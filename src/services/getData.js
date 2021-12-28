import axios from "axios";

const planets = {};
const pilots = {};

const searchPlanet = async (searchTerm) => {
  for (const planetDetails of Object.values(planets)) {
    if (searchTerm === planetDetails.name) {
      return planetDetails;
    }
  }
  const res = await axios.get(
    `https://swapi.dev/api/planets/?search=${searchTerm}`
  );
  const planet = res.data.results[0];
  planet.population = parseInt(planet.population);
  return planet;
};

const getPlanets = async (searchTerms) => {
  const planets = Promise.all(
    searchTerms.map(async (term) => {
      return await searchPlanet(term);
    })
  );
  return planets;
};

const getDataByUrl = async (url, dataHashMap) => {
  if (!dataHashMap[url]) {
    const res = await axios.get(url);
    dataHashMap[url] = res.data;
  }
  return dataHashMap[url];
};

const getResourceData = async (resourceName) => {
  try {
    let isResponseExists = true;
    const data = [];
    let page = 1;
    while (isResponseExists) {
      const res = await axios.get(
        `https://swapi.dev/api/${resourceName}/?page=${page}`
      );
      const results = res.data.results;
      isResponseExists = res.data.next;
      data.push(...results);
      page++;
    }
    return data;
  } catch (err) {}
};

const addPilotsAndPlanetsDetails = async (vehicleDetails) => {
  vehicleDetails.planetsPopulation = {};
  await Promise.all(
    vehicleDetails.pilotsUrls.map(async (url) => {
      const pilot = await getDataByUrl(url, pilots);
      vehicleDetails.pilots.push(pilot.name);
      const pilotPlanet = await getDataByUrl(pilot.homeworld, planets);
      if (!vehicleDetails.planetsPopulation[pilotPlanet.name]) {
        vehicleDetails.planetsPopulation[pilotPlanet.name] =
          pilotPlanet.population;
      }
    })
  );
  for (let population of Object.values(vehicleDetails.planetsPopulation)) {
    if (isNaN(parseInt(population))) continue;
    population = parseInt(population);
    vehicleDetails.populationSum += population;
  }
};

const getPopulationSortedArray = (vehicles) => {
  const populationArray = [];
  for (let [vehicle, details] of Object.entries(vehicles)) {
    populationArray.push({ vehicle, populationSum: details.populationSum });
  }
  populationArray.sort((a, b) => {
    return b.populationSum - a.populationSum;
  });
  return populationArray;
};

const initVehiclesData = async (allVehicles) => {
  const vehicles = {};
  const vehiclesAndTheirPilotsArray = allVehicles.filter(
    (vehicle) => vehicle.pilots.length > 0
  );
  vehiclesAndTheirPilotsArray.forEach((vehicle) => {
    vehicles[vehicle.name] = {
      pilotsUrls: vehicle.pilots,
      pilots: [],
      planetsPopulation: {},
      populationSum: 0,
    };
  });
  for (const vehicleDetails of Object.values(vehicles)) {
    await addPilotsAndPlanetsDetails(vehicleDetails);
  }
  return vehicles;
};

const getVehiclesDetails = async () => {
  const allVehicles = await getResourceData("vehicles");
  const vehicles = await initVehiclesData(allVehicles);
  return vehicles;
};

export { getVehiclesDetails, getPopulationSortedArray, getPlanets };
