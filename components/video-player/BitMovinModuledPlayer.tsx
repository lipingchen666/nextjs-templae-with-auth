'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerAPI } from 'bitmovin-player/modules/bitmovinplayer-core';
import EngineBitmovinModule from 'bitmovin-player/modules/bitmovinplayer-engine-bitmovin';
import MseRendererModule from 'bitmovin-player/modules/bitmovinplayer-mserenderer';
import HlsModule from 'bitmovin-player/modules/bitmovinplayer-hls';
import DashModule from 'bitmovin-player/modules/bitmovinplayer-dash';
import AbrModule from 'bitmovin-player/modules/bitmovinplayer-abr';
import XmlModule from 'bitmovin-player/modules/bitmovinplayer-xml';
import ContainerTSModule from 'bitmovin-player/modules/bitmovinplayer-container-ts';
import ContainerMp4Module from 'bitmovin-player/modules/bitmovinplayer-container-mp4';
import SubtitlesModule from 'bitmovin-player/modules/bitmovinplayer-subtitles';
import SubtitlesCEA608Module from 'bitmovin-player/modules/bitmovinplayer-subtitles-cea608';
import PolyfillModule from 'bitmovin-player/modules/bitmovinplayer-polyfill';
import StyleModule from 'bitmovin-player/modules/bitmovinplayer-style';
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import 'bitmovin-player/bitmovinplayer-ui.css';

function BitmovinModuledPlayer() {

    const [player, setPlayer] = useState<PlayerAPI | null>(null);

    const playerConfig = {
        key: '636b3992-1fb8-407b-ab8b-64ff611217b1',
    };

    const playerSource = {
        dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
        hls: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg'
    };
    const playerDiv = useRef(null);

    useEffect(() => {
        function setupPlayer() {
            if (playerDiv.current) {
                Player.addModule(EngineBitmovinModule);
                Player.addModule(MseRendererModule);
                Player.addModule(HlsModule);
                Player.addModule(XmlModule);
                Player.addModule(DashModule);
                Player.addModule(AbrModule);
                Player.addModule(ContainerTSModule);
                Player.addModule(ContainerMp4Module);
                Player.addModule(SubtitlesModule);
                Player.addModule(SubtitlesCEA608Module);
                Player.addModule(PolyfillModule);
                Player.addModule(StyleModule);

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

export default BitmovinModuledPlayer;