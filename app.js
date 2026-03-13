// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Modal (지역별 전화) =====
const modal = $("#callModal");
const openModal = () => {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

["#btnCallTop","#btnCallHero","#btnCallBottom","#btnCallFab","#btnCallSticky"]
  .forEach(id => $(id)?.addEventListener("click", openModal));

$("#modalClose")?.addEventListener("click", closeModal);
$("#modalX")?.addEventListener("click", closeModal);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// 카드 섹션의 “전화 상담” 버튼들
$$(".btnCallAny").forEach(btn => btn.addEventListener("click", openModal));

// ===== Slider =====
const track = $("#sliderTrack");
const slides = $$("#sliderTrack .slider__slide");
const dotsWrap = $("#dots");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const viewport = $("#sliderViewport");

let idx = 0;
let timer = null;

function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dotbtn" + (i === idx ? " active" : "");
    b.addEventListener("click", () => go(i, true));
    dotsWrap.appendChild(b);
  });
}

function go(nextIndex, resetAuto = false) {
  if (!track || slides.length === 0) return;
  idx = (nextIndex + slides.length) % slides.length;
  track.style.transform = `translateX(-${idx * 100}%)`;
  renderDots();
  if (resetAuto) startAuto();
}

function startAuto() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => go(idx + 1), 4200);
}

prevBtn?.addEventListener("click", () => go(idx - 1, true));
nextBtn?.addEventListener("click", () => go(idx + 1, true));

viewport?.addEventListener("mouseenter", () => timer && clearInterval(timer));
viewport?.addEventListener("mouseleave", () => startAuto());

renderDots();
startAuto();

// ===== Scroll: Top button + Sticky CTA =====
const btnTop = $("#btnTop");
const sticky = $("#stickyCta");

function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;

  // top 버튼: 300px부터 표시
  if (btnTop) btnTop.style.display = y > 300 ? "flex" : "none";

  // 모바일 스티키 CTA: 250px부터 표시(모바일에서만 CSS가 display:grid)
  if (sticky) sticky.style.opacity = y > 250 ? "1" : "0";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

btnTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Reveal Animation =====
const reveals = $$(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => io.observe(el));
} else {
  // fallback
  const revealFallback = () => {
    const wh = window.innerHeight;
    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < wh - 80) el.classList.add("show");
    });
  };
  window.addEventListener("scroll", revealFallback, { passive: true });
  revealFallback();
}
// 배너 슬라이더
(function () {

const track = document.querySelector(".slider_track");
const slides = document.querySelectorAll(".slide");
const prev = document.getElementById("btnPrev");
const next = document.getElementById("btnNext");

if(!track) return;

let index = 0;
const max = slides.length;

function move(i){
index = (i + max) % max;
track.style.transform = "translateX(-"+(index*100)+"%)";
}

prev.addEventListener("click", () => move(index-1));
next.addEventListener("click", () => move(index+1));

})();
document.querySelectorAll(".btnScrollCta").forEach(btn=>{
btn.addEventListener("click",()=>{
document.getElementById("cta").scrollIntoView({
behavior:"smooth"
});
});
});
/* ===== 개인정보 동의 / 버튼 연결 ===== */

const consentModal = document.getElementById("consentModal");
const consentBackdrop = document.getElementById("consentBackdrop");
const consentClose = document.getElementById("consentClose");
const consentCancel = document.getElementById("consentCancel");
const consentConfirm = document.getElementById("consentConfirm");
const consentRequired = document.getElementById("consentRequired");

const policyModal = document.getElementById("policyModal");
const policyBackdrop = document.getElementById("policyBackdrop");
const policyClose = document.getElementById("policyClose");
const policyConfirm = document.getElementById("policyConfirm");
const openPolicyLink = document.getElementById("openPolicyLink");

let pendingAction = null;

function updateConsentButton() {
  if (!consentConfirm || !consentRequired) return;
  consentConfirm.disabled = !consentRequired.checked;
}

function openConsent(action) {
  pendingAction = action;
  if (consentRequired) consentRequired.checked = false;
  updateConsentButton();

  if (consentModal) {
    consentModal.classList.add("open");
  }
}

function closeConsent() {
  if (consentModal) {
    consentModal.classList.remove("open");
  }
}

function openPolicy() {
  if (policyModal) {
    policyModal.classList.add("open");
  }
}

function closePolicy() {
  if (policyModal) {
    policyModal.classList.remove("open");
  }
}

consentRequired?.addEventListener("change", updateConsentButton);
consentBackdrop?.addEventListener("click", closeConsent);
consentClose?.addEventListener("click", closeConsent);
consentCancel?.addEventListener("click", closeConsent);

openPolicyLink?.addEventListener("click", function (e) {
  e.preventDefault();
  openPolicy();
});

policyBackdrop?.addEventListener("click", closePolicy);
policyClose?.addEventListener("click", closePolicy);
policyConfirm?.addEventListener("click", closePolicy);

consentConfirm?.addEventListener("click", function () {
  if (!consentRequired.checked) {
    alert("필수 동의에 체크해주세요.");
    return;
  }

  const action = pendingAction;
  closeConsent();

  if (!action) return;

  if (action.type === "phone-modal") {
    openModal();
  }

  if (action.type === "phone-call") {
    window.location.href = "tel:" + action.tel;
  }

  if (action.type === "kakao") {
    window.open(action.url, "_blank", "noopener");
  }

  if (action.type === "scroll-cta") {
    document.getElementById("cta")?.scrollIntoView({
      behavior: "smooth"
    });
  }
});

/* 지역별 전화 버튼 */
["btnCallTop", "btnCallHero", "btnCallBottom", "btnCallFab", "btnCallSticky"].forEach(function (id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("click", function (e) {
    e.preventDefault();
    openConsent({ type: "phone-modal" });
  });
});

/* 카드 안 버튼 */
document.querySelectorAll(".btnCallAny").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    openConsent({ type: "phone-modal" });
  });
});

document.querySelectorAll(".btnScrollCta").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    openConsent({ type: "scroll-cta" });
  });
});

/* 카카오 버튼 */
document.querySelectorAll(".consent-kakao").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const url = link.dataset.href;
    openConsent({ type: "kakao", url: url });
  });
});
/* ===== 슬라이더 ===== */
const sliderTrack = document.getElementById("sliderTrack");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const sliderDots = document.querySelectorAll(".slider__dot");

let currentSlide = 0;
const totalSlides = 2;

function updateSlider() {
  if (!sliderTrack) return;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  sliderDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

prevSlideBtn?.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
});

nextSlideBtn?.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
});

sliderDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    currentSlide = Number(dot.dataset.slide);
    updateSlider();
  });
});

updateSlider();
function quickConnect() {
  const ok = confirm("지금 바로 연결할까요?");
  if (ok) {
 const contactSection = document.getElementById("cta");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function toggleModels(id) {
  const target = document.getElementById(id);
  const allLists = document.querySelectorAll('.model_list');

  allLists.forEach(list => {
    if (list !== target) {
      list.classList.remove('active');
    }
  });

  target.classList.toggle('active');
}
function changeGalaxyImage(imageSrc) {
  const galaxyImage = document.getElementById("galaxyImage");
  if (galaxyImage) {
    galaxyImage.src = imageSrc;
  }
}

function changeIphoneImage(imageSrc) {
  const iphoneImage = document.getElementById("iphoneImage");
  if (iphoneImage) {
    iphoneImage.src = imageSrc;
  }
}

function changeInternetImage(imageSrc) {
  const internetImage = document.getElementById("internetImage");
  if (internetImage) {
    internetImage.src = imageSrc;
  }
}
function toggleModels(id) {
  const target = document.getElementById(id);
  const allLists = document.querySelectorAll(".model_list");

  allLists.forEach(list => {
    if (list !== target) {
      list.classList.remove("active");
    }
  });

  target.classList.toggle("active");
}

function quickConnect() {
  const contactSection = document.getElementById("cta");
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}
function openImageModal(imageSrc) {
  closeImageModal();

  const overlay = document.createElement("div");
  overlay.id = "runtimeImageModal";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.zIndex = "99999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "20px";

  const panel = document.createElement("div");
  panel.style.position = "relative";
  panel.style.background = "#fff";
  panel.style.borderRadius = "24px";
  panel.style.padding = "20px";
  panel.style.maxWidth = "760px";
  panel.style.width = "100%";
  panel.style.maxHeight = "88vh";
  panel.style.boxShadow = "0 20px 50px rgba(0,0,0,0.18)";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "14px";
  closeBtn.style.border = "none";
  closeBtn.style.background = "#fff";
  closeBtn.style.fontSize = "34px";
  closeBtn.style.lineHeight = "1";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = closeImageModal;

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "상세 이미지";
  img.style.width = "100%";
  img.style.maxHeight = "75vh";
  img.style.objectFit = "contain";
  img.style.display = "block";
  img.style.borderRadius = "16px";

  overlay.onclick = function (e) {
    if (e.target === overlay) closeImageModal();
  };

  panel.appendChild(closeBtn);
  panel.appendChild(img);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

function closeImageModal() {
  const oldModal = document.getElementById("runtimeImageModal");
  if (oldModal) oldModal.remove();
}
