// Enable smooth scroll for navigation links
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    const targetID = link.getAttribute('href');
    const targetSection = document.querySelector(targetID);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'  // Optional: aligns the top of the section
      });
    }
  });
});
