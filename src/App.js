import React, { useState } from 'react';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [error, setError] = useState(null);

  const fetchNumbers = async () => {
    const urls = [
      'http://20.244.56.144/numbers/primes',
      'http://20.244.56.144/numbers/fibo',
      'http://20.244.56.144/numbers/odd'
    ];

    try {
      const responsePromises = urls.map(url =>
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .catch(error => {
            console.error('Error fetching from', url, error);
            return { numbers: [] }; // Return empty numbers on error
          })
      );

      const responses = await Promise.all(responsePromises);

      const validResponses = responses
        .map(response => response.numbers)
        .flat();

      const uniqueNumbers = Array.from(new Set(validResponses));
      const sortedNumbers = uniqueNumbers.sort((a, b) => a - b);

      setNumbers(sortedNumbers);
      setError(null);
    } catch (error) {
      console.error('Error fetching numbers:', error);
      setError('Error fetching numbers. Please try again later.');
    }
  };

  return (
    <div className="App">
      <button onClick={fetchNumbers}>Fetch Numbers</button>
      <div>
        {error && <p>{error}</p>}
        <h2>Result:</h2>
        <pre>{JSON.stringify({ numbers }, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
