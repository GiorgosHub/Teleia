/* The form: checked as you go, then written as an email. Nothing is stored or sent from the page: the visitor
   chooses Gmail, Outlook, their own email app, or copying the text. */
import { $, $$, reduce, T } from "../core/dom.js";
import { say, copy } from "./ui.js";
import { burst } from "./extras.js";

const EMAIL = "tipsandgreeks@gmail.com";

export function initForm() {
  const form = $("#form"); if (!form) return;
  const rules = { name: (v) => v.trim().length > 1, email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: (v) => v.trim().length > 4 };
  const check = (n) => {
    const el = form.elements[n], ok = rules[n](el.value), f = el.closest(".field");
    f.classList.toggle("bad", !ok); el.setAttribute("aria-invalid", String(!ok));
    if (!ok) el.setAttribute("aria-describedby", "e-" + n); else el.removeAttribute("aria-describedby");
    return ok;
  };
  Object.keys(rules).forEach((n) => {
    const el = form.elements[n];
    el.addEventListener("blur", () => { if (el.value) check(n); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("bad")) check(n); });
  });
  let body = "";
  const ways = $("#ways");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    const v = (n) => form.elements[n].value.trim();
    const subject = T("mailSubject") + " — " + v("name");
    body = [T("mailHello"), "", v("msg"), "", `${T("mailName")}: ${v("name")}`, `${T("mailEmail")}: ${v("email")}`].join("\n");
    const su = encodeURIComponent(subject), bo = encodeURIComponent(body);
    /* web email first: "send" through an email program does nothing on a computer without one */
    $("#wGmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${su}&body=${bo}`;
    $("#wOutlook").href = `https://outlook.live.com/mail/0/deeplink/compose?to=${EMAIL}&subject=${su}&body=${bo}`;
    $("#wApp").href = `mailto:${EMAIL}?subject=${su}&body=${bo}`;
    ways.hidden = false;
    requestAnimationFrame(() => { ways.focus({ preventScroll: true }); ways.scrollIntoView({ block: "nearest", behavior: reduce() ? "auto" : "smooth" }); });
    const r = e.submitter?.getBoundingClientRect?.(); if (r) burst(r.left + r.width / 2, r.top + r.height / 2, 30);
  });
  $("#copyMsg").addEventListener("click", () => copy(body));
  $$(".way[target=_blank]", ways).forEach((w) => w.addEventListener("click", () => say(T("mailOpening"))));
}
