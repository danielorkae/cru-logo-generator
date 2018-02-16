/**
 * Author: Daniel Lopes (https://github.com/danielorkae)
 * Date: 15/02/2018
 * Locale: Natal, Brazil.
 */

/**
 * Variables
 */
let tagline = document.getElementById("tagline");
let taglines = document.getElementsByClassName("tagline");
let downloadBtns = document.getElementsByClassName("download-btn");

/**
 * Functions
 */

let download = (logoId, link) =>
{
    let _canvas = document.getElementsByTagName("canvas")[0];
    console.log(_canvas);
    link.href = _canvas.toDataURL();
    link.download = logoId + ".png";
};

let generateCanvas = (logoId, link) =>
{
    let _logo = document.createElement("img");
    _logo.src = "assets/img/" + logoId + ".png";

    let _tagline = document.createElement("p");
    _tagline.classList.add("tagline");
    _tagline.innerText = tagline.value;

    let _canvas = document.createElement("div");
    _canvas.id = "canvas";
    _canvas.classList.add("logo", "to-download", logoId);
    _canvas.appendChild(_logo);
    _canvas.appendChild(_tagline);

    document.body.appendChild(_canvas);

    html2canvas(_canvas).then((canvas) =>
    {
        _canvas.remove();

        canvas.id = "canvas";
        canvas.classList.add("collapse");
        document.body.appendChild(canvas);
        download(logoId, link);
    });
};

/**
 * Listen to the entry of taglines and edit in the logos.
 */
tagline.addEventListener("keyup", (event) =>
{
    Array.from(taglines).forEach(tag =>
    {
        tag.innerText = tagline.value;
    });
});

/**
 * Listen to the download buttons and generate the logo for download.
 */
Array.from(downloadBtns).forEach(btn =>
{
    btn.addEventListener("click", () =>
    {
        let logoId = btn.getAttribute("data-logo-id");
        generateCanvas(logoId, this);
    });
});

