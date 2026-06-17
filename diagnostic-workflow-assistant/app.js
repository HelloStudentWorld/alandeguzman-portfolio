const sampleCases = {
  mini: {
    vehicle: "2018 MINI Cooper SE",
    complaint: "Intermittent reduced power warning after charging. Customer reports the warning appears most often during the first drive of the day.",
    dtcs: "P0A0A, P0AA6",
    observations: "High-voltage interlock status intermittent. Insulation value varies after overnight charge. No visible coolant contamination. 12V battery passes basic test.",
    conditions: "Cold start after overnight charge. Warning clears after key cycle but returns intermittently.",
    environment: "Dealer service",
    urgency: "High"
  },
  honda: {
    vehicle: "2011 Honda Accord",
    complaint: "Check engine light returned after recent emissions-related repair. Customer needs vehicle ready for smog inspection.",
    dtcs: "P0420, P0138",
    observations: "Rear oxygen sensor voltage biased high on road test. Catalyst monitor incomplete after battery disconnect. No exhaust leak heard at idle.",
    conditions: "Warm engine, mixed city/highway drive cycle, no drivability complaint.",
    environment: "Dealer service",
    urgency: "Medium"
  },
  blank: {
    vehicle: "",
    complaint: "",
    dtcs: "",
    observations: "",
    conditions: "",
    environment: "Dealer service",
    urgency: "Medium"
  }
};

const defaultOutputs = {
  diagnosticPaths: [
    "Confirm the customer's complaint, when it appears, and whether it correlates with charging, cold start, speed, load, or ambient temperature.",
    "Separate root-cause data from symptom data by checking freeze-frame, live data, service information, and recent repair history.",
    "Use the DTCs as clues, then validate power, ground, network, sensor, actuator, and mechanical conditions before recommending parts."
  ],
  safetyChecks: [
    "Follow all OEM safety procedures before testing high-voltage, fuel, braking, steering, lift, or restraint systems.",
    "Do not clear codes until freeze-frame and current status are documented.",
    "Mark all assumptions that require technician validation."
  ],
  testSteps: [
    "Verify battery state, charging status, and related baseline conditions.",
    "Inspect connectors, harness routing, service bulletins, and known pattern failures for the affected system.",
    "Run a controlled reproduction test and document pass/fail evidence.",
    "Escalate if safety-related data is inconsistent or repeatable failure cannot be isolated."
  ],
  technicianNotes: [
    "Document customer words separately from technician observations.",
    "Capture DTC status: current, pending, history, permanent, and monitor readiness where relevant.",
    "Record what has been ruled out, not only what still looks likely."
  ],
  advisorExplanation: "The warning or fault code gives us a starting point, but the correct repair depends on confirming why the system is reporting the issue. The next step is controlled testing so we can avoid guessing and give a repair recommendation supported by evidence.",
  customerNextStep: "Approve diagnostic time to reproduce the concern, capture current data, and confirm the affected system before any repair recommendation.",
  assumptions: [
    "DTCs and observations are accurate as entered.",
    "No prior repairs or modifications are missing from the case history.",
    "OEM safety and diagnostic procedures are available to the technician."
  ],
  objectionHandling: "If the customer asks why the code is not enough, explain that a code identifies the system reporting a problem. Testing confirms whether the root cause is the component, wiring, control logic, operating condition, or another system influencing the data.",
  systemsToCheck: [
    "Power and ground",
    "Connectors and harness routing",
    "Sensor or actuator data",
    "Control-module communication",
    "Relevant service information"
  ],
  triageQuestions: [
    "When does the concern happen?",
    "Was there recent service, collision work, battery work, charging, or aftermarket installation?",
    "Is the DTC current, pending, history, or permanent?",
    "What live data confirms or contradicts the code?"
  ],
  doNotAssume: [
    "Do not assume the named component is failed because it appears in the code description.",
    "Do not assume intermittent faults are fixed because the warning is not active now.",
    "Do not assume clearing codes is useful before evidence is captured."
  ]
};

let currentExecutiveBrief = "";
let activePersona = "fleet";
let pendingAssumptionReset = true;

function $(id) {
  return document.getElementById(id);
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function splitCodes(dtcs) {
  return String(dtcs || "")
    .split(/[,\s]+/)
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

function readForm() {
  return {
    vehicle: $("vehicle").value.trim(),
    complaint: $("complaint").value.trim(),
    dtcs: $("dtcs").value.trim(),
    observations: $("observations").value.trim(),
    conditions: $("conditions").value.trim(),
    environment: $("environment").value,
    urgency: $("urgency").value
  };
}

function writeForm(data) {
  $("vehicle").value = data.vehicle;
  $("complaint").value = data.complaint;
  $("dtcs").value = data.dtcs;
  $("observations").value = data.observations;
  $("conditions").value = data.conditions;
  $("environment").value = data.environment;
  $("urgency").value = data.urgency;
}

function buildWorkflow(input) {
  const text = normalize(`${input.vehicle} ${input.complaint} ${input.dtcs} ${input.observations} ${input.conditions}`);
  const codes = splitCodes(input.dtcs);
  const output = JSON.parse(JSON.stringify(defaultOutputs));

  if (text.includes("high-voltage") || text.includes("p0a") || text.includes("charging") || text.includes("insulation")) {
    output.diagnosticPaths = [
      "Treat this as a high-voltage safety workflow first, then a drivability workflow second.",
      "Verify interlock status, insulation readings, charging conditions, 12V stability, and related connector/harness integrity before recommending parts.",
      "Correlate the warning with overnight charging and first-drive conditions to separate thermal, moisture, connector, and control-module patterns."
    ];
    output.safetyChecks = [
      "Follow OEM high-voltage disable, PPE, verification, and lockout steps before inspection or testing.",
      "Do not perform intrusive high-voltage inspection until the system is made safe by a qualified technician.",
      "Document insulation values, interlock status, charging state, and fault status before clearing codes."
    ];
    output.testSteps = [
      "Pull freeze-frame and current status for all high-voltage and power management faults.",
      "Inspect service information for interlock and insulation diagnostic sequence.",
      "Check 12V battery health under load because low-voltage instability can create misleading high-voltage symptoms.",
      "Perform harness and connector inspection only after required high-voltage safety steps are complete.",
      "Repeat test after overnight charge if the concern is condition-specific."
    ];
    output.technicianNotes = [
      "Customer says warning appears most often after charging, so reproduction strategy should include charge-state and cold-start context.",
      "Insulation value variation is a risk signal. Do not frame the case as a simple sensor issue until isolation testing supports it.",
      "Advisor explanation should emphasize safety validation before repair recommendation."
    ];
    output.advisorExplanation = "The warning involves the high-voltage system, so the first priority is safety verification. The codes point us toward the high-voltage interlock or insulation monitoring area, but we need controlled testing before identifying the exact cause. This prevents guessing and protects the customer, technician, and vehicle.";
    output.customerNextStep = "Approve high-voltage diagnostic testing by a qualified technician so the system can be made safe, data can be captured, and the concern can be reproduced under the same charging/cold-start conditions.";
    output.assumptions = [
      "Vehicle is safe to inspect only after OEM high-voltage procedures are followed.",
      "DTCs entered are current or relevant history and not leftover from unrelated service.",
      "No unreported charging equipment, water intrusion, or prior repair issue is influencing the case."
    ];
    output.objectionHandling = "If the customer asks why the car cannot be repaired immediately, explain that high-voltage warnings require a safety-first process. The goal is not to delay the repair. It is to confirm the root cause before touching systems that can create serious risk if handled incorrectly.";
    output.systemsToCheck = [
      "High-voltage interlock loop",
      "Insulation monitoring",
      "Charging interface and related harnesses",
      "12V power stability",
      "Relevant control-module communication"
    ];
    output.triageQuestions = [
      "Does the warning appear only after charging or also during normal driving?",
      "Which charger is used and has the symptom appeared with another charger?",
      "Are the high-voltage faults current, stored, intermittent, or pending?",
      "Are insulation values stable during a controlled test?"
    ];
    output.doNotAssume = [
      "Do not assume the charging port is failed without interlock and insulation evidence.",
      "Do not assume a cleared warning means the high-voltage concern is gone.",
      "Do not perform visual inspection on high-voltage components without proper safety state."
    ];
  }

  if (text.includes("p0420") || text.includes("p0138") || text.includes("smog") || text.includes("emissions") || text.includes("catalyst")) {
    output.diagnosticPaths = [
      "Confirm catalyst-efficiency and oxygen-sensor data before recommending catalyst replacement.",
      "Verify fuel control, exhaust leaks, sensor response, readiness monitors, and recent battery/code-clear history.",
      "Separate emissions readiness from active fault diagnosis so the customer understands smog timing."
    ];
    output.safetyChecks = [
      "Let exhaust components cool before inspection.",
      "Use proper lift and ventilation procedures for road-test and exhaust diagnostics.",
      "Document monitor readiness before clearing codes or disconnecting the battery."
    ];
    output.testSteps = [
      "Check freeze-frame conditions for catalyst and oxygen-sensor faults.",
      "Graph front and rear oxygen sensor behavior during warm steady-state operation.",
      "Inspect for exhaust leaks and wiring damage near oxygen sensor circuits.",
      "Confirm fuel trims and misfire data before condemning catalyst efficiency.",
      "Complete the correct drive cycle after repairs before advising smog readiness."
    ];
    output.technicianNotes = [
      "Customer's smog deadline makes readiness timing part of the repair plan.",
      "Rear oxygen sensor voltage biased high can be cause, symptom, or wiring issue.",
      "Catalyst monitor incomplete after battery disconnect should be explained before promising smog pass timing."
    ];
    output.advisorExplanation = "The check engine light is related to the emissions system, but the vehicle also needs readiness monitors completed before a smog inspection. We need to test sensor behavior, catalyst data, fuel control, and exhaust condition so we do not replace expensive parts without confirmation.";
    output.customerNextStep = "Approve emissions diagnostic testing and a readiness plan. After the repair decision, the vehicle may still need a drive cycle before smog inspection.";
    output.assumptions = [
      "The vehicle has no unreported recent battery disconnect or code clear.",
      "The exhaust is not modified in a way that changes sensor readings.",
      "The customer understands that diagnostic repair and monitor readiness are separate steps."
    ];
    output.objectionHandling = "If the customer asks why it cannot go straight to smog, explain that the computer must complete self-tests called monitors. If those monitors are incomplete, the vehicle may not be ready even if the light is off.";
    output.systemsToCheck = [
      "Catalyst efficiency",
      "Front and rear oxygen sensor behavior",
      "Fuel trims",
      "Exhaust leaks",
      "Monitor readiness"
    ];
    output.triageQuestions = [
      "Was the battery disconnected or were codes cleared recently?",
      "Are catalyst and oxygen-sensor monitors complete?",
      "Does rear sensor activity mirror the front sensor?",
      "Are fuel trims normal at idle and cruise?"
    ];
    output.doNotAssume = [
      "Do not assume P0420 automatically means the catalyst is failed.",
      "Do not promise smog readiness immediately after clearing codes.",
      "Do not ignore fuel control or exhaust leaks before recommending emissions parts."
    ];
  }

  if (codes.length) {
    output.technicianNotes.unshift(`Entered DTCs: ${codes.join(", ")}. Confirm status and freeze-frame before clearing.`);
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function setText(id, value) {
  const node = $(id);
  if (node) {
    node.textContent = value;
  }
}

function setMeter(id, percent) {
  const node = $(id);
  if (node) {
    node.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }
}

function renderPlainList(id, items) {
  const node = $(id);
  node.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
}

function buildCommandModel(input, output) {
  const text = normalize(`${input.vehicle} ${input.complaint} ${input.dtcs} ${input.observations} ${input.conditions}`);
  const isEv = text.includes("high-voltage") || text.includes("p0a") || text.includes("charging") || text.includes("insulation");
  const isEmissions = text.includes("p0420") || text.includes("p0138") || text.includes("smog") || text.includes("emissions") || text.includes("catalyst");

  const model = {
    timeSaved: 1.2,
    stakeholders: "4",
    stakeholderNote: "Fleet, tech, advisor, support",
    riskFlags: "1",
    riskNote: "Diagnostic ambiguity",
    primaryRisk: ["Primary risk", "Incomplete diagnostic context", 62, "Workflow needs cleaner intake before parts recommendation."],
    confidence: ["Root-cause confidence", "Needs more evidence", 48, "Freeze-frame and live data decide the next step."],
    proofMetric: ["Buyer proof metric", "Repeat clarifications", 58, "Track notes returned for missing context."],
    handoff: ["Handoff package", "Tech + advisor", 64, "Customer explanation stays tied to validated evidence."],
    timelineStatus: "Evidence capture",
    timeline: [
      ["Intake", "Normalize complaint, DTCs, conditions, and prior repair context."],
      ["Evidence", "Capture freeze-frame, code status, and current observations before clearing anything."],
      ["Test plan", "Select the next controlled test instead of recommending parts from a code description."],
      ["Handoff", "Translate what is known, unknown, and assumed for the advisor and buyer."]
    ],
    baselineProof: "Unstructured notes, repeated clarification, unclear risk ownership",
    workflowProof: "Validated next test, safety boundary, buyer-ready summary",
    measuredProof: "Time to triage, repeat contacts, escalations with complete evidence",
    defaultAssumptions: { vehicles: 8, cost: 140, hours: 1.2 },
    personas: {
      fleet: {
        title: "Fleet buyer view",
        badge: "Downtime",
        narrative: "The fleet story is not the code. It is whether the vehicle should stay in service, be routed for inspection, or be removed before a repeat event creates downtime.",
        bullets: ["Prioritize assets by safety and downtime risk.", "Show why a warning needs controlled testing.", "Turn technician notes into operations decisions."]
      },
      service: {
        title: "Service operations view",
        badge: "Throughput",
        narrative: "The service manager sees a cleaner intake path: fewer back-and-forth questions, better handoff quality, and less guessing from incomplete notes.",
        bullets: ["Standardize complex diagnostic intake.", "Reduce repeated clarification between advisor and technician.", "Make assumptions visible before authorization."]
      },
      support: {
        title: "Support team view",
        badge: "Escalation",
        narrative: "The support workflow captures enough evidence for a remote team to decide whether to escalate, request more data, or route the case to a qualified technician.",
        bullets: ["Separate active risk from historical codes.", "Escalate with evidence instead of screenshots alone.", "Preserve safety boundaries in the support handoff."]
      },
      exec: {
        title: "Executive buyer view",
        badge: "ROI",
        narrative: "The executive story is proof: reduced diagnostic loops, cleaner escalation packages, and measurable operating time returned to the business.",
        bullets: ["Tie workflow quality to time saved.", "Measure repeat escalations and avoidable downtime.", "Show a credible pilot metric before expansion."]
      }
    }
  };

  if (isEv) {
    Object.assign(model, {
      timeSaved: 1.7,
      riskFlags: "2",
      riskNote: "High-voltage and interlock",
      primaryRisk: ["Primary risk", "High-voltage isolation", 88, "Safety workflow before drivability workflow."],
      confidence: ["Root-cause confidence", "Connector / insulation pattern", 72, "Needs freeze-frame, insulation values, and controlled retest."],
      proofMetric: ["Buyer proof metric", "Repeat escalations", 64, "Track fewer clarification loops per high-risk case."],
      handoff: ["Handoff package", "Tech + advisor + fleet", 80, "Same evidence translated by audience."],
      timelineStatus: "Safety gate active",
      timeline: [
        ["Intake", "Capture complaint, charging context, DTCs, and whether the warning is current or intermittent."],
        ["Safety gate", "Apply OEM high-voltage disable, PPE, verification, and lockout requirements before inspection."],
        ["Evidence", "Document insulation readings, interlock status, freeze-frame, 12V state, and charging conditions."],
        ["Decision", "Separate connector, moisture, charging, and module-control patterns before recommending parts."],
        ["Handoff", "Provide technician action, advisor-safe explanation, fleet downtime risk, and support escalation notes."]
      ],
      defaultAssumptions: { vehicles: 10, cost: 175, hours: 1.7 }
    });
  }

  if (isEmissions) {
    Object.assign(model, {
      timeSaved: 1.1,
      riskFlags: "2",
      riskNote: "Readiness and emissions",
      primaryRisk: ["Primary risk", "Smog readiness gap", 66, "Repair decision and monitor readiness are separate workflows."],
      confidence: ["Root-cause confidence", "Sensor / catalyst validation", 70, "Needs fuel trims, sensor graphing, exhaust inspection, and drive-cycle status."],
      proofMetric: ["Buyer proof metric", "Avoided wrong-part quote", 74, "Track fewer premature catalyst recommendations."],
      handoff: ["Handoff package", "Advisor + emissions plan", 76, "Explains repair evidence and smog timing without overpromising."],
      timelineStatus: "Readiness plan active",
      timeline: [
        ["Intake", "Capture codes, recent battery disconnect, smog deadline, and drivability status."],
        ["Evidence", "Check freeze-frame, fuel trims, sensor response, exhaust condition, and monitor readiness."],
        ["Validation", "Separate active fault diagnosis from catalyst monitor completion requirements."],
        ["Decision", "Recommend testing or repair only after sensor, fuel-control, and exhaust evidence supports it."],
        ["Handoff", "Give the customer a repair path plus drive-cycle/readiness expectations."]
      ],
      defaultAssumptions: { vehicles: 6, cost: 125, hours: 1.1 }
    });
  }

  return model;
}

function renderTimeline(items) {
  const node = $("diagnosticTimeline");
  node.innerHTML = "";
  items.forEach(([title, detail], index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${index + 1}</span><div><strong>${title}</strong><p>${detail}</p></div>`;
    node.appendChild(li);
  });
}

function calculateMonthlyImpact(model) {
  const vehicles = Number($("affectedVehicles").value || model.defaultAssumptions.vehicles);
  const cost = Number($("downtimeCost").value || model.defaultAssumptions.cost);
  const hours = Number($("hoursSaved").value || model.defaultAssumptions.hours);
  return Math.round(vehicles * cost * hours * 4.2);
}

function renderCommandCenter(input, output) {
  const model = buildCommandModel(input, output);
  if (pendingAssumptionReset) {
    $("affectedVehicles").value = model.defaultAssumptions.vehicles;
    $("downtimeCost").value = model.defaultAssumptions.cost;
    $("hoursSaved").value = model.defaultAssumptions.hours;
    pendingAssumptionReset = false;
  }
  const impact = calculateMonthlyImpact(model);
  const persona = model.personas[activePersona] || model.personas.fleet;

  setText("topTimeSaved", `${model.timeSaved.toFixed(1)} hrs`);
  setText("topTimeNote", "Modeled per complex case");
  setText("topStakeholders", model.stakeholders);
  setText("topStakeholderNote", model.stakeholderNote);
  setText("topRiskFlags", model.riskFlags);
  setText("topRiskNote", model.riskNote);
  setText("topDemoValue", `$${(impact / 1000).toFixed(1).replace(".0", "")}k/mo`);
  setText("topDemoNote", "Recalculated from assumptions");

  setText("primaryRiskLabel", model.primaryRisk[0]);
  setText("primaryRiskValue", model.primaryRisk[1]);
  setMeter("primaryRiskMeter", model.primaryRisk[2]);
  setText("primaryRiskNote", model.primaryRisk[3]);

  setText("confidenceLabel", model.confidence[0]);
  setText("confidenceValue", model.confidence[1]);
  setMeter("confidenceMeter", model.confidence[2]);
  setText("confidenceNote", model.confidence[3]);

  setText("proofMetricLabel", model.proofMetric[0]);
  setText("proofMetricValue", model.proofMetric[1]);
  setMeter("proofMetricMeter", model.proofMetric[2]);
  setText("proofMetricNote", model.proofMetric[3]);

  setText("handoffLabel", model.handoff[0]);
  setText("handoffValue", model.handoff[1]);
  setMeter("handoffMeter", model.handoff[2]);
  setText("handoffNote", model.handoff[3]);

  setText("timelineStatus", model.timelineStatus);
  renderTimeline(model.timeline);

  setText("personaTitle", persona.title);
  setText("personaBadge", persona.badge);
  setText("personaNarrative", persona.narrative);
  renderPlainList("personaBullets", persona.bullets);

  setText("baselineProof", model.baselineProof);
  setText("workflowProof", model.workflowProof);
  setText("measuredProof", model.measuredProof);
  setText("modeledImpact", formatCurrency(impact));
  setText("modeledImpactNote", `${$("affectedVehicles").value} vehicles x ${$("hoursSaved").value} hrs saved x ${formatCurrency(Number($("downtimeCost").value))}/hr x 4.2 cases/mo.`);
}

function buildExecutiveBrief(input, output) {
  const vehicle = input.vehicle || "the selected vehicle";
  const dtcs = input.dtcs || "no DTCs entered";
  const highRisk = input.urgency === "High" || input.urgency === "Safety critical";
  return {
    summary: `${vehicle} has a ${input.urgency.toLowerCase()} diagnostic workflow with ${dtcs}. The demo converts customer language, DTCs, scan observations, and operating conditions into a structured workflow for technicians, advisors, fleet stakeholders, and support teams.`,
    impact: highRisk
      ? "The buyer value is risk control: safer escalation, cleaner documentation, fewer repeated clarifications, and faster agreement on what must be validated before any repair recommendation."
      : "The buyer value is workflow consistency: faster intake, better handoff notes, clearer advisor language, and fewer avoidable diagnostic loops.",
    demoScript: `I would demo this by starting with the messy complaint, showing how the system separates safety checks from next tests, then switching to advisor language so non-technical stakeholders understand the next decision without overpromising.`,
    proofPlan: "A proof of value would compare baseline diagnostic handoff time, number of clarification calls, repeat escalations, and advisor note quality before and after using this guided workflow."
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

function renderWorkflow() {
  const input = readForm();
  const output = buildWorkflow(input);
  const vehicle = input.vehicle || "the selected vehicle";

  $("caseSummary").textContent = `Structured triage for ${vehicle}.`;
  $("riskPill").textContent = input.urgency;
  $("riskPill").className = `risk ${input.urgency.toLowerCase().replace(/\s+/g, "-")}`;

  renderList("diagnosticPaths", output.diagnosticPaths);
  renderList("safetyChecks", output.safetyChecks);
  renderList("testSteps", output.testSteps);
  renderList("technicianNotes", output.technicianNotes);

  $("advisorExplanation").textContent = output.advisorExplanation;
  $("customerNextStep").textContent = output.customerNextStep;
  renderList("assumptions", output.assumptions);
  $("objectionHandling").textContent = output.objectionHandling;

  $("obdSummary").textContent = `The entered code set (${input.dtcs || "no DTCs entered"}) should be treated as triage input, not a final repair decision.`;
  renderList("systemsToCheck", output.systemsToCheck);
  renderList("triageQuestions", output.triageQuestions);
  renderList("doNotAssume", output.doNotAssume);
  renderCommandCenter(input, output);
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

$("diagnosticForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderWorkflow();
  activateTab("diagnostic");
});

$("loadMiniCase").addEventListener("click", () => {
  pendingAssumptionReset = true;
  writeForm(sampleCases.mini);
  renderWorkflow();
});

$("loadHondaCase").addEventListener("click", () => {
  pendingAssumptionReset = true;
  writeForm(sampleCases.honda);
  renderWorkflow();
});

$("resetForm").addEventListener("click", () => {
  pendingAssumptionReset = true;
  writeForm(sampleCases.blank);
  renderWorkflow();
});

document.querySelectorAll(".persona").forEach((button) => {
  button.addEventListener("click", () => {
    activePersona = button.dataset.persona;
    document.querySelectorAll(".persona").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    const input = readForm();
    renderCommandCenter(input, buildWorkflow(input));
  });
});

["affectedVehicles", "downtimeCost", "hoursSaved"].forEach((id) => {
  $(id).addEventListener("input", () => {
    const input = readForm();
    renderCommandCenter(input, buildWorkflow(input));
  });
});

$("copyBrief").addEventListener("click", async () => {
  try {
    if (!currentExecutiveBrief) {
      renderWorkflow();
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

renderWorkflow();
