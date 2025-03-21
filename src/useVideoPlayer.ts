import AVPlayer, { AVPlayerOptions } from "@libmedia/avplayer";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlayerEventType, PlayerStatus } from "./avplayer.type";

const videoSrc = `${window.location.origin}/mr-rabbit.mp4`;

AVPlayer.setLogLevel(0);

const useVideoPlayer = () => {
  const player = useRef<AVPlayer | null>(null);

  const [videoElement, setVideoElement] = useState<HTMLDivElement | null>(null);
  const [init, setInit] = useState(false);

  const getPlayerStatus = useCallback((): PlayerStatus | undefined => {
    if (!player) return;
    return player.current?.getStatus() as unknown as PlayerStatus;
  }, [player]);

  const checkVideoAvailability = async (url: string) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) {
        console.error(`Video file not available. Status: ${response.status}`);
        return false;
      }
      console.log(
        `Video file is available. Status: ${response.status} - ${response.statusText}`
      );
      return true;
    } catch (error) {
      console.error("Error checking video availability:", error);
      return false;
    }
  };

  const isPlaying = useCallback((): boolean => {
    const status = getPlayerStatus();
    return (
      status === PlayerStatus.PLAYING ||
      status === PlayerStatus.PAUSED ||
      status === PlayerStatus.PLAYED
    );
  }, [getPlayerStatus]);

  const play = async (): Promise<void> => {
    if (!player.current || !videoSrc)
      return Promise.reject("Player is not ready");

    if (!(await checkVideoAvailability(videoSrc))) {
      return Promise.reject("Video file not accessible");
    }
    await player.current?.load(videoSrc);
    await player.current?.play();

    return new Promise((resolve, reject) => {
      player.current?.on(PlayerEventType.FIRST_VIDEO_RENDERED, () => {
        resolve();
      });
    });
  };

  const playVideo = async () => {
    try {
      await Promise.all([play()]);
    } catch (e) {
      console.log("Error playing video", e);
    }
  };

  useEffect(() => {
    if (!videoElement) return;

    const options: AVPlayerOptions = {
      wasmBaseUrl: `${window.location.origin}${window.location.pathname}libmedia/wasm`,
      container: videoElement,
    };

    player.current = new AVPlayer(options);
    player.current?.setRenderMode(1);

    player.current?.on(PlayerEventType.ERROR, (error) => {
      console.error("Player error:", error);
    });

    setInit(true);

    return () => {
      player.current?.destroy();
      player.current = null;
    };
  }, [videoElement]);

  useEffect(() => {
    if (!init) return;
    playVideo();
  }, [init]);

  return {
    setVideoElement,
    player,
  };
};

export default useVideoPlayer;
