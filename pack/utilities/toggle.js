const themeSwitch = document.querySelector('#switch');

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});