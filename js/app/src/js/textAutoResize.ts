/*
 * Created by Tomasz Kiljanczyk on 23/11/2024, 16:49
 * Copyright (c) 2024 . All rights reserved.
 * Last modified 23/11/2024, 16:45
 */
import LyricCastContext from './LyricCastContext';

/* Based on: https://variablefonts.dev/posts/resize-to-fit/ */
export function resizeText() {
    const textElement = document.getElementById('song-text');
    if (!textElement) {
        console.error('Text element not found');
        return;
    }

    const textContainerElement = document.getElementById('song-text-container');
    if (!textContainerElement) {
        console.error('Text container element not found');
        return;
    }

    const parentContainerWidth = textContainerElement.clientWidth;
    const currentTextWidth = textElement.scrollWidth;

    const parentContainerHeight = textContainerElement.clientHeight;
    const currentTextHeight = textElement.scrollHeight;

    const widthRatio = parentContainerWidth / currentTextWidth;
    const heightRatio = parentContainerHeight / currentTextHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    const currentFontSize = parseInt(window.getComputedStyle(textElement).fontSize);
    let newValue = Math.min(Math.max(16, ratio * currentFontSize), LyricCastContext.maxFontSize);
    newValue = Math.floor(newValue);

    textElement.style.setProperty('--fontSize', `${newValue}px`);
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const text = document.getElementById('song-text');
        text?.addEventListener('DOMSubtreeModified', resizeText, false);
    },
    false
);