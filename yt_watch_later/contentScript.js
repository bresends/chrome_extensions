function addButtonToVideos() {
    const videoItems = document.querySelectorAll('ytd-playlist-video-renderer');
    videoItems.forEach((video) => {
        if (!video.querySelector('.copy-url-button')) {
            const videoUrl = video.querySelector('a').href;
            const button = createButton('Copy', videoUrl);
            video.appendChild(button);
        }
    });
}

function createButton(text, videoUrl) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.classList.add('copy-url-button');

    button.addEventListener('click', () => {
        const videoId = videoUrl.split('=')[1].split('&')[0];
        const newUrl = `https://youtu.be/${videoId}`;
        copyToClipboard(newUrl);
    });
    return button;
}

// copy a string to the clipboard
function copyToClipboard(str) {
    navigator.clipboard.writeText(str);
}

window.onload = () => {
    const observer = new MutationObserver(() => {
        const videoItems = document.querySelectorAll(
            'ytd-playlist-video-renderer'
        );

        // if there are videos on the page, add the button
        if (videoItems.length > 0) {
            addButtonToVideos();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};
