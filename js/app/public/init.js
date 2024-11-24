/*
 * Created by Tomasz Kiljanczyk on 11/04/2021, 22:02
 * Copyright (c) 2021 . All rights reserved.
 * Last modified 11/04/2021, 22:01
 */

function handleBlank(blankState) {
    document.getElementById('song-text-container').hidden = blankState;
    if (!blankState) {
        resizeText();
    }
}

function handleConfigure(config) {
    const backgroundColor = config.backgroundColor;
    const fontColor = config.fontColor;
    window.maxFontSize = config.maxFontSize;

    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = fontColor;
    resizeText();
}

function setText(text) {
    document.getElementById('song-text').innerHTML = text;
}

function onContentLoaded() {
    const CONTENT_NAMESPACE = 'urn:x-cast:lyric.cast.content';
    const CONTROL_NAMESPACE = 'urn:x-cast:lyric.cast.control';
    let songText = '';
    window.maxFontSize = 100;

    /**
     * Cast receiver context as variable
     */
    const castReceiverContext = cast.framework.CastReceiverContext.getInstance();

    /**
     * Handle disconnect
     */
    castReceiverContext.onSenderDisconnected = function (event) {
        // noinspection TypeScriptUMDGlobal
        if (
            castReceiverContext.getSenders().length === 0 &&
            event.reason === system.DisconnectReason.REQUESTED_BY_SENDER
        ) {
            window.close();
        }
    };

    /**
     * Control message listener setup
     */
    castReceiverContext.addCustomMessageListener(CONTENT_NAMESPACE, function (event) {
        songText = event.data.text;

        console.log('Received content message', songText);

        setText(songText);
    });

    castReceiverContext.addCustomMessageListener(CONTROL_NAMESPACE, event => {
        console.log('Received data', event.data);

        const action = event.data.action?.toUpperCase();
        switch (action.toUpperCase()) {
            case 'BLANK':
                handleBlank(event.data.value);
                break;
            case 'CONFIGURE':
                handleConfigure(event.data.value);
                break;
            default:
                setText('ERROR: UNKNOWN MESSAGE');
        }
    });

    /**
     * Initializes the system manager. The application should call this method when
     * it is ready to start receiving messages, typically after registering
     * to listen for the events it is interested on.
     */
    castReceiverContext.start({
        disableIdleTimeout: true,
        statusText: 'Ready to present'
    });
}

document.addEventListener('DOMContentLoaded', onContentLoaded, false);
