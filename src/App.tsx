import React, { useEffect, useState } from 'react';
import './App.css';
import { sampleGetMosquitoPopulation } from './utils/mosquitos';

const App: React.FC = () => {
  const [population, setPopulation] = useState();
  useEffect(() => {
      setPopulation(sampleGetMosquitoPopulation());
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          If you saw 2 in your garden and we assume it was one recently adult male and one recently adult female
          `After 30 days`
          {console.warn(population)}
          Hi
        </p>
      </header>
    </div>
  );
}

export default App;
