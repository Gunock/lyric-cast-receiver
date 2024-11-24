/*
 * Created by Tomasz Kiljanczyk on 23/11/2024, 16:49
 * Copyright (c) 2024 . All rights reserved.
 * Last modified 23/11/2024, 16:45
 */

/* Based on: https://variablefonts.dev/posts/resize-to-fit/ */
let text;

function resizeText() {
    const parentContainerWidth = text.parentNode.clientWidth;
    const currentTextWidth = text.scrollWidth;

    const parentContainerHeight = text.parentNode.clientHeight;
    const currentTextHeight = text.scrollHeight;

    const widthRatio = parentContainerWidth / currentTextWidth;
    const heightRatio = parentContainerHeight / currentTextHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
    let newValue = Math.min(Math.max(16, ratio * currentFontSize), window.maxFontSize);
    newValue = Math.floor(newValue);

    text.style.setProperty('--fontSize', newValue + 'px');
}

document.addEventListener(
    'DOMContentLoaded',
    function () {
        text = document.getElementById('song-text');

        text.addEventListener(
            'DOMSubtreeModified',
            function () {
                resizeText();
            },
            false
        );
    },
    false
);
