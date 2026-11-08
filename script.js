// بيانات بطاقات "Why schools choose it"
const features = [
  { icon: "🧠", title: "AI in every grade",   text: "Builds from digital literacy to real AI" },
  { icon: "💡", title: "Design thinking",     text: "Students plan, build, test and improve" },
  { icon: "⏰", title: "Just 1 hour a week",  text: "Fits easily into any school timetable" },
  { icon: "</>", title: "Real coding tools",  text: "ScratchJr, Scratch, web, Python and Arduino" },
  { icon: "😊", title: "Fun characters",      text: "Friendly guides young learners love" },
  { icon: "🏅", title: "Global standards",    text: "Mapped to ISTE, Bloom's taxonomy and the SDGs" },
  { icon: "👥", title: "Teacher support",     text: "Teacher's guide, training and ongoing help" },
  { icon: "🔧", title: "Hands-on kits",       text: "Robotics, Arduino and 3D printing" }
];

const grid = document.getElementById("features");
grid.innerHTML = features.map(f => `
  <article class="feature">
    <div class="ico" aria-hidden="true">${f.icon}</div>
    <div><h3>${f.title}</h3><p>${f.text}</p></div>
  </article>`).join("");

// نسخ رقم الهاتف / الإيميل عند الضغط
const toast = document.getElementById("toast");
let timer;
document.querySelectorAll(".copy").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      toast.textContent = "Copied: " + btn.dataset.copy;
    } catch {
      toast.textContent = "Copy failed – select the text manually";
    }
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 2000);
  });
});
