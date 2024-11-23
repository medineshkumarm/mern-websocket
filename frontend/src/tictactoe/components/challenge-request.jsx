import { AlertTriangle } from "lucide-react";

/* eslint-disable react/prop-types */
const ChallengeRequest = ({ challengeRequest, onAccept, onDecline }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black pixel-border">
      <div className="bg-green-800 p-8 rounded-lg shadow-lg text-center pixel-border text-white font-semibold border-2">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl mb-4">
          Challenge from {challengeRequest.challenger.username}
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="pixel-button bg-green-500 text-white px-6 py-2"
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className="pixel-button bg-red-500 text-white px-6 py-2"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeRequest;
