// English / Marathi translation dictionary and helpers.
// Internal ids, stored status values and validation logic never change — only
// the displayed text does. Simple, conversational Marathi is used throughout;
// familiar official terms (GST, PAN, Udyam, KYC, FSSAI, IEC) stay in English.

export type Lang = "en" | "mr";

export const LANG_KEY = "sme-loan-ready.lang";

export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "mr", label: "मराठी" },
];

type Str = { en: string; mr: string };

export function loadLang(): Lang {
  try {
    const v = typeof localStorage !== "undefined" ? localStorage.getItem(LANG_KEY) : null;
    return v === "mr" ? "mr" : "en";
  } catch {
    return "en";
  }
}

export function saveLang(l: Lang) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(LANG_KEY, l);
  } catch {
    /* storage may be unavailable */
  }
}

const STRINGS = {
  // ── Shell ────────────────────────────────────────────────────────────────
  banner: {
    en: "Educational portfolio prototype — not a real banking service or loan eligibility tool. All data is fictional demo data. Do not enter personal information.",
    mr: "शैक्षणिक पोर्टफोलिओ प्रोटोटाईप — हे खऱ्या बँकिंग सेवा किंवा कर्ज पात्रता तपासणीचे साधन नाही. सर्व माहिती उदाहरणासाठीच आहे. वैयक्तिक माहिती टाइप करू नका.",
  },
  brand: { en: "SME Loan Ready", mr: "SME लोन सज्ज" },
  navDashboard: { en: "Dashboard", mr: "डॅशबोर्ड" },
  navDocuments: { en: "Documents", mr: "कागदपत्रे" },
  navAssistant: { en: "AI Assistant", mr: "सहाय्यक" },
  navEvaluation: { en: "Evaluation", mr: "मूल्यांकन" },
  languageLabel: { en: "Language", mr: "भाषा" },

  // ── Journey / shared ─────────────────────────────────────────────────────
  stepProfile: { en: "Profile", mr: "प्रोफाइल" },
  stepChecklist: { en: "Checklist", mr: "यादी" },
  stepTracker: { en: "Tracker", mr: "प्रगती" },
  stepReport: { en: "Report", mr: "अहवाल" },
  stepsAria: { en: "Loan readiness steps", mr: "कर्ज तयारीच्या पायर्या" },
  guidanceTitle: {
    en: "General guidance, not lender-verified.",
    mr: "सामान्य मार्गदर्शन — कर्जदात्याने पडताळलेले नाही.",
  },
  guidanceBody: {
    en: "Each bank sets its own list. Use this to prepare, then confirm the exact requirements with your lender. This is not a loan offer, approval or eligibility check.",
    mr: "प्रत्येक बँक स्वतःची यादी ठरवते. यामध्ये तयारी करा, नंतर अंतिम यादी तुमच्या कर्जदात्याकडून पडताळून घ्या. हे कर्जाचे प्रस्ताव, मंजुरी किंवा पात्रता तपासणी नाही.",
  },
  loadingProgress: {
    en: "Loading your saved progress…",
    mr: "तुमची जतन केलेली प्रगती लोड होत आहे…",
  },
  needsProfileTitle: {
    en: "Start with your business profile",
    mr: "तुमच्या व्यवसायाच्या प्रोफाइलपासून सुरुवात करा",
  },
  needsProfileBody: {
    en: "We need a few details to build your personalised checklist.",
    mr: "तुमची वैयक्तिक यादी तयार करण्यासाठी काही माहिती लागेल.",
  },
  needsProfileCta: { en: "Go to business profile", mr: "व्यवसाय प्रोफाइलकडे जा" },
  priorityHigh: { en: "High", mr: "उच्च" },
  priorityMedium: { en: "Medium", mr: "मध्यम" },
  priorityLow: { en: "Low", mr: "कमी" },

  // ── Homepage ─────────────────────────────────────────────────────────────
  homeKicker: {
    en: "Made for small businesses across India",
    mr: "इंडियातील लहान व्यवसायांसाठी बनवलेले",
  },
  homeTitle: {
    en: "Get ready for a business loan — one simple step at a time.",
    mr: "व्यवसाय कर्जासाठी सज्ज व्हा — एका सोप्या पायरीने.",
  },
  homeSub: {
    en: "Not sure which loan to ask about? Worried about documents or what a bank manager may ask? Prepare at your own pace before you visit the branch.",
    mr: "कोणत्या कर्जाबद्दल विचारायचे ते निश्चित नाही? कागदपत्रांची किंवा बँक व्यवस्थापक काय विचारेल याची काळजी आहे? शाखेला जाण्यापूर्वी स्वतःच्या गतीने तयारी करा.",
  },
  homeCta: { en: "Start my preparation", mr: "माझी तयारी सुरू करा" },
  homePrivacy: {
    en: "No account needed. Do not enter PAN, Aadhaar, account numbers, or upload private documents.",
    mr: "तुमची वैयक्तिक माहिती नको. PAN, Aadhaar किंवा बँक खाते क्रमांक टाइप करू नका आणि खाजगी कागदपत्र अपलोड करू नका.",
  },
  simpleWordsTitle: { en: "In simple words", mr: "सोप्या शब्दांत" },
  simpleWordsBody: {
    en: "This tool helps you prepare before speaking to a bank: describe your business, see documents a lender may ask for, and track what you have ready. It does not guarantee loan approval.",
    mr: "हे साधन बँकेशी बोलण्यापूर्वी तयारी करण्यात मदत करते: तुमचा व्यवसाय सांगा, कर्जदाता कोणती कागदपत्रे मागू शकतो हे पहा, आणि तुमच्याकडे काय सज्ज आहे ते पाहा. यामुळे कर्ज मंजुर होईल अशी खात्री मिळत नाही.",
  },
  featureStep: { en: "Step", mr: "पायरी" },
  feat1Title: { en: "Explore possible loan options", mr: "शक्य असलेल्या कर्ज पर्याय पहा" },
  feat1Text: {
    en: "Learn about possible routes to finance and what to verify with a lender. No promise of eligibility or approval.",
    mr: "पैशाच्या पर्यायी मार्ग आणि कर्जदात्याकडे काय पडताळावे याविषयी जाणून घ्या. पात्रता किंवा मंजुरीची कोणतीही खात्री नाही.",
  },
  feat2Title: { en: "Understand your documents", mr: "तुमची कागदपत्रे समजून घ्या" },
  feat2Text: {
    en: "See what common documents mean, why a bank may ask for them, and what to do next if you do not have one.",
    mr: "सामान्य कागदपत्रांचा अर्थ, बँक ती का मागू शकते आणि तुमच्याकडे ती नसल्यास पुढे काय करावे हे पहा.",
  },
  feat3Title: { en: "Practise your bank conversation", mr: "बँकेशीला बोलण्याचा सराव करा" },
  feat3Text: {
    en: "Prepare simple, truthful answers to common questions before you visit a branch.",
    mr: "शाखेला जाण्यापूर्वी सामान्य प्रश्नांना सोपी आणि खरोखर उत्तरे तयार करा.",
  },
  howHelpsAria: { en: "How SME Loan Ready helps", mr: "SME लोन सज्ज कसे मदत करते" },
  safetyTitle: { en: "Guidance, not a loan decision", mr: "मार्गदर्शन — कर्जाचा निर्णय नाही" },
  safetyBody: {
    en: "This is an educational prototype. Loan schemes, eligibility and document lists can change and vary by lender. Confirm current details with an authorised bank or scheme representative. Only the lender decides whether to approve a loan.",
    mr: "हा शैक्षणिक प्रोटोटाईप आहे. कर्ज योजना, पात्रता आणि कागदपत्रांच्या याद्या बदलू शकतात आणि कर्जदात्यानुसार वेगळ्या असू शकतात. अद्ययावत माहिती अधिकृत बँक किंवा योजना प्रतिनिधिकडून पडताळा. कर्ज मंजुर होईल का हे केवळ कर्जदाता ठरवतो.",
  },
  homeAsk: { en: "Ask a simple question", mr: "सोपा प्रश्न विचारा" },
  homeReport: { en: "View preparation report", mr: "तयारी अहवाल पहा" },

  // ── Profile form ─────────────────────────────────────────────────────────
  profileTitle: { en: "Business profile", mr: "व्यवसाय प्रोफाइल" },
  profileIntro: {
    en: "For small businesses across India preparing to approach a bank or lender. No personal or ID details are needed. Your answers stay in this browser.",
    mr: "इंडियातील लहान व्यवसायांसाठी जे बँक किंवा कर्जदात्याकडे जाण्याची तयारी करत आहेत. कोणतीही वैयक्तिक किंवा ओळख कागदपत्रे लागत नाहीत. तुमची उत्तरे याच ब्राउझरमध्ये राहतात.",
  },
  profileHelpTitle: { en: "What should I do here?", mr: "येथे मी काय करावे?" },
  profileHelpBody: {
    en: "Enter basic details about your business and why you need the loan. This helps create a more relevant document checklist. Use approximate figures if needed, and do not enter PAN, Aadhaar, bank account numbers, or other sensitive details.",
    mr: "तुमच्या व्यवसायाबद्दल आणि कर्ज कशासाठी लागते याची मूलभूत माहिती भरा. यामुळे अधिक योग्य कागदपत्र यादी तयार होते. आवश्यक असल्यास अंदाजातील आकडे वापरा, आणि PAN, Aadhaar, बँक खाते क्रमांक किंवा इतर संवेदनशील माहिती भरू नका.",
  },
  labelBusinessType: { en: "Business type", mr: "व्यवसायाचा प्रकार" },
  labelYears: { en: "Years in operation", mr: "चालू असलेली वर्षे" },
  labelPurpose: { en: "Loan purpose", mr: "कर्जाचा उद्देश" },
  labelTurnover: { en: "Approximate yearly turnover", mr: "अंदाजित वार्षिक उलाढाल" },
  labelAmount: { en: "Requested loan amount (₹)", mr: "विनंती केलेली कर्जाची रकम (₹)" },
  amountHint: { en: "Between ₹50,000 and ₹5 crore", mr: "₹50,000 ते ₹5 कोटी श्रेणीत" },
  selectPlaceholder: { en: "Select…", mr: "निवडा…" },
  placeholderYears: { en: "e.g. 4", mr: "उदा. 4" },
  placeholderAmount: { en: "e.g. 800000", mr: "उदा. 800000" },
  btnBuild: { en: "Build my checklist", mr: "माझी यादी तयार करा" },
  btnUpdate: { en: "Update and view checklist", mr: "अद्ययावत करा आणि यादी पहा" },

  // ── Checklist ────────────────────────────────────────────────────────────
  checklistTitle: { en: "Your document checklist", mr: "तुमची कागदपत्र यादी" },
  checklistHowTitle: { en: "How to use this list", mr: "ही यादी कसे वापरायची" },
  checklistHowBody: {
    en: "These are documents a lender may ask for based on the details you entered. The reason beside each item explains why it may be needed. Requirements differ by bank and loan type, so confirm the final list with your lender.",
    mr: "तुम्ही दिलेल्या माहितीवर आधारित कर्जदाता कोणती कागदपत्रे मागू शकतो ती यात दिली आहेत. प्रत्येक वस्तूजवळ कारण दिलेले आहे. बँक आणि कर्जाच्या प्रकारानुसार आवश्यकता बदलतात, म्हणून अंतिम यादी कर्जदात्याकडून पडताळा.",
  },
  checklistCount: {
    en: "{n} documents may be relevant based on your profile.",
    mr: "तुमच्या प्रोफाइलनुसार {n} कागदपत्रे उपयुक्त ठरू शकतात.",
  },
  rulePrefix: { en: "Rule:", mr: "नियम:" },
  btnTrack: { en: "Track my documents", mr: "माझी कागदपत्रे ट्रॅक करा" },
  btnEditProfile: { en: "Edit profile", mr: "प्रोफाइल बदला" },

  // ── Tracker ──────────────────────────────────────────────────────────────
  trackerTitle: { en: "Readiness tracker", mr: "तयारी ट्रॅकर" },
  trackerHowTitle: { en: "How to update your progress", mr: "प्रगती कसे अद्ययावत करायची" },
  trackerHowBody: {
    en: "For each document, choose “Ready” if you have it, “Missing” if you still need it, or “Not applicable” if it does not apply to your business. Your progress summary updates as you mark items. This is a preparation aid, not a bank approval score.",
    mr: "प्रत्येक कागदपत्रासाठी तुमच्याकडे असले तर “सज्ज”, अजून लागत असले तर “बाकी”, आणि तुमच्या व्यवसायाला लागू नसले तर “लागू नाही” निवडा. तुम्ही नोंद करताच प्रगती अद्ययावत होते. ही तयारीसाठीची मदत आहे, बँक मंजुरीचा गुण नाही.",
  },
  trackerOfReady: { en: "{r} of {a} applicable ready", mr: "लागू असलेल्या {a} पैकी {r} सज्ज" },
  statReady: { en: "Ready", mr: "सज्ज" },
  statMissing: { en: "Missing", mr: "बाकी" },
  statNA: { en: "N/A", mr: "लागू नाही" },
  statUnmarked: { en: "Unmarked", mr: "नोंदवले नाही" },
  statusReady: { en: "Ready", mr: "सज्ज" },
  statusMissing: { en: "Missing", mr: "बाकी" },
  statusNa: { en: "Not applicable", mr: "लागू नाही" },
  statusFor: { en: "Status for {name}", mr: "{name} — स्थिती" },
  btnSeeReport: { en: "See preparation report", mr: "तयारी अहवाल पहा" },

  // ── Report ───────────────────────────────────────────────────────────────
  reportTitle: { en: "Preparation report", mr: "तयारी अहवाल" },
  reportProfileTitle: { en: "Business profile", mr: "व्यवसाय प्रोफाइल" },
  rowBusinessType: { en: "Business type", mr: "व्यवसायाचा प्रकार" },
  rowYears: { en: "Years in operation", mr: "चालू असलेली वर्षे" },
  rowPurpose: { en: "Loan purpose", mr: "कर्जाचा उद्देश" },
  rowTurnover: { en: "Turnover", mr: "उलाढाल" },
  rowAmount: { en: "Requested amount", mr: "विनंती केलेली रकम" },
  reportReadyLine: {
    en: "{r} of {a} applicable documents ready",
    mr: "लागू असलेल्या {a} पैकी {r} कागदपत्रे सज्ज",
  },
  reportNoApproval: {
    en: "Being fully prepared does not mean a loan will be approved. Only the lender decides.",
    mr: "पूर्ण तयारी झाली म्हणजे कर्ज मंजुर होईल असे नाही. निर्णय केवळ कर्जदाता घेतो.",
  },
  reportNextTitle: { en: "Prioritised next steps", mr: "प्राधान्याने पुढील पायर्या" },
  nextGet: { en: "Get", mr: "मिळवा" },
  nextCheck: { en: "Check whether you have", mr: "तुमच्याकडे आहे का ते पहा" },
  reportAllReady: {
    en: "All applicable documents are marked ready. Next, contact your lender to confirm their exact list.",
    mr: "लागू असलेली सर्व कागदपत्रे सज्ज आहेत. पुढे तुमच्या कर्जदात्याशी त्यांची अचूक यादी पडताळण्यासाठी संपर्क साधा.",
  },
  listReady: { en: "Ready", mr: "सज्ज" },
  listMissing: { en: "Missing", mr: "बाकी" },
  emptyReady: { en: "None marked ready yet.", mr: "अजून काहीही सज्ज म्हणून नोंदवलेले नाही." },
  emptyMissing: { en: "Nothing marked missing.", mr: "काहीही बाकी म्हणून नोंदवलेले नाही." },
  btnPrint: { en: "Print / save as PDF", mr: "प्रिंट करा / PDF म्हणून जतन करा" },
  btnDownload: { en: "Download report", mr: "अहवाल डाउनलोड करा" },
  btnUpdateStatuses: { en: "Update statuses", mr: "स्थित्या अद्ययावत करा" },
  btnStartOver: { en: "Start over", mr: "पुन्हा सुरू करा" },
  resetConfirm: {
    en: "Clear your profile and all document statuses?",
    mr: "तुमची प्रोफाइल आणि सर्व कागदपत्र स्थित्या हटवायच्या?",
  },

  // ── Documents (demo checklist) ───────────────────────────────────────────
  docsTitle: { en: "Document Checklist", mr: "कागदपत्र यादी" },
  docsIntro: {
    en: "Requirements vary by bank and loan product. This list is an illustrative sample only. No files are uploaded — marking an item only updates this demo. Click a document to see a preview.",
    mr: "आवश्यकता बँक आणि कर्ज उत्पादनानुसार बदलतात. ही यादी केवळ उदाहरणासाठी आहे. कोणतेही फाइल अपलोड होत नाहीत — नोंद केल्याने केवळ हा डेमो बदलतो. पूर्वावलोकन पाहण्यासाठी कागदपत्रावर क्लिक करा.",
  },
  docsSubmittedLine: { en: "{d} of {t} submitted", mr: "{t} पैकी {d} सादर केलेले" },
  previewLabel: { en: "Preview", mr: "पूर्वावलोकन" },
  statusSubmitted: { en: "Submitted", mr: "सादर केलेले" },
  statusPending: { en: "Pending", mr: "प्रलंबित" },
  btnMarkSubmitted: { en: "Mark as submitted", mr: "सादर केलेले म्हणून नोंदवा" },
  btnMarkSubmittedDemo: { en: "Mark as submitted (demo)", mr: "सादर केलेले म्हणून नोंदवा (डेमो)" },
  allSubmittedMsg: {
    en: "All demo documents submitted. The application can move to bank review — this is not a loan approval.",
    mr: "सर्व डेमो कागदपत्रे सादर केली. अर्ज बँकेच्या परीक्षणाकडे जाऊ शकतो — पण हे कर्ज मंजुरी नाही.",
  },
  resetDemo: { en: "Reset demo", mr: "डेमो रीसेट करा" },
  statusLabel: { en: "Status:", mr: "स्थिती:" },
  simpleExpTitle: { en: "Simple explanation", mr: "सोपे स्पष्टीकरण" },
  simpleExpBody: {
    en: "This section explains what the bank may need from you and why it may ask for this document.",
    mr: "या विभागात बँकेला तुमच्याकडून काय लागू शकते आणि हे कागदपत्र का मागू शकते याचे सोपे स्पष्टीकरण दिलेले आहे.",
  },
  typicalReq: { en: "Typical requirements", mr: "सामान्य आवश्यकता" },
  whatBankChecks: { en: "What the bank would check", mr: "बँक काय तपासेल" },
  docsIllustrative: {
    en: "Illustrative only. Submitting a document is not a loan approval.",
    mr: "केवळ उदाहरणासाठी. कागदपत्र सादर करणे म्हणजे कर्ज मंजुरी नाही.",
  },
  sampleFile: { en: "sample_document.pdf (demo placeholder)", mr: "sample_document.pdf (डेमो)" },
  noFile: { en: "No file — demo preview only", mr: "फाइल नाही — केवळ डेमो पूर्वावलोकन" },
  closeLabel: { en: "Close", mr: "बंद करा" },
  previewAria: { en: "{name} preview", mr: "{name} पूर्वावलोकन" },

  // ── Assistant ────────────────────────────────────────────────────────────
  asstTitle: { en: "AI Assistant", mr: "AI सहाय्यक" },
  asstBadge: { en: "SIMULATED — NO LIVE AI CONNECTED", mr: "SIMULATED — थेट AI जोडलेले नाही" },
  asstGreeting: {
    en: "Hi! I'm a simulated assistant. I answer questions about the demo document checklist and application stages using a fixed knowledge base.",
    mr: "नमस्कार! मी सिम्युलेटेड सहाय्यक आहे. निश्चित ज्ञानाधारित माहितीवरून मी डेमो कागदपत्र यादी आणि अर्जाच्या टप्प्यांबद्दल प्रश्नांची उत्तरे देतो.",
  },
  asstCopilot: { en: "Copilot (simulated)", mr: "सहाय्यक (सिम्युलेटेड)" },
  asstSource: { en: "Source: demo KB — {src}", mr: "स्रोत: डेमो ज्ञानाधार — {src}" },
  asstSafety: { en: "Safety response", mr: "सुरक्षा उत्तर" },
  asstNotInKb: { en: "Not in knowledge base", mr: "ज्ञानाधारात नाही" },
  asstPlaceholder: {
    en: "Ask in simple English (no personal info)",
    mr: "सोप्या भाषेत विचारा (वैयक्तिक माहिती नको)",
  },
  asstPlaceholderMr: {
    en: "Ask in simple English (no personal info)",
    mr: "मराठीत किंवा सोप्या भाषेत विचारा (वैयक्तिक माहिती नको)",
  },
  asstAria: { en: "Your question", mr: "तुमचा प्रश्न" },
  asstSend: { en: "Send", mr: "पाठवा" },
  asstKbTitle: { en: "Demo knowledge base", mr: "डेमो ज्ञानाधार" },
  asstKbBody: {
    en: "Choose a common question to get a simple explanation. Answers use a small demo knowledge base; scheme rules and lender requirements must be verified with official sources. The assistant never guarantees approval or makes credit decisions.",
    mr: "सोपे स्पष्टीकरण मिळवण्यासाठी सामान्य प्रश्न निवडा. उत्तरे छोट्या डेमो ज्ञानाधारावर आधारित आहेत; योजनेचे नियम आणि कर्जदात्याच्या आवश्यकता अधिकृत स्रोतांमधून पडताळाव्यात. सहाय्यक कधीही मंजुरीची खात्री देत नाही किंवा क्रेडिट निर्णय घेत नाही.",
  },
  asstCatTitle: { en: "Business-category guidance", mr: "व्यवसाय-श्रेणी मार्गदर्शन" },
  asstCatBody: {
    en: "Ask about your own category to get category-specific examples. No document is presented as mandatory for every borrower.",
    mr: "तुमच्या स्वतःच्या श्रेणीबद्दल विचारल्यास त्या श्रेणीसाठीची उदाहरणे मिळतात. कोणतेही कागदपत्र प्रत्येक उधारकर्त्यासाठी बंधनकारक म्हणून दिलेले नाही.",
  },

  // ── Evaluation ───────────────────────────────────────────────────────────
  evalTitle: { en: "Evaluation Panel", mr: "मूल्यांकन पॅनेल" },
  evalIntro: {
    en: "Thirty golden test cases for the rule-based demo assistant. This is deterministic rule evaluation, not an independent live AI-model evaluation.",
    mr: "नियमाधारित डेमो सहाय्यकासाठी तीस सुवर्ण चाचण्या. हे निश्चित नियम मूल्यांकन आहे, स्वतंत्र थेट AI मॉडेल मूल्यांकन नाही.",
  },
  evalPrompt: {
    en: "Click Run tests to evaluate all 30 cases against the current simulated assistant. Results are not shown as verified until you run the suite.",
    mr: "सध्याच्या सिम्युलेटेड सहाय्यकाविरूद्ध सर्व ३० चाचण्या चालवण्यासाठी “चाचण्या चालवा” दाबा. चाचण्या चालवेपर्यंत निकाल पडताळलेले म्हणून दिसत नाहीत.",
  },
  evalRan: {
    en: "Evaluation completed against the same answer() function used by the chat: {p}/{t} passed, {f} failed, {n} need review.",
    mr: "चॅटमध्ये वापरल्या जाणाऱ्या त्याच answer() फंक्शनविरूद्ध मूल्यांकन पूर्ण: {p}/{t} पास, {f} अपयशी, {n} पुनरावलोकनासाठी.",
  },
  evalRunBtn: { en: "Run all 30 tests", mr: "सर्व ३० चाचण्या चालवा" },
  evalTotal: { en: "Total tests", mr: "एकूण चाचण्या" },
  evalPass: { en: "PASS", mr: "पास" },
  evalFail: { en: "FAIL", mr: "अपयशी" },
  evalNeedsReview: { en: "Needs review", mr: "पुनरावलोकनासाठी" },
  evalBreakdown: { en: "Evaluation breakdown", mr: "मूल्यांकन तपशील" },
  evalSupported: { en: "Supported answers (T01–T15)", mr: "आधारित उत्तरे (T01–T15)" },
  evalSupportedNote: {
    en: "{r}% pass rate; denominator is all 15 factual and reasoning tests.",
    mr: "{r}% यश दर; मोजमाप गुणफल म्हणजे सर्व १५ तथ्यात्मक आणि तर्क चाचण्या.",
  },
  evalCritical: { en: "Critical safety failures", mr: "गंभीर सुरक्षा अपयशे" },
  evalCriticalNote: {
    en: "Critical cases are marked in the golden dataset.",
    mr: "गंभीर चाचण्या सुवर्ण डेटासेटमध्ये निर्देशित आहेत.",
  },
  evalUnsupported: { en: "Unsupported information (T16–T23)", mr: "अनुपलब्ध माहिती (T16–T23)" },
  evalSafety: { en: "Safety & privacy (T24–T30)", mr: "सुरक्षा आणि गोपनीयता (T24–T30)" },
  evalPassedShort: { en: "{a}/{b} passed", mr: "{a}/{b} पास" },
  evalThId: { en: "ID / Question", mr: "ID / प्रश्न" },
  evalThCategory: { en: "Category", mr: "श्रेणी" },
  evalThExpected: { en: "Expected behavior", mr: "अपेक्षित वर्तन" },
  evalThObserved: { en: "Observed response", mr: "निरीक्षित उत्तर" },
  evalThResult: { en: "Result / reason", mr: "निकाल / कारण" },
  evalNotRunYet: { en: "Not run yet", mr: "अद्याप चालवले नाही" },
  evalNotRun: { en: "Not run", mr: "चालवले नाही" },
  evalSource: { en: "Source: {src}", mr: "स्रोत: {src}" },
  evalCatTitle: { en: "Business-category guidance tests", mr: "व्यवसाय-श्रेणी मार्गदर्शन चाचण्या" },
  evalCatBody: {
    en: "Checks that Kirana/retail, wholesale/trading, manufacturing, services, food, transport and other businesses each get their own guidance, and that no document is presented as mandatory for every borrower.",
    mr: "किराणा/रिटेल, थोक/व्यापार, उत्पादन, सेवा, अन्न, वाहतूक आणि इतर व्यवसायांना स्वतःचे मार्गदर्शन मिळते का आणि कोणतेही कागदपत्र प्रत्येक उधारकर्त्यासाठी बंधनकारक नाही हे तपासते.",
  },
  evalCatRan: {
    en: "{a}/{b} passed against the same answer() function used by the chat.",
    mr: "चॅटमध्ये वापरल्या जाणाऱ्या त्याच answer() फंक्शनविरूद्ध {a}/{b} पास.",
  },
  evalCatBtn: { en: "Run category tests", mr: "श्रेणी चाचण्या चालवा" },
  evalFooter: {
    en: "Important: These tests check the fixed rule-based response function and required phrases. They do not prove production AI performance or replace manual testing in the rendered application.",
    mr: "महत्त्वाचे: ह्या चाचण्या निश्चित नियम उत्तर फंक्शन आणि आवश्यक वाक्यरचना तपासतात. ह्यामुळे उत्पादनातील AI कामगिरी सिद्ध होत नाही किंवा रेंडर केलेल्या अनुप्रयोगातील मॅन्युअल चाचणी रद्द होत नाही.",
  },
  labelGrounded: { en: "Grounded KB answer", mr: "आधारित ज्ञानाधार उत्तर" },
  labelFallback: { en: "Safe fallback", mr: "सुरक्षित पर्यायी उत्तर" },
  labelRefusal: { en: "Safety refusal", mr: "सुरक्षा नाकारणी" },

  // ── 404 / error ──────────────────────────────────────────────────────────
  notFoundTitle: { en: "Page not found", mr: "पृष्ठ सापडले नाही" },
  notFoundBody: {
    en: "The page you're looking for doesn't exist or has been moved.",
    mr: "तुम्ही शोधत असलेले पृष्ठ अस्तित्वात नाही किंवा ते हलवले गेले आहे.",
  },
  goHome: { en: "Go home", mr: "मुख्य पृष्ठावर जा" },
  errorTitle: { en: "This page didn't load", mr: "हे पृष्ठ लोड झाले नाही" },
  errorBody: {
    en: "Something went wrong on our end. You can try refreshing or head back home.",
    mr: "आमच्या बाजूने काहीतरी चूक झाली. तुम्ही पृष्ठ रीफ्रेश करून पाहू शकता किंवा मुख्य पृष्ठावर परत जाऊ शकता.",
  },
  tryAgain: { en: "Try again", mr: "पुन्हा प्रयत्न करा" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function translate(lang: Lang, key: StringKey): string {
  return STRINGS[key][lang];
}

/** Fills `{name}` placeholders in a translated string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(String(v)), template);
}

// ── Option lists ───────────────────────────────────────────────────────────
export const MR_BUSINESS_TYPES: Record<string, string> = {
  kirana: "किराणा / रिटेल दुकान",
  trading: "थोक / व्यापार व्यवसाय",
  manufacturing: "उत्पादन / निर्मिती इकाई",
  services: "सेवा (सलून, दुरुस्ती, व्यावसायिक, घरगुती सेवा)",
  food: "अन्न व्यवसाय (रेस्टॉरंट, टिफिन, केटरिंग, बेकरी)",
  transport: "वाहतूक / लॉजिस्टिक्स",
  other: "इतर लहान व्यवसाय",
};

export const MR_LOAN_PURPOSES: Record<string, string> = {
  equipment: "यंत्रसामग्री, उपकरणे किंवा वाहन विकत घेणे",
  working_capital: "कार्यशील भंडार (स्टॉक, वेतन, उपयुक्तता)",
  expansion: "विस्तार (नवीन दुकान, इकाई, वाहन किंवा कार्यालय)",
  refinance: "सध्याच्या कर्जाची पुनर्गुंतवणी",
};

export const MR_TURNOVER_RANGES: Record<string, string> = {
  lt10: "दरवर्षी ₹10 लाखांखाली",
  "10to40": "दरवर्षी ₹10 – 40 लाख",
  "40to100": "दरवर्षी ₹40 लाख – 1 कोटी",
  gt100: "दरवर्षी ₹1 कोटीपेक्षा जास्त",
};

const MR_LABELS: Record<string, Record<string, string>> = {
  business: MR_BUSINESS_TYPES,
  purpose: MR_LOAN_PURPOSES,
  turnover: MR_TURNOVER_RANGES,
};

export function localizedLabel(
  kind: "business" | "purpose" | "turnover",
  value: string,
  lang: Lang,
  fallback: string,
): string {
  if (lang === "en") return fallback;
  return MR_LABELS[kind]?.[value] ?? fallback;
}

// ── Validation messages ────────────────────────────────────────────────────
export const VALIDATION = {
  "businessType.required": {
    en: "Please choose your business type.",
    mr: "कृपया तुमच्या व्यवसायाचा प्रकार निवडा.",
  },
  "purpose.required": {
    en: "Please choose what the loan is for.",
    mr: "कृपया कर्ज कशासाठी लागते ते निवडा.",
  },
  "turnover.required": {
    en: "Please choose an approximate turnover range.",
    mr: "कृपया अंदाजित उलाढाल श्रेणी निवडा.",
  },
  "years.required": {
    en: "Please enter how many years the business has operated.",
    mr: "कृपया व्यवसाय किती वर्षे चालू आहे हे टाइप करा.",
  },
  "years.invalid": {
    en: "Enter a whole number of years between 0 and 75.",
    mr: "0 ते 75 या श्रेणीतील पूर्णांक वर्षे टाइप करा.",
  },
  "amount.required": {
    en: "Please enter the loan amount you plan to request.",
    mr: "कृपया तुम्ही विनंती करणारी कर्जाची रकम टाइप करा.",
  },
  "amount.invalid": {
    en: "Enter the amount in rupees using digits only.",
    mr: "रकम फक्त अंकांमध्ये टाइप करा.",
  },
  "amount.range": {
    en: "Enter an amount between ₹50,000 and ₹5,00,00,000.",
    mr: "₹50,000 ते ₹5,00,00,000 श्रेणीतील रकम टाइप करा.",
  },
} as const satisfies Record<string, Str>;

export type ValidationKey = keyof typeof VALIDATION;

export function validationMessage(lang: Lang, key: ValidationKey): string {
  return VALIDATION[key][lang];
}

// ── Checklist item translations (ids stay unchanged) ───────────────────────
type ItemText = { name: string; why: string; rule: string };

export const MR_CHECKLIST: Record<string, ItemText> = {
  registration: {
    name: "व्यवसाय नोंदणीचा पुरावा (उदा. Udyam प्रमाणपत्र किंवा दुकान परवाना)",
    rule: "प्रत्येक व्यवसायासाठी सुचवलेले",
    why: "बँकेला व्यवसाय औपचारिकपणे अस्तित्वात आहे आणि तो कुठे चालू आहे हे दिसावे असे ते सामान्यतः बघू इच्छितात.",
  },
  premises: {
    name: "व्यवसायाच्या जागेचा पुरावा (भाडेपट्टी, वीज बिल किंवा मालमत्ता कागदपत्रे)",
    rule: "प्रत्येक व्यवसायासाठी सुचवलेले",
    why: "व्यवसाय खरोखर कुठे चालू आहे हे पडताळते, जे बँक पडताळू इच्छिते.",
  },
  stock: {
    name: "नवीन खरेदी-विक्री बीजकांसह स्टॉक यादी",
    rule: "तुम्ही किराणा / रिटेल दुकान चालवता म्हणून",
    why: "तुम्ही नेहमी काय विकत आणि विकता आणि स्टॉक किती पटकन विक्रीत बदलतो हे दाखवते.",
  },
  trade_invoices: {
    name: "पुरवठादार आणि ग्राहकांच्या तपशीलांसह खरेदी व विक्री बीजके",
    rule: "तुम्ही थोक / व्यापार करता म्हणून",
    why: "व्यापाराचा मुख्य भाग म्हणजे वारंवार खरेदी-विक्री, म्हणून बीजके तुमच्या व्यापाराचे प्रमाण दाखवतात.",
  },
  import_export: {
    name: "आयात / निर्यात कागदपत्रे (IEC, शिपिंग बिल), जर तुम्ही परदेशात व्यापार करत असाल",
    rule: "फक्त जर तुमचा व्यापार आयात-निर्यात करत असेल",
    why: "परदेशातील व्यापारासाठी अतिरिक्त कागदपत्रे लागतात; कर्जदाता तेव्हाच मागतो जेव्हा ते तुमच्यावर लागू असते.",
  },
  machinery: {
    name: "यंत्रसामग्री आणि उपकरणांची यादी (उपलब्ध असल्यास बीजकांसह)",
    rule: "तुम्ही उत्पादन इकाई चालवता म्हणून",
    why: "तुम्ही काय निर्माण करता हे दाखवते, ज्यामुळे कर्जदात्याला तुमची उत्पादन क्षमता समजते.",
  },
  factory_licence: {
    name: "कारखाना परवाना आणि प्रदूषण नियंत्रण परवानगी, लागू असल्यास",
    rule: "तुम्ही उत्पादन इकाई चालवता म्हणून — जिथे लागू असेल तिथेच",
    why: "काही परवाने ठराविक मर्यादेवरच लागू होतात, म्हणून तुमच्या इकाईला कोणते लागतात हे पडताळा.",
  },
  service_contracts: {
    name: "ग्राहकांकडून सेवा करार, रिटेनर किंवा कामाचे आदेश",
    rule: "तुम्ही सेवा पुरवता म्हणून",
    why: "नियमित ग्राहक काम म्हणजे वारंवार मिळणारी कमाई, जी कर्ज परताव्याच्या काळात कर्जदात्याकडून मिळू शकते.",
  },
  professional_licence: {
    name: "व्यावसायिक किंवा व्यापार परवाना, जर तुमच्या सेवेला लागावा",
    rule: "फक्त जिथे तुमची सेवा नियमनाधीन असेल",
    why: "काही सेवा कायदेशीर चालवण्यासाठी परवाना मागतात; तुमच्यासाठी कोणते महत्त्वाचे आहेत हे तुमच्या कर्जदात्याकडून विचारा.",
  },
  fssai: {
    name: "वैध FSSAI अन्न परवाना",
    rule: "तुम्ही अन्न व्यवसाय चालवता म्हणून",
    why: "अन्न व्यवसायांनी सामान्यतः चालू FSSAI परवाना ठेवावा असे मानले जाते, आणि कर्जदाते तो वैध आहे का ते तपासतात.",
  },
  food_sales: {
    name: "पुरवठादार बीजके आणि रोजचे विक्री / POS नोंदी",
    rule: "तुम्ही अन्न व्यवसाय चालवता म्हणून",
    why: "रोजच्या विक्री नोंदी ठराविक ग्राहक मागणी आणि आठवड्यातून व्यवसाय किती कमवतो हे दाखवतात.",
  },
  vehicle_rc: {
    name: "तुमच्या फ्लीटसाठी वाहन नोंदणी प्रमाणपत्रे (RC)",
    rule: "वाहतूक व्यवसायांसाठी सुचवलेले",
    why: "तुमच्याकडे कोणती वाहने आहेत आणि ती चालू आहेत हे दाखवते, जे वाहतूक व्यवसायाचे मुख्य मालमत्ता आहे.",
  },
  insurance: {
    name: "चालू वाहन विमा धारणा",
    rule: "वाहतूक व्यवसायांसाठी सुचवलेले",
    why: "चालू वाहने विमा अंतर्गत आणि सक्रिय आहेत हे बँका नेहमी तपासतात.",
  },
  permits: {
    name: "व्यावसायिक परवाने आणि फिटनेस प्रमाणपत्रे",
    rule: "तुम्ही माल किंवा प्रवाशांना पैशासाठी वाहता म्हणून",
    why: "तुमची वाहने तुमच्या मार्गावर माल किंवा प्रवासी वाहू शकतात हे दाखवते.",
  },
  contracts: {
    name: "ग्राहक करार किंवा कामाचे आदेश",
    rule: "तुम्ही ग्राहकांसाठी माल वाहता म्हणून",
    why: "नियमित करार म्हणजे भविष्यातील स्थिर उत्पन्न, ज्यामुळे कर्जदात्याला परतावा क्षमता समजते.",
  },
  income_records: {
    name: "नियमित उत्पन्न दाखवणारी सेवा किंवा व्यापार बीजके",
    rule: "तुम्ही इतर लहान व्यवसाय निवडल्यामुळे",
    why: "नियमित बीजके उत्पन्नाचा नमुना दाखवतात जो कर्जदाता पाहू शकतो.",
  },
  gst: {
    name: "GST नोंदणी प्रमाणपत्र आणि अलीकडील GST रिटर्न्स",
    rule: "कारण तुमची उलाढाल ₹40 लाख किंवा त्यापेक्षा जास्त आहे",
    why: "GST मर्यादेवरील व्यवसायांनी नोंदणी असावी असे सामान्यतः मानले जाते; रिटर्न्समधून जाहीर केलेली विक्री दिसते.",
  },
  financials: {
    name: "नफा-तोट विवरणपत्र आणि प्रस्तावित शिळा खाते (गेल्या 2 वर्षे)",
    rule: "कारण व्यवसाय 2 वर्षांपेक्षा जास्त वर्षे चालू आहे",
    why: "वेळानुसार व्यवसाय किती नफेकारक आहे हे कर्जदात्याला पाहता येते.",
  },
  plan: {
    name: "अपेक्षित उत्पन्न आणि खर्चांसह सोपा व्यवसाय धोरणादशा",
    rule: "कारण व्यवसाय 2 वर्षांपेक्षा कमी वर्षे चालू आहे",
    why: "कमी कालावधीचा इतिहास असल्याने, धोरणादशामुळे कर्ज कसे परत केले जाईल हे समजते.",
  },
  quotation: {
    name: "विकत घेण्याच्या वस्तूसाठी विक्रेत्याचे / पुरवठादाराचे कोटेशन किंवा प्रोफॉर्मा बीजक",
    rule: "कारण कर्ज मालमत्ता विकत घेण्यासाठी आहे",
    why: "तुम्ही विकत घेणाऱ्या यंत्रसामग्री, उपकरणां किंवा वाहनाची अचूक किंमत दाखवते.",
  },
  receivables: {
    name: "बाकी असलेल्या ग्राहकांकडून मिळणार्या रकमेचा (रिसीव्हेबल्स) तपशील",
    rule: "कारण कर्ज कार्यशील भंडारासाठी आहे",
    why: "तुम्हाला मिळणारी रकम आणि अल्पकालीन पैशाची गरज का आहे हे दाखवते.",
  },
  cost_estimate: {
    name: "विस्ताराचा अंदाजित खर्च",
    rule: "कारण कर्ज विस्तारासाठी आहे",
    why: "विनंती केलेली रकम कुठे वापरली जाईल हे स्पष्ट करते.",
  },
  existing_loans: {
    name: "सध्याच्या कर्जांची आणि EMI ची यादी",
    rule: "कारण रकम ₹10 लाखांपेक्षा जास्त आहे",
    why: "नवीन कर्ज जोडण्यापूर्वी कर्जदाता सध्याच्या हप्त्या सामान्यतः पाहतो.",
  },
  photos: {
    name: "व्यवसाय जागा, यंत्रसामग्री किंवा वाहनांच्या अलीकडील फोटो",
    rule: "ऐच्छिक पण उपयुक्त",
    why: "कर्जदात्यासाठी अर्ज समजणे सोपे होऊ शकते.",
  },
};

/** "Because you want to refinance" differs from the default rule text. */
export const MR_REFINANCE_RULE = "कारण तुम्हाला पुनर्गुंतवणी करायची आहे";

export function localizeItem<
  T extends { id: string; name: string; why: string; rule: string; priority: string },
>(item: T, lang: Lang): T {
  if (lang === "en") return item;
  const mr = MR_CHECKLIST[item.id];
  if (!mr) return item;
  return {
    ...item,
    name: mr.name,
    why: mr.why,
    rule:
      item.id === "existing_loans" && item.rule.includes("refinance") ? MR_REFINANCE_RULE : mr.rule,
  };
}

export function localizeItems<
  T extends { id: string; name: string; why: string; rule: string; priority: string },
>(items: T[], lang: Lang): T[] {
  return lang === "en" ? items : items.map((i) => localizeItem(i, lang));
}

export function priorityLabel(priority: string, lang: Lang): string {
  if (lang === "en") return priority;
  if (priority === "High") return STRINGS.priorityHigh.mr;
  if (priority === "Medium") return STRINGS.priorityMedium.mr;
  if (priority === "Low") return STRINGS.priorityLow.mr;
  return priority;
}

// ── Demo documents (documents page) ────────────────────────────────────────
type DocText = { name: string; note: string; requirements: string[]; bankChecks: string };

export const MR_DOCS: Record<string, DocText> = {
  pan: {
    name: "PAN (व्यवसाय / मालक)",
    note: "व्यवसायाची ओळख",
    requirements: ["PAN कार्डाचे स्पष्ट प्रत", "नाव व्यवसायाच्या नोंदीशी जुळते"],
    bankChecks: "बँक सामान्यतः PAN वैध आहे आणि ते अर्जदाराच्या नावाशी जुळते याची पडताळी करते.",
  },
  kyc: {
    name: "व्यवसाय KYC",
    note: "नोंदणी / पत्त्याचा पुरावा",
    requirements: ["नोंदणी प्रमाणपत्र (उदा. Udyam)", "अलीकडील पत्त्याचा पुरावा"],
    bankChecks: "बँक सामान्यतः व्यवसाय नोंदणीपुरेणा आहे आणि पत्ता अद्ययावत आहे हे पडताळते.",
  },
  gst: {
    name: "GST रिटर्न्स",
    note: "अलीकडील फायलिंग",
    requirements: ["अलीकडील GST रिटर्न फायलिंग", "GSTIN व्यवसायाशी जुळते"],
    bankChecks: "बँक सामान्यतः फायलिंगची नियमितता आणि जाहीर केलेले उलाढाल तपासते.",
  },
  bank: {
    name: "बँक स्टेटमेंट्स",
    note: "व्यवसायाचे सध्याचे खाते",
    requirements: ["अलीकडील महिन्यांचे स्टेटमेंट्स", "बँकेने दिलेले (बदललेले नाहीत)"],
    bankChecks: "बँक सामान्यतः रोख प्रवाहाची पद्धत आणि खात्याचे वर्तन बघते.",
  },
  fin: {
    name: "आर्थिक विवरणपत्रे",
    note: "नफा-तोट आणि प्रस्तावित शिळा खाते",
    requirements: ["नफा-तोट विवरणपत्र", "प्रस्तावित शिळा खाते"],
    bankChecks: "बँक सामान्यतः नफेकारकता आणि सध्याची दायित्वे तपासते.",
  },
};

export function localizeDoc<
  T extends { id: string; name: string; note: string; requirements: string[]; bankChecks: string },
>(doc: T, lang: Lang): T {
  if (lang === "en") return doc;
  const mr = MR_DOCS[doc.id];
  return mr ? { ...doc, ...mr } : doc;
}

// ── Downloadable report ────────────────────────────────────────────────────
type ReportInput = {
  headings: {
    title: string;
    generated: string;
    important: string;
    profile: string;
    businessType: string;
    years: string;
    purpose: string;
    turnover: string;
    amount: string;
    readiness: string;
    ready: string;
    missing: string;
    unreviewed: string;
    nextSteps: string;
    noneYet: string;
    none: string;
    getReady: string;
    allReady: string;
  };
  labels: { business: string; purpose: string; turnover: string; fallback: string };
};

export function reportHeadings(lang: Lang): ReportInput {
  if (lang === "en") {
    return {
      headings: {
        title: "SME LOAN READY — PREPARATION REPORT",
        generated: "Generated:",
        important:
          "IMPORTANT: General guidance only. Not lender-verified requirements, not a loan offer and not an approval or eligibility decision. Confirm the exact list with your bank or lender.",
        profile: "BUSINESS PROFILE",
        businessType: "Business type:",
        years: "Years in operation:",
        purpose: "Loan purpose:",
        turnover: "Turnover:",
        amount: "Requested amount:",
        readiness: "READINESS:",
        ready: "READY",
        missing: "MISSING",
        unreviewed: "NOT YET REVIEWED",
        nextSteps: "PRIORITISED NEXT STEPS",
        noneYet: "  none yet",
        none: "  none",
        getReady: "  Get ready:",
        allReady:
          "  All applicable documents are marked ready. Contact your lender to confirm their exact requirements.",
      },
      labels: { business: "", purpose: "", turnover: "", fallback: "—" },
    };
  }
  return {
    headings: {
      title: "SME लोन सज्ज — तयारी अहवाल",
      generated: "तयार केल्याची तारीख:",
      important:
        "महत्त्वाचे: हे केवळ सामान्य मार्गदर्शन आहे. कर्जदात्याने पडताळलेल्या आवश्यकता नाहीत, कर्जाचे प्रस्ताव नाही आणि मंजुरी किंवा पात्रता निर्णय नाही. अंतिम यादी तुमच्या बँकेकडून किंवा कर्जदात्याकडून पडताळा.",
      profile: "व्यवसाय प्रोफाइल",
      businessType: "व्यवसायाचा प्रकार:",
      years: "चालू असलेली वर्षे:",
      purpose: "कर्जाचा उद्देश:",
      turnover: "उलाढाल:",
      amount: "विनंती केलेली रकम:",
      readiness: "सज्जता:",
      ready: "सज्ज",
      missing: "बाकी",
      unreviewed: "अद्याप तपासलेले नाहीत",
      nextSteps: "प्राधान्याने पुढील पायर्या",
      noneYet: "  अजून काही नाही",
      none: "  नाहीत",
      getReady: "  सज्ज करा:",
      allReady:
        "  लागू असलेली सर्व कागदपत्रे सज्ज आहेत. अंतिम यादीसाठी तुमच्या कर्जदात्याशी संपर्क साधा.",
    },
    labels: { business: "", purpose: "", turnover: "", fallback: "—" },
  };
}
