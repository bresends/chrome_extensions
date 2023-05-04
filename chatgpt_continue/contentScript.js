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

    button.classList.add('continue-button');

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
        const continueBtn = document.querySelector('#continue-btn');

        if (
            document.body.textContent.includes('Regenerate response') &&
            !continueBtn
        ) {
            addButton();
        } else if (
            !document.body.textContent.includes('Regenerate response') &&
            continueBtn
        ) {
            continueBtn.remove();
        }
    });

    observer.observe(targetNode, {
        attributes: true,
        childLIst: true,
        subtree: true,
    });
};
