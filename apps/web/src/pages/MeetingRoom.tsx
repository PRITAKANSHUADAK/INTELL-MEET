import React, { useEffect, useRef } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { ChatPanel } from './ChatPanel';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp } from 'lucide-react';

export const MeetingRoom = ({ roomId }: { roomId: string }) => {
  const { localVideoRef, peers, toggleMute, toggleVideo } = useWebRTC(roomId);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  const handleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleVideo = () => {
    toggleVideo();
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface shadow-md">
        <h2 className="text-xl font-bold text-text">Meeting: {roomId}</h2>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
             {peers.length + 1} Participants
           </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr overflow-y-auto">
          {/* Local Video */}
          <div className="relative rounded-xl overflow-hidden bg-surface border border-secondary/50 shadow-lg">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-sm">
              You
            </div>
          </div>

          {/* Remote Peers */}
          {peers.map((peer) => (
            <VideoPlayer key={peer.id} stream={peer.stream} id={peer.id} />
          ))}
        </div>
        
        {/* Chat Panel */}
        <ChatPanel roomId={roomId} userName="Guest" />
      </div>

      {/* Controls Bar */}
      <div className="h-24 bg-surface flex items-center justify-center gap-4 px-8 border-t border-secondary/30">
        <button 
          onClick={handleMute}
          className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-secondary/30 hover:bg-secondary/50 text-white'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button 
          onClick={handleVideo}
          className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-secondary/30 hover:bg-secondary/50 text-white'}`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button className="p-4 rounded-full bg-secondary/30 hover:bg-secondary/50 text-white transition-all">
          <MonitorUp size={24} />
        </button>
        <button className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all ml-4 shadow-lg shadow-red-500/20">
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

const VideoPlayer = ({ stream, id }: { stream: MediaStream; id: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-surface border border-secondary/50 shadow-lg">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-sm">
        User {id.substring(0, 4)}
      </div>
    </div>
  );
};
