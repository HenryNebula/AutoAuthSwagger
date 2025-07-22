chrome.storage.sync.get({ configs: [] }, function (items) {
  const configs = items.configs;
  const currentUrl = window.location.href;

  console.log('AutoAuthSwagger: Checking configurations for URL:', currentUrl);

  for (const config of configs) {
    const urlPattern = config.isRegex
      ? new RegExp(config.url)
      : new RegExp(`^${config.url.replace(/\*/g, '.*')}$`);

    if (urlPattern.test(currentUrl)) {
      console.log('AutoAuthSwagger: Found matching pattern:', config.url);
      const apiKey = config.apiKey;

      const injectApiKey = (authWrapper) => {
        console.log('AutoAuthSwagger: Auth wrapper found. Attempting to inject key.');
        const authButton = authWrapper.querySelector('button');
        if (authButton) {
          authButton.click(); // Open the authorization modal

          // Observe the modal for the input field to appear
          const modalObserver = new MutationObserver((mutationsList, observer) => {
            const form = authWrapper.querySelector('form');
            if (form) {
              const input = form.querySelector('input');
              if (input) {
                console.log('AutoAuthSwagger: Injecting API Key.');
                const changeEvent = new Event('change', { bubbles: true });
                const buttons = form.querySelectorAll('button');

                input.value = apiKey;
                input.dispatchEvent(changeEvent);

                if (buttons && buttons.length > 1) {
                  buttons[0]?.click(); // Authorize button
                  buttons[1]?.click(); // Close button
                  console.log('AutoAuthSwagger: Authorization submitted.');
                }
                observer.disconnect(); // Stop observing the modal
              }
            }
          });

          modalObserver.observe(authWrapper, { childList: true, subtree: true });
        }
      };

      // Observe the document for the main swagger-ui and auth-wrapper to appear
      const pageObserver = new MutationObserver((mutationsList, observer) => {
        const swaggerUI = document.getElementById('swagger-ui');
        const authWrapper = document.querySelector('.auth-wrapper');
        if (swaggerUI && authWrapper) {
          console.log('AutoAuthSwagger: Swagger UI and auth wrapper detected.');
          injectApiKey(authWrapper);
          observer.disconnect(); // Stop observing the page
        }
      });

      pageObserver.observe(document.body, { childList: true, subtree: true });

      break; // Stop after finding the first matching config
    }
  }
});