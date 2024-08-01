export default function dropdownMenu(button, dropdown) {
  const toggleDropdown = function () {
    dropdown.classList.toggle("show");
  };

  button.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdown();
  });

  //exit drop down on outside clicks
  document.documentElement.addEventListener("click", function () {
    if (dropdown.classList.contains("show")) {
      toggleDropdown();
    }
  });
}
