import AVPlayer, { AVPlayerOptions } from "@libmedia/avplayer";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { PlayerEventType, PlayerStatus } from "./avplayer.type";

AVPlayer.setLogLevel(0);

const useVideoPlayer = () => {
  const player = useRef<AVPlayer | null>(null);
  const preloadPlayer = useRef<AVPlayer | null>(null);

  const [videoElement, setVideoElement] = useState<HTMLDivElement | null>(null);
  const [videoState, setVideoState] = useState({
    currentSource: "",
    nextSource: `${window.location.origin}/earth.mp4`,
    isPreloading: false,
    isReady: false,
  });

  const initPreloader = () => {
    if (!videoElement) return;

    const options: AVPlayerOptions = {
      wasmBaseUrl: `${window.location.origin}${window.location.pathname}libmedia/wasm`,
      container: videoElement,
      loop: true,
    };
    preloadPlayer.current = new AVPlayer(options);
    preloadPlayer.current?.setRenderMode(1);
    console.log("Preloader initialized", preloadPlayer.current);
  };

  const preLoadVideoSource = async () => {
    console.log("Preloading video source", videoState.nextSource);
    if (!preloadPlayer.current) {
      initPreloader();
    }

    setVideoState((prev) => {
      return {
        ...prev,
        isPreloading: true,
      };
    });

    await preloadPlayer.current?.load(videoState.nextSource);

    // return new Promise((resolve) => {
    //   const firstFrameHandler = () => {
    //     setVideoState((prev) => {
    //       return {
    //         ...prev,
    //         isPreloading: false,
    //         isReady: true,
    //       };
    //     });
    //   };

    //   preloadPlayer.current?.on(
    //     PlayerEventType.FIRST_VIDEO_RENDERED,
    //     firstFrameHandler
    //   );

    //   resolve(true);
    // });
  };

  const swapVideoSource = async () => {
    const { nextSource, isReady } = videoState;
    console.log("nextSource", nextSource);
    console.log("isReady", isReady);

    if (!isReady || !nextSource) {
      console.warn("Video is not ready or no next source provided");
    }

    console.log("player", player.current);

    try {
      player.current?.destroy();
      player.current = preloadPlayer.current;
      console.log("Swapping video source", player.current);
      preloadPlayer.current = null;

      setVideoState((prev) => ({
        ...prev,
        currentSource: prev.nextSource,
        nextSource: "",
        isReady: false,
        isPreloading: false,
      }));

      await player.current?.play();
    } catch (error) {
      console.error("Error swapping video source:", error);
    }
  };

  const handleNextSource = async () => {
    initPreloader();
    await preLoadVideoSource();
    swapVideoSource();
  };

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
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

    return new Promise((resolve) => {
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
      loop: true,
    };

    setVideoSrc(`${window.location.origin}/mr-rabbit.mp4`);

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
  }, [videoElement, videoSrc]);

  useEffect(() => {
    if (!init) return;
    playVideo();
  }, [init, videoSrc]);

  return {
    setVideoElement,
    handleNextSource,
    setVideoSrc,
    player,
  };
};

export default useVideoPlayer;
