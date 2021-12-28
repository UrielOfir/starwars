import { useState, useEffect } from "react";
import { getPlanets } from "../services/getData";
import { Loader } from "./loader/Loader";

const PlanetsChart = () => {
  const [planets, setPlanets] = useState([]);
  const [maxPopulation, setMaxPopulation] = useState(0);
  const noPlanets = Object.keys(planets).length === 0;

  useEffect(() => {
    if (noPlanets) {
      getPlanets(["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"]).then(
        (planets) => {
          setPlanets(planets);
          const max = planets.reduce((p, v) => {
            return p.population > v.population ? p : v;
          }).population;
          setMaxPopulation(max);
        }
      );
    }
  });

  const chartColumns = noPlanets ? (
    <Loader />
  ) : (
    planets.map((planet) => {
      let planetPopulationPrecent = Math.ceil(
        (planet.population / maxPopulation) * 100
      );
      return (
        <div key={planet.name}>
          <div className="column-container">
            <div>{planet.name}</div>
            <div
              className="column"
              style={{ height: `${planetPopulationPrecent}%` }}
            />
            <div>{planet.population.toLocaleString()}</div>
          </div>
        </div>
      );
    })
  );

  return (
    <>
      <h1>Comparing the home planets’ own population</h1>
      <div className="container">{chartColumns}</div>
    </>
  );
};

export { PlanetsChart };
