import {
  getVehiclesDetails,
  getPopulationSortedArray,
} from "../services/getData";
import { useState, useEffect } from "react";
import { Loader } from "./loader/Loader";

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState({});
  const [populationSortedArray, setPopulationSortedArray] = useState([]);

  useEffect(() => {
    const noVehicles = Object.keys(vehicles).length === 0;
    if (noVehicles) {
      getVehiclesDetails().then((vehicles) => {
        setVehicles(vehicles);
        setPopulationSortedArray(getPopulationSortedArray(vehicles));
      });
    }
  });

  const planetsDetailsView = () => {
    let planetsPopulation = "";
    const planets =
      vehicles[populationSortedArray[0].vehicle].planetsPopulation;
    for (const [name, population] of Object.entries(planets)) {
      planetsPopulation += ` ${name}, ${population}`;
    }
    return planetsPopulation;
  };

  const pilotsString = () => {
    const pilots = vehicles[populationSortedArray[0].vehicle].pilots;
    let pilotsString = "";
    pilots.forEach((pilot) => {
      pilotsString += `${pilot} `;
    });
    return pilotsString;
  };

  const table = () => {
    if (!populationSortedArray[0]) {
      return <Loader />;
    } else {
      return (
        <div className="container">
          <table>
            <tbody>
              <tr>
                <td>Vehicle name with the largest sum </td>
                <td>{populationSortedArray[0].vehicle}</td>
              </tr>
              <tr>
                <td>Related home planets and their respective population </td>
                <td>{planetsDetailsView()}</td>
              </tr>
              <tr>
                <td>Related pilot names </td>
                <td>{pilotsString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };
  return (
    <>
      <h1>
        The vehicle which has the highest sum of population for all its pilots’
        home planets
      </h1>
      {table()}
    </>
  );
};

export { VehicleTable };
