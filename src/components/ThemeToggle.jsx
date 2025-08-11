import { useEffect, useState } from "react";
import { MdSunny } from "react-icons/md";
import { LuMoonStar } from "react-icons/lu";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {theme === "dark" ? <MdSunny /> : <LuMoonStar />}
    </button>
  );
};

export default ThemeToggle;
