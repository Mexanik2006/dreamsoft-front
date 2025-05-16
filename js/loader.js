export function notifyLoadComplete(section, success) {
    // Track the loading state of each section
    window.loadingState = window.loadingState || {
        team: false,
        blog: false
    };

    // Update the loading state for the given section
    window.loadingState[section] = true;

    // Check if both sections are loaded (successfully or with error)
    if (window.loadingState.team && window.loadingState.blog) {
        // Hide the loader
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('loader-hidden');
            // Remove the loader from DOM after transition
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }
}