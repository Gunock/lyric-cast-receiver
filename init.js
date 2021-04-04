/*
 * Created by Tomasz Kiljanczyk on 04/04/2021, 20:27
 * Copyright (c) 2021 . All rights reserved.
 * Last modified 04/04/2021, 20:27
 */


document.addEventListener('DOMContentLoaded', onContentLoaded, false);

function onContentLoaded() {

    const CONTENT_NAMESPACE = 'urn:x-cast:lyric.cast.content';
    const CONTROL_NAMESPACE = 'urn:x-cast:lyric.cast.control';
    let blanked = false;
    let songText = "";
    let backgroundColor = "black";
    let fontColor = "white";

    /**
     * Cast receiver context as variable
     */
    window.castReceiverContext = cast.framework.CastReceiverContext.getInstance();

    /**
     * Handle disconnect
     */
    window.castReceiverContext.onSenderDisconnected = function (event) {
        // noinspection TypeScriptUMDGlobal
        if (window.castReceiverContext.getSenders().length === 0
            && event.reason === system.DisconnectReason.REQUESTED_BY_SENDER) {

            window.close();
        }
    };

    /**
     * Control message listener setup
     */
    window.castReceiverContext.addCustomMessageListener(CONTENT_NAMESPACE, function (event) {
        songText = event.data.text;

        console.log(`Received content message: ${songText}`);

        setText(songText);
        blanked = false;
    });

    window.castReceiverContext.addCustomMessageListener(CONTROL_NAMESPACE, function (event) {
        const action = event.data.action;
        console.log(`Received control message: ${action}`);

        switch (action.toLowerCase()) {
            case "blank":
                if (blanked) {
                    setText(songText);
                    document.getElementById("song-text-container").style.display = "block";
                    resizeText();
                    blanked = false;
                } else {
                    document.getElementById("song-text-container").style.display = "none";
                    blanked = true;
                }
                break;
            case "configure":
                let config = event.data.value;
                backgroundColor = config["backgroundColor"];
                fontColor = config["fontColor"];

                document.body.style.backgroundColor = backgroundColor;
                document.body.style.color = fontColor;
                setText(songText);
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
    window.castReceiverContext.start({
        maxInactivity: 300, // In seconds
        statusText: "Ready to present"
    });

}
