import React, { useState } from "react";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, message } = form;
    if (!name || !phone || !message) {
      setStatus("Please fill all fields");
      return;
    }
    try {
      setSending(true);
      const res = await axios.post("http://localhost:8000/api/contact", form);
      if (res.status === 201) {
        setStatus("Thank you! Message received.");
        setForm({ name: "", phone: "", message: "" });
      } else {
        setStatus("Failed to send. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error submitting form.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          rows={5}
          required
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
