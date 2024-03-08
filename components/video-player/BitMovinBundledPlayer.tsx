'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerAPI } from 'bitmovin-player';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import 'bitmovin-player/bitmovinplayer-ui.css';

function BitmovinBundledPlayer() {

  const [player, setPlayer] = useState<PlayerAPI | null>(null);

  const playerConfig = {
    key: '636b3992-1fb8-407b-ab8b-64ff611217b1',
    ui: false
  };

  const playerSource = {
    dash: "https://nextjs-template-output-bucket.s3.amazonaws.com/caneloChin/stream.mpd",
    // hls: "https://nextjs-template-output-bucket.s3.amazonaws.com/master.m3u8",
    thumbnailTrack: {
      url: 'https://nextjs-template-output-bucket.s3.amazonaws.com/caneloChin/caneloChin.vtt'
    },
    drm: {
      widevine: {
        LA_URL: 'https://widevine-dash.ezdrm.com/proxy?pX=647038'
      }
    }
  }

  const playerDiv = useRef(null);

  useEffect(() => {
    function setupPlayer() {
      if (playerDiv.current) {
        const playerInstance = new Player(playerDiv.current, playerConfig);
        UIFactory.buildDefaultUI(playerInstance);
        playerInstance.load(playerSource).then(() => {
          setPlayer(playerInstance)
          console.log('Successfully loaded source');
        }, () => {
          console.log('Error while loading source');
        });
      }
    }

    setupPlayer();
  }, [])

  return <div id='player' ref={playerDiv} />;
}

export default BitmovinBundledPlayer;