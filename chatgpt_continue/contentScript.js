function sendContinue() {
    const textarea = document.querySelector("textarea[tabindex='0']");

    const gptResponses = document.querySelectorAll(
        'div.bg-gray-50, div.dark\\:bg-\\[\\#444654\\]'
    );

    const lastGptResponse = gptResponses[gptResponses.length - 1];

    const lastResponseText =
        lastGptResponse.querySelector('div.markdown').lastElementChild
            .textContent;

    const textAreaCurrentValue = textarea.value.trim();

    if (textAreaCurrentValue === '') {
        textarea.value = `Continue from "${lastResponseText}"`;
    }
}

function createBtnContainer() {
    const continueButtonWrapper = document.createElement('div');
    continueButtonWrapper.classList.add(
        'continue-button-wrapper',
        'animate-fade'
    );
    continueButtonWrapper.id = 'continue-conversation-button-wrapper';

    return continueButtonWrapper;
}

function createDropdownBtn() {
    const continueButtonDropdown = document.createElement('button');
    continueButtonDropdown.textContent = '⋮';
    continueButtonDropdown.id = 'continue-conversation-dropdown-button';
    continueButtonDropdown.classList.add(
        'continue-conversation-dropdown-button',
        'btn',
        'flex',
        'justify-center',
        'gap-2',
        'btn-neutral',
        'border-0',
        'md:border'
    );

    continueButtonDropdown.addEventListener('click', () => {
        const dropdown = document.getElementById(
            'continue-conversation-dropdown-list'
        );
        if (!dropdown) return;
        if (dropdown.classList.contains('block')) {
            dropdown.classList.replace('block', 'hidden');
        } else {
            dropdown.classList.replace('hidden', 'block');
        }
    });

    return continueButtonDropdown;
}

function createContinueBtn() {
    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.id = 'continue-conversation-button';
    continueButton.type = 'button';
    continueButton.dir = 'auto';
    continueButton.classList.add(
        'btn',
        'block',
        'justify-center',
        'gap-2',
        'btn-neutral',
        'border-0',
        'md:border',
        'max-w-10',
        'truncate'
    );

    continueButton.addEventListener('click', () => {
        const textAreaElement = document.querySelector('textarea');
        // textAreaElement.focus();
        // textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
        // textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
        sendContinue();
    });

    return continueButton;
}

function insertElementsToDom() {
    const textAreaElement = document.querySelector("textarea[tabindex='0']");

    if (!textAreaElement) return;

    const nodeBeforetTextAreaElement =
        textAreaElement.parentNode.previousSibling;

    if (nodeBeforetTextAreaElement.classList.length === 0) {
        nodeBeforetTextAreaElement.classList =
            'h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center';
        nodeBeforetTextAreaElement.firstChild.classList = '';
    }
    nodeBeforetTextAreaElement.style.minHeight = '38px';

    const continueButtonWrapper = createBtnContainer();
    const continueButtonDropdown = createDropdownBtn();
    const continueButton = createContinueBtn();

    continueButtonWrapper.appendChild(continueButtonDropdown);
    // continueButtonWrapper.appendChild(promptDropdown());
    continueButtonWrapper.appendChild(continueButton);

    nodeBeforetTextAreaElement.appendChild(continueButtonWrapper);
}

window.onload = () => {
    const targetNode = document.body;

    const observer = new MutationObserver(() => {
        const continueButtonWrapper = document.querySelector(
            '#continue-conversation-button-wrapper'
        );

        const responseButtonExists = document
            .querySelector("textarea[tabindex='0']")
            .parentNode.previousSibling.querySelector('button[as="button"]');

        if (!responseButtonExists) continueButtonWrapper.remove();

        if (responseButtonExists && !continueButtonWrapper) {
            insertElementsToDom();
        }
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true,
    });
};
