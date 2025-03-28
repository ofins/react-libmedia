import "./App.css";
import useVideoPlayer from "./useVideoPlayer";

function App() {
  const { setVideoElement, player, setVideoSrc, handleNextSource } =
    useVideoPlayer();

  return (
    <div style={{ display: "flex" }} onClick={() => player.current?.resume()}>
      <div
        ref={setVideoElement}
        className="video"
        style={{
          display: "flex",
          width: "80%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "5rem",
          fontWeight: "bold",
          backgroundPosition: "center",
        }}
      >
        <span style={{ position: "absolute", opacity: "30%" }}>
          Libmedia Studio
        </span>
      </div>
      <div
        className="controls"
        style={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
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
          change to source 1
        </button>
        <button
          onClick={() => setVideoSrc(`${window.location.origin}/mr-rabbit.mp4`)}
        >
          change to source 2
        </button>
        <button onClick={() => handleNextSource()}>
          next source (finish preloading resource in background before loading
          video)
        </button>
      </div>
    </div>
  );
}

export default App;
