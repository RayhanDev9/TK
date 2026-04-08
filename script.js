const btnOverlay = document.querySelector(".logo");
const btnCloseOverlay = document.querySelector(".button-close");
const overlay = document.querySelector(".overlay");

// send Wa
const sendWA = document.getElementById("send-massege");

// Apper
// const carouselItem = [...document.querySelectorAll(".carousel-item")];

//Overlay
btnOverlay.addEventListener("click", function () {
  overlay.classList.remove("hidden");
  overlay.classList.add("active");
  console.info("ok");
});

btnCloseOverlay.addEventListener("click", function () {
  overlay.classList.add("hidden");
  overlay.classList.remove("active");
});

//Apper
document.addEventListener("slid.bs.carousel", () => {
  document.querySelectorAll(".carousel-item").forEach((item) => {
    let text = item.querySelector(".h3-slide");

    if (!text) return;

    text.classList.remove("appear");

    if (item.classList.contains("active")) {
      text.classList.add("appear");
    }
  });
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
  console.info('ok')
});
