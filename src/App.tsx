import { useEffect, useState } from 'react';

import Table from './Table';

function App() {
  const [nests, setNests] = useState<Nest[]>([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('/api/v1/sse/events');
      events.onmessage = (event) => {
        const nestData = JSON.parse(event.data);
        if (Array.isArray(nestData)) {
          setNests(nestData);
        } else {
          setNests([...nests, nestData]);
        }
      };

      setListening(true);
    }
  }, [listening, nests]);

  return (
    <div className="app">
      <Table data={nests} />
    </div>
  );
}

export default App;

export interface Nest {
  country: string;
  code: string;
  currency: string;
  level: number;
  units: string;
}
