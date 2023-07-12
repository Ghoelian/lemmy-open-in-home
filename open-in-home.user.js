// ==UserScript==
// @name         Open in home instance
// @namespace    https://julianvos.nl
// @version      1.0
// @description  Open a Lemmy instance in your home instance with a one click
// @author       Julian Vos
// @match        https://*/c/*
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async () => {
    'use strict';
    console.debug('Started script');

    // TODO: find a way to ask the user for their home instance and save it
    let homeInstance = await GM.getValue("homeInstance");

    if (homeInstance === undefined) {
        homeInstance = prompt('Enter your home instance', 'feddit.nl');
        GM.setValue("homeInstance", homeInstance);
    }

    const currentInstance = window.location.hostname;

    window.addEventListener('load', (e) => {
        if (currentInstance === homeInstance) {
            console.debug('Already on home instance');
            return;
        }

        // Get the community name from the path
        const communityRegex = /\/c\/(\w+)/;
        const regexResult = communityRegex.exec(window.location.pathname);

        // Regex has 1 capture group, so result should always have 2 entries
        if (regexResult.length < 2) {
            console.debug('Failed to find community name in path');
            return;
        }

        const community = regexResult[1];

        console.debug('Finding community link');

        // kinda assuming the first element is always the community link at the top of the page
        // not sure if that's true though
        const communityLink = document.getElementsByClassName('community-link')[0];

        const openInHomeButton = document.createElement('button');

        openInHomeButton.classList.add('btn');
        openInHomeButton.classList.add('m-2');
        openInHomeButton.classList.add('btn-secondary');

        openInHomeButton.onclick = () => {
            window.open(`https://${homeInstance}/c/${community}@${currentInstance}`);
            console.log(`https://${homeInstance}/c/${community}@${currentInstance}`);
        };

        openInHomeButton.innerText = 'Open in home instance';

        console.debug('Inserting button');

        communityLink.after(openInHomeButton);
    });
})();
