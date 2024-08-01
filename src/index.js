//drop down menu
import dropdownMenu from "./dropdownMenu";
import "./styles.css";

const hmaBurgerButton = document.querySelector(".hamb");
const menuItems = document.querySelector(".menuItems");
dropdownMenu(hmaBurgerButton, menuItems);

//carousel.js
const slidesContainer = document.querySelector(".slidesContainer");
const allSlidesArray = document.querySelectorAll(".slide");
const buttonRight = document.querySelector(".right");
const buttonLeft = document.querySelector(".left");
const navigationPannel = document.querySelector(".navigation");
const allPlacementIndicatorsArray = document.querySelectorAll(
  ".placementIndicator",
);

let slideIndex = 0;

const moveRight = function () {
  slideIndex++;
  if (slideIndex >= allSlidesArray.length) {
    slideIndex = 0;
  }
  slidesContainer.style.transform = `translateX(${-slideIndex * 400}px)`;
};

const moveLeft = function () {
  slideIndex--;
  if (slideIndex < 0) {
    slideIndex = allSlidesArray.length - 1;
  }
  slidesContainer.style.transform = `translateX(${-slideIndex * 400}px)`;
};

const setPlacementIndicator = function () {
  allPlacementIndicatorsArray.forEach(function (item) {
    item.classList.remove("current");
  });
  allPlacementIndicatorsArray[slideIndex].classList.add("current");
};

buttonRight.addEventListener("click", () => {
  moveRight();
  setPlacementIndicator();
});

buttonLeft.addEventListener("click", () => {
  moveLeft();
  setPlacementIndicator();
});

navigationPannel.addEventListener("click", (e) => {
  if (e.target === navigationPannel) {
    return;
  }
  slideIndex = [...allPlacementIndicatorsArray].indexOf(e.target);
  setPlacementIndicator();
  slidesContainer.style.transform = `translateX(${-slideIndex * 400}px)`;
});

setInterval(function () {
  moveRight();
  setPlacementIndicator();
}, 5000);
