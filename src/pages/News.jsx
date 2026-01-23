import React, { useState, useEffect } from 'react';

const NewsComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://newsdata.io/api/1/latest? 
  apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91
  &country=za,us,jp,ua
  &language=en
  &category=breaking,education,sports,world,other
  &removeduplicate=1")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default NewsComponent;
