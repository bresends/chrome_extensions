function sendContinue() {
    const textarea = document.querySelector("textarea[tabindex='0']");

    const value = textarea.value.trim();

    if (value === '') {
        textarea.value = 'Continue';
    }
}

function addButton() {
    const button = document.createElement('button');
    button.textContent = 'Continue';
    button.id = 'continue-btn';

    button.style.padding = '2px';
    button.style.border = 'none';
    button.style.borderRadius = '20px';
    button.style.color = '#fff';
    button.style.backgroundColor = '#6e6e80';
    button.style.fontSize = '10px';
    button.style.fontWeight = '150';
    button.style.marginBottom = '.25rem';
    button.style.width = '80px';

    button.classList.add('copy-url-button');

    const textarea = document.querySelector("textarea[tabindex='0']");

    // Parent of the form
    const textAreadiv = textarea.parentNode.parentNode;

    // Regenerate button empty div
    const emptyDiv = textAreadiv.querySelector("div[class='']");

    // Insert the button after the regenerate button
    emptyDiv.insertAdjacentElement('afterend', button);

    button.addEventListener('click', sendContinue);
}

window.onload = () => {
    const targetNode = document.body;

    const observer = new MutationObserver(() => {
        const textArea = document.querySelectorAll('textarea[tabindex="0"]');
        const continueBtn = document.querySelector('#continue-btn');

        // If the text area is visible and there are no buttons insert One
        if (textArea.length > 0 && !continueBtn) {
            addButton();
        }
    });

    observer.observe(targetNode, {
        attributes: true,
        childLIst: true,
        subtree: true,
    });
};
