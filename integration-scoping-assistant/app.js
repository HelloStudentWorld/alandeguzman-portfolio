const examples = {
  fleet: {
    workflow: "Fleet wants maintenance exceptions from its telematics platform to create prioritized delivery operations alerts before vehicles miss route commitments.",
    sourceSystem: "Fleet maintenance platform",
    targetSystem: "Delivery dispatch system",
    objects: "Vehicle ID, asset status, DTC severity, open work order, route assignment, estimated downtime, technician note, last update timestamp.",
    authModel: "API key",
    cadence: "15-minute sync",
    successCriteria: "Reduce missed route commitments caused by maintenance surprises, cut manual dispatcher checks, and prove alerts are trusted by fleet managers and dispatch leads.",
    buyerType: "Fleet operations",
    riskLevel: "Medium"
  },
  delivery: {
    workflow: "Industrial delivery team wants urgent job status and driver availability to update a customer portal without dispatchers manually copying notes.",
    sourceSystem: "Last-mile logistics platform",
    targetSystem: "Customer portal",
    objects: "Order ID, driver status, ETA, delivery exception, proof-of-delivery photo status, customer location, dispatcher note.",
    authModel: "OAuth 2.0",
    cadence: "Real-time webhook",
    successCriteria: "Reduce customer status calls, improve ETA trust, and show exception alerts before SLA risk becomes a customer escalation.",
    buyerType: "Industrial delivery",
    riskLevel: "High"
  },
  blank: {
    workflow: "",
    sourceSystem: "",
    targetSystem: "",
    objects: "",
    authModel: "Unknown",
    cadence: "Hourly batch",
    successCriteria: "",
    buyerType: "Fleet operations",
    riskLevel: "Medium"
  }
};

let currentExecutiveBrief = "";

function $(id) {
  return document.getElementById(id);
}

function readForm() {
  return {
    workflow: $("workflow").value.trim(),
    sourceSystem: $("sourceSystem").value.trim(),
    targetSystem: $("targetSystem").value.trim(),
    objects: $("objects").value.trim(),
    authModel: $("authModel").value,
    cadence: $("cadence").value,
    successCriteria: $("successCriteria").value.trim(),
    buyerType: $("buyerType").value,
    riskLevel: $("riskLevel").value
  };
}

function writeForm(data) {
  $("workflow").value = data.workflow;
  $("sourceSystem").value = data.sourceSystem;
  $("targetSystem").value = data.targetSystem;
  $("objects").value = data.objects;
  $("authModel").value = data.authModel;
  $("cadence").value = data.cadence;
  $("successCriteria").value = data.successCriteria;
  $("buyerType").value = data.buyerType;
  $("riskLevel").value = data.riskLevel;
}

function includesAny(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function buildScope(input) {
  const source = input.sourceSystem || "source system";
  const target = input.targetSystem || "target system";
  const combined = `${input.workflow} ${input.objects} ${input.successCriteria} ${input.buyerType}`;
  const isFleet = includesAny(combined, ["fleet", "vehicle", "maintenance", "dtc", "route", "telematics"]);
  const isDelivery = includesAny(combined, ["delivery", "dispatch", "eta", "driver", "order", "sla"]);
  const isPublic = includesAny(combined, ["public", "transit", "municipal", "school", "government"]);
  const cadenceType = input.cadence.toLowerCase().includes("webhook") ? "event-driven webhook" : "scheduled sync";

  const discoveryQuestions = [
    `What exact business decision should improve when ${source} sends data to ${target}?`,
    "Which users trust this workflow today, and which users manually re-check the data?",
    "What data fields are required on day one versus later expansion?",
    "What happens when data is missing, stale, duplicated, or contradicted by the other system?"
  ];

  if (isFleet) {
    discoveryQuestions.push("How are maintenance severity, downtime, route assignment, and work-order status prioritized today?");
  }
  if (isDelivery) {
    discoveryQuestions.push("Which delivery exceptions create the most customer calls or SLA escalations?");
  }
  if (isPublic) {
    discoveryQuestions.push("Are there procurement, retention, accessibility, or audit requirements that change the integration scope?");
  }

  const systemsToValidate = [
    `${source} API documentation, rate limits, object model, and sandbox availability.`,
    `${target} required fields, update permissions, and exception-handling behavior.`,
    `${input.authModel} ownership, credential rotation process, and production access approval.`,
    `${input.cadence} feasibility against buyer expectations and system limits.`
  ];

  const dataClarifications = [
    "Define a shared unique ID strategy so vehicles, jobs, routes, or orders match across systems.",
    "Confirm which system is the source of truth for status, priority, and timestamps.",
    "Map field names, allowed values, required/optional fields, and validation rules.",
    "Decide whether historical data, attachments, notes, or audit logs are in scope."
  ];

  const stakeholders = [
    "Economic buyer: validates business value and success criteria.",
    "Operations owner: validates workflow reality and user adoption.",
    "IT / integration owner: validates auth, data flow, security, and supportability.",
    "Implementation owner: validates handoff notes, open risks, and launch sequence."
  ];

  const integrationPattern = `Recommended pattern: start with a ${cadenceType} from ${source} to ${target}, limited to the smallest object set needed to prove the workflow. Keep the first PoV narrow, traceable, and reversible before expanding to write-back or multi-system automation.`;

  const technicalAssumptions = [
    `${source} exposes the required objects through a documented API or export.`,
    `${target} can receive updates without breaking existing dispatcher or operations workflows.`,
    `${input.authModel} can be configured without sharing personal credentials in a demo environment.`,
    "The buyer can provide sample records, field definitions, and a named technical owner."
  ];

  const handoffSteps = [
    "Summarize buyer pain, current workflow, source of truth, target workflow, and measurable success criteria.",
    "Attach field map with required fields, examples, transformation notes, and unresolved questions.",
    "Document auth model, test credentials owner, sandbox limits, cadence, error handling, and monitoring needs.",
    "Define acceptance criteria and the exact records or users included in the proof of value.",
    "Schedule a technical validation call before implementation begins."
  ];

  const demoFlow = [
    "Start with the buyer's current manual workflow and the operational cost of delay or rework.",
    "Show a single source event or record moving into the target workflow.",
    "Pause on assumptions: auth, source of truth, field mapping, cadence, and exceptions.",
    "Close with PoV metrics and the handoff package implementation would need."
  ];

  const successMetrics = [
    "Time saved per exception or manual check.",
    "Reduction in missed routes, SLA risk, downtime, or customer-status calls.",
    "Percentage of alerts or updates trusted without manual re-check.",
    "Number of records successfully synced with no duplicate or stale updates."
  ];

  const baselineNeeded = [
    "Current manual workflow steps and owner for each step.",
    "Weekly volume of exceptions, route risks, jobs, work orders, or status calls.",
    "Current response time and current failure modes.",
    "Small sample of real-but-sanitized records for demo validation."
  ];

  const outcomeStory = `If the PoV works, ${input.buyerType.toLowerCase()} teams can move from manual status checking to a trusted workflow where ${source} and ${target} share the right context at the right time.`;

  const closePlan = [
    "Agree on PoV scope, buyer stakeholders, success metrics, and timeline.",
    "Confirm technical feasibility with API docs, sample records, and security owner.",
    "Run the narrow proof of value and review results with operations and IT together.",
    "Convert proven workflow into commercial next step, implementation scope, and rollout plan."
  ];

  const riskRegister = [
    "Unclear source of truth can cause conflicting statuses across systems.",
    "Missing unique identifiers can create duplicates or failed record matching.",
    "Over-broad PoV scope can hide value and delay the technical win.",
    "Unvalidated assumptions can create implementation rework after the sale."
  ];

  if (input.riskLevel === "High" || input.riskLevel === "Safety critical") {
    riskRegister.unshift("High-impact workflow: require explicit human review before automated operational decisions.");
  }

  const securityChecks = [
    "No personal credentials, passwords, API keys, MFA codes, or tokens in shared docs.",
    "Confirm least-privilege access and credential ownership before any live integration work.",
    "Validate data retention, PII exposure, audit needs, and customer approval for sample records.",
    "Confirm who monitors failures, retries, and support escalations after launch."
  ];

  const doNotClaim = [
    "Do not claim production integration ownership from this portfolio demo.",
    "Do not claim a live API call unless a real approved sandbox is used.",
    "Do not promise automation until source of truth, error handling, and safety boundaries are validated.",
    "Do not use customer data without permission and sanitization."
  ];

  const escalationPath = "Escalate to Product or Engineering when API limits, undocumented objects, write-back behavior, security constraints, or customer-specific workflows change the feasibility or scope of the promised outcome.";

  return {
    discoveryQuestions,
    systemsToValidate,
    dataClarifications,
    stakeholders,
    integrationPattern,
    technicalAssumptions,
    handoffSteps,
    demoFlow,
    successMetrics,
    baselineNeeded,
    outcomeStory,
    closePlan,
    riskRegister,
    securityChecks,
    doNotClaim,
    escalationPath
  };
}

function renderList(id, items, ordered = false) {
  const node = $(id);
  node.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
  if (ordered && node.tagName !== "OL") {
    node.setAttribute("data-ordered", "true");
  }
}

function buildExecutiveBrief(input, output) {
  const source = input.sourceSystem || "source system";
  const target = input.targetSystem || "target system";
  return {
    summary: `This demo turns a vague integration request between ${source} and ${target} into a Sales Engineer-ready discovery brief, technical assumptions, PoV metrics, risk register, and implementation handoff.`,
    impact: "The buyer value is deal control: unclear API asks become scoped proof plans with owners, success metrics, security boundaries, and measurable operational outcomes.",
    demoScript: "I would demo this by starting with the buyer workflow, mapping source and target systems, surfacing assumptions, then closing with the proof-of-value metrics and handoff package.",
    proofPlan: `A proof of value would validate ${input.cadence.toLowerCase()}, required data objects, auth ownership, alert trust, and whether ${input.buyerType.toLowerCase()} users act on the synced workflow without manual re-checking.`
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

function renderScope() {
  const input = readForm();
  const output = buildScope(input);
  const source = input.sourceSystem || "source system";
  const target = input.targetSystem || "target system";

  $("scopeSummary").textContent = `Integration scoping for ${source} to ${target}.`;
  $("riskPill").textContent = input.riskLevel;
  $("riskPill").className = `risk ${input.riskLevel.toLowerCase().replace(/\s+/g, "-")}`;

  renderList("discoveryQuestions", output.discoveryQuestions);
  renderList("systemsToValidate", output.systemsToValidate);
  renderList("dataClarifications", output.dataClarifications);
  renderList("stakeholders", output.stakeholders);

  $("integrationPattern").textContent = output.integrationPattern;
  renderList("technicalAssumptions", output.technicalAssumptions);
  renderList("handoffSteps", output.handoffSteps, true);
  renderList("demoFlow", output.demoFlow, true);

  $("povWindow").textContent = input.cadence.includes("webhook") ? "14-21 days" : "30 days";
  $("primaryMetric").textContent = input.buyerType.includes("delivery") ? "SLA risk reduction" : "Workflow trust";
  $("buyerProof").textContent = input.riskLevel === "Low" ? "Adoption signal" : "Trusted alerts";
  renderList("successMetrics", output.successMetrics);
  renderList("baselineNeeded", output.baselineNeeded);
  $("outcomeStory").textContent = output.outcomeStory;
  renderList("closePlan", output.closePlan, true);

  renderList("riskRegister", output.riskRegister);
  renderList("securityChecks", output.securityChecks);
  renderList("doNotClaim", output.doNotClaim);
  $("escalationPath").textContent = output.escalationPath;

  $("talkTrack").textContent = `This workflow turns an integration request between ${source} and ${target} into discovery questions, assumptions, a PoV plan, and an implementation handoff.`;
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

$("scopeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderScope();
  activateTab("discovery");
});

$("loadFleetCase").addEventListener("click", () => {
  writeForm(examples.fleet);
  renderScope();
});

$("loadDeliveryCase").addEventListener("click", () => {
  writeForm(examples.delivery);
  renderScope();
});

$("resetForm").addEventListener("click", () => {
  writeForm(examples.blank);
  renderScope();
});

$("copyBrief").addEventListener("click", async () => {
  try {
    const copied = await copyText(currentExecutiveBrief);
    $("copyStatus").textContent = copied ? "Copied." : "Selected. Press Ctrl+C.";
  } catch {
    $("briefText").focus();
    $("briefText").select();
    $("copyStatus").textContent = "Selected. Press Ctrl+C.";
  }
});

renderScope();
