"use client";

export default function PaymentButton({ itemId, type }) {

  async function handlePayment() {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          itemId,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      window.location.href = data.url;

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button onClick={handlePayment}>
      Плати
    </button>
  );
}