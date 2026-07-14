const headerLogic = () => {
  const navbar = document.querySelector("header");
  const navTop = navbar.offsetTop;
  const main = document.querySelector("main");

  window.addEventListener("scroll", () => {
    if (window.scrollY > navTop) {
      navbar.classList.add(
        "fixed",
        "top-0",
        "left-0",
        "z-50",
        "backdrop-blur-sm",
        "shadow-lg",
      );
      main.classList.remove("mt-20");
    } else {
      navbar.classList.remove(
        "fixed",

        "z-50",
        "backdrop-blur-sm",
        "shadow-lg",
      );
      main.classList.add("mt-20");
    }
  });
};
headerLogic();

const humbergerLogic = () => {
  const toggle = document.getElementById("menu-toggle");
  const close = document.getElementById("menu-close");
  const menu = document.getElementById("mobile-menu");

  toggle.addEventListener("click", () => {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    toggle.setAttribute("aria-expanded", "true");
  });

  menu.querySelectorAll(".nav-link").forEach((item) => {
    item.addEventListener("click", () => {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
      toggle.setAttribute("aria-expanded", "false");
      console.info("ok");
    });
  });

  close.addEventListener("click", () => {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    toggle.setAttribute("aria-expanded", "false");
  });
};

humbergerLogic();
const vidioLoad = () => {
  const videos = [
    "../asset/video/mpls/mpls-1.mp4",
    "../asset/video/mpls/mpls-2.mp4",
    // Tambahkan video lainnya di sini
  ];

  const videoContainer = document.getElementById("video-container");
  if (!videoContainer) return;

  // 1. BANGUN SELURUH UI DARI JAVASCRIPT (Termasuk Tombol Kanan-Kiri)
  videoContainer.innerHTML = `
    <div id="video-track" class="relative w-full h-full"></div>

    <button id="prev-btn" class="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:outline-none hidden">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    </button>
    
    <button id="next-btn" class="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:outline-none hidden">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
    </button>

    <div class="absolute z-20 bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button id="play-pause-btn" class="text-white hover:text-blue-400 focus:outline-none transition-colors">
        <svg id="icon-play" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        <svg id="icon-pause" class="w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
      </button>
      <button id="fullscreen-btn" class="text-white hover:text-blue-400 focus:outline-none transition-colors">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
      </button>
    </div>
  `;

  // 2. AMBIL REFERENSI ELEMEN
  const track = document.getElementById("video-track");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const playBtn = document.getElementById("play-pause-btn");
  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");
  const fsBtn = document.getElementById("fullscreen-btn");

  let currentIndex = 0;
  const videoElements = [];

  // 3. MASUKKAN VIDEO KE DALAM TRACK
  videos.forEach((src, index) => {
    const v = document.createElement("video");
    v.src = src;
    v.playsInline = true;

    // Semua video ditumpuk (absolute). Hanya index 0 yang transparasinya 100% dan z-index 10
    v.className = `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${index === 0 ? "opacity-100 z-10" : "opacity-0 z-0"}`;

    track.appendChild(v);
    videoElements.push(v);

    v.addEventListener("click", () => togglePlay());
    v.addEventListener("dblclick", () => toggleFullscreen());
  });

  // 4. LOGIKA NAVIGASI (SLIDER)
  const updateNavButtons = () => {
    // Sembunyikan tombol prev jika di video pertama, sembunyikan next jika di video terakhir
    prevBtn.style.display = currentIndex === 0 ? "none" : "block";
    nextBtn.style.display =
      currentIndex === videos.length - 1 ? "none" : "block";

    // Hapus class hidden jika video lebih dari 1
    if (videos.length > 1) {
      prevBtn.classList.remove("hidden");
      nextBtn.classList.remove("hidden");
    }
  };
  updateNavButtons();

  const switchVideo = (newIndex) => {
    // Stop video lama
    videoElements[currentIndex].pause();

    // Sembunyikan video lama (taruh di belakang)
    videoElements[currentIndex].classList.remove("opacity-100", "z-10");
    videoElements[currentIndex].classList.add("opacity-0", "z-0");

    // Perbarui Index
    currentIndex = newIndex;

    // Munculkan video baru (taruh di depan)
    videoElements[currentIndex].classList.remove("opacity-0", "z-0");
    videoElements[currentIndex].classList.add("opacity-100", "z-10");

    updateNavButtons();
    syncPlayButton(); // Pastikan ikon play/pause sesuai dengan status video baru
  };

  prevBtn.onclick = () => {
    if (currentIndex > 0) switchVideo(currentIndex - 1);
  };

  nextBtn.onclick = () => {
    if (currentIndex < videos.length - 1) switchVideo(currentIndex + 1);
  };

  // 5. LOGIKA PLAY & PAUSE
  const syncPlayButton = () => {
    const activeV = videoElements[currentIndex];
    if (activeV.paused) {
      iconPause.classList.add("hidden");
      iconPlay.classList.remove("hidden");
    } else {
      iconPlay.classList.add("hidden");
      iconPause.classList.remove("hidden");
    }
  };

  const togglePlay = () => {
    const activeV = videoElements[currentIndex];
    if (activeV.paused) {
      activeV.play();
    } else {
      activeV.pause();
    }
    syncPlayButton();
  };
  playBtn.onclick = togglePlay;

  // 6. LOGIKA FULLSCREEN (STATUS WA MODE)
  const toggleFullscreen = () => {
    const isExpanded = videoContainer.classList.contains("fixed");

    if (!isExpanded) {
      videoContainer.classList.remove(
        "relative",
        "max-w-xs",
        "aspect-[9/16]",
        "rounded-xl",
      );
      videoContainer.classList.add(
        "fixed",
        "inset-0",
        "z-50",
        "w-screen",
        "h-screen",
        "flex",
        "items-center",
        "justify-center",
        "bg-black/95",
      );

      videoElements.forEach((v) => {
        v.classList.remove("w-full", "h-full", "object-cover");
        v.classList.add(
          "h-full",
          "max-h-[90vh]",
          "aspect-[9/16]",
          "object-cover",
          "rounded-xl",
        );
      });
    } else {
      videoContainer.classList.remove(
        "fixed",
        "inset-0",
        "z-50",
        "w-screen",
        "h-screen",
        "flex",
        "items-center",
        "justify-center",
        "bg-black/95",
      );
      videoContainer.classList.add(
        "relative",
        "max-w-xs",
        "aspect-[9/16]",
        "rounded-xl",
      );

      videoElements.forEach((v) => {
        v.classList.remove(
          "h-full",
          "max-h-[90vh]",
          "aspect-[9/16]",
          "object-cover",
          "rounded-xl",
        );
        v.classList.add("w-full", "h-full", "object-cover");
      });
    }
  };
  fsBtn.onclick = toggleFullscreen;
};

document.addEventListener("DOMContentLoaded", vidioLoad);
const imgLoade = () => {
  const imageUrls = [
    "../asset/img/mpls/1.avif",
    "../asset/img/mpls/2.avif",
    "../asset/img/mpls/3.avif",
    "../asset/img/mpls/4.avif",
    "../asset/img/mpls/5.avif",
    "../asset/img/mpls/6.avif",
    "../asset/img/mpls/7.avif",
    "../asset/img/mpls/8.avif",
  ];

  // 2. Mengambil elemen DOM yang dibutuhkan
  const galleryContainer = document.getElementById("gallery-container");
  const overlay = document.getElementById("overlay");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("close-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentIndex = 0;

  // 3. Looping untuk membuat grid galeri
  let galleryHTML = "";
  imageUrls.forEach((url, index) => {
    galleryHTML += `
                <div class="overflow-hidden bg-white rounded-lg shadow-md cursor-pointer group">
                    <img 
                        src="${url}" 
                        alt="Galeri ${index + 1}" 
                        data-index="${index}"
                        class="gallery-item w-full h-64 sm:h-72 lg:h-80 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        loading="lazy"
                    />
                </div>
            `;
  });
  galleryContainer.innerHTML = galleryHTML;

  // 4. Fungsi untuk membuka Overlay
  const openModal = (index) => {
    currentIndex = index;
    modalImg.src = imageUrls[currentIndex];

    // Hapus class hidden agar elemen muncul di DOM
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");

    // Sedikit delay agar efek transisi opacity & scale berjalan mulus
    setTimeout(() => {
      overlay.classList.remove("opacity-0");
      modalImg.classList.remove("scale-95");
      modalImg.classList.add("scale-100");
    }, 10);
  };

  // 5. Fungsi untuk menutup Overlay
  const closeModal = () => {
    overlay.classList.add("opacity-0");
    modalImg.classList.remove("scale-100");
    modalImg.classList.add("scale-95");

    // Tunggu transisi selesai sebelum menambahkan class hidden
    setTimeout(() => {
      overlay.classList.add("hidden");
      overlay.classList.remove("flex");
    }, 300);
  };

  // 6. Fungsi Navigasi (Next & Prev)
  const showNext = () => {
    currentIndex = currentIndex === imageUrls.length - 1 ? 0 : currentIndex + 1;
    modalImg.src = imageUrls[currentIndex];
  };

  const showPrev = () => {
    currentIndex = currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1;
    modalImg.src = imageUrls[currentIndex];
  };

  // 7. Mendaftarkan Event Listeners
  // Event click pada setiap gambar di galeri
  document.querySelectorAll(".gallery-item").forEach((img) => {
    img.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      openModal(index);
    });
  });

  // Event click pada tombol-tombol overlay
  closeBtn.addEventListener("click", closeModal);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // Menutup overlay jika user klik area gelap di luar gambar
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Navigasi menggunakan tombol Keyboard (Esc, Kiri, Kanan)
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("hidden")) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });
};

imgLoade();
