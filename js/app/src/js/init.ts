/*
 * Created by Tomasz Kiljanczyk on 11/04/2021, 22:02
 * Copyright (c) 2021 . All rights reserved.
 * Last modified 11/04/2021, 22:01
 */
import {
    DisconnectReason,
    SenderDisconnectedEvent,
    EventType as SystemEventType
} from 'chromecast-caf-receiver/cast.framework.system';
import { z } from 'zod';

import LyricCastContext from './LyricCastContext';
import { CONTENT_NAMESPACE, CONTROL_NAMESPACE } from './constants';
import { resizeText } from './textAutoResize';

enum LyricCastAction {
    BLANK = 'BLANK',
    CONFIGURE = 'CONFIGURE'
}

const LyricCastControlMessage = z.object({
    action: z.string().toUpperCase().pipe(z.nativeEnum(LyricCastAction)),
    value: z.any()
});

const LyricCastContentMessage = z.object({
    text: z.string()
});

const LyricCastConfig = z.object({
    backgroundColor: z.string(),
    fontColor: z.string(),
    maxFontSize: z.number()
});

function handleBlank(blankState: unknown) {
    const textContainerElement = document.getElementById('song-text-container');
    if (!textContainerElement) {
        console.error('Text container element not found');
        return;
    }

    const blankStateBoolean = z.boolean().safeParse(blankState);
    if (!blankStateBoolean.success) {
        console.error('Invalid blank state', blankStateBoolean.error);
        return;
    }

    textContainerElement.hidden = blankStateBoolean.data;
    if (!blankState) {
        resizeText();
    }
}

function handleConfigure(data: unknown) {
    const config = LyricCastConfig.safeParse(data);
    if (!config.success) {
        console.error('Invalid config data', config.error);
        return;
    }

    const backgroundColor = config.data.backgroundColor;
    const fontColor = config.data.fontColor;

    LyricCastContext.maxFontSize = config.data.maxFontSize;
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = fontColor;
    resizeText();
}

function setText(text: string) {
    const textElement = document.getElementById('song-text');
    if (!textElement) {
        console.error('Text element not found');
        return;
    }

    textElement.innerHTML = text;
}

function onContentLoaded() {
    LyricCastContext.maxFontSize = 100;

    /**
     * Cast receiver context as variable
     */
    const castReceiverContext = cast.framework.CastReceiverContext.getInstance();

    /**
     * Handle disconnect
     */
    castReceiverContext.addEventListener(SystemEventType.SENDER_DISCONNECTED, event => {
        if (!(event instanceof SenderDisconnectedEvent)) {
            return;
        }

        if (
            castReceiverContext.getSenders().length === 0 &&
            event.reason === DisconnectReason.REQUESTED_BY_SENDER
        ) {
            window.close();
        }
    });

    /**
     * Control message listener setup
     */
    castReceiverContext.addCustomMessageListener(CONTENT_NAMESPACE, event => {
        console.debug('Received content message', event.data);

        const songTextMessage = LyricCastContentMessage.safeParse(event.data);

        if (!songTextMessage.success) {
            console.error('Invalid message', songTextMessage.error);
            return;
        }

        setText(songTextMessage.data.text);
    });

    castReceiverContext.addCustomMessageListener(CONTROL_NAMESPACE, event => {
        console.debug('Received data', event.data);

        const message = LyricCastControlMessage.safeParse(event.data);
        if (!message.success) {
            console.error('Invalid message', message.error);
            return;
        }

        switch (message.data.action) {
            case LyricCastAction.BLANK:
                handleBlank(message.data.value);
                break;
            case LyricCastAction.CONFIGURE:
                handleConfigure(message.data.value);
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
