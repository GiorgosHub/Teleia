/* runs before the page is drawn: entrance animations start from their first frame, the chosen theme is there at
   once (no flash), and the opening animation is shown only once per visit */
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") d.setAttribute("data-theme", t);
    else if (matchMedia("(prefers-color-scheme: dark)").matches) d.setAttribute("data-theme", "dark");
    if (sessionStorage.getItem("intro")) d.classList.add("seen");
    /* English chosen: keep the page hidden for the moment until the English texts are in, so the Greek never flashes */
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || (q !== "el" && localStorage.getItem("lang") === "en")) d.classList.add("i18n-wait");
  } catch (e) {}
})();
