import "./App.css";
import useVideoPlayer from "./useVideoPlayer";

function App() {
  const { setVideoElement, player, setVideoSrc } = useVideoPlayer();

  return (
    <div onClick={() => player.current?.resume()}>
      <div className="video" ref={setVideoElement} />
      <div className="controls">
        <button onClick={() => player.current?.setVolume(0)}>mute</button>
        <button onClick={() => player.current?.setVolume(3)}>sound on</button>
        <button onClick={() => player.current?.play()}>Play</button>
        <button onClick={() => player.current?.pause()}>Pause</button>
        <button>Seeking</button>
        <button onClick={() => player.current?.enterFullscreen()}>
          Fullscreen
        </button>
        <button>Caption/Subtitle</button>
        <button onClick={() => player.current?.stop()}>Stop</button>
        <button
          onClick={() => setVideoSrc(`${window.location.origin}/earth.mp4`)}
        >
          source 1
        </button>
        <button
          onClick={() => setVideoSrc(`${window.location.origin}/mr-rabbit.mp4`)}
        >
          source 2
        </button>
      </div>
    </div>
  );
}

export default App;
