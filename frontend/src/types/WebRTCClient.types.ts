export type Signal =
    | {
          to: string;
          type: 'offer' | 'answer' | 'candidate';
          sdp: string;
      }
    | {
          to: string;
          type: 'offer' | 'answer' | 'candidate';
          candidate: RTCIceCandidate;
      };
