const btnOverlay = document.querySelector(".logo");
const btnCloseOverlay = document.querySelector(".button-close");
const overlay = document.querySelector(".overlay");

// send Wa
const sendWA = document.getElementById("send-massege");
console.info(typeof Number(innerWidth) === "number");
// Logo
const navbar = document.querySelector(".navbar");
const button = navbar.querySelector("button");
button.addEventListener("click", function () {
  if (!button.classList.contains("collapsed")) {
    const logo = document.querySelector(".logo");
    logo.style.top = "4%";
    logo.style.left = "3%";
  } else if (button.classList.contains("collapsed")) {
    const logo = document.querySelector(".logo");
    logo.style.top = "12%";
    logo.style.left = "3%";
  }
});

//Overlay
btnOverlay.addEventListener("click", function () {
  overlay.classList.remove("hidden");
  overlay.classList.add("active");

    // overflow: hidden;
  document.body.style.overflow = "hidden"; // nonaktifkan scroll
  console.info("ok");
});

btnCloseOverlay.addEventListener("click", function () {
  overlay.classList.add("hidden");
  overlay.classList.remove("active");
});

//Apper
document.addEventListener("slid.bs.carousel", function (event) {
  const activeItem = document.querySelector(".carousel-item.active");
  if (!activeItem) return;

  const img = activeItem.querySelector("img");
  const text = activeItem.querySelector(".h3-slide");

  if (!img || !text) return;

  console.info("Active slide image:", img.src);

  // Reset semua text
  document.querySelectorAll(".h3-slide").forEach(function (el) {
    el.classList.remove("appear");
    // Reset style inline biar ga numpuk
    el.style.top = "70%";
    el.style.left = "20%";
    el.style.opacity = "0";
  });

  // Kasih appear ke yang aktif
  text.classList.add("appear");

  // Ambil ulang element yang sudah punya class appear (bisa pakai text langsung)
  const appear = text; // karena text sudah pasti yang aktif
  const lebar = innerWidth;

  // Atur posisi berdasarkan gambar
  const posisiAppear = function (s1, sAll) {
    console.info("ok");
    if (img.src.includes("slide-1.png")) {
      console.info("Active slide image:", img.src);
      appear.style.top = `${s1}%`;
      appear.style.left = "23%";
      appear.style.opacity = "1";
    } else if (img.src.includes("slide-2.png")) {
      appear.style.top = `${sAll}%`;
      appear.style.left = "16%";
      appear.style.opacity = "1";
    } else if (img.src.includes("slide-3.png")) {
      appear.style.top = `${sAll}%`;
      appear.style.left = "16%";
      appear.style.opacity = "1";
    } else {
      // Default untuk slide lain
      appear.style.top = `${sAll}`;
      appear.style.left = "16%";
      appear.style.opacity = "1";
    }
  };

  if (lebar > 0 && lebar < 500) {
    posisiAppear("80", "73");
  } else if (lebar > 500 && lebar < 992) {
    posisiAppear("86", "79");
  } else if (lebar > 992) {
    posisiAppear("66", "67");
  }

  appear.style.zIndex = "999999";
  appear.style.position = "absolute"; // Pastikan position absolute
  appear.style.transition = "opacity 0.3s ease"; // Opsional: animasi halus
});

// Kirim pesan ke wa
function sendToWhatsApp() {
  // Ambil nilai dari form
  let nama = document.getElementById("nama").value;
  let email = document.getElementById("wa").value;
  let pesan = document.getElementById("message").value;

  // Buat pesan
  let text = `Halo, saya ${nama} (${email})\n\nPesan: ${pesan}`;

  // Encode pesan untuk URL
  let url = `https://wa.me/6285692590096?text=${encodeURIComponent(text)}`;

  // Buka WhatsApp
  window.open(url, "_blank");
}

sendWA.addEventListener("click", function () {
  sendToWhatsApp();
  console.info("ok");
});
