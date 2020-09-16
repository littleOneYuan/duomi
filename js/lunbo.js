function startAnimation(e, t) {
    return new Promise(n => {
        let i = NaN,
            s = NaN;
        const r = a => {
            try {
                isNaN(i) && (i = a);
                const o = (a - i) / e;
                if (o >= 1) return cancelAnimationFrame(s), void requestAnimationFrame(() => { n(1) });
                t(o), s = requestAnimationFrame(r)
            } catch (e) { alert(e.message) }
        };
        s = requestAnimationFrame(r)
    })
}

function lerp(e, t, n) { return n = Math.min(1, n), e + (t - e) * (n = Math.max(0, n)) }

function lerpRound(e, t, n) { return Math.round(lerp(e, t, n)) }

function map01(e, t, n) { return n = Math.max(e, n), ((n = Math.min(n, t)) - e) / (t - e) }

function easeInOutCubic(e) { return (e /= .5) < 1 ? .5 * Math.pow(e, 3) : .5 * (Math.pow(e - 2, 3) + 2) }

function easeOutCubic(e) { return Math.pow(e - 1, 3) + 1 }

function easeInOutSine(e) { return -(Math.cos(Math.PI * e) - 1) / 2 }

function easeOutSine(e) { return Math.sin(e * Math.PI / 2) }

function isMobile() { const e = navigator.userAgent; return /Mobi|Android/i.test(e) }

function isIOS() { return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) }
class BannerModel {
    constructor(e) {
        this.title = e.dataset.title, this.imageLoader = new Image, this.imageLoader.src = e.dataset.imgSrc, this.imageLoader.addEventListener("load", () => { this.onImgLoad.forEach(e => e()) }), this.imageLoader.addEventListener("error", () => { this.onImgError.forEach(e => e()) }), e.dataset.imgShrink ? (this.hasShrinkImage = !0, this.shrinkImageLoader = new Image, this.shrinkImageLoader.src = e.dataset.imgShrink) : this.hasShrinkImage = !1, e.dataset.titleImage ? (this.hasTitleImage = !0, this.titleImageLoader = new Image, this.titleImageLoader.src = e.dataset.titleImage) : this.hasTitleImage = !1, this.downloadLinks = [], this.pageLinks = [];
        const t = e.querySelectorAll(".download-links>div"); // android and ios download links
        for (let e = 0; e < t.length; e++) {
            const n = t.item(e);
            this.downloadLinks.push({ link: n.dataset.link, text: n.dataset.text, iosLink: n.dataset.iosLink })
        }
        this.onImgLoad = [], this.onImgError = []
    }
    addEventListener(e, t) {
        switch (e) {
            case "load":
                this.onImgLoad.push(t);
                break;
            case "error":
                this.onImgError.push(t)
        }
    }
    removeEventListener(e, t) {
        const n = (e, t) => {
            const n = e.findIndex(e => e === t);
            n >= 0 && e.splice(n, 1)
        };
        switch (e) {
            case "load":
                n(this.onImgLoad, t);
                break;
            case "error":
                n(this.onImgError, t)
        }
    }
}
class BannerItem {
    // 轮播图 img title 等添加进e
    constructor(e) { this.itemElement = document.createElement("div"), this.itemElement.classList.add("banner-item"), this.imgWrapper = document.createElement("div"), this.img = document.createElement("img"), this.imgShrink = document.createElement("img"), this.imgWrapper.appendChild(this.img), this.imgWrapper.appendChild(this.imgShrink), this.imgWrapper.classList.add("banner-img"), this.title = document.createElement("div"), this.title.classList.add("banner-title"), this.titleImage = document.createElement("img"), this.titleImage.classList.add("image-front"), this.titleImage.classList.add("image-shadow"), this.titleText = document.createElement("div"), this.title.appendChild(this.titleText), this.title.appendChild(this.titleImage), this.downloadLinkWrapper = document.createElement("div"), this.downloadLinkWrapper.classList.add("banner-link"), this.itemElement.appendChild(this.imgWrapper), this.itemElement.appendChild(this.title), this.itemElement.appendChild(this.downloadLinkWrapper), e.appendChild(this.itemElement), this.wrapper = e, this.onResize() }
    assignModel(e, t) {
            this.img.src = e.imageLoader.src, this.hasShrinkImg = e.hasShrinkImage, this.hasShrinkImg ? (this.imgShrink.src = e.shrinkImageLoader.src, this.imgShrink.style.removeProperty("display"), t && (this.imgShrink.style.opacity = "0")) : (this.imgShrink.src = "", this.imgShrink.style.display = "none"), e.hasTitleImage ? (this.titleImage.src = e.titleImageLoader.src, this.titleImage.style.removeProperty("display"), this.titleText.style.display = "none") : (this.titleImage.style.display = "none", this.titleText.style.removeProperty("display"), this.titleText.textContent = e.title);
            // 链接处理
            const n = this.downloadLinkWrapper.querySelectorAll(".banner-link-item");
            for (let t = 0; t < e.downloadLinks.length; t++) {
                let i;
                t < n.length ? i = n[t] : (i = document.createElement("a"), i.target = "_blank", i.classList.add("banner-link-item"), this.downloadLinkWrapper.appendChild(i)), i.innerText = e.downloadLinks[t].text, e.downloadLinks[t].iosLink ? (i.href = "", i.onclick = () => { isIOS() ? window.open(e.downloadLinks[t].iosLink) : window.open(e.downloadLinks[t].link) }) : (i.href = e.downloadLinks[t].link, i.onclick = () => {}), i.style.removeProperty("display")
            }
            for (let t = e.downloadLinks.length; t < n.length; t++) n[t].style.display = "none"
        }
        // dom隐藏
    hideDom() { this.itemElement.style.display = "none" }
    absolutePosition() { this.itemElement.style.removeProperty("display"), this.itemElement.style.position = "absolute", this.itemElement.style.margin = "0" }
    copyStyle(e) { this.itemElement.classList = e.itemElement.classList }
        // element尺寸控制
    onResize() { window.innerWidth > 767 ? this.imgWrapper.style.height = .33 * this.wrapper.clientWidth + "px" : this.imgWrapper.style.height = .63 * this.wrapper.clientWidth + "px" }
}
class BannerArrow {
    constructor(e) { this.arrowLeft = e.querySelector(".arrow-left"), this.arrowRight = e.querySelector(".arrow-right") }
        // 计算左右箭头距离顶部的距离
    setPosition(e) {
        const t = e.offsetTop + e.offsetHeight / 2; // 距离父级顶部内框的偏移量+自身垂直方向占用空间大小的一半
        this.arrowLeft.style.top = t - this.arrowLeft.offsetHeight / 2 + "px", this.arrowRight.style.top = t - this.arrowRight.offsetHeight / 2 + "px"
    }
}
class Banner {
    constructor(e, t, n) {
        this.bannerElements = [], this.shownBannerCount = e, this.centerIndex = Math.floor(e / 2) - 1 + e % 2, this.currentIndex = 0, this.bannerModels = t, this.wrapper = n;
        for (let e = 0; e < this.shownBannerCount + 1; e++) {
            const t = new BannerItem(n),
                i = Math.abs(e - this.centerIndex);
            // 为轮播到不同位置的banner-item赋上不同的属性
            e < this.shownBannerCount ? (this.bannerElements.push(t), t.itemElement.classList.add("item-" + i)) : this.lastBannerElements = t
        }
        this.refreshBanner(), this.currentState = "idle"
    }
    refreshBanner() { // 刷新banner
        for (let e = 0; e < this.shownBannerCount; e++) {
            let t = e - this.centerIndex + this.currentIndex;
            for (; t < 0;) t += this.bannerModels.length;
            const n = this.bannerModels[t % this.bannerModels.length];
            this.bannerElements[e].assignModel(n, e == this.centerIndex)
        }
        this.lastBannerElements.hideDom()
    }
    startMove(e) {
        if ("idle" !== this.currentState) return;
        const t = getComputedStyle(this.bannerElements[0].itemElement).width;
        this.shrinkWidth = parseInt(t.substr(0, t.length - 2), 10);
        const n = getComputedStyle(this.bannerElements[0].title);
        this.shrinkFontSize = parseInt(n.fontSize.substr(0, n.fontSize.length - 2), 10), this.shrinkTitleHeight = parseInt(n.height.substr(0, n.height.length - 2), 10);
        const i = getComputedStyle(this.bannerElements[this.centerIndex].itemElement).width;
        this.expandWidth = parseInt(i.substr(0, i.length - 2), 10);
        const s = getComputedStyle(this.bannerElements[this.centerIndex].title);
        this.expandFontSize = parseInt(s.fontSize.substr(0, s.fontSize.length - 2), 10), this.expandTitleHeight = parseInt(s.height.substr(0, s.height.length - 2), 10), this.lastBannerElements.absolutePosition(), this.lastBannerElements.copyStyle(this.bannerElements[0]), this.lastBannerElements.itemElement.style.width = this.shrinkWidth + "px", this.lastBannerElements.itemElement.style.opacity = "0", this.lastBannerElements.itemElement.style.top = "15px", this.lastBannerElements.imgWrapper.style.height = this.bannerElements[0].imgWrapper.style.height;
        const r = getComputedStyle(this.bannerElements[this.centerIndex].itemElement).marginLeft;
        let a, o;
        if (this.horizontalSpacing = parseFloat(r.substr(0, r.length - 2)), this.wrapper.style.height = this.wrapper.offsetHeight + "px", e) {
            this.currentState = "move-right";
            let e = this.currentIndex + 1;
            e >= this.bannerModels.length && (e -= this.bannerModels.length), this.nextModel = this.bannerModels[e], o = this.bannerElements[this.shownBannerCount - 1], a = (this.currentIndex + Math.floor(this.shownBannerCount / 2) + 1) % this.bannerModels.length;
            const t = this.wrapper.offsetWidth - this.bannerElements[this.shownBannerCount - 1].itemElement.offsetLeft - this.bannerElements[this.shownBannerCount - 1].itemElement.offsetWidth - this.shrinkWidth - this.horizontalSpacing;
            this.lastBannerElements.itemElement.style.right = t + "px"
        } else {
            this.currentState = "move-left";
            let e = this.currentIndex - 1;
            for (e < 0 && (e += this.bannerModels.length), this.nextModel = this.bannerModels[e], o = this.bannerElements[0], a = this.currentIndex - Math.floor(this.shownBannerCount / 2) - 1; a < 0;) a += this.bannerModels.length;
            const t = this.bannerElements[0].itemElement.offsetLeft - this.shrinkWidth - this.horizontalSpacing;
            this.lastBannerElements.itemElement.style.left = t + "px"
        }
        if (this.lastBannerElements.assignModel(this.bannerModels[a], !1), o.downloadLinkWrapper.style.display = "flex", o.downloadLinkWrapper.style.opacity = "0", window.innerWidth < 768) {
            o.title.style.fontSize = this.expandFontSize + "px", o.title.style.lineHeight = o.title.style.fontSize;
            const t = getComputedStyle(this.bannerElements[this.centerIndex].downloadLinkWrapper.lastElementChild);
            this.downloadFontSize = parseInt(t.fontSize.substr(0, t.fontSize.length - 2)), this.downloadMargin = parseInt(t.marginLeft.substr(0, t.marginLeft)), o.itemElement.style.marginRight = this.horizontalSpacing + "px", this.bannerElements[this.centerIndex].itemElement.style.marginLeft = "0", e || (o.itemElement.style.marginLeft = o.itemElement.style.marginRight, this.bannerElements[this.shownBannerCount - 1].itemElement.style.marginLeft = "0")
        }
    }
    updateMove(e) { if ("idle" === this.currentState) return; let t, n, i, s = 0; if (s = window.innerWidth < 768 ? "move-right" === this.currentState ? -this.shrinkWidth : this.shrinkWidth : "move-right" === this.currentState ? -this.shrinkWidth - this.horizontalSpacing : this.shrinkWidth + this.horizontalSpacing, "move-right" === this.currentState ? (t = this.bannerElements[0], n = this.bannerElements[this.shownBannerCount - 1], i = this.bannerElements[1]) : (t = this.bannerElements[this.shownBannerCount - 1], i = this.bannerElements[1], n = this.bannerElements[0]), this.lastBannerElements.itemElement.style.opacity = "" + e, this.lastBannerElements.itemElement.style.transform = `translate(${lerpRound(0, s, e)}px, 0)`, t.itemElement.style.opacity = "" + (1 - e), t.itemElement.style.transform = `translate(${lerpRound(0, s, e)}px)`, n.downloadLinkWrapper.style.opacity = "" + e, n.itemElement.style.transform = `translate(${lerpRound(0, s, e)}px, 0)`, n.itemElement.style.marginTop = lerpRound(15, 5, e) + "px", n.itemElement.style.flexBasis = lerpRound(this.shrinkWidth, this.expandWidth, e) + "px", n.title.style.lineHeight = lerpRound(this.shrinkTitleHeight, this.expandTitleHeight, e) + "px", n.title.style.height = n.title.style.lineHeight, i.downloadLinkWrapper.style.opacity = "" + (1 - e), i.itemElement.style.flexBasis = lerpRound(this.expandWidth, this.shrinkWidth, e) + "px", i.itemElement.style.transform = `translate(${lerpRound(0, s, e)}px, ${lerpRound(0, 10, e)}px)`, i.title.style.fontSize = lerpRound(this.expandFontSize, this.shrinkFontSize, e) + "px", i.title.style.lineHeight = lerpRound(this.expandTitleHeight, this.shrinkTitleHeight, e) + "px", i.title.style.height = i.title.style.lineHeight, n.hasShrinkImg && (n.imgShrink.style.opacity = "" + (1 - e)), i.hasShrinkImg && (i.imgShrink.style.opacity = "" + e), window.innerWidth < 768) { n.title.style.opacity = "" + e, n.title.style.width = n.itemElement.style.flexBasis, n.imgWrapper.style.boxShadow = `rgba(0, 0, 0, ${e}) 0 0 7px 3px`, n.downloadLinkWrapper.style.width = n.itemElement.style.flexBasis, n.downloadLinkWrapper.style.opacity = "" + e, i.title.style.opacity = "" + (1 - e), 100 * (1 - e) <= 0 ? (i.title.style.display = "none", i.downloadLinkWrapper.style.display = "none", i.itemElement.style.display = "none") : (i.title.style.width = i.itemElement.style.flexBasis, i.downloadLinkWrapper.style.width = i.itemElement.style.flexBasis), i.downloadLinkWrapper.style.opacity = "" + (1 - e), i.downloadLinkWrapper.querySelectorAll("a").forEach((t, n) => { t.style.fontSize = lerpRound(this.downloadFontSize, 0, e) + "px", n > 0 && (t.style.marginLeft = lerpRound(this.downloadMargin, 0, e) + "px") }), i.imgWrapper.style.boxShadow = `rgba(0, 0, 0, ${1 - e}) 0 0 7px 3px` } else n.title.style.fontSize = Math.round(lerpRound(this.shrinkFontSize, this.expandFontSize, e)) + "px" }
    endMove() { if ("idle" === this.currentState) return; let e, t, n = this.bannerElements[1]; "move-right" === this.currentState ? (e = this.bannerElements[0], t = this.bannerElements[this.shownBannerCount - 1], this.currentIndex += 1, this.currentIndex >= this.bannerModels.length && (this.currentIndex -= this.bannerModels.length)) : (e = this.bannerElements[this.shownBannerCount - 1], t = this.bannerElements[0], this.currentIndex -= 1, this.currentIndex < 0 && (this.currentIndex += this.bannerModels.length)), this.wrapper.style.removeProperty("height"), this.lastBannerElements.itemElement.style.removeProperty("transform"), this.lastBannerElements.itemElement.style.removeProperty("left"), this.lastBannerElements.itemElement.style.removeProperty("right"), e.itemElement.style.removeProperty("opacity"), e.itemElement.style.removeProperty("transform"), t.title.style.removeProperty("font-size"), t.title.style.removeProperty("line-height"), t.title.style.removeProperty("height"), t.downloadLinkWrapper.style.removeProperty("opacity"), t.itemElement.style.removeProperty("transform"), t.itemElement.style.removeProperty("flex-basis"), t.itemElement.style.removeProperty("margin-top"), t.downloadLinkWrapper.style.removeProperty("display"), n.downloadLinkWrapper.style.removeProperty("opacity"), n.title.style.removeProperty("font-size"), n.title.style.removeProperty("line-height"), n.title.style.removeProperty("height"), n.itemElement.style.removeProperty("flex-basis"), n.itemElement.style.removeProperty("transform"), t.imgShrink.style.removeProperty("opacity"), n.imgShrink.style.removeProperty("opacity"), window.innerWidth < 768 && (t.title.style.removeProperty("opacity"), t.title.style.removeProperty("width"), t.imgWrapper.style.removeProperty("box-shadow"), t.downloadLinkWrapper.style.removeProperty("width"), n.title.style.removeProperty("opacity"), n.title.style.removeProperty("width"), n.imgWrapper.style.removeProperty("box-shadow"), n.downloadLinkWrapper.style.removeProperty("width"), n.downloadLinkWrapper.querySelectorAll("a").forEach((e, t) => { e.style.removeProperty("font-size"), t > 0 && e.style.removeProperty("margin-left") }), n.title.style.removeProperty("display"), n.downloadLinkWrapper.style.removeProperty("display"), n.itemElement.style.removeProperty("display"), t.itemElement.style.removeProperty("margin-right"), n.itemElement.style.removeProperty("margin-left"), "move-left" === this.currentState && (t.itemElement.style.removeProperty("margin-left"), e.itemElement.style.removeProperty("margin-left"))), this.lastBannerElements.hideDom(), this.refreshBanner(), this.currentState = "idle" }
    onResize() { this.bannerElements.forEach(e => e.onResize()) }
}! function() {
    const e = document.querySelector(".banner-news");
    if (!e) return;
    const t = e.querySelector("#banner-data");
    if (!t) return;
    const n = !(!t.dataset.autoPlay || "true" !== t.dataset.autoPlay),
        i = parseFloat(t.dataset.playInterval),
        s = e.querySelectorAll("#banner-data>div"),
        r = e.querySelector("#banner-box>.banner-item-wrapper"),
        a = e.querySelector("#banner-box>.arrow-btn-wrapper");
    let l = -1;
    if (!(s && r && a)) return;
    const d = Array.from(s).map(e => new BannerModel(e)),
        h = new Banner(3, d, r),
        m = new BannerArrow(a),
        c = e => {
            if ("idle" !== h.currentState) return;
            h.startMove(e), h.updateMove(0), startAnimation(window.innerWidth < 768 ? 250 : 350, e => { window.innerWidth > 767 && (e = easeOutSine(e)), h.updateMove(e) }).then(() => { h.endMove() })
        };
    m.setPosition(h.bannerElements[0].imgWrapper), h.bannerElements[0].imgWrapper.addEventListener("mousedown", () => { c(!1), -1 !== l && clearInterval(l), l = setInterval(() => { c(!0) }, 1e3 * i) }), m.arrowLeft.addEventListener("mousedown", () => { c(!1), -1 !== l && clearInterval(l), l = setInterval(() => { c(!0) }, 1e3 * i) }), h.bannerElements[2].imgWrapper.addEventListener("mousedown", () => { c(!0), -1 !== l && clearInterval(l), l = setInterval(() => { c(!0) }, 1e3 * i) }), m.arrowRight.addEventListener("mousedown", () => { c(!0), -1 !== l && clearInterval(l), l = setInterval(() => { c(!0) }, 1e3 * i) }), n && (l = setInterval(() => { c(!0) }, 1e3 * i)), window.addEventListener("resize", () => { h.onResize(), m.setPosition(h.bannerElements[0].imgWrapper) });
    let y = -1;
    h.bannerElements[1].imgWrapper.addEventListener("touchstart", e => {
        let t = e.targetTouches[0];
        y = t.pageX
    }), h.bannerElements[1].imgWrapper.addEventListener("touchend", e => {
        if ("idle" !== h.currentState) return;
        let t = e.changedTouches[0].pageX - y < 0;
        c(t)
    })
}(),
function() {
    const e = document.querySelector("a[data-custom-download]");
    e && e.addEventListener("click", () => { isIOS() ? window.open(e.dataset.iosLink) : window.open(e.dataset.downloadLink) })
}(),
function() {
    const e = document.documentElement.lang,
        t = document.querySelector("#help-info-games");
    if (!t) return;
    const n = t.childElementCount,
        i = t.children;
    for (let t = 0; t < n; t++) {
        const n = i[t],
            s = document.createElement("img");
        s.src = n.getAttribute("data-icon"), s.alt = n.getAttribute("data-text"), s.title = n.getAttribute("data-text"), s.addEventListener("load", () => { s.style.height = s.width + "px" });
        const r = document.createElement("span");
        r.innerText = n.getAttribute("data-text"), r.title = r.innerText, console.log(n.getAttribute("data-link")), n.href = e ? `/${e}${n.getAttribute("data-link")}` : n.getAttribute("data-link"), n.appendChild(s), n.appendChild(r)
    }
}(),
function() {
    const e = document.querySelector(".page-content");
    if (!e || !e.dataset.hasOwnProperty("hrefColor")) return;
    const t = e.dataset.hrefColor;
    document.querySelectorAll(".page-content a").forEach(e => e.style.color = t)
}(), document.querySelectorAll("img.center").forEach(e => {
        const t = e.parentElement;
        t && (t.style.textAlign = "center")
    }),
    function() {
        const e = document.querySelector(".media-link-wrapper>img"),
            t = document.querySelector(".media-link-wrapper");
        if (null == e || null == t) return;
        const n = Array.from(t.querySelectorAll(".link"));
        let i = !1;
        t.addEventListener("pointerenter", () => { 0 !== n.length && (i || (i = !0, t.classList.add("selected"))) }), document.addEventListener("click", (function(n) {
            if (!i) return;
            let s = n || window.event,
                r = s.target;
            for (; r;) {
                if (r === e || r === t) return;
                r = r.parentNode
            }
            t.classList.remove("selected"), i = !1
        }))
    }(),
    function() {
        function e() {
            const e = document.querySelector(".language-wrapper");
            if (!e) return;
            let t = "idle";
            const n = document.querySelector(".language-wrapper .language-icon"),
                i = document.createElement("div");
            i.classList.add("language-mask"), i.style.position = "absolute", i.style.top = "0", i.style.left = "0", i.style.right = "0", i.style.bottom = "0", i.style.zIndex = "1500", i.style.display = "none", document.body.appendChild(i);
            const s = Array.from(e.querySelectorAll(".language-item"));
            if (!s || 0 === s.length) return;
            const r = s.findIndex(e => e.dataset.code && e.dataset.code === document.documentElement.lang);
            if (!s[r]) return t = "shown", void h(s[1]);
            s[r].classList.add("current");
            const a = document.createElement("div");
            a.classList.add("language-wrapper-mobile"), document.body.appendChild(a);
            const o = s.map(e => { const t = document.createElement("div"); return t.classList.add("mobile-language-item"), a.appendChild(t), t.textContent = e.textContent, t.dataset.code = e.dataset.code, t });

            function l(e, t) {
                const n = t * r;
                for (let t = 0; t < s.length; t++) {
                    const i = s[t];
                    t === r ? i.style.top = lerpRound(0, n, e) + "px" : i.style.opacity = "" + e
                }
            }

            function d(e, t) {
                const n = t * r;
                for (let t = 0; t < s.length; t++) {
                    const i = s[t];
                    t === r ? i.style.top = lerpRound(n, 0, e) + "px" : i.style.opacity = "" + (1 - e)
                }
            }

            function h(e) {
                if ("idle" === t) return;
                const n = window.location.href;
                window.location.href = n.replace("/" + document.documentElement.lang, "/" + e.dataset.code)
            }
            o[r].classList.add("current"), e.addEventListener("click", () => {
                isMobile() ? (t = "shown", a.classList.add("show"), i.style.display = "block", i.classList.add("mobile")) : "shown" !== t && requestAnimationFrame(() => {
                    const n = e.offsetWidth,
                        a = e.offsetHeight;
                    e.classList.add("selected"), s.forEach((e, t) => { e.style.position = "absolute", e.style.width = n + "px", e.style.padding = "0", e.style.lineHeight = a + "px", t !== r && (e.style.opacity = "0", e.style.top = a * t + "px", e.style.display = "block") }), startAnimation(150, e => { l(e = easeInOutSine(e), a) }).then(() => { l(1, a), i.style.display = "block", t = "shown" })
                })
            }), i.addEventListener("click", () => {
                isMobile() ? (t = "idle", a.classList.remove("show"), i.style.display = "none", i.classList.remove("mobile")) : "idle" !== t && requestAnimationFrame(() => {
                    t = "idle";
                    const a = e.offsetHeight;
                    e.classList.remove("selected"), n.style.display = "none", startAnimation(200, e => { d(e = easeInOutSine(e), a) }).then(() => { d(1, a), i.style.display = "none", s.forEach((e, t) => { e.style.removeProperty("position"), e.style.removeProperty("width"), e.style.removeProperty("padding"), e.style.removeProperty("line-height"), t !== r && (e.style.removeProperty("opacity"), e.style.removeProperty("top"), e.style.removeProperty("display"), n.style.removeProperty("display")) }) })
                })
            }), s.forEach(e => { e.addEventListener("click", () => h(e)) }), o.forEach(e => { e.addEventListener("click", () => h(e)) })
        }
        window.addEventListener("load", () => e())
    }(),
    function() {
        const e = document.querySelector("#navbar-btn"),
            t = document.querySelector(".wrapper");
        let n = !1;
        const i = document.querySelectorAll(".navigation-wrapper>a");
        if (!e) return;
        const s = document.createElement("div");
        s.id = "navigation-wrapper-slide";
        const r = document.createElement("div");
        r.classList.add("cancel-btn"), r.appendChild(document.createElement("span")), r.appendChild(document.createElement("span")), s.appendChild(r);
        const a = document.createElement("div");
        a.classList.add("nav-wrapper"), i.forEach(e => {
            const t = document.createElement("a");
            t.text = e.text, t.href = e.href, a.appendChild(t)
        }), s.appendChild(a), document.body.appendChild(s);
        const o = document.createElement("div");

        function l() {
            e.style.removeProperty("transform"), s.classList.remove("nav-in"), s.classList.add("nav-out"), t.classList.remove("nav-expand");
            const i = () => { s.style.display = "none", o.style.display = "none", s.classList.remove("nav-out"), s.removeEventListener("transitionend", i), console.log("end") };
            s.addEventListener("transitionend", i), n = !1
        }
        o.id = "navigation-slide-mask", document.body.appendChild(o), s.style.display = "none", o.style.display = "none", r.addEventListener("click", () => { l() }), o.addEventListener("click", () => { l() }), e.onclick = () => {
            n = !0;
            const i = window.innerWidth - function(e) {
                let t = e.offsetLeft,
                    n = e.offsetParent;
                for (; n;) t += n.offsetLeft, n = n.offsetParent;
                return t
            }(e) - e.offsetWidth / 2;
            e.style.transform = `translateX(${i}px)`, s.classList.add("nav-in"), s.style.removeProperty("display"), o.style.removeProperty("display"), t.classList.add("nav-expand")
        }, window.addEventListener("resize", () => { n && l() })
    }(), document.querySelector("#support-question-anchor") && Array.from(document.querySelectorAll(".question-expand")).forEach(e => {
        e.addEventListener("click", () => function(e) {
            e.classList.contains("expand") ? e.classList.remove("expand") : (e.classList.add("expand"), function(e) {
                if (_czc) {
                    const t = navigator.language || navigator.userLanguage;
                    _czc && _czc.push(["_trackEvent", "帮助", "查看", t + "|" + e, "", ""])
                }
            }(e.id))
        }(e))
    });