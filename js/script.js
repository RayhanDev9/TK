// TK PAUD Permata - Interactive Script

// 1. Header Sticky & Scroll Shadow Logic
const headerLogic = () => {
  const navbar = document.querySelector("header");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("bg-white/95", "shadow-md", "backdrop-blur-md", "py-3");
      navbar.classList.remove("py-5", "bg-transparent");
    } else {
      navbar.classList.remove("bg-white/95", "shadow-md", "backdrop-blur-md", "py-3");
      navbar.classList.add("py-5", "bg-transparent");
    }
  });
};

// 2. Mobile Menu Toggle Logic
const mobileMenuLogic = () => {
  const toggle = document.getElementById("menu-toggle");
  const close = document.getElementById("menu-close");
  const menu = document.getElementById("mobile-menu");

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", openMenu);
  if (close) close.addEventListener("click", closeMenu);

  menu.querySelectorAll(".nav-link").forEach((item) => {
    item.addEventListener("click", closeMenu);
  });
};

// 3. About Stats Cycling Animation Logic
const aboutStatsLogic = () => {
  const statusCards = document.querySelectorAll(".about-status > div");
  if (statusCards.length === 0) return;

  let currentIndex = 0;
  setInterval(() => {
    statusCards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.remove("hidden", "opacity-0");
        card.classList.add("opacity-100", "scale-100");
      } else {
        card.classList.add("hidden", "opacity-0");
        card.classList.remove("opacity-100", "scale-100");
      }
    });
    currentIndex = (currentIndex + 1) % statusCards.length;
  }, 3000);
};

// 4. Program Visi/Misi/Kurikulum Accordion Logic
const programAccordionLogic = () => {
  const cards = document.querySelectorAll(".card-program");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const header = card.querySelector(".card-header");
    const content = card.querySelector(".card-content");
    const icon = card.querySelector(".card-icon");

    if (!header || !content) return;

    header.addEventListener("click", () => {
      const isExpanded = !content.classList.contains("hidden");

      // Close all cards first
      cards.forEach((otherCard) => {
        const otherContent = otherCard.querySelector(".card-content");
        const otherIcon = otherCard.querySelector(".card-icon");
        if (otherContent) {
          otherContent.classList.add("hidden", "opacity-0");
          otherContent.classList.remove("opacity-100");
        }
        if (otherIcon) {
          otherIcon.classList.remove("rotate-180");
        }
      });

      // Toggle clicked card
      if (!isExpanded) {
        content.classList.remove("hidden");
        requestAnimationFrame(() => {
          content.classList.remove("opacity-0");
          content.classList.add("opacity-100");
        });
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });
};

// 5. FAQ Accordion Logic
const faqLogic = () => {
  const faqData = [
    {
      question: "Berapa usia minimal untuk mendaftar di TK Permata?",
      answer: "Untuk Kelompok Bermain (Playgroup) usia mulai dari 2–4 tahun, sedangkan untuk TK Kelompok A dan B usia 4–6 tahun.",
      category: "Pendaftaran"
    },
    {
      question: "Apa saja dokumen persyaratan pendaftaran?",
      answer: "Persyaratan sangat mudah: Fotokopi Akta Kelahiran anak, fotokopi Kartu Keluarga (KK), dan fotokopi KTP Ayah & Ibu.",
      category: "Syarat"
    },
    {
      question: "Berapa rincian biaya pendaftaran dan SPP bulanan?",
      answer: "Biaya awal masuk sangat terjangkau yaitu Rp 470.000 (sudah mencakup 3 set seragam: batik, olahraga, muslim/muslimah, pensil warna, dan buku gambar). SPP bulanan hanya Rp 60.000.",
      category: "Biaya"
    },
    {
      question: "Bagaimana kurikulum dan metode belajar yang diterapkan?",
      answer: "Kami menggunakan Kurikulum Standar Nasional PAUD Kemendikbudristek yang dipadukan dengan pembelajaran tematik Islami (Active & Fun Learning) berbasis bermain sambil belajar.",
      category: "Kurikulum"
    },
    {
      question: "Pukul berapa jam kegiatan belajar mengajar dimulai dan selesai?",
      answer: "Kegiatan belajar dimulai pukul 07.45 hingga 10.20 WIB. Diawali dengan baris ceria, doa bersama, sholat dhuha berjamaah, dan kegiatan sentra.",
      category: "Jadwal"
    },
    {
      question: "Bagaimana jika anak saya belum terbiasa berpisah atau sering menangis?",
      answer: "Jangan khawatir Bunda, para guru kami sangat sabar dan berpengalaman dalam masa transisi/orientasi. Orang tua diizinkan mendampingi di minggu awal hingga anak merasa nyaman dan mandiri.",
      category: "Pendampingan"
    },
    {
      question: "Apakah ada pembelajaran mengaji, hafalan surat pendek & doa harian?",
      answer: "Ya, betul sekali. Setiap hari anak dibiasakan berdoa sebelum dan sesudah aktivitas, mengenal huruf hijaiyah, hafalan surat-surat pendek Juz Amma, dan praktek ibadah sederhana.",
      category: "Islami"
    }
  ];

  const containerFaq = document.querySelector(".container-faq");
  if (!containerFaq) return;

  containerFaq.innerHTML = "";

  faqData.forEach((item, index) => {
    const html = `
      <article class="faq-item bg-white rounded-2xl p-5 shadow-sm border border-amber-100 hover:border-amber-300 transition-all duration-300 cursor-pointer reveal">
        <div class="faq-header flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold text-sm flex items-center justify-center shrink-0">
              ${index + 1}
            </span>
            <h3 class="font-bold text-slate-800 text-base md:text-lg">
              ${item.question}
            </h3>
          </div>
          <div class="faq-icon w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300">
            <svg class="w-3.5 h-3.5 text-slate-600" viewBox="0 0 512 512" fill="currentColor">
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
            </svg>
          </div>
        </div>
        <div class="faq-answer hidden opacity-0 transition-all duration-300 mt-4 pt-4 border-t border-slate-100">
          <p class="text-slate-600 text-sm md:text-base leading-relaxed pl-11">
            ${item.answer}
          </p>
        </div>
      </article>
    `;
    containerFaq.insertAdjacentHTML("beforeend", html);
  });

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    header.addEventListener("click", () => {
      const isExpanded = !answer.classList.contains("hidden");

      // Close other items
      faqItems.forEach((other) => {
        const otherAnswer = other.querySelector(".faq-answer");
        const otherIcon = other.querySelector(".faq-icon");
        if (otherAnswer && other !== item) {
          otherAnswer.classList.add("hidden", "opacity-0");
          otherAnswer.classList.remove("opacity-100");
          if (otherIcon) otherIcon.classList.remove("rotate-180", "bg-amber-100", "text-amber-600");
        }
      });

      // Toggle current
      if (isExpanded) {
        answer.classList.add("hidden", "opacity-0");
        answer.classList.remove("opacity-100");
        icon.classList.remove("rotate-180", "bg-amber-100", "text-amber-600");
      } else {
        answer.classList.remove("hidden");
        requestAnimationFrame(() => {
          answer.classList.remove("opacity-0");
          answer.classList.add("opacity-100");
        });
        icon.classList.add("rotate-180", "bg-amber-100", "text-amber-600");
      }
    });
  });
};

// 6. Contact Form WhatsApp Logic
const contactLogic = () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('input[placeholder*="Nama"]')?.value || "";
    const childName = form.querySelector('input[placeholder*="Anak"]')?.value || "";
    const phone = form.querySelector('input[type="tel"]')?.value || "";
    const message = form.querySelector('textarea')?.value || "";

    const fullMessage = `Halo Bunda Guru TK PAUD Permata,\n\nSaya ingin bertanya mengenai pendaftaran / informasi sekolah:\n\n*Nama Orang Tua:* ${name}\n*Nama Anak:* ${childName || '-'}\n*No. Telepon / WA:* ${phone}\n*Pesan / Pertanyaan:* ${message}\n\nTerima kasih Bunda! 🙏`;

    window.open(
      `https://wa.me/6285692590096?text=${encodeURIComponent(fullMessage)}`,
      "_blank"
    );
  });
};

// 7. Gallery Carousel / Video Track Logic
const galleryTrackLogic = () => {
  const galleryData = [
    {
      video: "asset/video/info-lanjut/cooking-time.mp4",
      image: "asset/img/info-lanjut/solat.avif",
      title: "Praktik Sholat & Doa",
      category: "Islami"
    },
    {
      video: "asset/video/info-lanjut/kerja-bakti.mp4",
      image: "asset/img/info-lanjut/mencuci-piring.avif",
      title: "Kemandirian & Kebersihan",
      category: "Life Skill"
    },
    {
      video: "asset/video/info-lanjut/menanam.mp4",
      image: "asset/img/info-lanjut/membuat-bunga.avif",
      title: "Menanam & Cinta Alam",
      category: "Eksplorasi"
    },
    {
      video: "asset/video/info-lanjut/qomat.mp4",
      image: "asset/img/info-lanjut/membuat-aci.avif",
      title: "Kreasi Melipat & Menempel",
      category: "Kreativitas"
    },
    {
      video: "asset/video/info-lanjut/wadang.mp4",
      image: "asset/img/info-lanjut/foto-bersama.avif",
      title: "Keceriaan Bersama Guru",
      category: "Sosialisasi"
    },
    {
      video: "asset/video/info-lanjut/market-day.mp4",
      image: "asset/img/info-lanjut/wisuda.avif",
      title: "Market Day & Kewirausahaan",
      category: "Pentas & Karakter"
    },
    {
      video: "asset/video/info-lanjut/membuat-telor-asin.mp4",
      image: "asset/img/info-lanjut/juara-mewarnai.avif",
      title: "Juara Lomba Mewarnai",
      category: "Prestasi"
    },
    {
      video: "asset/video/info-lanjut/membuat-playdoh.mp4",
      image: "asset/img/info-lanjut/lomba-gambar.avif",
      title: "Sensori Play & Playdough",
      category: "Motorik Halus"
    },
    {
      video: "asset/video/info-lanjut/membuat-tempat-pensil.mp4",
      image: "asset/img/info-lanjut/menggambar.avif",
      title: "Menggambar Bebas",
      category: "Seni Rupa"
    }
  ];

  const track = document.querySelector(".track");
  if (!track) return;

  track.innerHTML = "";

  const createItems = () => {
    galleryData.forEach((item) => {
      const html = `
        <div class="gallery-card shrink-0 w-64 md:w-72 bg-white rounded-3xl p-3 shadow-md border border-amber-100 flex flex-col gap-3 group hover:shadow-xl transition-all duration-300">
          <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50">
            <video autoplay muted loop playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <source src="${item.video}" type="video/mp4">
            </video>
            <span class="absolute top-2.5 left-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ${item.category}
            </span>
          </div>
          <div class="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          </div>
          <div class="px-1 pb-1">
            <h4 class="font-bold text-slate-800 text-sm md:text-base">${item.title}</h4>
          </div>
        </div>
      `;
      track.insertAdjacentHTML("beforeend", html);
    });
  };

  createItems();
  createItems(); // Duplicate for smooth infinite loop

  let scrollPosition = 0;
  let isHovered = false;

  track.addEventListener("mouseenter", () => isHovered = true);
  track.addEventListener("mouseleave", () => isHovered = false);

  function autoScroll() {
    if (!isHovered) {
      scrollPosition += window.innerWidth < 768 ? 0.6 : 0.8;
      if (scrollPosition >= track.scrollWidth / 2) {
        scrollPosition = 0;
      }
      track.style.transform = `translateX(-${scrollPosition}px)`;
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
};

// 8. Purposeful Staggered Reveal on Scroll Animation
const revealOnScrollLogic = () => {
  const elements = document.querySelectorAll(".reveal");
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  elements.forEach((el) => {
    if (el.parentElement && el.parentElement.children.length > 1) {
      const siblingIndex = Array.from(el.parentElement.children).indexOf(el);
      if (siblingIndex > 0 && siblingIndex < 6) {
        el.style.transitionDelay = `${siblingIndex * 60}ms`;
      }
    }
    observer.observe(el);
  });
};

// Initialize all modules on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  headerLogic();
  mobileMenuLogic();
  aboutStatsLogic();
  programAccordionLogic();
  faqLogic();
  contactLogic();
  galleryTrackLogic();
  revealOnScrollLogic();
});
