import { H as Hls } from "./hls-vendor.js";

export function initMoviePlayer(source) {
  const video = document.getElementById("movie-video");
  const cover = document.getElementById("play-cover");
  if (!video || !source) {
    return;
  }
  let hls = null;
  let ready = false;
  const attach = () => {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  };
  const start = () => {
    attach();
    if (cover) {
      cover.classList.add("is-hidden");
    }
    const playTask = video.play();
    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(() => {});
    }
  };
  if (cover) {
    cover.addEventListener("click", start);
  }
  video.addEventListener("click", () => {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", () => {
    if (cover) {
      cover.classList.add("is-hidden");
    }
  });
  window.addEventListener("beforeunload", () => {
    if (hls) {
      hls.destroy();
    }
  });
}
