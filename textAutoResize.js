/*
 * Created by Tomasz Kiljanczyk on 05/04/2021, 00:10
 * Copyright (c) 2021 . All rights reserved.
 * Last modified 04/04/2021, 22:16
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
    let newValue = Math.min(Math.max(16, ratio * currentFontSize), 500);
    newValue = Math.floor(newValue);

    text.style.setProperty('--fontSize', newValue + 'px');
}

document.addEventListener('DOMContentLoaded', function () {
    text = document.getElementById("song-text");

    text.addEventListener('DOMSubtreeModified', function () {
        resizeText();
    }, false);
}, false);
