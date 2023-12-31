// ==UserScript==
// @name         Open in home instance
// @namespace    https://julianvos.nl
// @version      1.1
// @description  Open a Lemmy instance in your home instance with a one click
// @author       Julian Vos
// @match        https://*/c/*
// @run-at       document-idle
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async () => {
    'use strict';
    console.debug('Started script');

    let homeInstance = await GM.getValue("homeInstance");

    if (homeInstance === undefined) {
        homeInstance = prompt('Enter your home instance', 'feddit.nl');
        GM.setValue("homeInstance", homeInstance);
    }

    const currentInstance = window.location.hostname;

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
    const sidebarTitle = document.querySelector('#sidebarContainer #sidebarMain .card-body div');

    const openInHomeButton = document.createElement('button');

    openInHomeButton.classList = 'btn d-block mb-2 w-100 btn-secondary';

    openInHomeButton.onclick = () => {
        window.open(`https://${homeInstance}/c/${community}@${currentInstance}`);
    };

    openInHomeButton.innerText = 'Open in home instance';

    console.debug('Inserting button');
    sidebarTitle.after(openInHomeButton);
})();
