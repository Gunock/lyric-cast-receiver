/*
 * Created by Tomasz Kiljanczyk on 11/04/2021, 22:02
 * Copyright (c) 2021 . All rights reserved.
 * Last modified 11/04/2021, 22:01
 */


document.addEventListener('DOMContentLoaded', onContentLoaded, false);

function onContentLoaded() {

    const CONTENT_NAMESPACE = 'urn:x-cast:lyric.cast.content';
    const CONTROL_NAMESPACE = 'urn:x-cast:lyric.cast.control';
    let songText = "";
    let backgroundColor = "black";
    let fontColor = "white";
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
        if (castReceiverContext.getSenders().length === 0
            && event.reason === system.DisconnectReason.REQUESTED_BY_SENDER) {

            window.close();
        }
    };

    /**
     * Control message listener setup
     */
    castReceiverContext.addCustomMessageListener(CONTENT_NAMESPACE, function (event) {
        songText = event.data.text;

        console.log(`Received content message: ${songText}`);

        setText(songText);
    });

    castReceiverContext.addCustomMessageListener(CONTROL_NAMESPACE, function (event) {
        const action = event.data.action;
        console.log(`Received control message: ${action}`);
        console.log(`Control value: ${event.data.value}`);

        switch (action.toUpperCase()) {
            case "BLANK":
                let blankState = event.data.value;
                document.getElementById("song-text-container").hidden = blankState;
                if (!blankState) {
                    resizeText()
                }
                break;
            case "CONFIGURE":
                let config = event.data.value;
                backgroundColor = config["backgroundColor"];
                fontColor = config["fontColor"];
                window.maxFontSize = config["maxFontSize"];

                document.body.style.backgroundColor = backgroundColor;
                document.body.style.color = fontColor;
                resizeText();
                break;
            default:
                setText("ERROR: UNKNOWN MESSAGE");
        }
    });

    function setText(text) {
        document.getElementById("song-text").innerHTML = text;
    }


    /**
     * Initializes the system manager. The application should call this method when
     * it is ready to start receiving messages, typically after registering
     * to listen for the events it is interested on.
     */
    castReceiverContext.start({
        disableIdleTimeout: true,
        statusText: "Ready to present"
    });

}
