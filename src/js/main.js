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
let interval = null;
let counter = 0;

/**
 * Getters
 */

function getTagline()
{
    if (tagline.value == "")
        return "campus";

    return tagline.value;
}

function getFileName(logoId) 
{
    switch (logoId)
    {
        case "colored":
            return `Logo Cru ${toTitleCase(getTagline())} - Colorido.png`;
        case "grayscale":
            return `Logo Cru ${toTitleCase(getTagline())} - Escala de cinza.png`;
        case "black-bg":
            return `Logo Cru ${toTitleCase(getTagline())} - Reverso.png`;
        case "black":
            return `Logo Cru ${toTitleCase(getTagline())} - Preto sólido.png`;
        case "white":
            return `Logo Cru ${toTitleCase(getTagline())} - Branco sólido.png`;
        default:
            return `Logo Cru ${toTitleCase(getTagline())}.png`;
    }
}

/**
 * Helpers
 */

/**
 * Transform a string to Title Case
 */
function toTitleCase(s)
{
    return s.replace(/\w\S*/g, (t) => { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); });
}

/**
 * Functions
 */

/**
 * Execute on page is loaded
 */
function onLoad()
{

}

/**
 * Download the logo
 */
function download(_logoId)
{
    let _canvas = document.getElementsByTagName("canvas")[ 0 ];

    let _btn = document.createElement("a");
    _btn.href = _canvas.toDataURL("image/png");
    _btn.download = getFileName(_logoId);
    document.body.appendChild(_btn);

    _btn.click();
    _btn.remove();
    _btn = null;

    _canvas.remove();
    _canvas = null;
}

/**
 * Count and change url on timeout
 */
function changeUrlOnTimeout()
{
    if(counter > 0) 
        return counter--;

    clearInterval(interval);
    interval = null;
    resetCounter();

    if(tagline != "")
        changeUrl(
            `Cru ${ toTitleCase(getTagline()) } Logo Generator`, 
            `?tagline=${ getTagline().toLowerCase() }`
        )
}

/**
 * Change the history state and url by title and relative url parameters
 * @param {*} title Title by the new state
 * @param {*} url Relative url by the new state
 */
function changeUrl(title, url)
{
    if (typeof (history.pushState) != "undefined") {
        let state = { Title: title, Url: url };
        history.pushState(state, state.Title, state.Url);
        document.title = title;
    }
}

/**
 * Reset the counter to the default value
 */
function resetCounter() 
{
    counter = 5;
}

/**
 * Generate the canvas to download
 */
async function generateCanvas(logoId, link, backgroundColor = null)
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
    document.body.appendChild(await html2canvas(_canvas, { "backgroundColor": backgroundColor }));
    _canvas.remove();
    _canvas = null;
};

/**
 * Listeners
 */

/**
 * Listen to the entry of taglines and edit in the logos.
 */
tagline.addEventListener("keyup", () =>
{
    resetCounter();

    Array.from(taglines).forEach(tag =>
    {
        tag.innerText = getTagline();
    });

    if(interval == null)
        interval = setInterval(changeUrlOnTimeout, 100);
});

/**
 * Listen to the download buttons and generate the logo for download.
 */
Array.from(downloadBtns).forEach(btn =>
{
    btn.addEventListener("click", async () =>
    {
        var _logoId = btn.getAttribute("data-logo-id");


        generateCanvas(_logoId)
            .then(() =>
            {
                download(_logoId);
            }).catch(() =>
            {
                alert("Eita, abençoado. Não deu certo pra gerar a imagem...");
            })

    });
});

