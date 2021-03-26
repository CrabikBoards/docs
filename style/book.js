function addCss(fileName) {
  var head = document.head;
  var link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;

  head.appendChild(link);
}

addCss(
  "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap"
);

// addCss(
//   "https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap"
// );

// Force insert buttons to Amethyst API and Website

var btnFelid = document.getElementsByClassName("right-buttons")[0];

var btn = document.createElement("A");
btn.href = "https://amperka.ru";
btn.className = "am-btns";
btn.innerHTML = "<img src=\"https://docs.crabik.ru/images/amperka-logo.svg\" class=\"center-amperka-logo\" alt=\"Logo\"/>"; // Insert text
btnFelid.appendChild(btn);

// var btn2 = document.createElement("A");
// btn2.href = "https://amethyst.rs/";
// btn2.className = "am-btns";
// btn2.innerHTML = "Amethyst Website"; // Insert text
// btnFelid.appendChild(btn2);
