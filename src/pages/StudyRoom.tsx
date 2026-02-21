import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";

type Room = {
  roomId: string;
  createdAt: number;
  title: string;
};

const STORAGE_KEY = "STUDYCONNECT_ACTIVE_ROOMS";

const StudyRoom: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [joinInput, setJoinInput] = useState("");

  // 🔥 Load saved rooms (Dashboard Sync)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setRooms(JSON.parse(saved));
  }, []);

  const saveRooms = (updatedRooms: Room[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
  };

  // 🚀 CREATE ROOM CONFIRMED
  const handleCreateRoom = () => {
    if (!roomNameInput.trim()) return;

    const roomId = roomNameInput.replace(/\s+/g, "_");

    const newRoom: Room = {
      roomId,
      createdAt: Date.now(),
      title: "Virtual Study Room",
    };

    saveRooms([newRoom, ...rooms]);

    setShowCreateModal(false);
    setRoomNameInput("");

    window.open(
      `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`,
      "_blank"
    );
  };

  // 🚀 JOIN ROOM CONFIRMED
  const handleJoinRoom = () => {
    if (!joinInput.trim()) return;

    let roomId = joinInput.trim();

    if (roomId.includes("meet.jit.si")) {
      const parts = roomId.split("/");
      roomId = parts[parts.length - 1];
    }

    const exists = rooms.find((r) => r.roomId === roomId);

    if (!exists) {
      saveRooms([
        {
          roomId,
          createdAt: Date.now(),
          title: "Joined Study Room",
        },
        ...rooms,
      ]);
    }

    setShowJoinModal(false);
    setJoinInput("");

    window.open(
      `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`,
      "_blank"
    );
  };

  const handleResumeRoom = (roomId: string) => {
    window.open(
      `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`,
      "_blank"
    );
  };

  const handleRemoveRoom = (roomId: string) => {
    saveRooms(rooms.filter((r) => r.roomId !== roomId));
  };

  return (
    <div className="min-vh-100 bg-dark text-white">
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
        <div style={{ maxWidth: "700px", width: "100%" }} className="text-center">
          <Video size={64} className="text-primary mb-3" />
          <h1 className="display-4 fw-bold mb-3">🎓 Virtual Study Room</h1>
          <p className="text-secondary fs-5 mb-4">
            Collaborate with your peers in real-time video sessions
          </p>

          {/* ⭐ Dashboard Rooms */}
          {rooms.length > 0 && (
            <div className="mb-4 text-start">
              <h5 className="mb-3">Active Study Sessions</h5>
              {rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="d-flex justify-content-between align-items-center bg-secondary bg-opacity-25 p-3 rounded mb-2"
                >
                  <div>
                    <strong>{room.title}</strong>
                    <div className="text-muted small">{room.roomId}</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleResumeRoom(room.roomId)}
                    >
                      Resume
                    </button>

                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={() => handleRemoveRoom(room.roomId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex gap-3 justify-content-center">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowCreateModal(true)}
            >
              Create Room
            </button>

            <button
              className="btn btn-outline-light btn-lg"
              onClick={() => setShowJoinModal(true)}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ CREATE ROOM DIALOG (CENTERED) */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Create Study Room</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)} />
              </div>

              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Room Name"
                  value={roomNameInput}
                  onChange={(e) => setRoomNameInput(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreateRoom}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ JOIN ROOM DIALOG (CENTERED) */}
      {showJoinModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Join Study Room</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowJoinModal(false)} />
              </div>

              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Room ID or Invite Link"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleJoinRoom}>
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRoom;
