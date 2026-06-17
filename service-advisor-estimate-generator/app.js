const samples = {
  brake: {
    vehicle: "2019 BMW X3",
    concern: "Customer reports vibration while braking from highway speeds.",
    finding: "Front brake rotors measure below refinish spec and show heat spots. Front pads are near minimum thickness. No hydraulic leak found.",
    repair: "Replace front brake pads and rotors, clean/lubricate caliper slide surfaces, and road test.",
    urgency: "High",
    customerType: "Retail customer",
    parts: "Front pads, front rotors, hardware kit",
    labor: "Brake replacement and road test",
    unknowns: "Final price depends on parts availability, rotor specification, and any caliper issue found during repair."
  },
  ev: {
    vehicle: "2021 MINI Cooper SE",
    concern: "Customer reports charging warning and reduced power message after overnight charging.",
    finding: "Stored high-voltage interlock and insulation faults. Warning is intermittent. No visible coolant contamination from initial inspection.",
    repair: "Perform high-voltage safety diagnostic, inspect interlock circuit, verify insulation values, and confirm charging system status before repair recommendation.",
    urgency: "Safety critical",
    customerType: "Retail customer",
    parts: "No parts confirmed yet",
    labor: "High-voltage diagnostic testing by qualified technician",
    unknowns: "Repair recommendation depends on safety testing, fault status, charging conditions, and OEM diagnostic results."
  },
  blank: {
    vehicle: "",
    concern: "",
    finding: "",
    repair: "",
    urgency: "Medium",
    customerType: "Retail customer",
    parts: "",
    labor: "",
    unknowns: ""
  }
};

let currentExecutiveBrief = "";

function $(id) {
  return document.getElementById(id);
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function readForm() {
  return {
    vehicle: $("vehicle").value.trim(),
    concern: $("concern").value.trim(),
    finding: $("finding").value.trim(),
    repair: $("repair").value.trim(),
    urgency: $("urgency").value,
    customerType: $("customerType").value,
    parts: $("parts").value.trim(),
    labor: $("labor").value.trim(),
    unknowns: $("unknowns").value.trim()
  };
}

function writeForm(data) {
  $("vehicle").value = data.vehicle;
  $("concern").value = data.concern;
  $("finding").value = data.finding;
  $("repair").value = data.repair;
  $("urgency").value = data.urgency;
  $("customerType").value = data.customerType;
  $("parts").value = data.parts;
  $("labor").value = data.labor;
  $("unknowns").value = data.unknowns;
}

function sentence(text, fallback) {
  return text ? text.replace(/\s+/g, " ").trim() : fallback;
}

function buildOutput(input) {
  const combined = normalize(`${input.vehicle} ${input.concern} ${input.finding} ${input.repair}`);
  const vehicle = input.vehicle || "the vehicle";
  const finding = sentence(input.finding, "The technician found an issue that needs confirmation before final repair authorization.");
  const repair = sentence(input.repair, "The next step is to approve diagnostic time so the team can confirm the repair recommendation.");
  const unknowns = sentence(input.unknowns, "Final estimate details depend on inspection results, parts availability, and repair validation.");

  const output = {
    explanation: `We inspected ${vehicle} for the reported concern. The technician found: ${finding} The recommended next step is: ${repair}`,
    whyItMatters: [
      "The recommendation is based on the technician finding, not only on the customer's symptom.",
      "The explanation separates confirmed findings from assumptions that still need validation.",
      "Clear language helps the customer approve or decline with less confusion."
    ],
    nextStep: `Review the finding with the customer and request approval for: ${repair}`,
    callScript: `I want to explain what we found on ${vehicle}. The concern you described matches a condition we verified during inspection. The recommendation is ${repair.toLowerCase()} We will document any assumptions before completing the work.`,
    doNotSay: [
      "Do not promise the repair will fix unrelated symptoms.",
      "Do not hide assumptions or unknowns from the customer.",
      "Do not present an estimate as final until parts, labor, and inspection scope are confirmed."
    ],
    advisorDocumentation: `Customer concern: ${sentence(input.concern, "Not provided.")} Finding: ${finding} Recommended action: ${repair}`,
    approvalFraming: "Ask for approval around the next responsible action, not around vague parts replacement.",
    followUpNote: "After approval, document what was repaired, what was tested, and what remains an assumption or future recommendation.",
    objectionIntro: "Keep the response factual, calm, and tied to safety, reliability, or the customer's stated goal.",
    waitResponse: "If the customer asks to wait, explain the risk in plain language and document whether the concern affects safety, reliability, emissions, or convenience.",
    costResponse: "Explain what is included: parts assumption, labor assumption, testing, and validation. Avoid defending price with jargon.",
    clearResponse: "Clearing a warning or code without correcting the cause can hide useful evidence and may allow the concern to return."
  };

  if (combined.includes("brake") || combined.includes("rotor") || combined.includes("pad")) {
    output.explanation = `We inspected ${vehicle} for the braking concern. The technician found that the front brake components are worn beyond the point where resurfacing is the right repair path. That condition can cause vibration and reduce braking smoothness, so the recommendation is to replace the affected pads and rotors, service the sliding surfaces, and road test the vehicle.`;
    output.whyItMatters = [
      "Brakes are a safety system, so the customer should understand the risk without being pressured.",
      "Rotor condition and pad thickness explain why resurfacing or waiting may not be the right recommendation.",
      "A road test after repair confirms the vibration concern was addressed."
    ];
    output.waitResponse = "Because this is a braking concern, waiting can increase vibration, noise, stopping-distance risk, and damage to related components. If the customer declines, document the measurements and safety recommendation.";
    output.costResponse = "The estimate includes the brake parts, labor to replace them correctly, service of the contact points, and a road test to verify the concern.";
  }

  if (combined.includes("high-voltage") || combined.includes("charging") || combined.includes("insulation") || combined.includes("interlock")) {
    output.explanation = `We inspected ${vehicle} for the charging and reduced-power warning. Because the finding involves the high-voltage system, the first step is safety-controlled diagnostic testing by a qualified technician. We should not recommend parts until the interlock, insulation, charging status, and fault data are verified.`;
    output.whyItMatters = [
      "High-voltage concerns require a safety-first process before inspection or repair.",
      "Intermittent warnings need condition-based testing so the team does not guess.",
      "The customer should understand why diagnostic approval comes before a parts estimate."
    ];
    output.nextStep = "Request approval for high-voltage diagnostic testing before quoting a repair.";
    output.callScript = `I want to be careful with this explanation because ${vehicle} has a high-voltage warning. The responsible next step is safety-controlled diagnostic testing. Once the system is safely tested, we can confirm whether a component, connector, charging condition, or insulation issue is causing the warning.`;
    output.waitResponse = "Because this involves high-voltage safety and reduced power, waiting is not recommended until the system is evaluated. The vehicle may limit operation to protect itself or the driver.";
    output.costResponse = "At this stage, the estimate is for qualified diagnostic time. A parts estimate should come after safety testing confirms the affected component or circuit.";
    output.clearResponse = "Clearing this warning without testing can remove evidence and does not prove the high-voltage concern is resolved.";
  }

  if (input.customerType === "Fleet manager") {
    output.callScript += " For fleet planning, the key decision is whether to keep the vehicle in service, schedule controlled downtime, or escalate based on safety and uptime risk.";
    output.whyItMatters.push("Fleet buyers need downtime and safety framing, not only repair detail.");
  }

  if (input.customerType === "Warranty adjuster") {
    output.advisorDocumentation += " Warranty note: include measurements, test evidence, and causal language before requesting authorization.";
  }

  return { ...output, unknowns };
}

function renderList(id, items) {
  const node = $(id);
  node.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
}

function buildExecutiveBrief(input, output) {
  const vehicle = input.vehicle || "the selected vehicle";
  return {
    summary: `${vehicle} demonstrates how raw technician findings become customer-safe authorization language, estimate assumptions, objection handling, and follow-up notes for ${input.customerType.toLowerCase()} conversations.`,
    impact: "The buyer value is consistency: advisors get clearer language, service managers get cleaner documentation, and customers understand urgency without exaggerated claims.",
    demoScript: `I would demo this by pasting technician notes, generating the customer explanation, then showing how estimate assumptions and objection responses stay separate from confirmed findings.`,
    proofPlan: "A proof of value would measure declined-work reasons, advisor call time, documentation consistency, approval rate for safety-critical work, and fewer follow-up clarifications."
  };
}

function renderExecutiveBrief(input, output) {
  const brief = buildExecutiveBrief(input, output);
  $("execSummary").textContent = brief.summary;
  $("execImpact").textContent = brief.impact;
  $("execDemoScript").textContent = brief.demoScript;
  $("execProofPlan").textContent = brief.proofPlan;
  currentExecutiveBrief = [
    "Executive Demo Brief",
    "",
    `Summary: ${brief.summary}`,
    `Buyer Impact: ${brief.impact}`,
    `Live Demo Script: ${brief.demoScript}`,
    `Proof Plan: ${brief.proofPlan}`
  ].join("\n");
  $("briefText").value = currentExecutiveBrief;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = $("briefText");
  textarea.value = text;
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  return copied;
}

function renderOutput() {
  const input = readForm();
  const output = buildOutput(input);
  const vehicle = input.vehicle || "the selected vehicle";

  $("caseSummary").textContent = `Advisor-ready summary for ${vehicle}.`;
  $("urgencyPill").textContent = input.urgency;
  $("urgencyPill").className = `risk ${input.urgency.toLowerCase().replace(/\s+/g, "-")}`;

  $("customerExplanation").textContent = output.explanation;
  renderList("whyItMatters", output.whyItMatters);
  $("nextStep").textContent = output.nextStep;
  $("callScript").textContent = output.callScript;
  renderList("doNotSay", output.doNotSay);

  $("partsAssumption").textContent = input.parts || "No parts assumption entered.";
  $("laborAssumption").textContent = input.labor || "No labor assumption entered.";
  $("unknownAssumption").textContent = output.unknowns;
  $("advisorDocumentation").textContent = output.advisorDocumentation;
  $("approvalFraming").textContent = output.approvalFraming;
  $("followUpNote").textContent = output.followUpNote;

  $("objectionIntro").textContent = output.objectionIntro;
  $("waitResponse").textContent = output.waitResponse;
  $("costResponse").textContent = output.costResponse;
  $("clearResponse").textContent = output.clearResponse;
  renderExecutiveBrief(input, output);
}

function activateTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === name);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === name);
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

$("advisorForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderOutput();
  activateTab("customer");
});

$("loadBrakeCase").addEventListener("click", () => {
  writeForm(samples.brake);
  renderOutput();
});

$("loadEvCase").addEventListener("click", () => {
  writeForm(samples.ev);
  renderOutput();
});

$("resetForm").addEventListener("click", () => {
  writeForm(samples.blank);
  renderOutput();
});

$("copyBrief").addEventListener("click", async () => {
  try {
    if (!currentExecutiveBrief) {
      renderOutput();
    }
    const briefText = currentExecutiveBrief || $("briefText").value;
    $("briefText").value = briefText;
    const copied = await copyText(briefText);
    $("copyStatus").textContent = copied ? "Copied." : "Selected. Press Ctrl+C.";
  } catch {
    $("briefText").focus();
    $("briefText").select();
    $("copyStatus").textContent = "Selected. Press Ctrl+C.";
  }
});

renderOutput();
