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
 * Getters
 */

function getTagline()
{
    if (tagline.value == "")
        return "campus";

    return tagline.value;
}

/**
 * Functions
 */

/**
 * Download the logo
 */
function download(logoId, link)
{
    let _canvas = document.getElementsByTagName("canvas")[0];
};

/**
 * Generate the canvas to download
 */
async function generateCanvas(logoId, link)
{
    let _logo = document.createElement("img");
    _logo.src = "assets/img/" + logoId + ".png";

    let _tagline = document.createElement("p");
    _tagline.classList.add("tagline");
    _tagline.innerText = getTagline();

    let _canvas = document.createElement("div");
    _canvas.id = "canvas-" + logoId;
    _canvas.classList.add("logo", "to-download", logoId);
    _canvas.appendChild(_logo);
    _canvas.appendChild(_tagline);

    document.body.appendChild(_canvas);
    document.body.appendChild(await html2canvas(_canvas));
    _canvas.remove();
    _canvas = null;
};

/**
 * Listeners
 */

/**
 * Listen to the entry of taglines and edit in the logos.
 */
tagline.addEventListener("keyup", (event) =>
{
    Array.from(taglines).forEach(tag =>
    {
        tag.innerText = getTagline();
    });
});

/**
 * Listen to the download buttons and generate the logo for download.
 */
Array.from(downloadBtns).forEach(btn =>
{
    btn.addEventListener("click", async () =>
    {
        let _logoId = btn.getAttribute("data-logo-id");

        await generateCanvas(_logoId);
        let _canvas = document.getElementsByTagName("canvas")[0];

        window.open(_canvas.toDataURL("image/png"), "_blank");
        _canvas.remove();
        _canvas = null;
    });
});

