function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
    });
    return element;
}

function createFileInput(onChange) {
    const input = createElement('input', {
        type: 'file',
        accept: '.txt,.js,.py,.html,.css,.json,.csv',
    });
    input.addEventListener('change', onChange);
    return input;
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

async function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
    textarea.value = `Create VIDEO SUMMARY:\n\nTranscript Part: ${part} of ${filename}: ${text} \n\nCreate a VIDEO SUMMARY from the Transcript above following the flow of the conversation:`;
    textarea.dispatchEvent(enterKeyEvent);
}

function isChatGptReady() {
    return !document.querySelector('.text-2xl > span:not(.invisible)');
}

// Module: Main
function initializeExtension() {
    const { progressBar, progressContainer } = createProgressBar();
    const { chunkSizeInput, chunkSizeLabel } = createChunkSizeInput();

    const handleFileChange = async () => {
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#32a9db';

        const file = fileInput.files[0];
        const text = await file.text();

        const chunkSize = parseInt(chunkSizeInput.value);
        const numChunks = Math.ceil(text.length / chunkSize);

        for (let i = 0; i < numChunks; i++) {
            const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
            await submitConversation(chunk, i + 1, file.name);
            progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

            while (!isChatGptReady()) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        progressBar.style.backgroundColor = '#32a9db';
    };

    const fileInput = createFileInput(handleFileChange);

    const submitButton = createElement('button', {
        innerText: 'Submit File',
        className: 'submit-button',
    });

    submitButton.addEventListener('click', () => {
        fileInput.click();
    });

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type !== 'childList') return;

            const gptTextBox = document.querySelector(
                '.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4'
            );
            const existingSubmitButton =
                gptTextBox?.parentNode?.querySelector('.submit-button');
            if (gptTextBox && !existingSubmitButton) {
                gptTextBox.parentNode.insertBefore(submitButton, gptTextBox);
                gptTextBox.parentNode.insertBefore(
                    progressContainer,
                    gptTextBox
                );
                gptTextBox.parentNode.insertBefore(chunkSizeLabel, gptTextBox);
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the extension
initializeExtension();
