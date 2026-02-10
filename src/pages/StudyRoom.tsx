import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Copy, Check, Users, Video } from 'lucide-react';

// Declare Jitsi on window
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const StudyRoom: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [isCreator, setIsCreator] = useState(false);

  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  // Check if Jitsi is loaded
  useEffect(() => {
    const checkJitsi = () => {
      if (window.JitsiMeetExternalAPI) {
        console.log("StudyRoom: Jitsi API found on window");
        setJitsiLoaded(true);
        return true;
      }
      return false;
    };

    if (checkJitsi()) return;

    console.log("StudyRoom: Waiting for Jitsi API...");

    const interval = setInterval(() => {
      if (checkJitsi()) {
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Check for roomID in URL and auto-join
  useEffect(() => {
    const roomIdFromUrl = searchParams.get('roomID');
    if (roomIdFromUrl && jitsiLoaded) {
      const link = `${window.location.origin}/study-room?roomID=${roomIdFromUrl}`;
      setGeneratedLink(link);
      setInMeeting(true);
      setTimeout(() => startMeeting(roomIdFromUrl), 100);
    }
  }, [searchParams, jitsiLoaded]);

  const startMeeting = (roomId: string) => {
    if (!roomId || !jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return;

    // Store current room ID for login redirect
    setCurrentRoomId(roomId);

    // Dispose existing instance
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.error('Error disposing Jitsi:', e);
      }
    }

    try {
      const domain = "meet.jit.si";
      // Use a consistent room name (without timestamp) so users can rejoin after login
      const uniqueRoomName = `StudyConnect_${roomId}`;

      const options = {
        roomName: uniqueRoomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          // Disable prejoin for faster loading
          prejoinPageEnabled: false,
          // Disable authentication requirement - allows anyone to join
          enableUserRolesBasedOnToken: false,
          // Disable lobby by default
          enableLobbyChat: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'hangup', 'chat', 'filmstrip', 'tileview'
          ],
          SHOW_JITSI_WATERMARK: false,
        },
        userInfo: {
          displayName: user?.name || "Student"
        }
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      jitsiApiRef.current.addEventListeners({
        videoConferenceLeft: () => handleLeaveMeeting(),
        readyToClose: () => handleLeaveMeeting()
      });
    } catch (err) {
      console.error('Error starting meeting:', err);
    }
  };

  const handleLeaveMeeting = () => {
    setInMeeting(false);
    setSearchParams({});
    setGeneratedLink('');
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.error('Error disposing:', e);
      }
    }
  };

  const handleCreateRoom = () => {
    console.log("StudyRoom: Create Room clicked", { roomNameInput });

    if (!roomNameInput.trim()) {
      alert('Please enter a room name');
      return;
    }

    if (!jitsiLoaded && !window.JitsiMeetExternalAPI) {
      alert('Video conferencing system is still loading. Please check your internet connection and try again in a few seconds.');
      return;
    }

    const roomId = roomNameInput.trim().replace(/\s+/g, '-').toLowerCase();
    const link = `${window.location.origin}/study-room?roomID=${roomId}`;

    setGeneratedLink(link);
    setSearchParams({ roomID: roomId });
    setShowCreateModal(false);
    setRoomNameInput('');
    setInMeeting(true);
    setIsCreator(true);

    setTimeout(() => startMeeting(roomId), 100);
  };

  const handleJoinRoom = () => {
    console.log("StudyRoom: Join Room clicked", { joinRoomIdInput });
    if (!joinRoomIdInput.trim()) {
      alert('Please enter a room ID');
      return;
    }

    if (!jitsiLoaded && !window.JitsiMeetExternalAPI) {
      alert('Video conferencing system is still loading. Please check your internet connection and try again in a few seconds.');
      return;
    }

    const roomId = joinRoomIdInput.trim();
    // Check if user pasted a full link, extract ID if so
    const linkMatch = roomId.match(/roomID=([^&]*)/);
    const finalRoomId = linkMatch ? linkMatch[1] : roomId;

    const link = `${window.location.origin}/study-room?roomID=${finalRoomId}`;

    setGeneratedLink(link);
    setSearchParams({ roomID: finalRoomId });
    setShowJoinModal(false);
    setJoinRoomIdInput('');
    setInMeeting(true);
    setIsCreator(false);

    setTimeout(() => startMeeting(finalRoomId), 100);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.error('Error disposing Jitsi on unmount:', e);
        }
      }
    };
  }, []);

  return (
    <div className="min-vh-100 bg-dark text-white">
      {!inMeeting ? (
        <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
          <div className="text-center" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="mb-4">
              <Video size={64} className="text-primary mb-3" />
              <h1 className="display-4 fw-bold mb-3">🎓 Virtual Study Room</h1>
              <p className="text-secondary fs-5 mb-4">
                Collaborate with your peers in real-time video sessions
              </p>
            </div>

            {!jitsiLoaded && (
              <div className="alert alert-info mb-4" role="alert">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Loading video conferencing...
              </div>
            )}

            <div className="d-grid gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-semibold d-flex align-items-center justify-content-center gap-3"
                style={{ fontSize: '1.1rem' }}
              >
                <Users size={24} />
                Create a Room
              </button>

              <button
                onClick={() => setShowJoinModal(true)}
                className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-semibold d-flex align-items-center justify-content-center gap-3"
                style={{ fontSize: '1.1rem' }}
              >
                <Users size={24} />
                Join a Room
              </button>
            </div>

            <div className="mt-5 p-4 bg-secondary bg-opacity-10 rounded-4">
              <h3 className="h5 mb-3">✨ Features</h3>
              <div className="row g-3 text-start">
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <span>🎥</span>
                    <span className="small">HD Video & Audio</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <span>💬</span>
                    <span className="small">Real-time Chat</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <span>🖥️</span>
                    <span className="small">Screen Sharing</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <span>🔒</span>
                    <span className="small">Secure & Private</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 alert alert-success">
              <h6 className="fw-bold mb-2">🎯 How to Become Moderator:</h6>
              <p className="small mb-0 text-justify">
                <strong>Simple!</strong> The first person who creates and joins the room automatically becomes the moderator.
                Just click "Create a Room", enter a name, and you'll join as the moderator with full control!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column vh-100">
          {/* Room Link Banner */}
          {generatedLink && (
            <div className="bg-secondary bg-opacity-25 p-3 border-bottom border-secondary">
              <div className="container-fluid">
                <div className="row align-items-center g-2 mb-2">
                  <div className="col-auto">
                    <span className="text-secondary small fw-semibold">Room Link:</span>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={generatedLink}
                      readOnly
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                      <span className="ms-2">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="col-auto">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        const jitsiLoginUrl = `https://meet.jit.si/StudyConnect_${currentRoomId}`;
                        window.open(jitsiLoginUrl, '_blank');
                      }}
                      title="Open meeting in a new tab"
                    >
                      Open in Browser
                    </button>
                  </div>
                </div>
                <div className={`alert alert-secondary mb-0 py-2 small text-justify`}>
                  {isCreator ? (
                    <>
                      <strong>You're the Moderator!</strong> As the room creator, you have full control. Share the link above with others to invite them.
                      <br />
                      <small className="opacity-75">💡 Click "Open in Browser" to get the full-screen experience and moderator controls.</small>
                    </>
                  ) : (
                    <>
                      <strong>You're a Participant!</strong> Welcome to the study room.
                      <br />
                      <small className="opacity-75">💡 Click "Open in Browser" for a better full-screen video experience.</small>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Jitsi Container */}
          <div ref={jitsiContainerRef} className="flex-grow-1 w-100" style={{ height: '100%' }} />





        </div>
      )}

      {/* Create Room Modal */}
      {
        showCreateModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
            onClick={() => setShowCreateModal(false)}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content bg-dark text-white border-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header border-secondary">
                  <h5 className="modal-title fw-bold">Create Study Room</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-secondary mb-3">
                    Enter a name for your study room. You'll automatically become the moderator!
                  </p>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      id="roomNameInput"
                      placeholder="Enter room name"
                      value={roomNameInput}
                      onChange={(e) => setRoomNameInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                      autoFocus
                    />
                    <label htmlFor="roomNameInput" className="text-secondary">
                      Room Name
                    </label>
                  </div>
                  <div className="alert alert-info small mb-0">
                    💡 <strong>Tip:</strong> Use a descriptive name like "Math-Study-Group" or "Project-Team-A"
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleCreateRoom}
                    disabled={!roomNameInput.trim()}
                  >
                    Create & Join as Moderator
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Join Room Modal */}
      {
        showJoinModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
            onClick={() => setShowJoinModal(false)}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content bg-dark text-white border-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header border-secondary">
                  <h5 className="modal-title fw-bold">Join Study Room</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowJoinModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-secondary mb-3">
                    Enter the Room ID or paste the room link to join an existing session.
                  </p>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      id="joinRoomIdInput"
                      placeholder="Enter Room ID"
                      value={joinRoomIdInput}
                      onChange={(e) => setJoinRoomIdInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                      autoFocus
                    />
                    <label htmlFor="joinRoomIdInput" className="text-secondary">
                      Room ID or Link
                    </label>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowJoinModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleJoinRoom}
                    disabled={!joinRoomIdInput.trim()}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default StudyRoom;
