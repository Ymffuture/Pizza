import React, { useState, useEffect } from "react";

const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url =
      "https://newsdata.io/api/1/latest" +
      "?apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91" +
      "&country=za,us,jp,ua" +
      "&language=en" +
      "&category=breaking,education,sports,world,other" +
      "&removeduplicate=1";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <pre className="text-xs overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default NewsComponent;
