/*
 * Created by Tomasz Kiljańczyk on 30/12/2020, 18:42
 * Copyright (c) 2020 . All rights reserved.
 * Last modified 30/12/2020, 18:41
 */

$(document).ready(function () {

    const CONTENT_NAMESPACE = 'urn:x-cast:lyric.cast.content';
    const CONTROL_NAMESPACE = 'urn:x-cast:lyric.cast.control';
    let blanked = false;
    let songText = "";
    let fontSize = 40;
    let backgroundColor = "black"
    let fontColor = "white"

    /**
     * Cast receiver context as variable
     */
    window.castReceiverContext = cast.framework.CastReceiverContext.getInstance();

    /**
     * Handle disconnect
     */
    window.castReceiverContext.onSenderDisconnected = function (event) {
        if (window.castReceiverContext.getSenders().length === 0 &&
            event.reason === system.DisconnectReason.REQUESTED_BY_SENDER) {
            window.close();
        }
    }

    /**
     * Control message listener setup
     */
    window.castReceiverContext.addCustomMessageListener(CONTENT_NAMESPACE, function (event) {
        songText = event.data.text;

        console.log(`Received content message: ${songText}`)

        showText(songText)
        blanked = false;
    });

    window.castReceiverContext.addCustomMessageListener(CONTROL_NAMESPACE, function (event) {
        const action = event.data.action;
        console.log(`Received control message: ${action}`)

        switch (action.toLowerCase()) {
            case "blank":
                if (blanked) {
                    showText(songText)
                    $("#song-text").show()
                    blanked = false;
                } else {
                    $("#song-text").hide()
                    blanked = true;
                }
                break;
            case "configure":
                let config = event.data.value;
                fontSize = config["fontSize"];
                backgroundColor = config["backgroundColor"]
                fontColor = config["fontColor"]

                $("body").css({backgroundColor: backgroundColor, color: fontColor})
                showText(songText)
                break;
            default:
                showText("ERROR: UNKNOWN MESSAGE")
        }
    });

    function showText(text) {
        $("#song-text").empty()
            .append(`<p style="font-size: ${fontSize}">${text}</p>`);
    }

    /**
     * Initializes the system manager. The application should call this method when
     * it is ready to start receiving messages, typically after registering
     * to listen for the events it is interested on.
     */
    window.castReceiverContext.start({
        maxInactivity: 6000,
        statusText: "Ready to present"
    });

});
