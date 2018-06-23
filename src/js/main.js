/**
 * Author: Daniel Lopes (https://github.com/danielorkae)
 * Date: 15/02/2018
 * Locale: Natal, Brazil.
 */

/**
 * Variables
 */
var tagline = document.getElementById("tagline");
var taglines = document.getElementsByClassName("tagline");
var downloadBtns = document.getElementsByClassName("download-btn");
var interval = null;
var counter = 0;
var downloadBtn = null;
var generatedLogoId = null;

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
 * Reset the donwload button to default
 */
function resetDownloadBtn()
{
    if(downloadBtn != null)
    {
        downloadBtn.innerHTML = "Gerar";
        downloadBtn.setAttribute("disabled", false);
        downloadBtn.classList.remove("disabled");
        downloadBtn = null;
    }
}

/**
 * Generate the canvas to download
 */
async function generateCanvas(logoId, link, backgroundColor = null)
{
    let _canvas = document.getElementsByTagName("canvas")[0];

    if(_canvas != null)
    {
        _canvas.remove();
        _canvas = null;
    }

    let _logo = document.createElement("img");
    _logo.src = "assets/img/" + logoId + ".png";

    let _tagline = document.createElement("p");
    _tagline.classList.add("tagline");
    _tagline.innerText = getTagline();

    _canvas = document.createElement("div");
    _canvas.id = "canvas-" + logoId;
    _canvas.classList.add("logo", "to-download", logoId);
    _canvas.appendChild(_logo);
    _canvas.appendChild(_tagline);

    document.body.appendChild(_canvas);
    document.body.appendChild(await html2canvas(_canvas, { "backgroundColor": backgroundColor }));
    _canvas.remove();
    _canvas = null;
}

/**
 * Download the logo
 */
function download(_logoId)
{
    let _canvas = document.getElementsByTagName("canvas")[0];

    let _btn = document.createElement("a");
    _btn.href = _canvas.toDataURL("image/png");
    _btn.download = getFileNameByLogoId(_logoId);
    document.body.appendChild(_btn);

    _btn.click();
    _btn.remove();
    _btn = null;

    _canvas.remove();
    _canvas = null;

    generatedLogoId = null;
    resetDownloadBtn();
}

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
        if(btn != downloadBtn)
        {
            resetDownloadBtn();
            downloadBtn = btn;
        }

        var _logoId = downloadBtn.getAttribute("data-logo-id");

        if(_logoId == generatedLogoId)
            return download(_logoId);

        downloadBtn.innerHTML = "Gerando..."
        downloadBtn.setAttribute("disabled", true);
        downloadBtn.classList.add("disabled");

        generateCanvas(_logoId)
            .then(() =>
            {
                generatedLogoId = _logoId;

                downloadBtn.innerHTML = "Baixar";
                downloadBtn.setAttribute("disabled", false);
                downloadBtn.classList.remove("disabled");
            }).catch(error =>
            {
                generatedLogoId = null;

                downloadBtn.innerHTML = "Erro!";
                downloadBtn.classList.add("btn-danger");
            })

    });
});

