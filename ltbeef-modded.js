function isPageDev() {
    return localStorage.getItem("dev") ? "dev" : ""
}

function isButtonDev() {
    return localStorage.getItem("dev") ? "" : "unchecked"
}

function removeExtension(n) {
    chrome.management.uninstall(n)
}

function blobToDataURL(n) {
    return new Promise(((t, e) => {
        var i = new FileReader;
        i.onload = function(n) {
            t(n.target.result)
        }, i.onerror = function(n) {
            e(i.error)
        }, i.onabort = function(n) {
            e(new Error("Read aborted"))
        }, i.readAsDataURL(n)
    }))
}
async function getIconFromExtension(n) {
    if (!n) return "";
    var t = await fetch("https://chromewebstore.google.com/detail/" + n),
        e = await t.text(),
        i = (new DOMParser).parseFromString(e, "text/html");
    if (!i.querySelector("img.e-f-s[src]")) return "";
    var o = i.querySelector("img.e-f-s[src]").src,
        r = await fetch(o);
    return await blobToDataURL(await r.blob())
}

function toggleExtension(n, t) {
    n.hasAttribute("unchecked") ? chrome.management.setEnabled(t, !0) : chrome.management.setEnabled(t, !1)
}

function toggle(n) {
    n.hasAttribute("unchecked") ? n.removeAttribute("unchecked") : n.setAttribute("unchecked", "")
}

function togglePress(n, t) {
    "down" == t ? n.children[1].children[0].children[0].setAttribute("open", "") : setTimeout((function() {
        n.children[1].children[0].children[0].style.display = "none", n.children[1].children[0].children[0].removeAttribute("open"), n.children[1].children[0].children[0].style.display = "initial"
    }), 80)
}

function devMode() {
    document.body.hasAttribute("dev") ? (document.body.removeAttribute("dev"), localStorage.removeItem("dev")) : (document.body.setAttribute("dev", ""), localStorage.setItem("dev", "true"))
}

function addExtension(n) {
    var t = document.getElementById("items"),
        e = document.createElement("div");
    e.className = "item", e.setAttribute("data-id", n.id), n.managed && e.setAttribute("managed", "");
    var i = document.createElement("div");
    i.className = "item-main";
    var o = document.createElement("div");
    o.className = "item-img-wrapper";
    var r = document.createElement("img");
    r.className = "item-img", r.src = n.logo;
    var a = document.createElement("div");
    a.className = "item-img-source", a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24" class="item-img-source-icon"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" style="fill: currentColor"></path></svg>', o.appendChild(r), o.appendChild(a), i.appendChild(o);
    var d = document.createElement("div");
    d.className = "item-content";
    var l = document.createElement("div");
    l.className = "item-title-and-version";
    var s = document.createElement("div");
    s.className = "item-title", s.innerText = n.title;
    var m = document.createElement("div");
    m.className = "item-version", m.innerText = n.version, l.appendChild(s), l.appendChild(m), d.appendChild(l);
    var c = document.createElement("div");
    c.className = "item-description-overflow";
    var p = document.createElement("div");
    p.className = "item-description", p.innerText = n.description, c.appendChild(p), d.appendChild(c);
    var g = document.createElement("div");
    g.className = "item-id", g.innerText = "ID: " + n.id, d.appendChild(g), i.appendChild(d), e.appendChild(i);
    var h = document.createElement("div");
    h.className = "item-buttons";
    var v = document.createElement("div");
    v.className = "item-toggle", v.setAttribute("onclick", "toggleExtension(this, '" + n.id + "');toggle(this)"), v.setAttribute("onmousedown", "togglePress(this, 'down')"), v.setAttribute("onmouseup", "togglePress(this, 'up')"), n.enabled || v.setAttribute("unchecked", "");
    var x = document.createElement("div");
    x.className = "item-bar";
    var u = document.createElement("div");
    u.className = "item-knob";
    var b = document.createElement("div");
    b.className = "item-ripple";
    var f = document.createElement("div");
    f.className = "ripple", b.appendChild(f), u.appendChild(b), v.appendChild(x), v.appendChild(u), h.appendChild(v), e.appendChild(h), t.appendChild(e)
}
async function getExtensions() {
    chrome.management.getAll((async function(n) {
        for (let t in n) n[t].isApp || addExtension({
            title: n[t].name,
            version: n[t].version,
            description: n[t].description,
            id: n[t].id,
            logo: "",
            managed: "admin" == n[t].installType,
            enabled: n[t].enabled
        })
    })), setTimeout((function() {
        setIcons()
    }), 100)
}
async function setIcons() {
    var n = document.querySelectorAll(".items .item");
    for (let t in n) try {
        n[t].querySelector(".item-main .item-img-wrapper .item-img").src = await getIconFromExtension(n[t].dataset.id)
    } catch {}
}
document.documentElement.innerHTML = "<html><head><link rel=\"icon\" href=\"data:image/svg+xml,<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'><path fill='white' d='M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z'></path></svg>\">\n<title>Ingot</title>\n</head>\n<body " + isPageDev() + '>\n<div class="nav">\n<div class="nav-left">\n<div class="nav-title">Ingot</div>\n<div class="nav-right">\n<div class="nav-dev">Developer mode</div>\n<div ' + isButtonDev() + ' class="item-toggle item-toggle-dev" id="toggle" onclick="toggle(this);devMode()" onmousedown="togglePress(this, \'down\')" onmouseup="togglePress(this, \'up\')">\n<div class="item-bar"></div>\n<div class="item-knob">\n<div class="item-ripple">\n<div class="ripple"></div>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n\n<div class="items-main">\n<div class="items" id="items">\n<div class="patched">Error: This may have been patched</div>\n<div class="wrongpage">You are not on the correct page.<br>To use Ingot click the button below to redirect and run the bookmarklet again.<div class="item-left-buttons" style="justify-content: center; margin: 20px;">\n<div class="item-left-button" onclick="window.location=\'https://bypassi-is-awesome.vercel.app/misc/extensions.html\'">Redirect</div>\n</div></div>\n</div>\n</div>\n\n<style>\n@import url(\'https://fonts.googleapis.com/css2?family=Roboto&display=swap\');\n\n@import url(\'https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap\');\n\n* {\n\tfont-family: "Roboto";\n}\n\n:root {\n\tcolor-scheme: dark;\n}\n\nbody {\n\tbackground: #202124;\n\tmargin: 0;\n\tpadding: 0;\n}\n\n.nav {\n\twidth: 100%;\n\theight: 55px;\n\tbackground: #292a2d;\n\tborder-bottom: 1px solid rgba(255, 255, 255, .1);\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n\tleft: 0;\n\tz-index: 9;\n}\n\n.nav-left {\n\talign-items: center;\n\tbox-sizing: border-box;\n\tdisplay: flex;\n\tpadding-inline-start: calc(12px + 6px);\n\theight: 55px;\n}\n\n.nav-right {\n\tposition: absolute;\n\tright: 0;\n\tleft: 0;\n\tdisplay: flex;\n\tjustify-content: flex-end;\n}\n\n.nav-dev {\n\tcolor: rgb(154, 160, 166);\n\tfont-size: 13px;\n\tmargin-inline-end: calc(16px + 30px);\n\tmargin-bottom: 3px;\n}\n\n.item-toggle-dev {\n\ttransform: translateX(-30px);\n}\n\n.nav-title {\n\tcolor: rgb(232, 234, 237);\n\tfont-size: 22px;\n\tletter-spacing: .25px;\n\tline-height: normal;\n\tmargin-inline-start: 6px;\n\tpadding-inline-end: 12px;\n\tfont-weight: 500;\n}\n\n.items-main {\n\tmin-width: 400px;\n\tpadding: 24px 60px 64px;\n\tmargin-top: 57px;\n}\n\n.items {\n\tdisplay: grid;\n\tgrid-column-gap: 12px;\n\tgrid-row-gap: 12px;\n\tgrid-template-columns: repeat(auto-fill,400px);\n\tjustify-content: center;\n\tmargin: auto;\n/*max-width: calc(400px * 3 + 12pz * 3);*/;\n}\n\n.item {\n\theight: 160px;\n\twidth: 400px;\n\tbackground: #292a2d;\n\tborder-radius: 8px;\n\tbox-shadow: rgba(0, 0, 0, .3) 0 1px 2px 0, rgba(0, 0, 0, .15) 0 2px 6px 2px;\n/*transition: height .3s cubic-bezier(.25,.1,.25,1);*/;\n}\n\n.item-main {\n\tdisplay: flex;\n\tflex: 1;\n\tmin-height: 0;\n\tpadding: 16px 20px;\n\theight: 80px;\n}\n\n.item-img-wrapper {\n\talign-self: flex-start;\n\tdisplay: flex;\n\tpadding: 6px;\n\tposition: relative;\n}\n\n.item-img {\n\theight: 36px;\n\twidth: 36px;\n\tborder-radius: 6px;\n\tbackground: #202124;\n\ttext-indent: -10000px;\n}\n\n.item-img-source {\n\talign-items: center;\n\tbackground: #f1592b;\n\tborder-radius: 50%;\n\tbox-shadow: 0 1px 1px 0 rgb(0 0 0 / 22%), 0 2px 2px 0 rgb(0 0 0 / 12%);\n\tdisplay: flex;\n\theight: 22px;\n\tjustify-content: center;\n\twidth: 22px;\n\tmargin-inline-start: 24px;\n\tmargin-top: 24px;\n\tposition: absolute;\n\tdisplay: none;\n}\n\n.item[managed] .item-img-source {\n\tdisplay: flex;\n}\n\n.item-img-source-icon {\n\tpointer-events: none;\n\tdisplay: block;\n\theight: 16px;\n\twidth: 16px;\n\tcolor: white;\n}\n\n.item-content {\n\tdisplay: flex;\n\tflex: 1;\n\tflex-direction: column;\n\tmargin-inline-start: 24px;\n\twidth: 288px;\n\toverflow: hidden;\n}\n\n.item-title-and-version {\n\tdisplay: flex;\n\talign-items: center;\n\tflex-direction: row;\n}\n\n.item-title {\n\tmargin-inline-end: 8px;\n\tcolor: rgb(232, 234, 237);\n\twhite-space: nowrap;\n\tmargin-bottom: 4px;\n\tfont-size: 13px;\n\tmargin-top: 2px;\n\ttext-overflow: ellipsis;\n\toverflow: hidden;\n}\n\n.item-version {\n\tcolor: rgb(154, 160, 166);\n\tfont-size: 13px;\n\tmargin-bottom: 4px;\n\tdisplay: none;\n}\n\n.item-description-overflow {\n\theight: 84px;\n\toverflow: hidden;\n}\n\n.item-description {\n\tcolor: rgb(154, 160, 166);\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tflex: 1;\n\tfont-size: 13px;\n\tline-height: 20.02px;\n\tmargin-top: 3px;\n}\n\n.item-id {\n\tcolor: rgb(154, 160, 166);\n\tfont-size: 13px;\n\tmargin-top: 5px;\n\tdisplay: none;\n}\n\n.item-buttons {\n\theight: 48px;\n\tdisplay: flex;\n\tflex-direction: row;\n\talign-items: center;\n\tjustify-content: flex-end;\n\tpadding-right: 38px;\n\tpadding-bottom: 8px;\n\tpadding-top: 8px;\n\tbox-sizing: border-box;\n}\n\n.item-left-buttons {\n\tdisplay: flex;\n\tflex-direction: row;\n\talign-items: center;\n\tflex: 1;\n\tflex-basis: 1e-9px;\n}\n\n.item-left-button {\n\tborder: 1px solid rgb(95, 99, 104);\n\talign-items: center;\n\tborder-radius: 4px;\n\tbox-sizing: border-box;\n\tcolor: rgb(138, 180, 248);\n\tcursor: pointer;\n\tdisplay: inline-flex;\n\tfont-weight: 500;\n\theight: 32px;\n\tjustify-content: center;\n\tmin-width: 5.14em;\n\toverflow: hidden;\n\tpadding: 8px 16px;\n\tuser-select: none;\n\tmargin-inline-start: 8px;\n\tfont-size: 13px;\n\tline-height: 20.02px;\n}\n\n.item-left-button:hover {\n\tbackground: rgba(138, 180, 248, 0.08);\n}\n\n.item-left-button:active {\n\tbackground: rgba(138, 180, 248, 0.25);\n}\n\n.item-toggle {\n\tposition: relative;\n\tcursor: pointer;\n}\n\n.item-toggle[unchecked] .item-bar {\n\tbackground: rgb(154, 160, 166);\n\topacity: 1;\n}\n\n.item-toggle[unchecked] .item-knob {\n\tbackground: rgb(218, 220, 224);\n\ttransform: initial;\n}\n\n.item-bar {\n\tbackground: rgb(138, 180, 248);\n\tborder-radius: 8px;\n\theight: 12px;\n\tleft: 3px;\n\tposition: absolute;\n\ttop: 2px;\n\ttransition: background-color linear 80ms;\n\twidth: 28px;\n\topacity: 0.5;\n}\n\n.item-knob {\n\tbackground: rgb(138, 180, 248);\n\ttransform: translate3d(18px, 0, 0);\n\tborder-radius: 50%;\n\tdisplay: block;\n\theight: 16px;\n\tposition: relative;\n\ttransition: transform linear 80ms, background-color linear 80ms;\n\twidth: 16px;\n\tbox-shadow: 0 1px 3px 0 rgb(0 0 0 / 40%);\n}\n\n.item-ripple {\n\tcolor: rgb(218, 220, 224);\n\theight: 40px;\n\tleft: 50%;\n\toutline: none;\n\tpointer-events: none;\n\tposition: absolute;\n\ttop: 50%;\n\ttransform: translate(-50%, -50%);\n\ttransition: color linear 80ms;\n\twidth: 40px;\n}\n\n.ripple {\n\theight: 40px;\n\twidth: 40px;\n\tborder-radius: 50%;\n\tbackground-color: currentcolor;\n\tleft: 0;\n\topacity: 0.25;\n\tpointer-events: none;\n\tposition: absolute;\n\twill-change: height, transform, width;\n\ttransform: scaleX(0) scaleY(0);\n\ttransition: transform linear 80ms;\n}\n\n.ripple[open] {\n\ttransform: initial;\n}\n\nbody[dev] .item {\n\theight: 208px;\n}\n\nbody[dev] .item-main {\n\theight: 125px;\n}\n\nbody[dev] .item-version, body[dev] .item-id {\n\tdisplay: initial;\n}\n\n.patched, .wrongpage {\n\tcolor: rgb(154, 160, 166);\n\tfont-size: 15.99px;\n\tfont-weight: 500;\n\tmargin-top: 80px;\n\ttext-align: center;\n\tdisplay: none;\n}\n\n.items[patched], .items[wrongpage] {\n\tgrid-template-columns: initial;\n}\n\n.items[patched] .patched {\n\tdisplay: initial;\n}\n\n.items[wrongpage] .wrongpage {\n\tdisplay: flow-root;\n}\n</style>\n</body>\n</html>', window.location.toString().startsWith("https://bypassi-is-awesome.vercel.app/misc/extensions.html") ? chrome.management ? getExtensions() : document.getElementById("items").setAttribute("patched", "") : document.getElementById("items").setAttribute("wrongpage", "");