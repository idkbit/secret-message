const { hash } = window.location;

const message = b64DecodeUnicode(hash.replace(/#/, ""));

if (message) {
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#message-show").classList.remove("hide");
  document.querySelector("h1").textContent = message;
}

const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  const input = document.querySelector("#message-input");
  if (!input.value.length) return;
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#link-form").classList.remove("hide");

  const encrypted = b64EncodeUnicode(input.value)

  const linkInput = document.querySelector("#link-input");
  linkInput.value = `${window.location}#${encrypted}`;
  linkInput.select();
});

const copyBtn = document.querySelector(".copy");

copyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#message-input").select();
  document.execCommand("copy");
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