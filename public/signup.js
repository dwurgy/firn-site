// Sends the sign-up form in the background, then hides the form and shows
// the thank-you message (.thanks), so the visitor stays on the page.
// Without JavaScript the form still works: the browser posts it and lands
// on the thanks page.

const form = document.querySelector('.signup');
const button = form.querySelector('button');
const error = form.querySelector('.signup-error');
const thanks = document.querySelector('.thanks');

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
      form.hidden = true;
      thanks.hidden = false;
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
