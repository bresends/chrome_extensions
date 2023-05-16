function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
    });
    return element;
}

const button = createElement('button', {
    innerText: 'Submit File',
    className: 'submit-button',
});

const progressContainer = createElement('div', {
    className: 'progress-container',
});

const progressBar = createElement('div', {
    className: 'progress-bar',
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

// Add a click event listener to the button
button.addEventListener('click', async () => {
    // Create the input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.py,.html,.css,.json,.csv';

    // Add a change event listener to the input element
    input.addEventListener('change', async () => {
        // Reset progress bar once a new file is inserted
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#32a9db';

        // Read the file as text
        const file = input.files[0];
        const text = await file.text();

        // Get the chunk size from the input element
        const chunkSize = parseInt(chunkSizeInput.value);

        // Split the text into chunks of the specified size
        const numChunks = Math.ceil(text.length / chunkSize);
        for (let i = 0; i < numChunks; i++) {
            const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);

            // Submit the chunk to the conversation
            await submitConversation(chunk, i + 1, file.name);

            // Update the progress bar
            progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

            // Wait for ChatGPT to be ready
            let chatgptReady = false;
            while (!chatgptReady) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                chatgptReady = !document.querySelector(
                    '.text-2xl > span:not(.invisible)'
                );
            }
        }

        // Finish updating the progress bar
        progressBar.style.backgroundColor = '#32a9db';
    });

    // Click the input element to trigger the file selection dialog
    input.click();
});

// Define the submitConversation function
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

// Periodically check if the button has been added to the page and add it if it hasn't
const targetSelector =
    '.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4';
const intervalId = setInterval(() => {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement && !targetElement.contains(button)) {
        // Insert the button before the target element
        targetElement.parentNode.insertBefore(button, targetElement);

        // Insert the progress bar container before the target element
        targetElement.parentNode.insertBefore(progressContainer, targetElement);

        // Insert the chunk size label and input before the target element
        targetElement.parentNode.insertBefore(chunkSizeLabel, targetElement);
    }
}, 2000);
