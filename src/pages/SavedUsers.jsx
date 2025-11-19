import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import WeatherInfo from "../components/WeatherInfo";
import useWeather from "../hooks/useWeather";
import { sendToN8N } from "../services/n8nService";
import toast from "react-hot-toast";

export default function SavedUsers() {
  const [savedUsers, setSavedUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { selectedWeather, isInfoOpen, fetchWeather, closeWeather } =
    useWeather();

  useEffect(() => {
    const stored = localStorage.getItem("savedUsers");
    if (stored) setSavedUsers(JSON.parse(stored));
  }, []);


  function openConfirm(user) {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  }


  function confirmDelete() {
    if (!userToDelete) return;

    const updated = savedUsers.filter(
      (u) => u.login.uuid !== userToDelete.login.uuid
    );

    setSavedUsers(updated);
    localStorage.setItem("savedUsers", JSON.stringify(updated));

    setIsConfirmOpen(false);
    setUserToDelete(null);
  }


  function cancelDelete() {
    setIsConfirmOpen(false);
    setUserToDelete(null);
  }


  async function handleExportAll() {
    if (!savedUsers.length) return;

    const payload = savedUsers.map((user) => ({
      fullName: `${user.name.first} ${user.name.last}`,
      email: user.email,
      gender: user.gender,
      location: `${user.location.city}, ${user.location.country}`,
      exportedAt: new Date().toISOString(),
    }));

    const loadingId = toast.loading("Exporting...");

    try {
      await sendToN8N(payload);
      toast.success("All users were exported to Google Sheets successfully! 🚀");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Sorry! Export failed. Try again later!");
    } finally {
      toast.dismiss(loadingId);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      {savedUsers.length === 0 ? (
        <p className="text-center text-gray-500">No saved users yet.</p>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            <button
              onClick={handleExportAll}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Export to Google Sheet📄
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedUsers.map((user) => (
              <UserCard
                key={user.login.uuid}
                user={user}
                onWeather={fetchWeather}
                onDelete={() => openConfirm(user)} 
              />
            ))}
          </div>
        </>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this user?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>

              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isInfoOpen && (
        <WeatherInfo weather={selectedWeather} onClose={closeWeather} />
      )}
    </main>
  );
}
