// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Book 1</li><li class="chapter-item expanded "><a href="book-1/chapter-1.html"><strong aria-hidden="true">1.</strong> Chapter 1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="book-1/chapter-1/chapter-1.1.html"><strong aria-hidden="true">1.1.</strong> Chapter 1.1</a></li><li class="chapter-item expanded "><a href="book-1/chapter-1/chapter-1.2.html"><strong aria-hidden="true">1.2.</strong> Chapter 1.2</a></li></ol></li><li class="chapter-item expanded "><a href="book-1/chapter-2/2.html"><strong aria-hidden="true">2.</strong> Chapter 2</a></li><li class="chapter-item expanded affix "><li class="part-title">Book 2</li><li class="chapter-item expanded "><a href="book-2/chapter-1.html"><strong aria-hidden="true">3.</strong> Chapter 1</a></li><li class="chapter-item expanded "><a href="book-2/chapter-2.html"><strong aria-hidden="true">4.</strong> Chapter 2</a></li><li class="chapter-item expanded affix "><li class="part-title">Syntax Highlighting</li><li class="chapter-item expanded "><a href="syntax-highlighting/rust.html"><strong aria-hidden="true">5.</strong> Rust</a></li><li class="chapter-item expanded "><a href="syntax-highlighting/go.html"><strong aria-hidden="true">6.</strong> Go</a></li><li class="chapter-item expanded "><a href="syntax-highlighting/javascript.html"><strong aria-hidden="true">7.</strong> Javascript</a></li><li class="chapter-item expanded "><a href="syntax-highlighting/solidity.html"><strong aria-hidden="true">8.</strong> Solidity</a></li><li class="chapter-item expanded affix "><li class="part-title">Mathjax</li><li class="chapter-item expanded "><a href="mathjax/derivatives.html"><strong aria-hidden="true">9.</strong> Derivatives</a></li><li class="chapter-item expanded "><a href="mathjax/integrals.html"><strong aria-hidden="true">10.</strong> Integrals</a></li><li class="chapter-item expanded affix "><li class="part-title">GitHub Pages</li><li class="chapter-item expanded "><a href="github-pages/hosting.html"><strong aria-hidden="true">11.</strong> Hosting</a></li><li class="chapter-item expanded affix "><li class="part-title">Hint Boxes</li><li class="chapter-item expanded "><a href="hint-boxes/types.html"><strong aria-hidden="true">12.</strong> Types</a></li><li class="chapter-item expanded affix "><li class="part-title">Tabs</li><li class="chapter-item expanded "><a href="tabs/raw-html-javascript.html"><strong aria-hidden="true">13.</strong> Raw HTML Javascript</a></li><li class="chapter-item expanded "><a href="tabs/raw-html-css.html"><strong aria-hidden="true">14.</strong> Raw HTML CSS</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
