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

  // const playerSource = {
  //   dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
  //   hls: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
  //   poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
  //   thumbnailTrack: {
  //     url: 'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/thumbnails/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.vtt'
  //   }
  // };

  const playerSource = {
    dash: "https://nextjs-template-output-bucket.s3.amazonaws.com/stream.mpd",
    hls: "https://nextjs-template-output-bucket.s3.amazonaws.com/master.m3u8",
    thumbnailTrack: {
      url: 'https://nextjs-template-output-bucket.s3.amazonaws.com/cool.vtt'
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