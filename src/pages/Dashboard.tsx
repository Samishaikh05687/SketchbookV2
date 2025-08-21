import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants, Transition } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCanvasStore } from '../stores/canvas-store';
import { generateColor, generateId } from '../lib/utils';
import { Link } from "react-router-dom";


const queryClient = new QueryClient();

interface Room {
  id: string;
  name: string;
  createdAt: string;
}

function Dashboard() {
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { currentUser, setCurrentUser } = useCanvasStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Load previous rooms from local storage
    const savedRooms = localStorage.getItem('sketchbookRooms');
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    }
  }, []);

  const handleRoomChange = (newRoomId: string) => {
    setRoomId(newRoomId);
  };

  const handleCreateRoom = () => {
    if (!name) return alert('Please enter your name');
    const newRoomId = roomId || generateId();
    const newRoom: Room = {
      id: newRoomId,
      name,
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    // Update current user
    setCurrentUser({
      id: currentUser?.id || generateId(),
      name,
      color: currentUser?.color || generateColor(),
    });

    // Save room to local storage
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    localStorage.setItem('sketchbookRooms', JSON.stringify(updatedRooms));

    // Navigate to canvas
    navigate(`/canvas?room=${newRoomId}`);
  };

  const handleJoinExistingRoom = (roomId: string, roomName: string) => {
    setCurrentUser({
      id: currentUser?.id || generateId(),
      name: roomName || 'Anonymous',
      color: currentUser?.color || generateColor(),
    });
    navigate(`/canvas?room=${roomId}`);
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' } as Transition,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>

        
        <div>
    <header className="w-full fixed top-4 z-1000  ">
            <div className="max-w-4xl  mx-auto rounded-full bg-[#1a1818] backdrop-blur-md border-b border-orange-100 px-1 py-2 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-rose-400" />
                    <span className="text-2xl font-sans text-white">SketchBook</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 pr-64 text-lg text-white font-normal">
                    <a href="/" className="hover:text-orange-600">Home</a>
                    <a href="/" className="hover:text-orange-600">About</a>
                   
                    <a href="/" className="hover:text-orange-600">How it works</a>
                    <Link to="/support" className="hover:text-orange-600">Support</Link>
                </nav>
                
            </div>
        </header>
      <div className="h-auto mt-[4em] bg-orange-50 rounded-3xl py-12 px-4 ">
        <div className="flex flex-col justify-start items-start  mx-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-4xl font-bold text-start text-gray-900">
              Welcome to SketchBook !
            </h1>
            <p className="mt-4 text-lg text-gray-600 text-start max-w-[25rem]">
              Create or join a collaborative drawing room to start sketching with your team in real-time.
            </p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <motion.button
              whileHover={{ scale:1.01 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setRoomId(generateId());
                setIsModalOpen(true);
              }}
              className="flex items-center bg-opacity-90 bg-gray-300 text-white rounded-2xl px-12 py-12  font-semibold text-lg hover:bg-gray-400"
            >
              <svg
                className="w-6 h-6 text-gray-900 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            <span className='text-gray-900'>Create New Room</span>  
            </motion.button>
          </div>

          {rooms.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Previous Rooms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-6 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleJoinExistingRoom(room.id, room.name)}
                  >
                    <h3 className="text-lg font-semibold text-orange-600">Room: {room.id.slice(0, 8)}...</h3>
                    <p className="text-sm text-gray-600 mt-2">Created by: {room.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{room.createdAt}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl p-8 w-full max-w-md border border-orange-200"
              >
                <h2 className="text-2xl font-bold text-orange-600 mb-6">Create or Join Room</h2>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Room ID (optional)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  value={roomId}
                  onChange={(e) => handleRoomChange(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateRoom}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Join Room
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
    </div>
    </div>
    </QueryClientProvider>
  );
}

export default Dashboard;