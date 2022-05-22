import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import styled, { keyframes } from "styled-components";
import { COLORS, txt } from "../other/constants";

const loadOut = keyframes`
  0% {
      transform: rotate(0deg);
    }
  100% {
    transform: rotate(360deg);
  }
`,
  loadIn = keyframes`
0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`;

const VideoError = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #c4c4c4;
    padding: 30px;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    background: ${COLORS.DARK};
  `,
  Wrap = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
  `,
  VideoStyles = styled.div`
    position: relative;
    .react-awesome-player * {
      outline: 0;
    }
    .video-js {
      height: auto;
    }
    .vjs-time-tooltip {
      min-width: 40px;
    }
    .react-awesome-player-container button {
      outline: none;
    }
    .vjs-remaining-time {
      visibility: hidden;
    }
    .vjs-progress-control {
      visibility: hidden;
    }
    .video-js.vjs-playing .vjs-tech {
      pointer-events: none;
    }
    .vjs-play-control {
      display: none;
    }
    .react-awesome-player-container
      .video-js
      .vjs-control-bar
      .vjs-current-time {
      padding: 0;
      display: block !important;
    }
    .vjs-picture-in-picture-control {
      display: none !important;
    }
    .react-awesome-player-container .video-js .vjs-time-divider {
      padding: 0 2px;
      min-width: 0em;
      text-align: center;
      display: block !important;
    }
    .react-awesome-player-container .video-js .vjs-control-bar .vjs-duration {
      padding: 0;
      display: block !important;
    }
    .react-awesome-player-container video {
      object-fit: fill;
    }
    .react-awesome-player-container .vjs-fullscreen video {
      object-fit: contain;
    }
    .react-awesome-player-container .video-layer section {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #080915;
      box-shadow: 0px 0px 30px 1px #103136 inset;
    }
    .react-awesome-player-container .video-layer .loader {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .react-awesome-player-container .video-layer .loader-1 .loader-outter {
      position: absolute;
      border: 4px solid #b50136;
      border-left-color: transparent;
      border-bottom: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: loadOut 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
    }
    .react-awesome-player-container .video-layer .loader-1 .loader-inner {
      position: absolute;
      border: 4px solid #b50136;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      left: calc(50% - 22px);
      top: calc(50% - 24px);
      border-right: 0;
      border-top-color: transparent;
      animation: loadIn 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
    }
    .no-video {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 9;
    }
    .definition-container {
      width: 30px;
      background: red;
      height: 30px;
      position: relative;
    }
    .vjs-menu .vjs-menu-content {
      overflow: initial;
    }
    .video-js {
      background-color: #212121;
      font-family: VideoJS !important;
      outline: 0;
    }
    .video-js .vjs-volume-panel {
      position: relative !important;
      left: calc(100% - 70px);
    }
    .vjs-live-control {
      background-color: green !important;
      display: none !important;
    }
    .definition-container .definition-btn-container {
      background: #ddd;
      bottom: 30px;
      position: absolute;
      display: none;
    }
    .vjs-menu-content {
      overflow-y: hidden;
    }
    .vjs-custom-skin .video-js .vjs-big-play-button {
      margin: 0 !important;
      height: 54px !important;
    }
    .vjs-current-time,
    .vjs-time-divider,
    .vjs-duration {
      display: none !important;
      visibility: hidden !important;
    }
    .video-js .vjs-hover {
      width: 20px !important;
    }
    .video-js .vjs-big-play-button {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      width: 54px;
      height: 54px !important;
      border-radius: 50%;
      border: 0;
      line-height: 54px !important;
      background-color: rgba(0, 0, 0, 0.6);
      text-align: center;
      line-height: 54px;
      margin: 0 !important;
    }
    .video-js .vjs-play-progress {
      font-family: VideoJS !important;
    }
    .video-js .vjs-poster {
      background-size: cover;
    }
    .video-js .vjs-big-play-button .vjs-icon-placeholder:before,
    .vjs-button > .vjs-icon-placeholder:before,
    .video-js .vjs-modal-dialog,
    .vjs-modal-dialog .vjs-modal-dialog-content {
      position: unset;
    }
    .vjs-menu .vjs-menu-content li:first-child {
      display: none;
    }
    .vjs-control-bar {
      display: ${({ volume }) => (volume ? "block" : "none")};
    }
    .vjs-mute-control {
      display: ${({ volume }) => (volume ? "block" : "none")};
    }
    .video-js
      .vjs-subs-caps-button
      + .vjs-menu
      .vjs-captions-menu-item
      .vjs-menu-item-text
      .vjs-icon-placeholder:before {
      font-family: VideoJS !important;
      content: "\F10D" !important;
    }
    .vjs-custom-skin > .video-js .vjs-menu-button-popup .vjs-menu {
      width: 90px;
      left: -30px;
    }
    .vjs-custom-skin > .video-js .vjs-control {
      width: 30px;
    }
    .vjs-custom-skin > .video-js .vjs-play-progress,
    .vjs-custom-skin > .video-js .vjs-volume-level {
      background-color: #d32f2f;
    }
    .vjs-custom-skin > .video-js .vjs-loading-spinner {
      border-color: #d32f2f;
    }
    .vjs-custom-skin > .video-js .vjs-control-bar .vjs-time-control {
      min-width: 6px;
    }
    .vjs-custom-skin > .video-js .vjs-control-bar .vjs-time-control div {
      height: 42px;
      font-size: 12px;
      line-height: 42px;
    }
    .vjs-custom-skin > .video-js .vjs-control-bar .vjs-time-control div span {
      line-height: 39px;
    }
    .vjs-custom-skin > .video-js .vjs-time-control {
      width: auto;
    }
    .vjs-custom-skin > .video-js .vjs-time-control .vjs-current-time-display {
      width: auto;
    }
    .video-js .vjs-custom-skin > .video-js .vjs-big-play-button {
      margin: 0 !important;
    }

    .video-js:hover .vjs-big-play-button {
      background-color: rgba(0, 0, 0, 0.45);
    }
    .video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal {
      display: none;
    }
    .vjs-error .vjs-error-display .vjs-modal-dialog-content {
      display: none;
    }
    .vjs-error .vjs-error-display {
      display: none;
    }
  `,
  Blur = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 2px 10px 4px 10px;
    background: ${COLORS.DARK};
    color: ${COLORS.LIGHT};
    border-radius: 5px 0 5px 0;
    font-size: 10px;
    text-transform: uppercase;
  `,
  Volume = styled.span`
    margin-left: 10px;
  `;

const Video = ({ options, onReady, error, blur, volume, isStop, admin }) => {
  const { lng } = useSelector((state) => state.common);

  const videoRef = useRef(null),
    playerRef = useRef(null);

  const setVideoBlur = () => {
      if (videoRef.current) {
        const preview = document.querySelectorAll(".vjs-poster");
        if (preview) {
          preview.forEach((el) => (el.style.filter = `blur(${blur * 5}px)`));
        }

        videoRef.current.style.filter = `blur(${blur * 5}px)`;
      }
    },
    setVideoVolume = () => {
      if (videoRef.current) {
        if (volume) {
          videoRef.current.removeAttribute("muted");
          videoRef.current.muted = 0;
        } else {
          videoRef.current.setAttribute("muted", "muted");
          videoRef.current.muted = 1;
        }
      }
    };

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    setVideoBlur();
  }, [blur]);

  useEffect(() => {
    setVideoVolume();
  }, [volume]);

  useEffect(() => {
    const blurTimer = setInterval(() => {
        setVideoBlur();
      }, 5000),
      volumeTimer = setInterval(() => {
        setVideoBlur();
      }, 5500);

    return () => {
      clearInterval(blurTimer);
      clearInterval(volumeTimer);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute("webkit-playsinline", true);
      videoRef.current.setAttribute("playsInline", true);
      videoRef.current.setAttribute("x5-playsinline", true);
      videoRef.current.setAttribute("x5-video-player-type", "h5");
      videoRef.current.setAttribute("x5-video-player-fullscreen", false);
    }
  }, [videoRef]);

  useEffect(() => {
    if (!admin) {
      if (videoRef.current && volume) {
        if (isStop) {
          videoRef.current.setAttribute("muted", "muted");
          videoRef.current.muted = 1;
        } else {
          videoRef.current.removeAttribute("muted");
          videoRef.current.muted = 0;
        }
      }
    }
  }, [isStop, volume]);

  return (
    <VideoStyles volume={volume}>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        onError={error}
      />
      <Blur>
        {txt[lng].video.blur} {(blur * 100).toFixed()}%
        {!volume && <Volume>{txt[lng].video.voloff}</Volume>}
      </Blur>
    </VideoStyles>
  );
};

export const VideoPlayer = ({ src, preview, blur, volume, admin, isStop }) => {
  const { lng } = useSelector((state) => state.common);

  const [isVideoErr, setIsVideoErr] = useState(false);

  const options = {
    autoplay: false,
    controls: true,
    loop: false,
    preload: "none",
    aspectRatio: "16:9",
    poster: preview,
    fluid: true,
    controlBar: {
      fullscreenToggle: false,
    },
    userActions: {
      doubleClick: false,
    },
    sources: [
      {
        type: "application/x-mpegURL",
        src: src,
      },
    ],
  };

  const error = () => setIsVideoErr("Video error");

  return (
    <Wrap>
      {!isVideoErr ? (
        <Video
          options={options}
          error={error}
          blur={blur}
          volume={volume}
          admin={admin}
          isStop={isStop}
        />
      ) : (
        <VideoError>{txt[lng].video.first} =(</VideoError>
      )}
    </Wrap>
  );
};
