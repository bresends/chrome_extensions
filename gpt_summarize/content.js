let isRunning = false;

function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
    });
    return element;
}

async function submitConversation(text, chunkNumber, startPrompt, endPrompt) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
    textarea.value = `${startPrompt}\n\nTranscript Part: ${chunkNumber}: ${text}\n\n${endPrompt}`;
    textarea.dispatchEvent(enterKeyEvent);
}

async function handleChunkInput(
    progressBar,
    chunkSizeInput,
    startPromptInput,
    endPromptInput
) {
    function isChatGptReady() {
        // If not present, the GPT can be assumed to be ready
        const gptIsProcessingSVG = document.querySelector(
            '.text-2xl > span:not(.invisible)'
        );
        return !gptIsProcessingSVG;
    }

    const textarea = document.querySelector("textarea[tabindex='0']");
    const text = textarea?.value;

    const startPrompt = startPromptInput.value;
    const endPrompt = endPromptInput.value;

    const chunkSize = parseInt(chunkSizeInput.value);
    const numChunks = Math.ceil(text.length / chunkSize);

    for (let i = 0; i < numChunks; i++) {
        if (!isRunning) {
            break;
        }
        const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
        await submitConversation(chunk, i + 1, startPrompt, endPrompt);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

        while (!isChatGptReady()) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

function insertElementsAboveTextBox(elements) {
    const textBoxContainer = document.querySelector(
        "textarea[tabindex='0']"
    )?.parentElement;

    const responseContainer = textBoxContainer?.parentNode;

    const submitBtn = responseContainer?.querySelector('.submit-button');

    if (textBoxContainer && !submitBtn) {
        elements.forEach((element) => {
            responseContainer.insertBefore(element.element, textBoxContainer);
        });

        const closeEyeSVG = createOpenEyeSVG();

        const openCloseBtn = createElement('button', {
            id: 'open-close-btn',
            className:
                'absolute p-1 text-gray-500 enabled:dark:hover:text-gray-400',
        });

        openCloseBtn.appendChild(closeEyeSVG);

        const sendText = document.querySelector(
            "textarea[tabindex='0']"
        )?.nextElementSibling;

        sendText.parentElement.insertBefore(openCloseBtn, sendText);
    }
}

function createOpenEyeSVG() {
    // Create the SVG element
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('class', 'w-6 h-6');

    // Create the first path element
    var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('stroke-linecap', 'round');
    path1.setAttribute('stroke-linejoin', 'round');
    path1.setAttribute(
        'd',
        'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178'
    );

    // Create the second path element
    var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('stroke-linecap', 'round');
    path2.setAttribute('stroke-linejoin', 'round');
    path2.setAttribute('d', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z');

    // Append the path elements to the SVG element
    svg.appendChild(path1);
    svg.appendChild(path2);

    return svg;
}

function createDomElements(insertToTexBoxContainer) {
    const progressBar = createElement('div', {
        className: 'progress-bar',
    });
    const progressContainer = createElement('div', {
        className: 'progress-container',
    });
    progressContainer.appendChild(progressBar);

    const chunkSizeInput = createElement('input', {
        type: 'number',
        min: '1',
        value: '12000',
        className: 'chunk-size-input',
    });
    const chunkSizeLabel = createElement('label', {
        innerText: 'Chunk Size: ',
        className: 'chunk-size-label',
    });
    chunkSizeLabel.appendChild(chunkSizeInput);

    const promptContainer = createElement('div', {
        className: 'flex justify-between py-2 gap-3',
    });

    const startPromptInput = createElement('input', {
        type: 'text',
        className:
            'focus:ring-0 focus-visible:ring-0 py-2 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]',
        value: 'VIDEO SUMMARY:',
    });

    const startPromptLabel = createElement('label', {
        innerText: 'Start Prompt: ',
        className: 'prompt-label w-full flex flex-col',
    });

    const endPromptInput = createElement('input', {
        type: 'text',
        className:
            'focus:ring-0 focus-visible:ring-0 py-2 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]',
        value: 'VIDEO SUMMARY:',
    });

    const endPromptLabel = createElement('label', {
        innerText: 'End Prompt: ',
        className: 'prompt-label w-full flex flex-col',
    });

    startPromptLabel.appendChild(startPromptInput);
    endPromptLabel.appendChild(endPromptInput);

    promptContainer.appendChild(startPromptLabel);
    promptContainer.appendChild(endPromptLabel);

    const submitButton = createElement('button', {
        innerText: 'Submit Long Text',
        className: 'submit-button py-2 my-2',
    });

    submitButton.addEventListener('click', () => {
        isRunning = !isRunning;

        if (isRunning) {
            submitButton.innerText = 'Stop Execution';
            submitButton.style.backgroundColor = '#ef4146';

            handleChunkInput(
                progressBar,
                chunkSizeInput,
                startPromptInput,
                endPromptInput
            );
        } else {
            submitButton.innerText = 'Submit Long Text';
            submitButton.style.backgroundColor = '#4d8b31';
            progressBar.style.width = '0%';
        }
    });

    const elements = [
        { element: promptContainer, position: 'before' },
        { element: submitButton, position: 'before' },
        { element: progressContainer, position: 'before' },
        { element: chunkSizeLabel, position: 'before' },
    ];

    insertToTexBoxContainer(elements);
}

// Module: Main
function initializeExtension() {
    const observer = new MutationObserver(() =>
        createDomElements(insertElementsAboveTextBox)
    );
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the extension
initializeExtension();
