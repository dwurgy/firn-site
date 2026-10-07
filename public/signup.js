// Sends the sign-up form in the background and swaps in the thank-you note,
// so the visitor stays on the page. Without JavaScript the form still works:
// the browser posts it and lands on the thanks page.

const form = document.querySelector('.signup');
const button = form.querySelector('button');
const error = form.querySelector('.signup-error');

const messages = {
  invalid: "That doesn't look like an email address.",
  busy: 'Too many sign-ups right now. Please try again later.',
  error: 'Something went wrong. Please try again in a minute.',
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  button.disabled = true;
  error.hidden = true;

  let reason = 'error';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    const result = await response.json();
    if (result.ok) {
      const thanks = document.getElementById('thanks').content.cloneNode(true);
      form.replaceWith(thanks);
      return;
    }
    reason = result.error;
  } catch {
    // Network trouble: fall through to the general message.
  }

  error.textContent = messages[reason] || messages.error;
  error.hidden = false;
  button.disabled = false;
});
