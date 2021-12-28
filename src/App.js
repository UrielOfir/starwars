import "./App.css";
import { VehicleTable } from "./components/VehicleTable";
import { PlanetsChart } from "./components/PlanetsChart";

function App() {
  return (
    <div className="container flex-column">
      <VehicleTable />
      <PlanetsChart />
    </div>
  );
}

export default App;
