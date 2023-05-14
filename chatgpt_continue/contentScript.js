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

function createDropdown() {
    const dropdown = document.createElement('ul');
    dropdown.id = 'continue-conversation-dropdown-list';
    dropdown.classList =
        'dropdown hidden absolute z-10 overflow-auto rounded-sm text-base ring-1 ring-opacity-5 focus:outline-none bg-white dark:bg-gray-800 dark:ring-white/20 dark:last:border-0 sm:text-sm';

    dropdown.setAttribute('role', 'menu');
    dropdown.setAttribute('aria-orientation', 'vertical');
    dropdown.setAttribute(
        'aria-labelledby',
        'continue-conversation-dropdown-button'
    );
    dropdown.setAttribute('tabindex', '-1');

    const dropdownItem1 = createDropdownOption('continue', 'Continue');
    const dropdownItem2 = createDropdownOption('Test', 'Test');

    dropdown.appendChild(dropdownItem1);
    dropdown.appendChild(dropdownItem2);

    return dropdown;
}

function createDropdownOption(title, innerText) {
    const dropdownItem = document.createElement('li');

    dropdownItem.id = `continue-conversation-dropdown-item-${title}`;
    dropdownItem.dir = 'auto';
    dropdownItem.classList =
        'text-gray-900 relative cursor-pointer select-none border-b p-2 last:border-0 border-gray-100 dark:border-white/20 hover:bg-gray-600';

    const dropdownOption = document.createElement('span');
    dropdownOption.classList =
        'font-semibold flex h-6 items-center gap-1 truncate text-gray-800 dark:text-gray-100';

    dropdownOption.title = title;
    dropdownOption.innerText = innerText;

    dropdownItem.appendChild(dropdownOption);
    dropdownItem.setAttribute('role', 'option');
    dropdownItem.setAttribute('tabindex', '-1');

    dropdownItem.addEventListener('mousemove', () => {
        dropdownItem.classList.add('bg-gray-600');
    });

    dropdownItem.addEventListener('mouseleave', () => {
        dropdownItem.classList.remove('bg-gray-600');
    });

    return dropdownItem;
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

    continueButtonWrapper.appendChild(createDropdownBtn());
    continueButtonWrapper.appendChild(createDropdown());
    continueButtonWrapper.appendChild(createContinueBtn());

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

        if (!responseButtonExists && continueButtonWrapper)
            continueButtonWrapper.remove();

        if (responseButtonExists && !continueButtonWrapper) {
            insertElementsToDom();
        }
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true,
    });
};
