import React from "react";

export default function UserCard({
  user,
  onSave,
  isSaved,
  onWeather,
  onDelete,
}) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center transition-transform hover:scale-105">
      <img
        src={user.picture.large}
        alt={`${user.name.first} ${user.name.last}`}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-lg font-semibold">
        {user.name.first} {user.name.last}
      </h2>
      <p className="text-gray-600 text-sm">{user.gender}</p>
      <p className="break-words text-gray-600 text-center text-sm px-2">
        {user.email}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        {user.location.city}, {user.location.country}
      </p>

      <div className="flex justify-center gap-3">
        {onSave && (
          <button
            onClick={() => !isSaved && onSave(user)}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isSaved
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(user)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        )}

        <button
          onClick={() => onWeather(user)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Weather
        </button>
      </div>
    </div>
  );
}
