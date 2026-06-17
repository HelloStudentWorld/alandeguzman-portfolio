const cases = {
  ev: {
    vehicle: "2018 MINI Cooper SE",
    dtcs: "P0AA6, P0A0A",
    symptom: "Reduced power warning after overnight charging. Warning clears after key cycle but returns intermittently.",
    observations: "High-voltage interlock status intermittent. Insulation value varies after overnight charge. 12V battery passes basic test.",
    useCase: "Dealer service",
    assetStatus: "Intermittent / customer driving",
    conditions: "Cold start after overnight charging. Concern is not present every drive cycle."
  },
  emissions: {
    vehicle: "2011 Honda Accord",
    dtcs: "P0420, P0138",
    symptom: "Check engine light returned before smog inspection. No major drivability complaint.",
    observations: "Rear oxygen sensor voltage biased high. Catalyst monitor incomplete after battery disconnect. No exhaust leak heard at idle.",
    useCase: "Warranty review",
    assetStatus: "Vehicle available",
    conditions: "Warm engine, mixed city/highway drive cycle, recent emissions repair."
  },
  network: {
    vehicle: "2020 Fleet Van",
    dtcs: "U0100, U0121",
    symptom: "Multiple warning lamps after intermittent no-start. Driver reports issue after heavy rain.",
    observations: "Lost communication with ECM and ABS modules in history. Battery voltage low during first scan. Water intrusion suspected near lower harness.",
    useCase: "Fleet maintenance",
    assetStatus: "Vehicle down",
    conditions: "Rain event, vehicle parked outdoors, intermittent no-start."
  },
  blank: {
    vehicle: "",
    dtcs: "",
    symptom: "",
    observations: "",
    useCase: "Dealer service",
    assetStatus: "Vehicle available",
    conditions: ""
  }
};

function $(id) {
  return document.getElementById(id);
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function parseCodes(dtcs) {
  return String(dtcs || "")
    .split(/[,\s]+/)
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

function readForm() {
  return {
    vehicle: $("vehicle").value.trim(),
    dtcs: $("dtcs").value.trim(),
    symptom: $("symptom").value.trim(),
    observations: $("observations").value.trim(),
    useCase: $("useCase").value,
    assetStatus: $("assetStatus").value,
    conditions: $("conditions").value.trim()
  };
}

function writeForm(data) {
  $("vehicle").value = data.vehicle;
  $("dtcs").value = data.dtcs;
  $("symptom").value = data.symptom;
  $("observations").value = data.observations;
  $("useCase").value = data.useCase;
  $("assetStatus").value = data.assetStatus;
  $("conditions").value = data.conditions;
}

function baseOutput(input) {
  const codes = parseCodes(input.dtcs);
  return {
    severity: input.assetStatus === "Vehicle down" ? "High" : "Medium",
    systems: [
      "Power and ground",
      "Related sensors or actuators",
      "Control-module communication",
      "Wiring, connectors, and recent service areas"
    ],
    redFlags: [
      "Safety-related warning lamps or reduced operation.",
      "Faults that are current, repeatable, or paired with low voltage.",
      "Missing freeze-frame or status data before codes are cleared."
    ],
    nextTests: [
      "Confirm DTC status: current, pending, history, permanent, or intermittent.",
      "Capture freeze-frame, live data, voltage status, and operating conditions.",
      "Check service information for diagnostic sequence and known patterns.",
      "Validate the symptom before recommending parts."
    ],
    doNotAssume: [
      "Do not assume the component named in a code description is failed.",
      "Do not treat an intermittent code as fixed because it is not active now.",
      "Do not clear codes before evidence is documented."
    ],
    dispatchQuestions: [
      "When did the concern occur and what was the vehicle doing?",
      "Was there recent service, battery work, charging, weather, collision, or aftermarket installation?",
      "Is the DTC current or history?",
      "What live data confirms or contradicts the code?"
    ],
    dataToCapture: [
      "DTC status and freeze-frame.",
      "Battery voltage and network voltage if available.",
      "Mileage, operating condition, and customer words.",
      "Photos or notes for visible damage, fluid intrusion, or connector issues."
    ],
    escalationLogic: "Escalate when the code set affects safety, uptime, repeated failure, high-voltage systems, brake/steering systems, or when remote data is insufficient for a confident next step.",
    buyerExplanation: `The code set (${codes.join(", ") || "none entered"}) gives the team a starting point. The correct action depends on confirming status, context, and supporting data before dispatch, repair, or warranty decisions.`,
    handoffSummary: `For ${input.vehicle || "the asset"}, treat ${codes.join(", ") || "the entered DTCs"} as triage input. Document symptom, conditions, code status, and what has already been ruled out before escalation.`,
    fleetNote: "Use this output to decide whether the asset can stay in service, needs scheduled downtime, or requires immediate inspection.",
    advisorNote: "Explain that the code identifies a system concern, but testing confirms the cause and prevents guessing.",
    productSignal: "Repeated unclear code sets may indicate a need for better guided workflows, field validation prompts, or integration with work-order notes.",
    salesAngle: "This shows how diagnostic data becomes an operational workflow, not just a dashboard alert."
  };
}

function buildOutput(input) {
  const text = normalize(`${input.vehicle} ${input.dtcs} ${input.symptom} ${input.observations} ${input.conditions}`);
  const output = baseOutput(input);

  if (text.includes("p0a") || text.includes("high-voltage") || text.includes("insulation") || text.includes("charging")) {
    output.severity = "Safety critical";
    output.systems = [
      "High-voltage interlock loop",
      "Insulation monitoring",
      "Charging interface and harness",
      "12V power stability",
      "Power-management control modules"
    ];
    output.redFlags = [
      "High-voltage safety concern requires qualified technician validation.",
      "Intermittent insulation values can indicate condition-specific risk.",
      "Reduced power after charging may affect safe operation."
    ];
    output.nextTests = [
      "Follow OEM high-voltage disable, PPE, and verification steps before inspection.",
      "Capture current and history status for high-voltage faults.",
      "Verify 12V stability because low voltage can distort high-voltage diagnostics.",
      "Reproduce after overnight charging if the condition is charge-state dependent.",
      "Inspect connectors/harnesses only after the system is confirmed safe."
    ];
    output.doNotAssume = [
      "Do not assume the charging port is failed without interlock and insulation evidence.",
      "Do not touch high-voltage components without OEM safety state.",
      "Do not clear intermittent high-voltage faults before documenting values."
    ];
    output.escalationLogic = "Escalate immediately to a qualified EV/high-voltage technician. Remote support should collect data, but final safety and repair decisions require OEM procedure and trained validation.";
    output.buyerExplanation = "High-voltage codes should be treated as a safety workflow first and a repair workflow second. The value is knowing what to capture, when to stop remote triage, and how to route the case safely.";
  } else if (text.includes("p0420") || text.includes("p0138") || text.includes("catalyst") || text.includes("oxygen") || text.includes("smog")) {
    output.severity = "Medium";
    output.systems = [
      "Catalyst efficiency",
      "Front and rear oxygen sensor behavior",
      "Fuel trim and misfire data",
      "Exhaust leaks",
      "Readiness monitors"
    ];
    output.redFlags = [
      "Smog deadline creates customer urgency, but readiness and repair are separate issues.",
      "Catalyst codes can be caused by fuel control, exhaust leaks, sensors, or catalyst condition.",
      "Recent battery disconnect or code clear can delay monitor readiness."
    ];
    output.nextTests = [
      "Check freeze-frame and readiness monitor status before clearing codes.",
      "Graph oxygen-sensor behavior during warm steady-state operation.",
      "Verify fuel trims and misfire counters.",
      "Inspect for exhaust leaks before recommending catalyst replacement.",
      "Plan drive cycle and retest before smog inspection."
    ];
    output.doNotAssume = [
      "Do not assume P0420 automatically means catalyst replacement.",
      "Do not promise smog readiness immediately after code clearing.",
      "Do not ignore fuel control before evaluating catalyst efficiency."
    ];
    output.escalationLogic = "Escalate when emissions readiness timing affects the customer's deadline or when sensor/catalyst data conflicts with repair history.";
    output.buyerExplanation = "Emissions fault data is useful only when paired with readiness status, sensor behavior, and recent service history. The workflow prevents unnecessary parts replacement and unrealistic smog timing promises.";
  } else if (text.includes("u0") || text.includes("lost communication") || text.includes("network") || text.includes("no-start") || text.includes("rain")) {
    output.severity = "High";
    output.systems = [
      "Control-module network",
      "Battery and charging system",
      "Ground distribution",
      "Harness routing and water intrusion points",
      "Communication gateway or affected modules"
    ];
    output.redFlags = [
      "Vehicle down or intermittent no-start affects uptime and dispatch decisions.",
      "Low voltage can create misleading communication faults.",
      "Water intrusion can make faults intermittent and recurring."
    ];
    output.nextTests = [
      "Stabilize and test battery voltage before network diagnosis.",
      "Identify current versus history communication faults.",
      "Inspect likely water intrusion paths and harness low points.",
      "Check power/ground at affected modules before replacing modules.",
      "Document weather and no-start conditions for repeatability."
    ];
    output.doNotAssume = [
      "Do not replace a module until power, ground, and network integrity are verified.",
      "Do not ignore low-voltage history in communication faults.",
      "Do not dispatch the vehicle until no-start risk is understood."
    ];
    output.escalationLogic = "Escalate to fleet maintenance when the asset is down, when low voltage is unresolved, or when network faults affect safety or dispatch reliability.";
    output.buyerExplanation = "Network codes need context because one weak battery, ground issue, or water intrusion point can trigger many module faults. The workflow helps prevent unnecessary module replacement.";
  }

  if (input.useCase === "Remote support") {
    output.dispatchQuestions.push("What data can be confirmed remotely versus requiring hands-on inspection?");
    output.salesAngle = "This is a remote-support triage layer: collect enough context to route the case without pretending remote data is a final diagnosis.";
  }

  if (input.useCase === "Warranty review") {
    output.dataToCapture.push("Repair history, photos, measurements, and causal evidence for authorization.");
    output.productSignal = "Warranty workflows need clean evidence chains: symptom, code status, test result, causal finding, and repair recommendation.";
  }

  return output;
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

function renderOutput() {
  const input = readForm();
  const output = buildOutput(input);
  const vehicle = input.vehicle || "the selected vehicle";

  $("caseSummary").textContent = `Initial triage for ${vehicle}.`;
  $("severityPill").textContent = output.severity;
  $("severityPill").className = `risk ${output.severity.toLowerCase().replace(/\s+/g, "-")}`;
  renderList("systems", output.systems);
  renderList("redFlags", output.redFlags);
  renderList("nextTests", output.nextTests);
  renderList("doNotAssume", output.doNotAssume);
  renderList("dispatchQuestions", output.dispatchQuestions);
  renderList("dataToCapture", output.dataToCapture);
  $("escalationLogic").textContent = output.escalationLogic;
  $("buyerExplanation").textContent = output.buyerExplanation;
  $("handoffSummary").textContent = output.handoffSummary;
  $("fleetNote").textContent = output.fleetNote;
  $("advisorNote").textContent = output.advisorNote;
  $("productSignal").textContent = output.productSignal;
  $("salesAngle").textContent = output.salesAngle;
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

$("triageForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderOutput();
  activateTab("triage");
});

$("loadEvCase").addEventListener("click", () => {
  writeForm(cases.ev);
  renderOutput();
});

$("loadEmissionsCase").addEventListener("click", () => {
  writeForm(cases.emissions);
  renderOutput();
});

$("loadNetworkCase").addEventListener("click", () => {
  writeForm(cases.network);
  renderOutput();
});

$("resetForm").addEventListener("click", () => {
  writeForm(cases.blank);
  renderOutput();
});

renderOutput();
