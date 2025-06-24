document.querySelectorAll('.cmd-list li').forEach(item => {
  item.addEventListener('click', () => {
    navigator.clipboard.writeText(item.textContent);
    item.textContent += " ✅";
    item.style.color = "green";
    setTimeout(() => {
      item.style.color = "";
      item.textContent = item.textContent.replace(" ✅", "");
    }, 1200);
  });
});
