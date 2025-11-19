import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function useFetch() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const USERS_PER_PAGE = 3;

  async function fetchUsers(count = 9, append = false) {
    try {
      setLoading(true);
      const res = await fetch(`https://randomuser.me/api/?results=${count}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      if (append) {
        setUsers((prev) => [...prev, ...data.results]);
      } else {
        setUsers(data.results);
        sessionStorage.setItem("users", JSON.stringify(data.results));

      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Sorry! Users're not willing to come for now(")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("users");
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      fetchUsers(9);
    }
  }, []);
  

  async function nextPage() {
    try {
      const totalLoaded = (page + 1) * USERS_PER_PAGE;
      if (totalLoaded >= users.length) {
        await fetchUsers(USERS_PER_PAGE, true);
      }
      setPage((p) => p + 1);
    } catch (err) {
      console.error("Next page failed:", err);
      toast.error("Sorry! Next page has some problems.")
    }
  }
  

  function prevPage() {
    setPage((p) => Math.max(p - 1, 0));
  }

  const start = page * USERS_PER_PAGE;
  const currentUsers = users.slice(start, start + USERS_PER_PAGE);

  return { currentUsers, nextPage, prevPage, page, loading };
}
