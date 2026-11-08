// 2) المنيو: تمييز القسم الحالي + قائمة الموبايل
function initMenu() {
  const links = [...document.querySelectorAll("#links a")];
  const burger = document.getElementById("burger");
  const list = document.getElementById("links");

  burger.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  links.forEach(a => a.addEventListener("click", () => {
    list.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  }));

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => {
    const sec = document.querySelector(a.getAttribute("href"));
    if (sec) io.observe(sec);
  });
}

// 3) نسخ الهاتف / الإيميل
function initCopy() {
  const toast = document.getElementById("toast");
  let timer;
  document.querySelectorAll(".copy, .demo-copy").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        toast.textContent = "Copied: " + btn.dataset.copy;
      } catch { toast.textContent = "Copy failed"; }
      toast.classList.add("show");
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove("show"), 2000);
    });
  });
}

// 4) Slideshow
function initSlider() {
  const root = document.getElementById("slideshow");
  const items = [...root.querySelectorAll(".ss-item")];
  const dotsBox = root.querySelector(".ss-dots");
  let cur = 0, timer;
  // Each photo: blurred copy fills the sides so any image size shows in full.
  // If the file name's extension is different (png, jpeg, webp...), try the others automatically.
  const exts = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP", "jfif"];
  items.forEach(el => {
    const img = el.querySelector("img");
    const base = img.getAttribute("src").replace(/\.[^./]+$/, "");
    let tried = 0;
    const setBg = () => el.style.setProperty("--bg", `url("${img.currentSrc || img.src}")`);
    img.addEventListener("load", setBg);
    img.addEventListener("error", () => {
      if (tried < exts.length) img.src = base + "." + exts[tried++];
      else { el.classList.add("missing"); img.removeAttribute("src"); console.warn("Slideshow image not found:", base); }
    });
    if (img.complete) { img.naturalWidth ? setBg() : img.dispatchEvent(new Event("error")); }
  });

  const dots = items.map((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    b.addEventListener("click", () => { show(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  function show(n) {
    cur = (n + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle("active", i === cur));
    dots.forEach((d, i) => d.classList.toggle("on", i === cur));
  }
  const next = () => show(cur + 1), prev = () => show(cur - 1);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function start() { if (!reduce) timer = setInterval(next, 5000); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  root.querySelector(".ss-next").addEventListener("click", () => { next(); restart(); });
  root.querySelector(".ss-prev").addEventListener("click", () => { prev(); restart(); });
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  // swipe on phones
  let x0 = null;
  root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener("touchend", e => {
    if (x0 !== null) {
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    }
    x0 = null; start();
  });

  show(0);
  start();
}

initMenu();
initCopy();
initSlider();
