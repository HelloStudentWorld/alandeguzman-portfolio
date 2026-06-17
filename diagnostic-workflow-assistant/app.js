const caseLibrary = {
  mini: {
    id: "CASE-2025-0616-0842",
    status: "Live",
    vehicle: "2018 MINI Cooper SE (F56)",
    vin: "VIN: MMWXP7C57J2A12345 - 45,678 mi",
    complaint: "Intermittent reduced power warning after charging. Warning appears most often during first drive of the day.",
    dtcs: "P0A0A, P0AA6",
    observations: "High-voltage interlock status intermittent. Insulation value varies after overnight charge. No visible coolant contamination. 12V battery passes basic test.",
    conditions: "Cold start after overnight charge",
    environment: "Dealer service",
    urgency: "High",
    system: "High Voltage System",
    risk: "High",
    confidence: 78,
    labor: "1.6 - 2.4 hrs",
    parts: "$780 - $1,250",
    currentStep: "Current Step: 2 of 6 - HV System Checks",
    subtitle: "Safety-first workflow for intermittent high-voltage reduced-power warning.",
    path: ["Safety & Pre-Check", "HV System Checks", "Insulation Testing", "Component Isolation", "Root Cause Confirmation", "Repair & Verification"],
    steps: [
      ["Verify high-voltage system disable and PPE", "Pass", "Technician confirmed safety state"],
      ["Check 12V system health", "Pass", "12.6 V resting"],
      ["Inspect HVIL loop and interlock connectors", "Warning", "Intermittent open detected"],
      ["Measure insulation resistance pack to chassis", "Fail", "480 kOhm below 500 kOhm spec assumption"],
      ["Check charge port for moisture or debris", "Pending", "-"],
      ["Scan for related codes and freeze-frame", "Pending", "-"]
    ],
    rootCauses: [
      ["Moisture intrusion in charge port HVIL circuit", 60, "Intermittent HVIL plus low insulation after overnight charge"],
      ["HV battery insulation degradation", 25, "Insulation below spec; validate before expensive part assumption"],
      ["Interlock connector harness fault", 15, "Intermittent connection under vibration or temperature change"]
    ],
    nextTests: [
      "Inspect and dry charge port cavity, then re-check HVIL loop.",
      "Perform insulation test again and compare values.",
      "If still low, isolate battery pack vs. harness. Check for tracking or corrosion.",
      "Review charging-system service information and software updates for this VIN."
    ],
    tools: ["Insulation resistance meter 1000 V", "BMW/MINI ISTA or compatible scan tool", "Service information and TSB access"],
    signals: [
      ["HV Battery Voltage", "377.5 V", "Stable", "ok", [20, 21, 20, 23, 22, 24, 21, 26, 24]],
      ["HV Current", "-1.2 A", "Normal", "ok", [13, 14, 12, 15, 11, 13, 12, 14, 13]],
      ["Insulation Resistance", "480 kOhm", "Low", "warn", [26, 25, 24, 20, 23, 18, 17, 22, 19]],
      ["Interlock Status", "Intermittent", "Warning", "warn", [12, 18, 17, 12, 18, 13, 16, 14, 12]],
      ["HVIL Loop", "Closed", "OK", "ok", [18, 17, 18, 16, 16, 17, 16, 18, 17]],
      ["Coolant Temp", "19 C", "Normal", "ok", [12, 13, 12, 14, 13, 13, 12, 14, 13]]
    ],
    impact: {
      downtime: ["6.4 hrs", "per incident", "Faster first-time fix and fewer comebacks reduce vehicle downtime."],
      labor: ["30-40%", "improvement", "Guided workflow reduces diagnostic time and guesswork."],
      accuracy: ["+28%", "higher first-time fix rate", "Structured path and safety checks improve right-part, right-fix outcomes."],
      parts: ["$180 - $420", "saved per repair", "Better triage avoids unnecessary part replacement."]
    },
    advisor: "This is a safety-first high-voltage diagnostic case. The warning gives us a starting point, but the repair decision should wait until interlock, insulation, charging-state, and freeze-frame evidence are validated.",
    nextStep: "Approve high-voltage diagnostic testing by a qualified technician so the system can be made safe, data can be captured, and the concern can be reproduced under the same charging and cold-start conditions.",
    objection: "If the customer asks why the car cannot be repaired immediately, explain that high-voltage warnings require controlled safety validation before anyone recommends or touches expensive components.",
    obdSummary: "P0A0A and P0AA6 are treated as triage inputs. This demo separates safety gates, HVIL evidence, insulation readings, and charge-state context before making any repair assumption.",
    systems: ["High-voltage interlock loop", "Insulation monitoring", "Charging interface and harness", "12V power stability", "Control-module communication"],
    questions: ["Does the warning appear only after charging?", "Which charger is used?", "Are the faults current, stored, or intermittent?", "Are insulation values stable during a controlled retest?"],
    doNotAssume: ["Do not assume the charge port is failed without HVIL and insulation evidence.", "Do not assume a cleared warning means the high-voltage concern is gone.", "Do not perform inspection without proper high-voltage safety state."],
    roi: { casesPerMonth: 8, hoursSaved: 1.7, costPerHour: 140, partsSaved: 260 }
  },
  honda: {
    id: "CASE-2025-0617-1038",
    status: "Review",
    vehicle: "2011 Honda Accord 2.4L",
    vin: "VIN: 1HGCP2F39BA123456 - 132,410 mi",
    complaint: "Check engine light returned after recent emissions repair. Customer needs vehicle ready for smog inspection.",
    dtcs: "P0420, P0138",
    observations: "Rear oxygen sensor voltage biased high on road test. Catalyst monitor incomplete after battery disconnect. No exhaust leak heard at idle.",
    conditions: "Warm engine mixed drive cycle",
    environment: "Dealer service",
    urgency: "Medium",
    system: "Emissions & Readiness",
    risk: "Medium",
    confidence: 72,
    labor: "1.0 - 1.6 hrs",
    parts: "$190 - $1,100",
    currentStep: "Current Step: 3 of 5 - Sensor & Catalyst Validation",
    subtitle: "Emissions workflow separating active faults from smog-readiness timing.",
    path: ["Intake", "Freeze-Frame Review", "Sensor Graphing", "Catalyst Validation", "Readiness Plan"],
    steps: [
      ["Confirm recent code clear or battery disconnect", "Pass", "Customer reported recent repair"],
      ["Review freeze-frame and monitor status", "Warning", "Catalyst monitor incomplete"],
      ["Graph front and rear oxygen sensor behavior", "Warning", "Rear sensor biased high"],
      ["Inspect exhaust leaks and wiring near O2 circuit", "Pending", "-"],
      ["Validate fuel trims before catalyst recommendation", "Pending", "-"]
    ],
    rootCauses: [
      ["Rear oxygen sensor circuit or sensor bias", 42, "Voltage behavior does not yet prove catalyst failure"],
      ["Catalyst efficiency below threshold", 35, "Possible, but needs fuel trim and exhaust validation first"],
      ["Incomplete drive cycle after battery disconnect", 23, "Readiness issue may be separate from active fault"]
    ],
    nextTests: [
      "Graph front and rear O2 response under warm steady-state cruise.",
      "Inspect rear O2 wiring and connector for damage or contamination.",
      "Check fuel trims and misfire counters before condemning catalyst efficiency.",
      "Complete proper drive cycle after repair decision before advising smog timing."
    ],
    tools: ["Enhanced OBD scan tool", "Exhaust leak inspection tools", "Drive-cycle readiness reference"],
    signals: [
      ["Rear O2 Voltage", "0.89 V", "Biased high", "warn", [24, 25, 25, 26, 25, 26, 27, 26, 27]],
      ["Front O2 Response", "Active", "Normal", "ok", [12, 24, 13, 25, 14, 24, 13, 25, 15]],
      ["Catalyst Monitor", "Incomplete", "Readiness", "warn", [10, 11, 10, 11, 10, 11, 10, 11, 10]],
      ["Fuel Trim STFT", "+3.1%", "OK", "ok", [14, 15, 16, 15, 14, 16, 15, 14, 15]],
      ["Misfire Count", "0", "OK", "ok", [12, 12, 12, 12, 12, 12, 12, 12, 12]],
      ["Exhaust Leak", "Not heard", "Verify", "neutral", [13, 13, 14, 13, 13, 14, 13, 13, 14]]
    ],
    impact: {
      downtime: ["2.7 hrs", "per incident", "Cleaner triage prevents repeat smog-test loops and callbacks."],
      labor: ["22-30%", "improvement", "Advisor and technician share the same readiness plan."],
      accuracy: ["+18%", "better repair confidence", "Sensor data, fuel trims, and readiness status are validated separately."],
      parts: ["$250 - $700", "avoided wrong-part risk", "Workflow reduces premature catalyst recommendations."]
    },
    advisor: "The emissions fault and the smog-readiness status are related, but they are not the same decision. The next diagnostic step validates oxygen-sensor behavior, fuel control, exhaust condition, and monitor readiness before recommending parts.",
    nextStep: "Approve emissions diagnostic testing and a readiness plan. After repair, the vehicle may still need a proper drive cycle before smog inspection.",
    objection: "If the customer asks why it cannot go straight to smog, explain that monitors must complete before inspection. A cleared light does not always mean the vehicle is ready.",
    obdSummary: "P0420 and P0138 should not trigger an automatic catalyst quote. This workflow validates sensor behavior, fuel trims, exhaust condition, and readiness history first.",
    systems: ["Catalyst efficiency", "Front and rear oxygen sensors", "Fuel trims", "Exhaust leaks", "Monitor readiness"],
    questions: ["Was the battery disconnected or were codes cleared recently?", "Are catalyst and O2 monitors complete?", "Does rear O2 activity mirror the front sensor?", "Are fuel trims normal at idle and cruise?"],
    doNotAssume: ["Do not assume P0420 automatically means the catalyst is failed.", "Do not promise smog readiness immediately after clearing codes.", "Do not ignore fuel control or exhaust leaks before recommending emissions parts."],
    roi: { casesPerMonth: 6, hoursSaved: 1.1, costPerHour: 115, partsSaved: 410 }
  }
};

const personas = {
  fleet: {
    label: "Fleet Manager",
    emphasis: "downtime avoided, repeat escalation control, and vehicle availability",
    script: [
      "The problem - complex cases create downtime and repeated clarification loops.",
      "Our approach - intake, safety gate, evidence, and buyer-ready handoff.",
      "Live demo - messy complaint to validated root-cause ranking.",
      "Business impact - fewer days out of service and cleaner approval decisions.",
      "Next step - pilot on repeat diagnostic escalations."
    ]
  },
  service: {
    label: "Service Director",
    emphasis: "diagnostic consistency, technician utilization, and advisor confidence",
    script: [
      "The problem - note quality and diagnostic paths vary by technician.",
      "Our approach - standardize intake and validation without replacing technician judgment.",
      "Live demo - show how evidence becomes a service-ready workflow.",
      "Business impact - better throughput, cleaner dispatch, and fewer comeback loops.",
      "Next step - run a small proof with high-friction diagnostic categories."
    ]
  },
  support: {
    label: "Remote Support",
    emphasis: "clean escalations, consistent evidence packages, and faster handoffs",
    script: [
      "The problem - support teams receive incomplete case notes.",
      "Our approach - convert raw symptoms into a structured escalation packet.",
      "Live demo - switch between technical, advisor, and OBD triage views.",
      "Business impact - fewer back-and-forth questions and faster next actions.",
      "Next step - define escalation templates around common fault families."
    ]
  },
  exec: {
    label: "Executive Buyer",
    emphasis: "measurable proof of value, risk control, and operating leverage",
    script: [
      "The problem - diagnostic complexity creates hidden labor and customer-experience cost.",
      "Our approach - workflow intelligence that makes expert process repeatable.",
      "Live demo - from one case to operational metrics and proof plan.",
      "Business impact - faster decisions, lower parts risk, and better capacity use.",
      "Next step - agree on pilot KPIs and success threshold."
    ]
  }
};

let activeModel = null;
let currentBrief = "";
let currentTalkTrack = "";
let activeDemoMode = "15";

const $ = (id) => document.getElementById(id);

const demoModes = {
  5: {
    label: "5 min talk track",
    framing: "fast recruiter screen",
    steps: ["Problem", "Workflow", "Buyer value"]
  },
  15: {
    label: "15 min talk track",
    framing: "standard Sales Engineer interview demo",
    steps: ["Problem", "Approach", "Live demo", "Business impact", "Next step"]
  },
  30: {
    label: "30 min talk track",
    framing: "deep-dive panel demo",
    steps: ["Discovery", "Current-state pain", "Workflow walkthrough", "Technical validation", "Persona handoff", "ROI model", "Pilot plan"]
  }
};

function cloneCase(key) {
  return JSON.parse(JSON.stringify(caseLibrary[key] || caseLibrary.mini));
}

function readInputs() {
  return {
    complaint: $("complaint").value.trim(),
    dtcs: $("dtcs").value.trim(),
    observations: $("observations").value.trim(),
    conditions: $("conditions").value,
    environment: $("environment").value,
    urgency: $("urgency").value
  };
}

function writeInputs(model) {
  $("complaint").value = model.complaint;
  $("dtcs").value = model.dtcs;
  $("observations").value = model.observations;
  $("conditions").value = model.conditions;
  $("environment").value = model.environment;
  $("urgency").value = model.urgency;
  updateCounts();
}

function chooseModelFromInputs(input) {
  const text = `${input.complaint} ${input.dtcs} ${input.observations} ${input.conditions}`.toLowerCase();
  if (text.includes("p0420") || text.includes("p0138") || text.includes("smog") || text.includes("emissions") || text.includes("catalyst")) {
    return cloneCase("honda");
  }
  if (text.includes("p0a") || text.includes("high-voltage") || text.includes("insulation") || text.includes("charging") || text.includes("interlock")) {
    return cloneCase("mini");
  }
  const fallback = cloneCase("mini");
  fallback.id = "CASE-CUSTOM-DEMO";
  fallback.status = "Draft";
  fallback.vehicle = "Custom Diagnostic Case";
  fallback.vin = "Simulated portfolio case - no VIN lookup";
  fallback.system = "Guided Diagnostic Workflow";
  fallback.confidence = input.urgency === "High" ? 66 : 58;
  fallback.subtitle = "Generic deterministic workflow based on the provided intake.";
  fallback.path = ["Intake", "Safety Screen", "Evidence Review", "System Isolation", "Customer Handoff"];
  fallback.currentStep = "Current Step: 2 of 5 - Evidence Review";
  fallback.rootCauses = [
    ["System fault requiring validation", 45, "Symptoms and observations need structured confirmation"],
    ["Harness, connector, or power issue", 32, "Intermittent concerns often require baseline electrical checks"],
    ["Operating-condition pattern", 23, "Concern may depend on temperature, load, state of charge, or drive cycle"]
  ];
  fallback.advisor = "The entered information is enough to build a diagnostic plan, but not enough to make a repair recommendation. The demo organizes the case into safety checks, evidence capture, system isolation, and customer-safe language.";
  fallback.nextStep = "Approve diagnostic time to reproduce the concern, capture current data, and validate the affected system before recommending parts.";
  fallback.obdSummary = "Entered DTCs are treated as triage inputs. The workflow asks what must be validated before the code can become a repair decision.";
  fallback.roi = { casesPerMonth: 5, hoursSaved: 0.9, costPerHour: 120, partsSaved: 180 };
  return fallback;
}

function buildActiveModel() {
  const input = readInputs();
  const model = chooseModelFromInputs(input);
  model.complaint = input.complaint || model.complaint;
  model.dtcs = input.dtcs || model.dtcs;
  model.observations = input.observations || model.observations;
  model.conditions = input.conditions || model.conditions;
  model.environment = input.environment || model.environment;
  model.urgency = input.urgency || model.urgency;
  model.risk = model.urgency;
  model.confidence = Math.max(50, Math.min(92, model.confidence + (model.urgency === "High" ? 4 : model.urgency === "Low" ? -5 : 0)));
  return model;
}

function updateCounts() {
  $("complaintCount").textContent = $("complaint").value.length;
  $("observationsCount").textContent = $("observations").value.length;
}

function setText(id, text) {
  const node = $(id);
  if (node) node.textContent = text;
}

function markSearchable(node, text) {
  if (!node) return;
  node.classList.add("searchable");
  node.dataset.search = String(text || node.textContent || "").toLowerCase();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function sparkline(points, tone) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 112 + 4;
    const y = 30 - ((point - min) / range) * 22;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return `<svg class="sparkline ${tone}" viewBox="0 0 120 34" aria-hidden="true"><polyline points="${coords}"></polyline></svg>`;
}

function renderCaseStrip(model) {
  setText("caseId", model.id);
  setText("caseStatus", model.status);
  setText("caseVehicle", model.vehicle);
  setText("caseVin", model.vin);
  setText("systemArea", model.system);
  setText("riskLevel", model.risk);
  setText("confidenceValue", `${model.confidence}%`);
  $("confidenceBar").style.width = `${model.confidence}%`;
  setText("laborEstimate", model.labor);
  setText("partsEstimate", model.parts);
  markSearchable($("caseVehicle"), `${model.vehicle} ${model.dtcs}`);
  markSearchable($("caseVin"), model.vin);
  markSearchable($("systemArea"), model.system);
  markSearchable($("riskLevel"), model.risk);
  markSearchable($("partsEstimate"), model.parts);
}

function renderSignals(model) {
  const grid = $("signalGrid");
  clearNode(grid);
  model.signals.forEach(([label, value, status, tone, points]) => {
    const card = document.createElement("article");
    card.className = `signal-card ${tone}`;
    markSearchable(card, `${label} ${value} ${status}`);
    card.innerHTML = `<span>${label}</span><strong></strong>${sparkline(points, tone)}<small></small>`;
    card.querySelector("strong").textContent = value;
    card.querySelector("small").textContent = status;
    grid.appendChild(card);
  });
}

function renderPath(model) {
  const list = $("pathSteps");
  clearNode(list);
  model.path.forEach((step, index) => {
    const item = document.createElement("li");
    item.className = index < 2 ? "complete" : index === 2 ? "active" : "";
    markSearchable(item, step);
    item.innerHTML = `<span>${index + 1}</span><strong></strong>`;
    item.querySelector("strong").textContent = step;
    list.appendChild(item);
  });
}

function resultClass(result) {
  return String(result).toLowerCase().replace(/[^a-z]+/g, "-");
}

function renderStepRows(model) {
  const rows = $("stepRows");
  clearNode(rows);
  model.steps.forEach(([step, result, detail]) => {
    const row = document.createElement("tr");
    markSearchable(row, `${step} ${result} ${detail}`);
    row.innerHTML = `<td></td><td><span class="result ${resultClass(result)}"></span></td><td></td>`;
    row.children[0].textContent = step;
    row.querySelector(".result").textContent = result;
    row.children[2].textContent = detail;
    rows.appendChild(row);
  });
}

function renderRootCauses(model) {
  const rows = $("rootCauseRows");
  clearNode(rows);
  model.rootCauses.forEach(([cause, probability, why], index) => {
    const row = document.createElement("tr");
    markSearchable(row, `${cause} ${probability} ${why}`);
    row.innerHTML = `<td>${index + 1}</td><td></td><td><div class="probability"><i></i><span>${probability}%</span></div></td><td></td>`;
    row.children[1].textContent = cause;
    row.querySelector("i").style.width = `${probability}%`;
    row.children[3].textContent = why;
    rows.appendChild(row);
  });
}

function renderPlainList(id, items) {
  const list = $(id);
  clearNode(list);
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    markSearchable(li, text);
    list.appendChild(li);
  });
}

function buildTalkTrackLines(model, persona) {
  if (activeDemoMode === "5") {
    return [
      `Problem - ${persona.label}s need a faster way to turn messy diagnostic intake into a trusted next step.`,
      `Workflow - this static demo converts ${model.dtcs} and technician observations into safety gates, validation steps, root-cause ranking, and stakeholder language.`,
      `Buyer value - ${persona.emphasis}; modeled value is $${monthlyImpact(model).toLocaleString()}/mo from simulated assumptions.`
    ];
  }

  if (activeDemoMode === "30") {
    return [
      `Discovery - ask where diagnostic context gets lost today, who owns the next decision, and what one day of downtime costs.`,
      `Current-state pain - ${model.vehicle} starts with symptoms, DTCs, observations, safety constraints, and incomplete buyer context.`,
      `Workflow walkthrough - show ${model.path.join(" > ")} and explain why each gate reduces guessing.`,
      `Technical validation - review the validation table, signal snapshot, and top root cause: ${model.rootCauses[0][0]}.`,
      `Persona handoff - switch buyer persona to show how the same evidence becomes fleet, service, support, or executive language.`,
      `ROI model - tie ${model.roi.casesPerMonth} monthly cases, ${model.roi.hoursSaved} saved hours, and parts-risk control to business value.`,
      `Pilot plan - define success as fewer clarification loops, cleaner handoffs, faster triage, and better first-decision quality.`
    ];
  }

  return persona.script;
}

function monthlyImpact(model) {
  return Math.round(model.roi.casesPerMonth * ((model.roi.hoursSaved * model.roi.costPerHour) + model.roi.partsSaved));
}

function renderImpact(model) {
  const persona = personas[$("buyerPersona").value] || personas.fleet;
  const mode = demoModes[activeDemoMode] || demoModes["15"];
  const stack = $("impactCards");
  clearNode(stack);
  [
    ["Downtime Avoided", ...model.impact.downtime, "line"],
    ["Labor Efficiency", ...model.impact.labor, "bars"],
    ["Repair Accuracy", ...model.impact.accuracy, "ring"],
    ["Parts Spend Control", ...model.impact.parts, "line"]
  ].forEach(([title, value, unit, copy, chart]) => {
    const card = document.createElement("article");
    card.className = "impact-card";
    card.innerHTML = `<div><h3></h3><strong></strong><span></span><p></p></div><div class="mini-chart ${chart}" aria-hidden="true"></div>`;
    card.querySelector("h3").textContent = title;
    card.querySelector("strong").textContent = value;
    card.querySelector("span").textContent = unit;
    card.querySelector("p").textContent = copy;
    stack.appendChild(card);
  });

  const proof = document.createElement("article");
  proof.className = "impact-card proof";
  proof.innerHTML = `<div><h3>Modeled Proof Value</h3><strong></strong><span>monthly portfolio-demo estimate</span><p></p></div>`;
  proof.querySelector("strong").textContent = `$${monthlyImpact(model).toLocaleString()}/mo`;
  proof.querySelector("p").textContent = `Persona focus: ${persona.emphasis}. Based on ${model.roi.casesPerMonth} cases/month, ${model.roi.hoursSaved} hrs saved, $${model.roi.costPerHour}/hr downtime, and $${model.roi.partsSaved} avoided parts risk per case.`;
  stack.appendChild(proof);

  const script = $("demoScript");
  clearNode(script);
  setText("demoModeLabel", `${mode.label} - ${mode.framing}`);
  const lines = buildTalkTrackLines(model, persona);
  currentTalkTrack = [
    `Sales Engineer Talk Track - ${mode.label}`,
    `Persona: ${persona.label}`,
    `Case: ${model.vehicle}`,
    "",
    ...lines.map((line, index) => `${index + 1}. ${line}`),
    "",
    "Boundary: static simulated workflow demo, not a production diagnostic recommendation."
  ].join("\n");
  $("talkTrackText").value = currentTalkTrack;
  lines.forEach((line, index) => {
    const li = document.createElement("li");
    markSearchable(li, line);
    li.innerHTML = `<span>${index + 1}</span><p></p>`;
    li.querySelector("p").textContent = line;
    script.appendChild(li);
  });
}

function renderExplanation(model) {
  setText("advisorExplanation", model.advisor);
  setText("customerNextStep", model.nextStep);
  setText("objectionHandling", model.objection);
  setText("obdSummary", model.obdSummary);
  renderPlainList("systemsToCheck", model.systems);
  renderPlainList("triageQuestions", model.questions);
  renderPlainList("doNotAssume", model.doNotAssume);
}

function buildBrief(model) {
  const persona = personas[$("buyerPersona").value] || personas.fleet;
  return [
    "Executive Demo Brief",
    "",
    `Case: ${model.id} - ${model.vehicle}`,
    `System: ${model.system}; Risk: ${model.risk}; Confidence: ${model.confidence}%.`,
    `Workflow: ${model.path.join(" > ")}.`,
    `Top root cause: ${model.rootCauses[0][0]} (${model.rootCauses[0][1]}% simulated confidence).`,
    `Buyer focus: ${persona.label} - ${persona.emphasis}.`,
    `Modeled value: $${monthlyImpact(model).toLocaleString()}/mo from simulated assumptions.`,
    "",
    "Talk track:",
    ...persona.script.map((line, index) => `${index + 1}. ${line}`),
    "",
    "Boundary: This is a static portfolio workflow demo using simulated data and deterministic case logic. It is not OEM service data, a real diagnostic result, or a production repair recommendation."
  ].join("\n");
}

function applySearch() {
  const input = $("searchInput");
  const query = input.value.trim().toLowerCase();
  const nodes = Array.from(document.querySelectorAll(".searchable"));
  const dtcMatch = query && $("dtcs").value.toLowerCase().includes(query);
  let matches = 0;

  document.body.classList.toggle("is-searching", Boolean(query));
  $("dtcs").classList.toggle("search-match", Boolean(dtcMatch));

  nodes.forEach((node) => {
    const hit = Boolean(query && node.dataset.search && node.dataset.search.includes(query));
    node.classList.toggle("search-match", hit);
    if (hit) matches += 1;
  });

  if (!query) {
    setText("searchStatus", "Search highlights workflow evidence.");
    return;
  }

  setText("searchStatus", `${matches + (dtcMatch ? 1 : 0)} match${matches + (dtcMatch ? 1 : 0) === 1 ? "" : "es"} for "${query}" across DTCs, systems, root causes, and workflow steps.`);
}

async function copyFromTextArea(text, targetId, statusId) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      $(targetId).value = text;
      $(targetId).focus();
      $(targetId).select();
      document.execCommand("copy");
    }
    setText(statusId, "Copied");
  } catch {
    $(targetId).value = text;
    $(targetId).focus();
    $(targetId).select();
    setText(statusId, "Selected - press Ctrl+C");
  }
}

async function copyBrief() {
  currentBrief = buildBrief(activeModel || buildActiveModel());
  await copyFromTextArea(currentBrief, "briefText", "briefStatus");
}

async function copyTalkTrack() {
  if (!currentTalkTrack) renderDashboard();
  await copyFromTextArea(currentTalkTrack, "talkTrackText", "talkTrackStatus");
}

function workflowSection(title, items) {
  return `
    <section>
      <h3>${escapeHtml(title)}</h3>
      <ul>${items.map((item) => `<li>${escapeHtml(Array.isArray(item) ? item.join(" - ") : item)}</li>`).join("")}</ul>
    </section>
  `;
}

function renderWorkflowModal(model) {
  setText("workflowModalTitle", `${model.vehicle} - ${model.system}`);
  $("workflowModalBody").innerHTML = [
    workflowSection("Recommended Path", model.path),
    workflowSection("Validation Steps", model.steps.map(([step, result, detail]) => `${step}: ${result} - ${detail}`)),
    workflowSection("Likely Root Causes", model.rootCauses.map(([cause, probability, why]) => `${probability}% - ${cause}: ${why}`)),
    workflowSection("Next Test Steps", model.nextTests),
    workflowSection("Required Tools", model.tools),
    workflowSection("Buyer Proof", [
      `Modeled value: $${monthlyImpact(model).toLocaleString()}/mo`,
      `Labor estimate: ${model.labor}`,
      `Parts assumption: ${model.parts}`,
      `Demo boundary: simulated data only`
    ])
  ].join("");
}

function openWorkflowModal() {
  renderWorkflowModal(activeModel || buildActiveModel());
  $("workflowModal").classList.add("open");
  $("workflowModal").setAttribute("aria-hidden", "false");
  $("closeWorkflowModal").focus();
}

function closeWorkflowModal() {
  $("workflowModal").classList.remove("open");
  $("workflowModal").setAttribute("aria-hidden", "true");
  $("fullWorkflowButton").focus();
}

function renderDashboard() {
  activeModel = buildActiveModel();
  renderCaseStrip(activeModel);
  renderSignals(activeModel);
  renderPath(activeModel);
  setText("workflowSubtitle", activeModel.subtitle);
  setText("currentStepTitle", activeModel.currentStep);
  renderStepRows(activeModel);
  renderRootCauses(activeModel);
  renderPlainList("nextTestSteps", activeModel.nextTests);
  renderPlainList("requiredTools", activeModel.tools);
  renderImpact(activeModel);
  renderExplanation(activeModel);
  currentBrief = buildBrief(activeModel);
  $("briefText").value = currentBrief;
  applySearch();
}

function loadCase(key) {
  writeInputs(cloneCase(key));
  document.querySelectorAll("[data-case]").forEach((button) => button.classList.toggle("active", button.dataset.case === key));
  setText("briefStatus", "");
  renderDashboard();
}

function activateTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  document.querySelectorAll(".stage-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `${name}Panel`));
}

document.addEventListener("DOMContentLoaded", () => {
  writeInputs(caseLibrary.mini);
  renderDashboard();

  $("diagnosticForm").addEventListener("submit", (event) => {
    event.preventDefault();
    setText("briefStatus", "");
    document.querySelectorAll("[data-case]").forEach((button) => button.classList.remove("active"));
    renderDashboard();
    activateTab("workflow");
  });

  $("loadMiniCase").addEventListener("click", () => loadCase("mini"));
  $("loadHondaCase").addEventListener("click", () => loadCase("honda"));
  $("clearCase").addEventListener("click", () => {
    ["complaint", "dtcs", "observations"].forEach((id) => { $(id).value = ""; });
    $("urgency").value = "Medium";
    updateCounts();
    renderDashboard();
  });

  $("buyerPersona").addEventListener("change", () => {
    setText("briefStatus", "");
    renderDashboard();
  });

  $("briefButton").addEventListener("click", copyBrief);
  $("copyTalkTrack").addEventListener("click", copyTalkTrack);
  $("fullWorkflowButton").addEventListener("click", openWorkflowModal);
  $("closeWorkflowModal").addEventListener("click", closeWorkflowModal);
  document.querySelector("[data-close-modal]").addEventListener("click", closeWorkflowModal);
  $("searchInput").addEventListener("input", applySearch);
  document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));
  document.querySelectorAll("[data-demo-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDemoMode = button.dataset.demoMode;
      document.querySelectorAll("[data-demo-mode]").forEach((item) => item.classList.toggle("active", item === button));
      setText("talkTrackStatus", "");
      renderDashboard();
    });
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("searchInput").focus();
    }
    if (event.key === "Escape" && $("workflowModal").classList.contains("open")) {
      closeWorkflowModal();
    }
  });
  ["complaint", "observations"].forEach((id) => $(id).addEventListener("input", updateCounts));
});
