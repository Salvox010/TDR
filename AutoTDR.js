// ==UserScript==
// @name         TDR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatismo TDR by Salvatore Maurici
// @author       Salvox
// @match        http://om1n983/tdrtool/pages/web_portal.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variabili per i bottoni
    let startButton;
    let stopButton;

    // Variabile di stato per il processo
    let isRunning = false;

    // Funzione per creare e posizionare i bottoni
    function createButtons() {
        startButton = document.createElement('button');
        startButton.innerText = 'Start Processo';
        startButton.style.position = 'fixed';
        startButton.style.bottom = '20px';
        startButton.style.left = '20px';
        startButton.style.padding = '10px 20px';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.cursor = 'pointer';
        startButton.style.zIndex = '1000';
        document.body.appendChild(startButton);

        stopButton = document.createElement('button');
        stopButton.innerText = 'Stop Processo';
        stopButton.style.position = 'fixed';
        stopButton.style.bottom = '20px';
        stopButton.style.left = '160px';
        stopButton.style.padding = '10px 20px';
        stopButton.style.backgroundColor = '#f44336';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.cursor = 'pointer';
        stopButton.style.zIndex = '1000';
        stopButton.style.display = 'none';
        document.body.appendChild(stopButton);

        startButton.addEventListener('click', startProcess);
        stopButton.addEventListener('click', stopProcess);
    }

    function startProcess() {
        if (!isRunning) {
            isRunning = true;
            console.log("Processo avviato!");
            startButton.style.display = 'none';
            stopButton.style.display = 'block';
            runSequentialActions();
        }
    }

    function stopProcess() {
        if (isRunning) {
            isRunning = false;
            console.log("Processo fermato!");
            stopButton.style.display = 'none';
            startButton.style.display = 'block';
        }
    }

    async function runSequentialActions() {
        console.log("Inizio l'elaborazione delle righe...");

        let continueProcessing = true;

        while (continueProcessing) {
            const rows = document.querySelectorAll('tr');
            const rowsToProcess = Array.from(rows).filter(row => {
                const cells = row.querySelectorAll('td');
                return cells.length >= 11 && cells[10].innerText.trim() === "NO" && cells[11].innerText.trim() === "NO";
            });

            if (rowsToProcess.length > 0) {
                const firstRow = rowsToProcess[0];
                console.log("Processo della prima riga:", firstRow);

                await clickRow(firstRow);
                await clickCreateEmailButton();
                console.log("Riga cliccata e tasto 'Crea Email' premuto!");
                await delay(90000);

                await clickSendEmailButton();
                console.log("Tasto 'Invia' premuto!");

                await clearSearchInput();
                console.log("Casella di ricerca svuotata!");

                await simulateEnterKey();
                console.log("Tasto 'Invio' premuto!");

                await delay(10000);
                await clickSearchButton();
                console.log("Tasto 'Cerca' premuto!");

                await delay(90000);
                await clearSearchInput();
                console.log("Casella di ricerca svuotata di nuovo!");

            } else {
                console.log("Aspetto 10 secondi per la verifica finale dei filtri NO, NO...");
                await delay(10000);
                console.log("Nessuna riga che soddisfa i criteri ('NO', 'NO'). Terminando il processo.");
                continueProcessing = false;
            }
        }

        stopProcess();
    }

    async function clearSearchInput() {
        const searchInput = document.querySelector('input[type="search"].form-control.form-control-sm');

        if (searchInput) {
            searchInput.focus();
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Casella di ricerca svuotata!");
        } else {
            console.log("Casella di ricerca non trovata.");
        }
    }

    async function simulateEnterKey() {
        const searchInput = document.querySelector('input[type="search"].form-control.form-control-sm');
        if (searchInput) {
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            });
            searchInput.dispatchEvent(event);
            console.log("Tasto 'Invio' simulato.");
        } else {
            console.log("Casella di ricerca non trovata per inviare 'Invio'.");
        }
    }

    async function clickRow(row) {
        const clickableElement = row.querySelector('td:first-child');
        if (clickableElement) {
            clickableElement.click();
            console.log("Cliccato elemento di selezione:", clickableElement);
        }
        row.classList.add('selected');
        row.style.backgroundColor = "#d3d3d3";
    }

    async function clickCreateEmailButton() {
        const emailButton = document.getElementById('btn-email');
        if (emailButton) {
            emailButton.click();
            console.log("Tasto 'Crea Email' cliccato!");
        } else {
            console.log("Bottone 'Crea Email' non trovato.");
        }
    }

    async function clickSendEmailButton() {
        const sendButton = document.getElementById('btn-send-mail');
        if (sendButton) {
            sendButton.click();
            console.log("Tasto 'Invia' cliccato!");
        } else {
            console.log("Bottone 'Invia' non trovato.");
        }
    }

    async function clickSearchButton() {
        const searchButton = document.getElementById('btn-search-dates');
        if (searchButton) {
            searchButton.click();
            console.log("Tasto 'Cerca' cliccato!");
        } else {
            console.log("Bottone 'Cerca' non trovato.");
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.alert = function(message) {
        console.log("Pop-up alert trovato e chiuso automaticamente:", message);
    };

    createButtons();
})();
