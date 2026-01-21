import { useEffect, useState } from "react";

export const useConnectionStrength = () => {
  const [strength, setStrength] = useState("Checking");

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.webkitConnection ||
      navigator.mozConnection;

    if (!connection) {
      setStrength("Unknown");
      return;
    }

    const evaluate = () => {
      const { downlink, effectiveType } = connection;

      if (downlink < 1 || effectiveType === "2g" || effectiveType === "slow-2g") {
        setStrength("Poor");
      } else if (downlink < 3 || effectiveType === "3g") {
        setStrength("Average");
      } else {
        setStrength("Good");
      }
    };

    evaluate();
    connection.addEventListener("change", evaluate);

    return () => {
      connection.removeEventListener("change", evaluate);
    };
  }, []);

  return strength;
};
