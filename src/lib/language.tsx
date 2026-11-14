import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "mr";

const COPY = {
  en: {
    brand: "SME Loan Ready",
    safetyBanner: "Educational preparation guide only — not a banking service or loan decision. Demo data only. Never enter personal or ID details.",
    navHome: "Home", navProfile: "Business details", navChecklist: "Checklist", navVisit: "Before the bank", navFinance: "Business finance", navReport: "My preparation",
    language: "Language", english: "English", marathi: "मराठी", demoMode: "PRACTICE MODE · FICTIONAL EXAMPLE",
    homeEyebrow: "A calmer first step toward the bank",
    homeTitle: "Prepare for Your Bank Visit with Confidence",
    homeSubtitle: "Understand your loan preparation steps, documents and what to expect before approaching a bank.",
    start: "Start My Loan Readiness", exploreFinance: "Explore Business Finance", homeNote: "A private practice guide. Your progress stays in this browser.",
    homeHow: "A clearer way to prepare", homeHowText: "Describe your business, review a document list shaped around your answers, and decide what you may want to clarify with a lender.",
    safetyTitle: "Preparation guidance, not a lending decision", safetyText: "Document needs and loan terms vary by bank, lender, loan product and scheme. Only the lender can assess or approve an application.",
    profileTitle: "Tell us about your business", profileSubtitle: "A few approximate details help shape a useful preparation list. No personal identity details are needed.",
    profileHelpTitle: "Keep it simple", profileHelp: "Choose the closest answer. Estimates are fine. Never enter PAN, Aadhaar, passwords, OTPs, or bank account details.",
    businessType: "Business category", businessAge: "How long has the business been operating?", loanPurpose: "What would the funding be used for?",
    turnover: "Approximate yearly turnover", amount: "Approximate amount you may request (₹)", amountHint: "Example only; between ₹50,000 and ₹5 crore.",
    choose: "Choose one…", years: "Years in operation", profileContinue: "Build my checklist", profileUpdate: "Update and view checklist",
    editProfile: "Edit business details", step: "Step", profileStep: "Business", checklistStep: "Documents", trackerStep: "Progress", reportStep: "Summary",
    checklistTitle: "Your document checklist", checklistIntro: "These are common examples based on your answers. Each lender may ask for different documents.",
    whyMayNeed: "Why it may be needed", whatToPrepare: "What you can prepare", priority: "Priority", varyNote: "Requirements differ between banks, lenders, loan products and schemes. Confirm the exact list with an authorized bank representative.",
    trackerTitle: "Track your preparation", trackerIntro: "Choose the description that best fits each item. This is for preparation only, not an approval score.",
    ready: "Ready", unavailable: "Not available", needHelp: "Need help", pending: "Pending", clarification: "Needs clarification", notReviewed: "Not reviewed",
    allItems: "Checklist items", progress: "Preparation progress", continueReport: "View my preparation", backChecklist: "Review checklist",
    reportTitle: "Your Loan Readiness Checklist Is Ready", reportIntro: "Here is your preparation summary. Being prepared does not mean a loan will be approved.",
    readyDocs: "Documents marked ready", pendingDocs: "Documents pending", clarifyDocs: "Documents requiring clarification", nextSteps: "Suggested next steps",
    noneReady: "No documents marked ready yet.", nonePending: "Nothing marked unavailable.", noneClarify: "Nothing marked for clarification.", noNext: "Review your answers with an authorized lender representative and confirm their requirements.",
    download: "Download checklist", print: "Print / save as PDF", startAgain: "Start again", confirmReset: "Clear your business details and checklist progress?",
    visitLink: "Before visiting the bank", financeLink: "Understand business finance", guidanceLabel: "General guidance only",
    visitTitle: "Not Sure What Happens at the Bank?", visitIntro: "A first conversation is a chance to explain your business and learn what the lender needs.",
    firstVisit: "What happens during a first bank visit?", visit1: "Explain your business.", visit2: "Explain why you need funding.", visit3: "Discuss your approximate funding requirement.", visit4: "Ask about applicable loan products and requirements.", visit5: "Understand the next steps.",
    officerQuestions: "Common questions a credit officer may ask", q1: "What business do you operate?", q2: "How long have you been operating?", q3: "What is your monthly turnover?", q4: "What is the purpose of the loan?", q5: "How will the funds be used?", q6: "How do you plan to repay?",
    dontKnowTitle: "What if you don't know an answer?", dontKnow: "It is okay if you do not know every answer. Be honest. Do not guess or provide incorrect information. Ask the bank representative to explain anything you do not understand.",
    financeTitle: "Understand Business Finance", financeIntro: "Learn about common types of business finance. The right option and terms depend on your business and the lender's assessment.",
    termLoan: "Term loan", termMeaning: "A loan repaid over an agreed period, often used for eligible investments such as equipment or expansion.", termUse: "Typical use: equipment or business expansion.", termRepay: "Repayment: scheduled instalments; interest and fees depend on the lender and offer.", termAsk: "Ask the bank: What is the repayment schedule, total cost, and any fees?",
    cc: "Cash credit (CC)", ccMeaning: "A working-capital facility commonly used for recurring business needs such as stock and inventory, subject to lender approval.", ccUse: "Typical use: recurring working-capital needs such as stock.", ccRepay: "Cost: interest may depend on the amount used and facility terms.", ccAsk: "Ask the bank: How is the limit set, and how are interest and renewals handled?",
    od: "Overdraft (OD)", odMeaning: "An approved borrowing facility that can help manage short-term cash-flow requirements.", odUse: "Typical use: temporary cash-flow gaps.", odRepay: "Cost: interest and charges depend on the amount used and lender terms.", odAsk: "Ask the bank: What are the charges, repayment expectations, and review period?",
    noRecommendation: "This guide does not recommend a particular facility. Approval, limits, interest rates, fees and terms depend on the lender and its assessment.",
    returnHome: "Back to home", previous: "Previous", next: "Continue", pageUnavailable: "Please complete your business details first.", goProfile: "Add business details",
    food: "Food stall / Food business", grocery: "Grocery shop", retail: "Retail shop", manufacturing: "Manufacturing", trading: "Trading", transport: "Transport", other: "Other",
    ageUnder1: "Less than 1 year", age1to3: "1–3 years", age3to5: "3–5 years", ageOver5: "More than 5 years",
    purposeExpansion: "Business expansion", purposeEquipment: "Equipment purchase", purposeWorking: "Working capital", purposeStock: "Stock purchase", purposeOther: "Other",
    turnoverLt10: "Under ₹10 lakh a year", turnover10to40: "₹10–40 lakh a year", turnover40to100: "₹40 lakh–1 crore a year", turnoverGt100: "Over ₹1 crore a year",
    errBusiness: "Please choose a business category.", errAge: "Please choose how long your business has operated.", errPurpose: "Please choose what the funding may be used for.", errTurnover: "Please choose an approximate turnover range.", errAmount: "Please enter a whole-rupee amount between ₹50,000 and ₹5,00,00,000.",
    priorityHigh: "Important", priorityMedium: "Useful", priorityLow: "Optional",
  },
  mr: {
    brand: "एसएमई कर्ज तयारी",
    safetyBanner: "फक्त शैक्षणिक तयारी मार्गदर्शक — ही बँक सेवा किंवा कर्जाचा निर्णय नाही. फक्त नमुना माहिती. वैयक्तिक किंवा ओळख तपशील देऊ नका.",
    navHome: "मुख्यपृष्ठ", navProfile: "व्यवसायाची माहिती", navChecklist: "कागदपत्रे", navVisit: "बँकेत जाण्यापूर्वी", navFinance: "व्यवसाय वित्त", navReport: "माझी तयारी",
    language: "भाषा", english: "English", marathi: "मराठी", demoMode: "सराव मोड · काल्पनिक उदाहरण",
    homeEyebrow: "बँकेकडे जाण्यापूर्वीची सोपी सुरुवात",
    homeTitle: "बँकेच्या भेटीसाठी आत्मविश्वासाने तयारी करा",
    homeSubtitle: "बँकेशी संपर्क करण्यापूर्वी कर्जाची तयारी, कागदपत्रे आणि पुढे काय होईल हे समजून घ्या.",
    start: "कर्ज तयारी सुरू करा", exploreFinance: "व्यवसाय वित्त समजून घ्या", homeNote: "खाजगी सराव मार्गदर्शक. तुमची प्रगती याच ब्राउझरमध्ये राहते.",
    homeHow: "तयारीचा सोपा मार्ग", homeHowText: "तुमच्या व्यवसायाची माहिती द्या, उत्तरांनुसार तयार झालेली कागदपत्रांची यादी पाहा आणि बँकेकडे काय विचारायचे ते ठरवा.",
    safetyTitle: "तयारीसाठी मार्गदर्शन; कर्जाचा निर्णय नाही", safetyText: "कागदपत्रे आणि कर्जाच्या अटी बँक, कर्जदाता, कर्ज उत्पादन आणि योजनेनुसार बदलतात. अर्जाचे मूल्यांकन किंवा मंजुरी फक्त कर्जदाता देऊ शकतो.",
    profileTitle: "तुमच्या व्यवसायाबद्दल सांगा", profileSubtitle: "काही अंदाजे माहितीमुळे उपयुक्त तयारी यादी बनते. वैयक्तिक ओळख तपशीलांची गरज नाही.",
    profileHelpTitle: "सोपे ठेवा", profileHelp: "सर्वात जवळचा पर्याय निवडा. अंदाज चालेल. PAN, आधार, पासवर्ड, OTP किंवा बँक खाते तपशील कधीही देऊ नका.",
    businessType: "व्यवसायाचा प्रकार", businessAge: "व्यवसाय किती काळापासून सुरू आहे?", loanPurpose: "मिळणारा निधी कशासाठी वापरणार?",
    turnover: "अंदाजे वार्षिक उलाढाल", amount: "अंदाजे मागणीची रक्कम (₹)", amountHint: "फक्त उदाहरण; ₹५०,००० ते ₹५ कोटी दरम्यान.",
    choose: "एक निवडा…", years: "व्यवसाय सुरू होऊन किती वर्षे", profileContinue: "माझी यादी तयार करा", profileUpdate: "माहिती बदला आणि यादी पहा",
    editProfile: "व्यवसायाची माहिती बदला", step: "पायरी", profileStep: "व्यवसाय", checklistStep: "कागदपत्रे", trackerStep: "प्रगती", reportStep: "सारांश",
    checklistTitle: "तुमची कागदपत्रांची यादी", checklistIntro: "तुमच्या उत्तरांनुसार ही सामान्य उदाहरणे आहेत. प्रत्येक कर्जदाता वेगळी कागदपत्रे मागू शकतो.",
    whyMayNeed: "हे का लागू शकते", whatToPrepare: "काय तयार ठेवावे", priority: "प्राधान्य", varyNote: "बँक, कर्जदाता, कर्ज उत्पादन आणि योजनांनुसार आवश्यकता बदलतात. अधिकृत बँक प्रतिनिधीकडून अचूक यादी विचारा.",
    trackerTitle: "तुमच्या तयारीची नोंद ठेवा", trackerIntro: "प्रत्येक बाबीसाठी योग्य स्थिती निवडा. ही केवळ तयारीसाठी आहे; मंजुरीचा गुण नाही.",
    ready: "तयार", unavailable: "उपलब्ध नाही", needHelp: "मदत हवी", pending: "प्रलंबित", clarification: "स्पष्टीकरण हवे", notReviewed: "अजून पाहिले नाही",
    allItems: "यादीतील बाबी", progress: "तयारीची प्रगती", continueReport: "माझा तयारी सारांश", backChecklist: "यादी पुन्हा पहा",
    reportTitle: "तुमची कर्ज तयारी यादी तयार आहे", reportIntro: "हा तुमच्या तयारीचा सारांश आहे. पूर्ण तयारी म्हणजे कर्ज मंजूर होईल असे नाही.",
    readyDocs: "तयार म्हणून चिन्हांकित", pendingDocs: "प्रलंबित कागदपत्रे", clarifyDocs: "स्पष्टीकरण आवश्यक", nextSteps: "पुढील तयारीच्या सूचना",
    noneReady: "अजून कोणतेही कागदपत्र तयार म्हणून चिन्हांकित नाही.", nonePending: "उपलब्ध नाही असे काहीही चिन्हांकित नाही.", noneClarify: "स्पष्टीकरणासाठी काहीही चिन्हांकित नाही.", noNext: "अधिकृत कर्जदाता प्रतिनिधीशी उत्तरांची चर्चा करा आणि त्यांची आवश्यकता तपासा.",
    download: "यादी डाउनलोड करा", print: "प्रिंट / PDF म्हणून जतन करा", startAgain: "पुन्हा सुरू करा", confirmReset: "व्यवसायाची माहिती आणि यादीची प्रगती पुसायची?",
    visitLink: "बँकेत जाण्यापूर्वी", financeLink: "व्यवसाय वित्त समजून घ्या", guidanceLabel: "सामान्य मार्गदर्शन",
    visitTitle: "बँकेत गेल्यावर काय होईल याची काळजी वाटते?", visitIntro: "पहिली भेट म्हणजे व्यवसाय समजावून सांगण्याची आणि कर्जदात्याला काय हवे आहे हे जाणून घेण्याची संधी.",
    firstVisit: "बँकेच्या पहिल्या भेटीत काय होते?", visit1: "तुमचा व्यवसाय समजावून सांगा.", visit2: "निधीची गरज का आहे ते सांगा.", visit3: "अंदाजे निधीची गरज सांगा.", visit4: "लागू कर्ज उत्पादने आणि आवश्यकता विचारा.", visit5: "पुढील टप्पे समजून घ्या.",
    officerQuestions: "कर्ज अधिकारी कोणते प्रश्न विचारू शकतात", q1: "तुम्ही कोणता व्यवसाय करता?", q2: "व्यवसाय किती काळापासून सुरू आहे?", q3: "तुमची मासिक उलाढाल किती आहे?", q4: "कर्जाचा उद्देश काय आहे?", q5: "निधी कसा वापरणार?", q6: "परतफेड कशी करणार?",
    dontKnowTitle: "उत्तर माहीत नसेल तर?", dontKnow: "प्रत्येक उत्तर माहीत नसणे ठीक आहे. प्रामाणिक रहा. अंदाज लावू नका किंवा चुकीची माहिती देऊ नका. न समजलेली गोष्ट बँक प्रतिनिधीला समजावून सांगायला सांगा.",
    financeTitle: "व्यवसाय वित्त समजून घ्या", financeIntro: "व्यवसायासाठी वापरल्या जाणाऱ्या वित्त प्रकारांबद्दल जाणून घ्या. योग्य पर्याय आणि अटी तुमचा व्यवसाय व कर्जदात्याच्या मूल्यांकनावर अवलंबून असतात.",
    termLoan: "मुदत कर्ज", termMeaning: "ठराविक कालावधीत परतफेड केले जाणारे कर्ज; उपकरणे किंवा व्यवसाय विस्तारासारख्या पात्र गुंतवणुकीसाठी वापरले जाऊ शकते.", termUse: "सामान्य वापर: उपकरणे किंवा व्यवसायाचा विस्तार.", termRepay: "परतफेड: ठराविक हप्ते; व्याज व शुल्क कर्जदात्याच्या अटींवर अवलंबून.", termAsk: "बँकेला विचारा: परतफेड वेळापत्रक, एकूण खर्च आणि शुल्क काय आहेत?",
    cc: "कॅश क्रेडिट (CC)", ccMeaning: "माल किंवा साठ्यासारख्या नियमित व्यावसायिक गरजांसाठी वापरली जाणारी खेळत्या भांडवलाची सुविधा; कर्जदात्याची मंजुरी आवश्यक.", ccUse: "सामान्य वापर: मालासारख्या नियमित खेळत्या भांडवलाच्या गरजा.", ccRepay: "खर्च: वापरलेली रक्कम आणि सुविधेच्या अटींनुसार व्याज लागू शकते.", ccAsk: "बँकेला विचारा: मर्यादा कशी ठरते, व्याज आणि नूतनीकरण कसे होते?",
    od: "ओव्हरड्राफ्ट (OD)", odMeaning: "अल्पकालीन रोख प्रवाहाची गरज भागवण्यासाठी मदत करणारी मंजूर कर्ज सुविधा.", odUse: "सामान्य वापर: तात्पुरती रोख तूट भरून काढणे.", odRepay: "खर्च: वापरलेली रक्कम आणि कर्जदात्याच्या अटींवर व्याज व शुल्क अवलंबून.", odAsk: "बँकेला विचारा: शुल्क, परतफेडीची अपेक्षा आणि पुनरावलोकन कालावधी काय?",
    noRecommendation: "हा मार्गदर्शक कोणत्याही विशिष्ट सुविधेची शिफारस करत नाही. मंजुरी, मर्यादा, व्याजदर, शुल्क आणि अटी कर्जदाता व त्याच्या मूल्यांकनावर अवलंबून असतात.",
    returnHome: "मुख्यपृष्ठावर", previous: "मागे", next: "पुढे जा", pageUnavailable: "कृपया आधी व्यवसायाची माहिती भरा.", goProfile: "व्यवसायाची माहिती भरा",
    food: "खाद्य स्टॉल / खाद्य व्यवसाय", grocery: "किराणा दुकान", retail: "किरकोळ दुकान", manufacturing: "उत्पादन", trading: "व्यापार", transport: "वाहतूक", other: "इतर",
    ageUnder1: "१ वर्षापेक्षा कमी", age1to3: "१–३ वर्षे", age3to5: "३–५ वर्षे", ageOver5: "५ वर्षांपेक्षा जास्त",
    purposeExpansion: "व्यवसायाचा विस्तार", purposeEquipment: "उपकरणे खरेदी", purposeWorking: "खेळते भांडवल", purposeStock: "मालसाठा खरेदी", purposeOther: "इतर",
    turnoverLt10: "वर्षाला ₹१० लाखांपेक्षा कमी", turnover10to40: "वर्षाला ₹१०–४० लाख", turnover40to100: "वर्षाला ₹४० लाख–१ कोटी", turnoverGt100: "वर्षाला ₹१ कोटींपेक्षा जास्त",
    errBusiness: "व्यवसायाचा प्रकार निवडा.", errAge: "व्यवसाय किती काळापासून सुरू आहे ते निवडा.", errPurpose: "निधीचा संभाव्य उपयोग निवडा.", errTurnover: "अंदाजे उलाढाल निवडा.", errAmount: "₹५०,००० ते ₹५,००,००,००० दरम्यानची पूर्ण रुपयांतील रक्कम भरा.",
    priorityHigh: "महत्त्वाचे", priorityMedium: "उपयुक्त", priorityLow: "पर्यायी",
  },
} as const;

export type CopyKey = keyof typeof COPY.en;
export const text = (language: Language, key: CopyKey) => COPY[language][key];

const LANG_KEY = "sme-loan-ready.language";
const LanguageContext = createContext<{ language: Language; setLanguage: (value: Language) => void } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "mr") setLanguage(saved);
  }, []);
  const changeLanguage = (value: Language) => {
    setLanguage(value);
    localStorage.setItem(LANG_KEY, value);
  };
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider missing");
  return value;
}

const FALLBACK_ITEM = {
  en: { name: "Business document", why: "A lender may ask for information about your business.", prepare: "Ask the lender what information they need." },
  mr: { name: "व्यवसायाचे कागदपत्र", why: "कर्जदाता व्यवसायाबद्दल माहिती विचारू शकतो.", prepare: "कर्जदात्याला कोणती माहिती हवी ते विचारा." },
};

export const ITEM_COPY: Record<string, { en: { name: string; why: string; prepare: string }; mr: { name: string; why: string; prepare: string } }> = {
  registration: { en: { name: "Business registration or shop licence", why: "May help show that the business operates as described.", prepare: "A copy of a business registration, Udyam certificate, or shop licence if available." }, mr: { name: "व्यवसाय नोंदणी किंवा दुकान परवाना", why: "व्यवसाय दिलेल्या माहितीनुसार चालतो हे दाखवण्यास मदत होऊ शकते.", prepare: "उपलब्ध असल्यास व्यवसाय नोंदणी, उद्यम प्रमाणपत्र किंवा दुकान परवान्याची प्रत." } },
  vehicle_rc: { en: { name: "Vehicle registration certificates (RC)", why: "May describe the vehicles used in the transport business.", prepare: "Vehicle registration certificates for vehicles used by the business." }, mr: { name: "वाहन नोंदणी प्रमाणपत्रे (RC)", why: "वाहतूक व्यवसायात वापरल्या जाणाऱ्या वाहनांची माहिती देऊ शकतात.", prepare: "व्यवसायातील वाहनांची नोंदणी प्रमाणपत्रे." } },
  insurance: { en: { name: "Current vehicle insurance policies", why: "A lender may ask about cover for vehicles used by the business.", prepare: "Current policy documents for business vehicles, if applicable." }, mr: { name: "चालू वाहन विमा पॉलिसी", why: "व्यवसायातील वाहनांच्या विम्याबद्दल कर्जदाता विचारू शकतो.", prepare: "लागू असल्यास व्यवसायातील वाहनांची चालू पॉलिसी कागदपत्रे." } },
  permits: { en: { name: "Commercial permits and fitness certificates", why: "May help explain whether commercial vehicles can operate on intended routes.", prepare: "Relevant commercial permits and valid fitness certificates, if applicable." }, mr: { name: "व्यावसायिक परवाने आणि फिटनेस प्रमाणपत्रे", why: "व्यावसायिक वाहने नियोजित मार्गांवर चालवता येतात का हे समजण्यास मदत होऊ शकते.", prepare: "लागू असल्यास व्यावसायिक परवाने आणि वैध फिटनेस प्रमाणपत्रे." } },
  contracts: { en: { name: "Customer contracts, orders, or work agreements", why: "May help explain expected business activity and customer work.", prepare: "Recent customer agreements, purchase orders, or work orders if available." }, mr: { name: "ग्राहक करार, ऑर्डर किंवा कामाचे करार", why: "अपेक्षित व्यवसाय आणि ग्राहकांकडील काम समजण्यास मदत होऊ शकते.", prepare: "उपलब्ध असल्यास अलीकडील ग्राहक करार, खरेदी ऑर्डर किंवा कामाच्या ऑर्डर." } },
  gst: { en: { name: "GST registration and recent GST returns", why: "May help explain reported business sales where GST applies.", prepare: "GST registration certificate and recent filed returns, if applicable." }, mr: { name: "GST नोंदणी आणि अलीकडील GST रिटर्न", why: "GST लागू असल्यास नोंदवलेली विक्री समजण्यास मदत होऊ शकते.", prepare: "लागू असल्यास GST नोंदणी प्रमाणपत्र आणि अलीकडे भरलेले रिटर्न." } },
  financials: { en: { name: "Business income and expense records", why: "May help the lender understand the business's financial activity.", prepare: "Available profit-and-loss summaries or other business financial records." }, mr: { name: "व्यवसायाचे उत्पन्न आणि खर्च नोंदी", why: "व्यवसायाची आर्थिक स्थिती समजण्यास कर्जदात्याला मदत होऊ शकते.", prepare: "उपलब्ध नफा-तोटा सारांश किंवा इतर आर्थिक नोंदी." } },
  plan: { en: { name: "Simple business plan and expected costs", why: "A short operating history may make it useful to explain future plans.", prepare: "A simple note on what the business does, expected income, costs, and use of funds." }, mr: { name: "साधा व्यवसाय आराखडा आणि अपेक्षित खर्च", why: "व्यवसायाचा अनुभव कमी असल्यास भविष्यातील योजना स्पष्ट करणे उपयुक्त ठरू शकते.", prepare: "व्यवसाय, अपेक्षित उत्पन्न, खर्च आणि निधीचा उपयोग याबद्दलची साधी नोंद." } },
  quotation: { en: { name: "Equipment quotation or proforma invoice", why: "May show the estimated cost of equipment you plan to buy.", prepare: "A current quotation or proforma invoice from a supplier, if available." }, mr: { name: "उपकरणांचे कोटेशन किंवा प्रोफॉर्मा इनव्हॉइस", why: "खरेदीच्या उपकरणांचा अंदाजे खर्च दाखवू शकते.", prepare: "उपलब्ध असल्यास पुरवठादाराचे चालू कोटेशन किंवा प्रोफॉर्मा इनव्हॉइस." } },
  receivables: { en: { name: "Summary of expected customer payments", why: "May help describe short-term working-capital needs.", prepare: "A simple list of unpaid invoices or expected customer payments." }, mr: { name: "अपेक्षित ग्राहक पेमेंटचा सारांश", why: "अल्पकालीन खेळत्या भांडवलाची गरज स्पष्ट करण्यास मदत होऊ शकते.", prepare: "थकीत बिले किंवा अपेक्षित ग्राहक पेमेंटची साधी यादी." } },
  cost_estimate: { en: { name: "Cost estimate for expansion", why: "May explain how the funds could be used for the planned expansion.", prepare: "A simple cost breakdown, estimates, or supplier quotes for planned work." }, mr: { name: "विस्तारासाठी खर्चाचा अंदाज", why: "नियोजित विस्तारासाठी निधी कसा वापरला जाईल हे स्पष्ट होऊ शकते.", prepare: "नियोजित कामाचा साधा खर्च तपशील, अंदाज किंवा पुरवठादाराची कोटेशन्स." } },
  existing_loans: { en: { name: "Summary of existing business repayments", why: "A lender may ask about current commitments when discussing additional borrowing.", prepare: "A simple list of existing business loan payments; do not include account numbers." }, mr: { name: "व्यवसायाच्या सध्याच्या परतफेडीचा सारांश", why: "अतिरिक्त कर्जाबद्दल चर्चा करताना सध्याच्या देयकांबद्दल कर्जदाता विचारू शकतो.", prepare: "सध्याच्या व्यवसाय कर्जहप्त्यांची साधी यादी; खाते क्रमांक देऊ नका." } },
  photos: { en: { name: "Recent photos of business premises or equipment", why: "Optional images may help describe the business setup.", prepare: "Recent non-sensitive photos, only if you are comfortable sharing them with the lender." }, mr: { name: "व्यवसायाच्या जागेची किंवा उपकरणांची अलीकडील छायाचित्रे", why: "ऐच्छिक छायाचित्रांमुळे व्यवसायाची मांडणी समजण्यास मदत होऊ शकते.", prepare: "तुम्हाला कर्जदात्याला द्यायला योग्य वाटल्यास अलीकडील, संवेदनशील नसलेली छायाचित्रे." } },
  business_use: { en: { name: "Brief note describing the planned use of funds", why: "May help connect the requested funding with the business need.", prepare: "A short, truthful description of what you plan to pay for." }, mr: { name: "निधीच्या नियोजित वापराची थोडक्यात नोंद", why: "मागितलेल्या निधीचा व्यवसायाच्या गरजेशी संबंध स्पष्ट होऊ शकतो.", prepare: "कशासाठी पैसे वापरणार याचे थोडक्यात आणि अचूक वर्णन." } },
};

export function localizedItem(id: string, language: Language) {
  return ITEM_COPY[id]?.[language] ?? FALLBACK_ITEM[language];
}