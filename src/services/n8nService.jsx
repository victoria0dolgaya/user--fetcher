export async function sendToN8N(payload) {
  try {
    const res = await fetch(
      "https://vickydolha.app.n8n.cloud/webhook/saved-users-export",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error("Failed to send data to n8n!");

    console.log("Successfully sent to n8n!");
  } catch (err) {
    console.error("n8n integration error:", err);
  }
}
