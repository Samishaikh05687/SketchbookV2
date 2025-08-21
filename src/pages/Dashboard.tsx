import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name || !room) return alert("Please fill all fields");
    navigate(`/canvas?room=${room}&user=${name}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-orange-100"
      >
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-8">
          Create or Join a Room
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room ID"
          className="w-full border rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-orange-400 outline-none"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition text-lg shadow"
        >
          Join Room
        </motion.button>
        <p className="text-gray-500 text-center mt-6 text-sm">
          Share your Room ID with others to collaborate instantly.
        </p>
      </motion.div>
    </div>
  );
}
