// Overlay
const btnOverlay = document.querySelector(".logo");
const btnCloseOverlay = document.querySelector(".button-close");
const overlay = document.querySelector(".overlay");

// send Wa
const sendWA = document.getElementById("send-massege");
console.info(typeof Number(innerWidth) === "number");

// Logo
const navbar = document.querySelector(".navbar");
const button = navbar.querySelector("button");

// Event Logo
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

  //agar tidak bisa di scroll
  document.body.style.overflow = "hidden"; // nonaktifkan scroll
  console.info("ok");
});
// Close overlay
btnCloseOverlay.addEventListener("click", function () {
  overlay.classList.add("hidden");
  overlay.classList.remove("active");

  // Agar bisa di scroll
  document.body.style.overflow = "";
});

//Apper

const appearFrist = function () {
  const activeItem = document.querySelector(".carousel-item")
console.info(activeItem)

}

appearFrist()

document.addEventListener("slid.bs.carousel", function (event) {
  // Menagkan carousel yang active saja
  const activeItem = document.querySelector(".carousel-item.active");

  // Jika activeItem null,maka langsung di rturn agar tidak eroro
  if (!activeItem) return;

  // Menangkap img slide dan appear
  const img = activeItem.querySelector("img");
  const text = activeItem.querySelector(".h3-slide");

  // Jika img atau text,maka langsung di rturn agar tidak eroro
  if (!img || !text) return;

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

  // function ngatur posisi berdasarkan gambar
  const posisiAppear = function (top, left) {
    console.info("ok");
    if (img.src.includes("slide-1.png")) {
      console.info("Active slide image:", img.src);
      appear.style.top = `${top}%`;
      appear.style.left = `${left}%`;
      appear.style.opacity = "1";
    } else if (img.src.includes("slide-2.png")) {
      appear.style.top = `${top}%`;
      appear.style.left = `${left}%`;
      appear.style.opacity = "1";
    } else if (img.src.includes("slide-3.png")) {
      appear.style.top = `${top}%`;
      appear.style.left = `${left}%`;
      appear.style.opacity = "1";
    } else {
      // Default untuk slide lain
      appear.style.top = `${top}`;
      appear.style.left = `${left}%`;
      appear.style.opacity = "1";
    }
  };

  // Memanggil function sesuai lebar jendela layar
  if (lebar > 0 && lebar < 500) {
    posisiAppear("73", "10");
  } else if (lebar > 500 && lebar < 776) {
    posisiAppear("78", "10");
  } else if (lebar > 776) {
    posisiAppear("60", "16");
  }

  appear.style.zIndex = "999999"; // agar di depan gambar apearnya
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

// Kirim pesan ke wa
sendWA.addEventListener("click", function () {
  sendToWhatsApp();
});
