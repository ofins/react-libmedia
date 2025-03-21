import "./App.css";
import useVideoPlayer from "./useVideoPlayer";

function App() {
  const { setVideoElement, player } = useVideoPlayer();

  return (
    <div onClick={() => player.current?.resume()}>
      <div className="video" ref={setVideoElement} />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
