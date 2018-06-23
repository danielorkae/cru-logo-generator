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

/**
 * Returns the tagline value
 */
function getTagline()
{
    if (tagline.value == "")
        return "campus";

    return tagline.value;
}

/**
 * Returns the file name to download by logo id param 
 * @param {*} logoId Logo id such as on html page
 */
function getFileNameByLogoId(logoId) 
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
 * Returns the document title
 */
function getPageTitle()
{
    return document.title;
}

/**
 * Setters
 */

/**
 * Set the page title by a tagline, respecting the pattern
 */
function setPageTitleByTagline(tagline)
{
    if(tagline != "" && tagline != "campus")
        return document.title = `Cru ${ toTitleCase(tagline) } Logo Generator`;
    
    document.title = "Cru Logo Generator";
}

/**
 * Change the history state and url by title and relative url parameters
 * @param {*} title Title by the new state
 * @param {*} url Relative url by the new state
 */
function setUrlByTagline(tagline)
{
    setPageTitleByTagline(getTagline());

    let url = "?";

    if(tagline != "" && tagline != "campus")
        url = `?tagline=${ getTagline().toLowerCase() }`;

    if (typeof (history.pushState) != "undefined") {
        let state = { Title: getPageTitle(), Url: url };
        history.pushState(state, state.Title, state.Url);
    }
}

/**
 * Set all logo taglines values
 * @param {*} tagline The value of the new logo taglines
 */
function setTaglines(tagline)
{
    Array.from(taglines).forEach(tag =>
    {
        tag.innerText = tagline;
    });
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
    let url = new URL(document.location.href);

    tagline.value = url.searchParams.get("tagline");

    setPageTitleByTagline(tagline.value);

    setTaglines(getTagline());
}

/**
 * Download the logo
 */
function download(_logoId)
{
    let _canvas = document.getElementsByTagName("canvas")[ 0 ];

    let _btn = document.createElement("a");
    _btn.href = _canvas.toDataURL("image/png");
    _btn.download = getFileNameByLogoId(_logoId);
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
function setUrlOnTimeout()
{
    if(counter > 0) 
        return counter--;

    clearInterval(interval);
    interval = null;
    resetCounter();

    setUrlByTagline(getTagline())
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

    setTaglines(getTagline());

    if(interval == null)
        interval = setInterval(setUrlOnTimeout, 100);
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

