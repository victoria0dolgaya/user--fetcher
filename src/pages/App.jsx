import UserCard from "../components/UserCard";
import WeatherInfo from "../components/WeatherInfo";
import useWeather from "../hooks/useWeather";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function App() {
  const { currentUsers, nextPage, prevPage, page, loading } = useFetch();
  const [savedUsers, setSavedUsers] = useState([]);
  const { selectedWeather, isInfoOpen, fetchWeather, closeWeather } =
    useWeather();

  useEffect(() => {
    const stored = localStorage.getItem("savedUsers");
    if (stored) {
      setSavedUsers(JSON.parse(stored));
    }
  }, []);

  function handleSave(user) {
    const exists = savedUsers.find((u) => u.login.uuid === user.login.uuid);
    if (exists) {
      toast.error(`${user.name.first} is already saved.`);
      return;
    }

    const updated = [...savedUsers, user];
    setSavedUsers(updated);
    localStorage.setItem("savedUsers", JSON.stringify(updated));
    toast.success(`${user.name.first} was saved!`);
  }

  if (loading)
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found...</p>
        ) : (
          currentUsers.map((user) => (
            <UserCard
              key={user.login.uuid}
              user={user}
              onWeather={fetchWeather}
              onSave={handleSave}
              isSaved={savedUsers.some((u) => u.login.uuid === user.login.uuid)}
            />
          ))
        )}
      </div>

      <div className="flex justify-center items-center gap-6 mt-12">
        <button
          onClick={prevPage}
          disabled={page === 0}
          className={`px-4 py-2 rounded-lg text-white ${
            page === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={nextPage}
          className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
        >
          Next →
        </button>
      </div>

      {isInfoOpen && (
        <WeatherInfo weather={selectedWeather} onClose={closeWeather} />
      )}
    </main>
  );
}
