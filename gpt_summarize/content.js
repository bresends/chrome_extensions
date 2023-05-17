function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
    });
    return element;
}

function createProgressBar() {
    const progressBar = createElement('div', {
        className: 'progress-bar',
    });
    const progressContainer = createElement('div', {
        className: 'progress-container',
    });
    progressContainer.appendChild(progressBar);
    return { progressBar, progressContainer };
}

function createChunkSizeInput() {
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
    return { chunkSizeInput, chunkSizeLabel };
}

async function submitConversation(text, part) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
    textarea.value = `VIDEO SUMMARY:\n\nTranscript Part: ${part}: ${text}`;
    textarea.dispatchEvent(enterKeyEvent);
}

async function handleChunkInput(progressBar, chunkSizeInput) {
    function isChatGptReady() {
        return !document.querySelector('.text-2xl > span:not(.invisible)');
    }

    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#32a9db';

    const textarea = document.querySelector("textarea[tabindex='0']");
    const text = textarea?.value;

    const chunkSize = parseInt(chunkSizeInput.value);
    const numChunks = Math.ceil(text.length / chunkSize);

    for (let i = 0; i < numChunks; i++) {
        const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
        await submitConversation(chunk, i + 1);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

        while (!isChatGptReady()) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    progressBar.style.backgroundColor = '#32a9db';
}

function insertElementsToDom(progressContainer, chunkSizeLabel, submitButton) {
    const textBoxContainer = document.querySelector(
        "textarea[tabindex='0']"
    )?.parentElement;

    const responseContainer = textBoxContainer?.parentNode;

    const submitBtn = responseContainer?.querySelector('.submit-button');

    if (textBoxContainer && !submitBtn) {
        responseContainer.insertBefore(submitButton, textBoxContainer);
        responseContainer.insertBefore(progressContainer, textBoxContainer);
        responseContainer.insertBefore(chunkSizeLabel, textBoxContainer);
    }
}

// Module: Main
function initializeExtension(handleChunkInput) {
    const { progressBar, progressContainer } = createProgressBar();
    const { chunkSizeInput, chunkSizeLabel } = createChunkSizeInput();

    const submitButton = createElement('button', {
        innerText: 'Submit Long Text',
        className: 'submit-button',
    });

    submitButton.addEventListener('click', () => {
        handleChunkInput(progressBar, chunkSizeInput);
    });

    const observer = new MutationObserver(() =>
        insertElementsToDom(progressContainer, chunkSizeLabel, submitButton)
    );
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the extension
initializeExtension(handleChunkInput);
