const initLaunchTimer = () => {
  const timerContainer = document.getElementById('launch-timer');
  if (!timerContainer) return;

  const deadlineStr = timerContainer.dataset.deadline;
  if (!deadlineStr) return;

  const deadline = new Date(deadlineStr).getTime();

  const update = () => {
    const now = new Date().getTime();
    const distance = deadline - now;

    if (distance < 0) {
      timerContainer.innerHTML = "<h3>Released!</h3>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.innerText = days.toString().padStart(2, '0');
    if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
    if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
    if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
  };

  update();
  const interval = setInterval(update, 1000);

  // Clean up on page change (Astro transitions)
  document.addEventListener('astro:before-preparation', () => clearInterval(interval), { once: true });
};

document.addEventListener('astro:page-load', initLaunchTimer);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLaunchTimer, { once: true });
} else {
  initLaunchTimer();
}
