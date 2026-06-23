(function () {
  const modeLabels = {
    "5": "5 min recruiter screen",
    "15": "15 min interview demo",
    "30": "30 min panel deep dive"
  };
  let activeMode = "15";
  let lastTalkTrack = "";

  function text(node) {
    return (node && node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pageTitle() {
    return text(document.querySelector("h1")) || document.title || "Portfolio Demo";
  }

  function buildLines() {
    const title = pageTitle();
    const summary = text(document.querySelector(".command-header p")) || text(document.querySelector(".sales-panel p"));
    const proof = Array.from(document.querySelectorAll(".proof-strip div")).map((item) => text(item)).filter(Boolean);
    const activeTab = text(document.querySelector(".tab.active")) || "main workflow";

    if (activeMode === "5") {
      return [
        `Problem - ${title} shows where frontline context gets lost before a buyer can act.`,
        `Demo - run the workflow, then show the generated ${activeTab.toLowerCase()} output and buyer proof.`,
        `Value - ${proof[0] || summary || "the workflow creates cleaner handoffs and more consistent decision-making."}`
      ];
    }

    if (activeMode === "30") {
      return [
        `Discovery - start by asking which team owns the current workflow and where handoffs break down.`,
        `Current state - show the raw intake fields and explain why the information is incomplete without structure.`,
        `Workflow - run the generator and walk through each tab as a product demo, not a static form.`,
        `Buyer lens - connect the result to the stakeholder list and proof metrics on the right rail.`,
        `Implementation handoff - highlight assumptions, risks, missing data, and the next owner.`,
        `Proof plan - define how the customer would measure whether this workflow helped in a pilot.`,
        `Close - ask whether the buyer would trust this output enough to change the current process.`
      ];
    }

    return [
      `The problem - ${summary || `${title} converts messy input into a repeatable workflow.`}`,
      `The approach - capture the source context, run the local workflow logic, and separate facts from assumptions.`,
      `Live demo - switch cases, generate the output, and inspect the active ${activeTab.toLowerCase()} view.`,
      `Business impact - ${proof[1] || "reduce clarification loops and improve handoff quality."}`,
      `Next step - use a small proof-of-value plan to test whether the workflow improves speed, consistency, and trust.`
    ];
  }

  function updateTalkTrack() {
    const lines = buildLines();
    lastTalkTrack = [
      `Customer-Facing Talk Track - ${modeLabels[activeMode]}`,
      `Demo: ${pageTitle()}`,
      "",
      ...lines.map((line, index) => `${index + 1}. ${line}`),
      "",
      "Boundary: static portfolio workflow demo using fictional or sanitized sample data."
    ].join("\n");

    const salesPanel = document.querySelector(".sales-panel section:first-child p");
    if (salesPanel) salesPanel.textContent = lines.join(" ");
  }

  function addSearchables() {
    document.querySelectorAll("main article, .command-center article, .proof-strip div, .sales-panel section, .tab-panel li, .tab-panel p, .tab-panel td, .tab-panel th").forEach((node) => {
      node.classList.add("demo-searchable");
      node.dataset.demoSearch = text(node).toLowerCase();
    });
  }

  function applySearch(input, status) {
    addSearchables();
    const query = input.value.trim().toLowerCase();
    const nodes = Array.from(document.querySelectorAll(".demo-searchable"));
    let matches = 0;
    const filterableSelector = "article.demo-searchable, li.demo-searchable, tr.demo-searchable";
    document.body.classList.toggle("demo-searching", Boolean(query));
    nodes.forEach((node) => {
      const hit = Boolean(query && node.dataset.demoSearch && node.dataset.demoSearch.includes(query));
      node.classList.toggle("demo-search-match", hit);
      if (hit) matches += 1;
    });
    nodes.forEach((node) => {
      const filterable = node.matches(filterableSelector);
      const shouldHide = Boolean(query && matches > 0 && filterable && !node.classList.contains("demo-search-match"));
      node.classList.toggle("demo-search-filtered-out", shouldHide);
    });
    if (!query) nodes.forEach((node) => node.classList.remove("demo-search-filtered-out"));
    status.textContent = query
      ? `${matches} match${matches === 1 ? "" : "es"} for "${query}". Matching workflow blocks are filtered into view.`
      : "Search highlights and filters the generated workflow.";
  }

  function sectionFrom(title, selector) {
    const items = Array.from(document.querySelectorAll(selector)).map(text).filter(Boolean).slice(0, 8);
    if (!items.length) return "";
    return `<section><h3>${escapeHtml(title)}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
  }

  function openWorkflowModal(modal) {
    const body = modal.querySelector(".demo-enhancement-grid");
    body.innerHTML = [
      sectionFrom("Current Flow", ".flow-rail span"),
      sectionFrom("Generated Output", ".tab-panel.active article"),
      sectionFrom("Proof Metrics", ".proof-strip div"),
      sectionFrom("Buyer Value", ".sales-panel .metric-list div"),
      sectionFrom("Discovery Questions", ".sales-panel .compact-list li"),
      sectionFrom("Demo Script", ".sales-panel section:first-child p")
    ].join("");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    modal.querySelector("button").focus();
  }

  async function copyTalkTrack(status) {
    updateTalkTrack();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(lastTalkTrack);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = lastTalkTrack;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      status.textContent = "Copied";
    } catch {
      status.textContent = "Copy blocked - use Executive Brief tab";
    }
  }

  function enhance() {
    const topbar = document.querySelector(".topbar");
    if (!topbar || document.querySelector(".demo-enhancement-bar")) return;

    const bar = document.createElement("section");
    bar.className = "demo-enhancement-bar";
    bar.innerHTML = `
      <label class="demo-search-control"><span>Search</span><input type="search" placeholder="Search outputs, DTCs, systems, risks..."></label>
      <div class="demo-mode-control" aria-label="Demo mode">
        <button type="button" data-mode="5">5 min</button>
        <button type="button" class="active" data-mode="15">15 min</button>
        <button type="button" data-mode="30">30 min</button>
      </div>
      <button class="demo-action-button" type="button" data-open-workflow>View full workflow</button>
      <button class="demo-action-button" type="button" data-copy-talk>Copy customer-facing talk track</button>
      <span class="demo-search-status">Search highlights and filters the generated workflow.</span>
      <span class="demo-copy-status" aria-live="polite"></span>
    `;
    topbar.insertAdjacentElement("afterend", bar);

    const modal = document.createElement("section");
    modal.className = "demo-enhancement-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="demo-enhancement-backdrop" data-close-workflow></div>
      <article class="demo-enhancement-dialog" role="dialog" aria-modal="true" aria-label="Full workflow package">
        <header><div><h2>${escapeHtml(pageTitle())}</h2><p>Full workflow package generated from the current demo state.</p></div><button type="button" data-close-workflow>Close</button></header>
        <div class="demo-enhancement-grid"></div>
      </article>
    `;
    document.body.appendChild(modal);

    const input = bar.querySelector("input");
    const searchStatus = bar.querySelector(".demo-search-status");
    const copyStatus = bar.querySelector(".demo-copy-status");
    input.addEventListener("input", () => applySearch(input, searchStatus));
    bar.querySelector("[data-open-workflow]").addEventListener("click", () => openWorkflowModal(modal));
    bar.querySelector("[data-copy-talk]").addEventListener("click", () => copyTalkTrack(copyStatus));
    modal.querySelectorAll("[data-close-workflow]").forEach((node) => node.addEventListener("click", () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }));

    bar.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        activeMode = button.dataset.mode;
        bar.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item === button));
        copyStatus.textContent = `${modeLabels[activeMode]} ready`;
        updateTalkTrack();
      });
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.focus();
      }
      if (event.key === "Escape" && modal.classList.contains("open")) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
      }
    });

    addSearchables();
    updateTalkTrack();
  }

  document.addEventListener("DOMContentLoaded", enhance);
})();
