const { hash } = window.location;

const message = b64DecodeUnicode(hash.replace(/#/, ""));

if (message) {
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#message-show").classList.remove("hide");
  document.querySelector("h1").textContent = message;
}

const form = document.querySelector("form");
const linkInput = document.querySelector("#link-input");
const input = document.querySelector("#message-input");

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!input.value.length) return;
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#link-form").classList.remove("hide");

  const encrypted = b64EncodeUnicode(input.value)

  linkInput.value = `${window.location}#${encrypted}`;
  linkInput.select();
});

const copyBtn = document.querySelector(".copy");

copyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  linkInput.select();
  document.execCommand("copy");
  linkInput.select();
});

linkInput.addEventListener("copy", e => {
  const popup = document.querySelector(".popup");
  popup.classList.remove("hide");

  setTimeout(() => {
    popup.style.opacity = "1";
    setTimeout(() => {
      popup.style.transform = "translateY(0)";
      setTimeout(() => {
        popup.style = "";
        popup.classList.add("hide");
      }, 1000)
    }, 200)
  }, 100);


});

function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}