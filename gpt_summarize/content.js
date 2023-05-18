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
        return !document.querySelector('.text-2xl > span:not(.invisible)');
    }

    const textarea = document.querySelector("textarea[tabindex='0']");
    const text = textarea?.value;

    const startPrompt = startPromptInput.value;
    const endPrompt = endPromptInput.value;

    const chunkSize = parseInt(chunkSizeInput.value);
    const numChunks = Math.ceil(text.length / chunkSize);

    for (let i = 0; i < numChunks; i++) {
        const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
        await submitConversation(chunk, i + 1, startPrompt, endPrompt);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

        while (!isChatGptReady()) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    progressBar.style.backgroundColor = '#32a9db';
}

function createAndInsertElements(elements) {
    const textBoxContainer = document.querySelector(
        "textarea[tabindex='0']"
    )?.parentElement;

    const responseContainer = textBoxContainer?.parentNode;

    const submitBtn = responseContainer?.querySelector('.submit-button');

    if (textBoxContainer && !submitBtn) {
        elements.forEach((element) => {
            responseContainer.insertBefore(element.element, textBoxContainer);
        });
    }
}

function insertElementsToDom(createAndInsertElements) {
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
        handleChunkInput(
            progressBar,
            chunkSizeInput,
            startPromptInput,
            endPromptInput
        );
    });

    const elements = [
        { element: promptContainer, position: 'before' },
        { element: submitButton, position: 'before' },
        { element: progressContainer, position: 'before' },
        { element: chunkSizeLabel, position: 'before' },
    ];

    createAndInsertElements(elements);
}

// Module: Main
function initializeExtension() {
    const observer = new MutationObserver(() =>
        insertElementsToDom(createAndInsertElements)
    );
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the extension
initializeExtension();
