import React, { useState } from "react";
import { Building2, Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Pricing ────────────────────────────────────────────────────────────────
const BASE_RATES = [
  { max: 2500,    rate: 0.44 },
  { max: 3500,    rate: 0.43 },
  { max: 5000,    rate: 0.41 },
  { max: 7500,    rate: 0.39 },
  { max: 10000,   rate: 0.36 },
  { max: 15000,   rate: 0.32 },
  { max: 20000,   rate: 0.30 },
  { max: 30000,   rate: 0.27 },
  { max: 50000,   rate: 0.25 },
  { max: Infinity,rate: 0.22 },
];

const FREQ_MULTIPLIERS = {
  "daily":     2.39,
  "4x-week":   1.93,
  "3x-week":   1.42,
  "2x-week":   1.0,
  "weekly":    0.50,
  "bi-weekly": 0.28,
  "monthly":   0.15,
};

const VISITS = {
  "daily": 22, "4x-week": 17, "3x-week": 12,
  "2x-week": 8, "weekly": 4, "bi-weekly": 2, "monthly": 1,
};

const FACILITY_MULT = {
  "daily": 0.82, "4x-week": 0.86, "3x-week": 0.90,
  "2x-week": 1.0, "weekly": 1.05, "bi-weekly": 1.12, "monthly": 1.20,
};

const MINIMUM = 299;

const OFFICE_TYPES = [
  { value: "corporate",      label: "🏢 Corporate Office",   desc: "General corporate / multi-tenant" },
  { value: "law",            label: "⚖️ Law Office",          desc: "Legal firms & practices" },
  { value: "real-estate",    label: "🏠 Real Estate",         desc: "Agencies & brokerages" },
  { value: "accounting",     label: "📊 Accounting / CPA",    desc: "Financial & tax firms" },
  { value: "coworking",      label: "🤝 Co-working Space",    desc: "Shared / flex offices" },
  { value: "nonprofit",      label: "🌱 Non-profit / Gov't",  desc: "Organizations & agencies" },
  { value: "tech",           label: "💻 Tech / Startup",      desc: "Software & tech companies" },
  { value: "medical-office", label: "🩺 Medical Office",      desc: "Non-clinical admin offices" },
];

function getRateForSqft(sqft) {
  const tier = BASE_RATES.find(t => sqft <= t.max);
  return tier ? tier.rate : BASE_RATES[BASE_RATES.length - 1].rate;
}

function facilityMonthly(qty, pricePerClean, freq) {
  if (!qty || !freq) return 0;
  return qty * pricePerClean * (VISITS[freq] || 0) * (FACILITY_MULT[freq] || 1);
}

// ─── Shared styles ───────────────────────────────────────────────────────────
const BG_STYLE = {
  minHeight: "100vh",
  backgroundColor: "#0F171E",
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),
    radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),
    radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),
    radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),
    radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
  `,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  padding: "20px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const CARD_STYLE = {
  backgroundColor: "#0F171E",
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),
    radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),
    radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),
    radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),
    radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
  `,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  borderRadius: "32px",
  overflow: "hidden",
  boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
  border: "1px solid rgba(184,115,51,0.2)",
};

const labelSt = {
  fontSize: "12px", fontWeight: "700", color: "#B87333",
  marginBottom: "8px", display: "block", letterSpacing: "0.5px", textTransform: "uppercase",
};

const inputSt = {
  width: "100%", padding: "16px 18px", borderRadius: "14px",
  border: "2px solid rgba(184,115,51,0.3)", background: "rgba(255,255,255,0.05)",
  color: "white", fontSize: "14px", fontWeight: "600", outline: "none",
  transition: "all 0.3s ease", boxSizing: "border-box",
};

// ─── Frequency grid sub-component ────────────────────────────────────────────
function FreqGrid({ value, onChange }) {
  const options = [
    { value: "4x-week",   label: "4x/Week",   disc: "14% OFF" },
    { value: "3x-week",   label: "3x/Week",   disc: "10% OFF" },
    { value: "2x-week",   label: "2x/Week",   disc: "BASE"    },
    { value: "weekly",    label: "Weekly",    disc: "BASE"    },
    { value: "bi-weekly", label: "Bi-Weekly", disc: "+12%"    },
    { value: "monthly",   label: "Monthly",   disc: "+20%"    },
  ];
  const fc = (sel) => ({
    padding: "10px 8px", borderRadius: "8px", cursor: "pointer",
    transition: "all 0.15s ease", textAlign: "center",
    border: sel ? "2px solid #5DEBF1" : "1px solid rgba(184,115,51,0.3)",
    background: sel ? "rgba(93,235,241,0.12)" : "rgba(255,255,255,0.02)",
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
      <div onClick={() => onChange("daily")} style={{ ...fc(value === "daily"), gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: value === "daily" ? "#5DEBF1" : "white", marginBottom: "2px" }}>Daily</div>
        <div style={{ fontSize: "9px", fontWeight: "600", color: value === "daily" ? "#5DEBF1" : "rgba(255,255,255,0.5)" }}>18% OFF</div>
      </div>
      {options.map(o => (
        <div key={o.value} onClick={() => onChange(o.value)} style={fc(value === o.value)}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: value === o.value ? "#5DEBF1" : "white", marginBottom: "2px" }}>{o.label}</div>
          <div style={{ fontSize: "9px", fontWeight: "600", color: value === o.value ? "#5DEBF1" : "rgba(255,255,255,0.5)" }}>{o.disc}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OfficeForm({ sharedInfo, onBack }) {
  const [step,       setStep]       = useState(1);
  const [officeType, setOfficeType] = useState("");

  const [squareFeet, setSquareFeet] = useState("");
  const [frequency,  setFrequency]  = useState("");

  const [conferenceRooms, setConferenceRooms] = useState(0);
  const [breakRooms,      setBreakRooms]      = useState(0);
  const [restrooms,       setRestrooms]       = useState(0);
  const [receptions,      setReceptions]      = useState(0);
  const [serverRooms,     setServerRooms]     = useState(0);
  const [storageRooms,    setStorageRooms]    = useState(0);

  const [confFreq,    setConfFreq]    = useState("");
  const [breakFreq,   setBreakFreq]   = useState("");
  const [restrFreq,   setRestrFreq]   = useState("");
  const [recepFreq,   setRecepFreq]   = useState("");
  const [serverFreq,  setServerFreq]  = useState("");
  const [storageFreq, setStorageFreq] = useState("");

  const [workspaceConfigs, setWorkspaceConfigs] = useState([]);
  const [showWsModal,      setShowWsModal]      = useState(false);
  const [wsEditingIndex,   setWsEditingIndex]   = useState(null);
  const [wsType,           setWsType]           = useState("");
  const [wsSqftRange,      setWsSqftRange]      = useState("");
  const [wsFlooring,       setWsFlooring]       = useState("hard");
  const [wsFeatures,       setWsFeatures]       = useState({ trashRemoval: false, multiMonitor: false, sensitiveDocs: false, plants: false });
  const [wsQuantity,       setWsQuantity]       = useState(1);

  const [addOns,              setAddOns]              = useState({ windowCleaning: false, floorWaxing: false, carpetCleaning: false, pressureWashing: false, postConstruction: false, disinfection: false });
  const [preferredDays,       setPreferredDays]       = useState([]);
  const [preferredTime,       setPreferredTime]       = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showSuccess,         setShowSuccess]         = useState(false);

  // ── Pricing ───────────────────────────────────────────────────────────────
  const sqft        = parseInt(squareFeet) || 0;
  const baseRate    = getRateForSqft(sqft);
  const baseCost    = sqft * baseRate;
  const freqMult    = FREQ_MULTIPLIERS[frequency] || 1.0;
  const adjBaseCost = frequency ? baseCost * freqMult : baseCost;

  const trashCost = (() => {
    if (!workspaceConfigs.length || !frequency) return 0;
    const v = VISITS[frequency] || 1;
    return workspaceConfigs.reduce((s, c) => c.specialFeatures?.trashRemoval ? s + c.quantity * v * 1 : s, 0);
  })();

  const facilityTotal =
    facilityMonthly(conferenceRooms, 45, confFreq) +
    facilityMonthly(breakRooms,      35, breakFreq) +
    facilityMonthly(restrooms,       25, restrFreq) +
    facilityMonthly(receptions,      40, recepFreq) +
    facilityMonthly(serverRooms,     30, serverFreq) +
    facilityMonthly(storageRooms,    20, storageFreq);

  const subtotal = Math.max(MINIMUM, adjBaseCost + trashCost + facilityTotal);

  const addonsCost = (() => {
    let t = 0;
    if (addOns.windowCleaning)   t += 150;
    if (addOns.floorWaxing)      t += 200;
    if (addOns.carpetCleaning)   t += sqft * 0.35;
    if (addOns.pressureWashing)  t += sqft * 0.25;
    if (addOns.postConstruction) t += sqft * 0.50;
    if (addOns.disinfection)     t += sqft * 0.15;
    return t;
  })();

  const total = subtotal + addonsCost;

  // ── Price breakdown ───────────────────────────────────────────────────────
  const breakdown = (() => {
    const items = [];
    if (!sqft || !frequency) return items;

    const visits      = VISITS[frequency] || 8;
    const bpv         = baseCost / 8;
    const fullRate    = bpv * visits;
    const hasDiscount = adjBaseCost < fullRate;
    const isPremium   = adjBaseCost > fullRate;

    items.push({
      label: `Base Cleaning (${sqft.toLocaleString()} sqft)`,
      amount: adjBaseCost,
      originalAmount: frequency !== "2x-week" ? fullRate : null,
      discountAmount: hasDiscount ? fullRate - adjBaseCost : 0,
      isUpcharge: isPremium,
    });

    if (workspaceConfigs.length > 0) {
      const totalWs = workspaceConfigs.reduce((s, c) => s + c.quantity, 0);
      items.push({ label: `📋 ${totalWs} workspace(s) configured (included in base)`, amount: 0, isInfo: true });
      if (trashCost > 0) items.push({ label: "Trash Removal", amount: trashCost, isUpcharge: true });
    }

    [
      { qty: conferenceRooms, freq: confFreq,    price: 45, label: "Conference Rooms"  },
      { qty: breakRooms,      freq: breakFreq,   price: 35, label: "Break Rooms"       },
      { qty: restrooms,       freq: restrFreq,   price: 25, label: "Restrooms"         },
      { qty: receptions,      freq: recepFreq,   price: 40, label: "Lobby/Reception"   },
      { qty: serverRooms,     freq: serverFreq,  price: 30, label: "Server/IT Rooms"   },
      { qty: storageRooms,    freq: storageFreq, price: 20, label: "Storage/Archive"   },
    ].forEach(({ qty, freq, price, label }) => {
      if (!qty || !freq) return;
      const v    = VISITS[freq] || 0;
      const mult = FACILITY_MULT[freq] || 1;
      const base = qty * price * v;
      const cost = base * mult;
      items.push({
        label: `${label} (${freq})`,
        amount: cost,
        originalAmount: mult !== 1 ? base : null,
        discountAmount: mult < 1 ? base - cost : 0,
        discountPercent: mult < 1 ? `${Math.round((1-mult)*100)}%` : mult > 1 ? `${Math.round((mult-1)*100)}%` : "",
        isUpcharge: mult > 1,
      });
    });

    if (addOns.windowCleaning)   items.push({ label: "Window Cleaning",   amount: 150,        isUpcharge: true });
    if (addOns.floorWaxing)      items.push({ label: "Floor Waxing",      amount: 200,        isUpcharge: true });
    if (addOns.carpetCleaning)   items.push({ label: "Carpet Deep Clean", amount: sqft*0.35,  isUpcharge: true });
    if (addOns.pressureWashing)  items.push({ label: "Pressure Washing",  amount: sqft*0.25,  isUpcharge: true });
    if (addOns.postConstruction) items.push({ label: "Post-Construction", amount: sqft*0.50,  isUpcharge: true });
    if (addOns.disinfection)     items.push({ label: "Disinfection",      amount: sqft*0.15,  isUpcharge: true });

    return items;
  })();

  const totalSavings = breakdown.reduce((s, i) => !i.isUpcharge && i.discountAmount ? s + i.discountAmount : s, 0);

  // ── Workspace helpers ─────────────────────────────────────────────────────
  const WS_TYPE_LABELS = { executive:"Executive Office", manager:"Manager Office", standard:"Standard Office", cubicle:"Cubicle", "open-desk":"Open Desk", collaborative:"Collaborative Workspace" };
  const getWsLabel = (c) => {
    let l = WS_TYPE_LABELS[c.type] || c.type;
    if (c.sqftRange) l += ` (${c.sqftRange} sqft)`;
    if (c.specialFeatures?.trashRemoval) l += " +Trash";
    return l;
  };

  const saveWorkspace = () => {
    const cfg = { type: wsType, sqftRange: wsSqftRange, flooring: wsFlooring, specialFeatures: { ...wsFeatures }, quantity: wsQuantity };
    if (wsEditingIndex !== null) {
      const upd = [...workspaceConfigs]; upd[wsEditingIndex] = cfg; setWorkspaceConfigs(upd); setWsEditingIndex(null);
    } else {
      setWorkspaceConfigs([...workspaceConfigs, cfg]);
    }
    setShowWsModal(false); setWsType(""); setWsSqftRange(""); setWsFlooring("hard");
    setWsFeatures({ trashRemoval:false, multiMonitor:false, sensitiveDocs:false, plants:false }); setWsQuantity(1);
  };

  const editWorkspace = (i) => {
    const c = workspaceConfigs[i];
    setWsType(c.type); setWsSqftRange(c.sqftRange); setWsFlooring(c.flooring);
    setWsFeatures({ ...c.specialFeatures }); setWsQuantity(c.quantity); setWsEditingIndex(i); setShowWsModal(true);
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = () => { window.scrollTo({ top:0, behavior:"smooth" }); setTimeout(() => setStep(s => s+1), 100); };
  const goBack = () => {
    if (step === 1) { onBack(); return; }
    window.scrollTo({ top:0, behavior:"smooth" }); setTimeout(() => setStep(s => s-1), 100);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const payload = {
      "First Name": sharedInfo.firstName, "Last Name": sharedInfo.lastName,
      "Email": sharedInfo.email, "Phone": sharedInfo.phone,
      "Business Name": sharedInfo.businessName || "N/A",
      "Address": sharedInfo.streetAddress, "Suite/Unit": sharedInfo.suiteUnit || "N/A",
      "City": sharedInfo.city, "State": sharedInfo.state, "ZIP": sharedInfo.zipCode,
      "Office Type": officeType, "Square Feet": squareFeet, "Frequency": frequency,
      "Workspace Configs": workspaceConfigs.length ? JSON.stringify(workspaceConfigs) : "None",
      "Conference Rooms": conferenceRooms, "Break Rooms": breakRooms,
      "Restrooms": restrooms, "Reception/Lobby": receptions,
      "Server/IT Rooms": serverRooms, "Storage/Archive": storageRooms,
      "Add-ons": Object.keys(addOns).filter(k => addOns[k]).join(", ") || "None",
      "Preferred Days": preferredDays.join(", ") || "Not specified",
      "Preferred Time": preferredTime || "Not specified",
      "Special Instructions": specialInstructions || "None",
      "TOTAL MONTHLY": `$${total.toFixed(2)}`,
      "_captcha": "false", "_template": "table",
    };
    try {
      const res = await fetch("https://formsubmit.co/ajax/AkCleaningSuCasa@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) setShowSuccess(true);
      else alert("There was an error submitting. Please try again or call us directly.");
    } catch (e) {
      console.error(e);
      alert("There was an error submitting. Please try again or call us directly.");
    }
  };

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{ position:"sticky", top:"20px", height:"fit-content", maxHeight:"calc(100vh - 40px)", display:"flex", flexDirection:"column" }}>
      <div style={{ ...CARD_STYLE, borderRadius:"28px", display:"flex", flexDirection:"column", maxHeight:"100%" }}>
        <div style={{ padding:"25px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize:"16px", color:"#B87333", fontWeight:"800", marginBottom:"8px", letterSpacing:"1.5px", textTransform:"uppercase" }}>Price Breakdown</div>
          <div style={{ fontSize:"14px", color:"#D4955A", fontWeight:"700", background:"rgba(143,170,184,0.12)", padding:"4px 12px", borderRadius:"6px", display:"inline-block" }}>Monthly Estimate</div>
        </div>
        <div style={{ padding:"20px 25px", overflowY:"auto", flex:1 }}>
          {breakdown.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(255,255,255,0.5)", fontSize:"14px", fontWeight:"600" }}>Complete the form to see pricing</div>
          ) : (
            <>
              {breakdown.map((item, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"12px 0", borderBottom: i < breakdown.length-1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                  <div style={{ color:"rgba(255,255,255,0.8)", fontSize:"14px", fontWeight:"600", flex:1 }}>
                    {item.label}
                    {item.discountPercent && (
                      <span style={{ display:"inline-block", marginLeft:"8px", padding:"2px 6px", borderRadius:"4px", background: item.isUpcharge ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#10b981,#059669)", fontSize:"10px", fontWeight:"900", color:"white" }}>
                        {item.isUpcharge ? `+${item.discountPercent}` : `-${item.discountPercent}`}
                      </span>
                    )}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"2px" }}>
                    {item.originalAmount && <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", textDecoration:"line-through", fontWeight:"600" }}>${item.originalAmount.toFixed(2)}</div>}
                    <div style={{ color: item.discountPercent && !item.isUpcharge ? "#10b981" : "white", fontSize:"14px", fontWeight:"800" }}>${item.amount.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {totalSavings > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 16px", marginTop:"10px", borderRadius:"10px", background:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.15))", border:"1px solid rgba(16,185,129,0.3)" }}>
                  <div style={{ color:"#10b981", fontSize:"14px", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.5px" }}>✓ Total Savings</div>
                  <div style={{ color:"#10b981", fontSize:"16px", fontWeight:"900" }}>-${totalSavings.toFixed(2)}</div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0", marginTop:"10px", borderTop:"2px solid rgba(93,235,241,0.3)" }}>
                <div style={{ color:"#B87333", fontSize:"14px", fontWeight:"800", textTransform:"uppercase" }}>Subtotal</div>
                <div style={{ color:"white", fontSize:"16px", fontWeight:"900" }}>${subtotal.toFixed(2)}</div>
              </div>
            </>
          )}
        </div>
        <div style={{ padding:"12px 20px", background:"rgba(255,255,255,0.1)", borderTop:"1px solid rgba(255,255,255,0.1)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"11px", margin:0, fontWeight:"600", textAlign:"center", fontStyle:"italic" }}>💡 Estimate based on monthly contract. Final prices may vary.</p>
        </div>
        <div style={{ padding:"25px", background:"rgba(93,235,241,0.15)", borderTop:"1px solid rgba(93,235,241,0.3)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:"white", fontWeight:"900", fontSize:"14px", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"4px" }}>Total</div>
              <div style={{ fontSize:"14px", color:"#D4955A", fontWeight:"700", background:"rgba(143,170,184,0.12)", padding:"3px 10px", borderRadius:"6px" }}>per month</div>
            </div>
            <div style={{ color:"white", fontWeight:"900", fontSize:"36px" }}>${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop:"20px", padding:"20px", background:"linear-gradient(135deg,#10b981,#059669)", borderRadius:"20px", textAlign:"center", boxShadow:"0 10px 30px rgba(16,185,129,0.3)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize:"32px", marginBottom:"8px" }}>✓</div>
        <div style={{ color:"white", fontSize:"16px", fontWeight:"900", letterSpacing:"1px", lineHeight:"1.3" }}>100% SATISFACTION<br/>GUARANTEED</div>
      </div>
    </div>
  );

  // ── STEP 1: Office Type ───────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="fade-in-up">
      <div style={{ textAlign:"center", marginBottom:"40px" }}>
        <div style={{ width:"90px", height:"90px", background:"linear-gradient(135deg,#8a5523,#B87333,#D4955A)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", boxShadow:"0 20px 50px rgba(184,115,51,0.4)", border:"4px solid rgba(255,255,255,0.2)", fontSize:"44px" }}>🏢</div>
        <h2 style={{ fontSize:"28px", fontWeight:"900", color:"white", margin:"0 0 12px", letterSpacing:"-0.5px" }}>What type of office?</h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"16px", fontWeight:"500", margin:0 }}>Select the option that best describes your space</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px", marginBottom:"40px" }}>
        {OFFICE_TYPES.map(ot => (
          <div key={ot.value} onClick={() => setOfficeType(ot.value)} style={{
            padding:"20px 16px", borderRadius:"16px", cursor:"pointer", transition:"all 0.2s ease",
            border: officeType===ot.value ? "2px solid #5DEBF1" : "2px solid rgba(184,115,51,0.3)",
            background: officeType===ot.value ? "linear-gradient(135deg,rgba(93,235,241,0.15),rgba(93,235,241,0.05))" : "rgba(255,255,255,0.03)",
            boxShadow: officeType===ot.value ? "0 0 20px rgba(93,235,241,0.3)" : "none",
          }}>
            <div style={{ fontSize:"15px", fontWeight:"800", color: officeType===ot.value?"#5DEBF1":"white", marginBottom:"4px" }}>{ot.label}</div>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", fontWeight:"600" }}>{ot.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:"15px" }}>
        <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <ChevronLeft size={20}/> Back
        </button>
        <button onClick={goNext} disabled={!officeType} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background:officeType?"linear-gradient(135deg,#B87333,#D4955A)":"rgba(255,255,255,0.1)", color:"white", fontSize:"15px", fontWeight:"800", cursor:officeType?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          Continue <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  );

  // ── STEP 2: Service Details ───────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="fade-in-up">

      {/* Square Footage */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"20px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><Building2 size={18} color="#B87333"/>Total Square Footage *</div>
          <div style={{ fontSize:"24px", fontWeight:"900", color:"white" }}>{sqft.toLocaleString()} sqft</div>
        </label>

        {/* Running total box */}
        <div style={{ padding:"12px 16px", borderRadius:"12px", background:"linear-gradient(135deg,rgba(143,170,184,0.2),rgba(212,149,90,0.2))", border:"1px solid rgba(143,170,184,0.3)", marginBottom:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.8)", fontWeight:"600", marginBottom:"4px" }}>Base Monthly Cost</div>
          {frequency && sqft ? (() => {
            const v    = VISITS[frequency] || 8;
            const bpv  = baseCost / 8;
            const full = bpv * v;
            const disc = adjBaseCost < full;
            const prem = adjBaseCost > full;
            const lbl  = { "monthly":"Monthly","bi-weekly":"Bi-weekly","weekly":"Weekly","2x-week":"2x/Week","3x-week":"3x/Week","4x-week":"4x/Week","daily":"Daily" }[frequency];
            return (
              <>
                {frequency !== "2x-week" && <div style={{ fontSize:"18px", fontWeight:"700", color:"rgba(255,255,255,0.4)", textDecoration:"line-through", marginBottom:"4px" }}>${full.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>}
                <div style={{ fontSize:"28px", fontWeight:"900", color:disc?"#10b981":prem?"#f59e0b":"#B87333" }}>${adjBaseCost.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                <div style={{ fontSize:"13px", color:disc?"#10b981":prem?"#f59e0b":"#B87333", marginTop:"6px", fontWeight:"800" }}>{lbl} • Monthly Total</div>
              </>
            );
          })() : (
            <>
              <div style={{ fontSize:"28px", fontWeight:"900", color:"#B87333" }}>${baseCost.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.9)", marginTop:"6px", fontWeight:"700", background:"rgba(184,115,51,0.2)", padding:"4px 8px", borderRadius:"6px", display:"inline-block" }}>2x/week base rate — select frequency below</div>
            </>
          )}
        </div>

        {/* Slider */}
        <input type="range" min="500" max="50000" step="100" value={squareFeet||500} onChange={e=>setSquareFeet(e.target.value)}
          style={{ width:"100%", height:"8px", borderRadius:"4px", outline:"none", cursor:"pointer", WebkitAppearance:"none", appearance:"none", marginBottom:"16px",
            background:`linear-gradient(to right, #B87333 0%, #B87333 ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(255,255,255,0.1) ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(255,255,255,0.1) 100%)` }}/>
        <style>{`input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#8a5523,#B87333,#D4955A);cursor:pointer;border:3px solid white;box-shadow:0 4px 12px rgba(143,170,184,0.5);}input[type="range"]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#8a5523,#B87333,#D4955A);cursor:pointer;border:3px solid white;}`}</style>

        {/* Manual input */}
        <div style={{ position:"relative" }}>
          <input type="number" min="500" max="50000" value={squareFeet||""} onChange={e=>setSquareFeet(e.target.value)} onBlur={e=>{const v=parseInt(e.target.value)||0;if(v<500)setSquareFeet("500");else if(v>50000)setSquareFeet("50000");}} placeholder="Enter square feet..."
            style={{ ...inputSt, paddingRight:"55px", fontSize:"17px", fontWeight:"700" }}/>
          <div style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.5)", fontSize:"14px", fontWeight:"700", pointerEvents:"none" }}>sqft</div>
        </div>
      </div>

      {/* Cleaning Frequency */}
      <div style={{ marginBottom:"24px", background:"linear-gradient(135deg,rgba(184,115,51,0.08),rgba(143,170,184,0.08))", borderRadius:"16px", padding:"20px", border:"1px solid rgba(184,115,51,0.2)" }}>
        <label style={{ ...labelSt, marginBottom:"12px" }}>📅 Cleaning Frequency *</label>
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:"16px", alignItems:"start" }}>
          {/* Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
            <div onClick={()=>setFrequency("daily")} style={{ gridColumn:"1/-1", padding:"14px 12px", borderRadius:"10px", cursor:"pointer", transition:"all 0.2s ease", textAlign:"center",
              border:frequency==="daily"?"2px solid #5DEBF1":"2px solid rgba(184,115,51,0.3)",
              background:frequency==="daily"?"linear-gradient(135deg,rgba(93,235,241,0.15),rgba(93,235,241,0.05))":"rgba(255,255,255,0.03)",
              boxShadow:frequency==="daily"?"0 0 20px rgba(93,235,241,0.3)":"none" }}>
              <div style={{ fontSize:"15px", fontWeight:"800", color:frequency==="daily"?"#5DEBF1":"white", marginBottom:"3px" }}>Daily</div>
              <div style={{ fontSize:"11px", fontWeight:"600", color:frequency==="daily"?"#5DEBF1":"rgba(255,255,255,0.6)" }}>13% OFF</div>
            </div>
            {[
              {value:"4x-week",label:"4x Week",disc:"9% OFF"},
              {value:"3x-week",label:"3x Week",disc:"5% OFF"},
              {value:"2x-week",label:"2x Week",disc:"BASE"},
              {value:"weekly", label:"Weekly", disc:"BASE"},
              {value:"bi-weekly",label:"Bi-Weekly",disc:"+12%"},
              {value:"monthly",  label:"Monthly",  disc:"+20%"},
            ].map(o=>(
              <div key={o.value} onClick={()=>setFrequency(o.value)} style={{ padding:"14px 10px", borderRadius:"10px", cursor:"pointer", transition:"all 0.2s ease", textAlign:"center",
                border:frequency===o.value?"2px solid #5DEBF1":"2px solid rgba(184,115,51,0.3)",
                background:frequency===o.value?"linear-gradient(135deg,rgba(93,235,241,0.15),rgba(93,235,241,0.05))":"rgba(255,255,255,0.03)",
                boxShadow:frequency===o.value?"0 0 20px rgba(93,235,241,0.3)":"none" }}>
                <div style={{ fontSize:"14px", fontWeight:"800", color:frequency===o.value?"#5DEBF1":"white", marginBottom:"3px" }}>{o.label}</div>
                <div style={{ fontSize:"11px", fontWeight:"600", color:frequency===o.value?"#5DEBF1":"rgba(255,255,255,0.6)" }}>{o.disc}</div>
              </div>
            ))}
          </div>
          {/* Price per visit */}
          {squareFeet && frequency ? (() => {
            const v   = VISITS[frequency];
            const ppv = adjBaseCost / v;
            const bpv = baseCost / 8;
            const disc = ppv < bpv; const prem = ppv > bpv;
            return (
              <div style={{ padding:"16px 20px", borderRadius:"12px", background:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.12))", border:"2px solid rgba(16,185,129,0.25)" }}>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:"700", marginBottom:"6px", letterSpacing:"0.5px" }}>PRICE PER VISIT</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginBottom:"12px" }}>
                  {(disc||prem) && <div style={{ fontSize:"16px", color:"rgba(255,255,255,0.35)", textDecoration:"line-through", fontWeight:"600" }}>${bpv.toFixed(2)}</div>}
                  <div style={{ fontSize:"28px", fontWeight:"900", color:disc?"#10b981":prem?"#f59e0b":"#B87333", lineHeight:"1" }}>${ppv.toFixed(2)}</div>
                </div>
                {disc && <div style={{ padding:"8px 14px", borderRadius:"8px", background:"linear-gradient(135deg,#10b981,#059669)", display:"inline-block" }}>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.9)", fontWeight:"600", marginBottom:"2px" }}>YOU SAVE</div>
                  <div style={{ fontSize:"18px", color:"white", fontWeight:"900" }}>{Math.round(((bpv-ppv)/bpv)*100)}%</div>
                </div>}
                {prem && <div style={{ padding:"8px 14px", borderRadius:"8px", background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"inline-block" }}>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.9)", fontWeight:"600", marginBottom:"2px" }}>PREMIUM</div>
                  <div style={{ fontSize:"18px", color:"white", fontWeight:"900" }}>+{Math.round(((ppv-bpv)/bpv)*100)}%</div>
                </div>}
              </div>
            );
          })() : (
            <div style={{ padding:"16px 20px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"2px dashed rgba(255,255,255,0.1)", textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"13px", fontStyle:"italic" }}>Select frequency to see price per visit</div>
          )}
        </div>
        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", marginTop:"12px", fontStyle:"italic" }}>Base rates assume 2x per week cleaning. More frequent service receives volume discounts.</div>
      </div>

      {/* Workspace button */}
      <div style={{ marginBottom:"20px", background:"linear-gradient(135deg,rgba(184,115,51,0.12),rgba(143,170,184,0.12))", border:"2px dashed rgba(184,115,51,0.4)", borderRadius:"16px", padding:"20px", display:"flex", flexDirection:"column", gap:"15px" }}>
        <button onClick={()=>{setWsEditingIndex(null);setShowWsModal(true);}} style={{ width:"100%", padding:"24px 20px", borderRadius:"14px", border:"2px solid #5DEBF1", background:"linear-gradient(135deg,#B87333,#D4955A)", color:"white", cursor:"pointer", boxShadow:"0 0 28px rgba(93,235,241,0.4), 0 8px 24px rgba(184,115,51,0.4)", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"-75%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", transform:"skewX(-20deg)", pointerEvents:"none" }}/>
          <div style={{ fontSize:"22px", fontWeight:"900", letterSpacing:"0.5px", textTransform:"uppercase", textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>💼 Configure Workspaces</div>
          <div style={{ fontSize:"13px", fontWeight:"700", marginTop:"7px", color:"rgba(255,255,255,0.92)", letterSpacing:"0.8px", textTransform:"uppercase", borderTop:"1px solid rgba(255,255,255,0.25)", paddingTop:"8px" }}>✦ Tell us your offices, cubicles & desks ✦</div>
        </button>
        {workspaceConfigs.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {workspaceConfigs.map((cfg, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"12px 15px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"700", color:"white", marginBottom:"3px" }}>{getWsLabel(cfg)} × {cfg.quantity}</div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:"600" }}>{cfg.flooring==="hard"?"Hard Surface":cfg.flooring==="low-carpet"?"Low-pile Carpet":"High-pile Carpet"}{cfg.specialFeatures?.trashRemoval&&" • Trash removal"}</div>
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={()=>editWorkspace(i)} style={{ padding:"6px 12px", borderRadius:"6px", border:"none", background:"rgba(184,115,51,0.2)", color:"#D4955A", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>Edit</button>
                  <button onClick={()=>setWorkspaceConfigs(workspaceConfigs.filter((_,idx)=>idx!==i))} style={{ padding:"6px 12px", borderRadius:"6px", border:"none", background:"rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facility counters */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px", marginBottom:"30px" }}>
        {[
          {label:"🗂️ Conference Rooms", desc:"Boardrooms & meeting rooms", price:"$45/clean", val:conferenceRooms, set:setConferenceRooms, freq:confFreq,    setFreq:setConfFreq},
          {label:"☕ Break Rooms",       desc:"Kitchen & break areas",      price:"$35/clean", val:breakRooms,      set:setBreakRooms,      freq:breakFreq,   setFreq:setBreakFreq},
          {label:"🚻 Restrooms",         desc:"Employee restrooms",         price:"$25/clean", val:restrooms,       set:setRestrooms,       freq:restrFreq,   setFreq:setRestrFreq},
          {label:"🏛️ Reception/Lobby",  desc:"Front desk & lobby",         price:"$40/clean", val:receptions,      set:setReceptions,      freq:recepFreq,   setFreq:setRecepFreq},
          {label:"🖥️ Server/IT Rooms",  desc:"Data & IT closets",          price:"$30/clean", val:serverRooms,     set:setServerRooms,     freq:serverFreq,  setFreq:setServerFreq},
          {label:"📦 Storage/Archive",  desc:"File & storage rooms",       price:"$20/clean", val:storageRooms,    set:setStorageRooms,    freq:storageFreq, setFreq:setStorageFreq},
        ].map(f=>(
          <div key={f.label} style={{ background:"linear-gradient(135deg,rgba(138,85,35,0.08),rgba(184,115,51,0.08))", border:"1px solid rgba(184,115,51,0.2)", borderRadius:"16px", padding:"16px", display:"flex", flexDirection:"column", gap:"10px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"2px" }}>{f.label}</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.7)", fontWeight:"600" }}>{f.desc}</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:"600" }}>{f.price}</div>
              </div>
              <div style={{ fontSize:"24px", fontWeight:"900", color:"white", minWidth:"40px", textAlign:"right" }}>{f.val}</div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={()=>f.set(Math.max(0,f.val-1))} style={{ flex:1, padding:"10px", borderRadius:"10px", border:"none", background:f.val>0?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.05)", color:f.val>0?"#ef4444":"rgba(255,255,255,0.3)", fontSize:"18px", fontWeight:"900", cursor:f.val>0?"pointer":"not-allowed" }}>−</button>
              <button onClick={()=>f.set(f.val+1)} style={{ flex:1, padding:"10px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#8a5523,#B87333,#D4955A)", color:"white", fontSize:"18px", fontWeight:"900", cursor:"pointer" }}>+</button>
            </div>
            {f.val > 0 && <FreqGrid value={f.freq} onChange={f.setFreq}/>}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:"15px" }}>
        <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <ChevronLeft size={20}/> Back
        </button>
        <button onClick={goNext} disabled={!squareFeet||!frequency} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background:(squareFeet&&frequency)?"linear-gradient(135deg,#B87333,#D4955A)":"rgba(255,255,255,0.1)", color:"white", fontSize:"15px", fontWeight:"800", cursor:(squareFeet&&frequency)?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          Continue <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  );

  // ── STEP 3: Add-ons & Schedule ────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="fade-in-up">
      {/* Add-ons */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <CheckCircle2 size={18} color="#B87333"/>Additional Services (Optional)
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
          {[
            {key:"windowCleaning",   label:"Window Cleaning",     price:"$150"},
            {key:"floorWaxing",      label:"Floor Waxing/Buffing", price:"$200"},
            {key:"carpetCleaning",   label:"Carpet Deep Clean",    price:"$0.35/sqft"},
            {key:"pressureWashing",  label:"Pressure Washing",     price:"$0.25/sqft"},
            {key:"postConstruction", label:"Post-Construction",    price:"$0.50/sqft"},
            {key:"disinfection",     label:"Disinfection",         price:"$0.15/sqft"},
          ].map(a=>(
            <div key={a.key} onClick={()=>setAddOns({...addOns,[a.key]:!addOns[a.key]})} style={{ padding:"18px 16px", borderRadius:"16px", cursor:"pointer", transition:"all 0.3s ease", display:"flex", alignItems:"flex-start", gap:"10px",
              border:addOns[a.key]?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",
              background:addOns[a.key]?"linear-gradient(135deg,#D4955A,#5A7080)":"rgba(255,255,255,0.03)", color:"white" }}>
              <div style={{ width:"20px", height:"20px", borderRadius:"6px", border:addOns[a.key]?"none":"2px solid rgba(255,255,255,0.3)", background:addOns[a.key]?"linear-gradient(135deg,#10b981,#059669)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
                {addOns[a.key]&&<CheckCircle2 size={14} color="white"/>}
              </div>
              <div>
                <div style={{ fontSize:"14px", fontWeight:"800", marginBottom:"3px" }}>{a.label}</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.7)", fontWeight:"700" }}>{a.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferred Days */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <Calendar size={18} color="#B87333"/>Preferred Days (Optional)
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
            <div key={d} onClick={()=>setPreferredDays(preferredDays.includes(d)?preferredDays.filter(x=>x!==d):[...preferredDays,d])}
              style={{ padding:"14px 10px", borderRadius:"12px", cursor:"pointer", textAlign:"center", fontSize:"14px", fontWeight:"800", color:"white", transition:"all 0.3s ease",
                border:preferredDays.includes(d)?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",
                background:preferredDays.includes(d)?"linear-gradient(135deg,#D4955A,#5A7080)":"rgba(255,255,255,0.03)" }}>{d}</div>
          ))}
        </div>
      </div>

      {/* Preferred Time */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <Clock size={18} color="#B87333"/>Preferred Time (Optional)
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
          {["Morning (6-10am)","Mid-Day (10am-2pm)","Afternoon (2-6pm)","Evening (6-10pm)","Overnight (10pm-6am)"].map(t=>(
            <div key={t} onClick={()=>setPreferredTime(t)} style={{ padding:"14px 12px", borderRadius:"12px", cursor:"pointer", fontSize:"12px", fontWeight:"800", color:"white", textAlign:"center", transition:"all 0.3s ease",
              border:preferredTime===t?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",
              background:preferredTime===t?"linear-gradient(135deg,#D4955A,#5A7080)":"rgba(255,255,255,0.03)" }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ ...labelSt, fontSize:"14px", fontWeight:"800", marginBottom:"15px", letterSpacing:"1px", textTransform:"uppercase" }}>Special Instructions (Optional)</label>
        <textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} placeholder="Any specific requirements, access instructions, or special requests..." rows={4}
          style={{ ...inputSt, resize:"vertical", fontFamily:"inherit" }}/>
      </div>

      {/* Terms */}
      <div style={{ padding:"20px", borderRadius:"16px", background:"rgba(212,149,90,0.1)", border:"1px solid rgba(212,149,90,0.3)", marginBottom:"30px" }}>
        <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.8)", fontWeight:"600", lineHeight:"1.6", margin:0 }}>
          By submitting this request, you agree to our{" "}
          <a href="https://img1.wsimg.com/blobby/go/a218c663-7c40-48f5-aae1-0c7e30c1037f/downloads/Terms%20and%20Conditions.pdf?ver=1721081910935" target="_blank" rel="noopener noreferrer" style={{ color:"#D4955A", textDecoration:"underline", fontWeight:"700" }}>Terms & Conditions</a>.{" "}
          Our team will review your request and contact you within 24 hours to confirm details and schedule service.
        </p>
      </div>

      <div style={{ display:"flex", gap:"15px" }}>
        <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <ChevronLeft size={20}/> Back
        </button>
        <button onClick={handleSubmit} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background:"linear-gradient(135deg,#10b981,#059669)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          Submit Request <CheckCircle2 size={20}/>
        </button>
      </div>
    </div>
  );

  // ── Workspace Modal ───────────────────────────────────────────────────────
  const renderWsModal = () => (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"20px", overflowY:"auto" }}>
      <div style={{ background:"linear-gradient(135deg,#2E3A47,#1A252F)", borderRadius:"24px", padding:"40px 35px", maxWidth:"700px", width:"100%", maxHeight:"90vh", overflowY:"auto", border:"1px solid rgba(184,115,51,0.3)", boxShadow:"0 30px 80px rgba(0,0,0,0.7)" }}>
        <h2 style={{ fontSize:"26px", fontWeight:"900", color:"white", marginBottom:"8px" }}>💼 Configure Workspace</h2>
        <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.6)", marginBottom:"30px", fontWeight:"600" }}>{wsEditingIndex!==null?"Update workspace configuration":"Document workspace types for cleaning crew"}</p>

        <div style={{ marginBottom:"25px" }}>
          <label style={labelSt}>🏢 Workspace Type *</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
            {[{id:"executive",icon:"🏢",name:"Executive Office"},{id:"manager",icon:"💼",name:"Manager Office"},{id:"standard",icon:"📋",name:"Standard Office"},{id:"cubicle",icon:"🪑",name:"Cubicle"},{id:"open-desk",icon:"💻",name:"Open Desk"},{id:"collaborative",icon:"🤝",name:"Collaborative Workspace"}].map(t=>(
              <button key={t.id} onClick={()=>setWsType(t.id)} style={{ padding:"16px 14px", borderRadius:"12px", border:wsType===t.id?"2px solid #D4955A":"2px solid rgba(184,115,51,0.2)", background:wsType===t.id?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)", color:"white", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:"22px", marginBottom:"4px" }}>{t.icon}</div>
                <div style={{ fontSize:"13px", fontWeight:"800" }}>{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {wsType && wsType!=="cubicle" && wsType!=="open-desk" && (
          <div style={{ marginBottom:"25px" }}>
            <label style={labelSt}>📏 Square Footage Range *</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
              {[{value:"100-150",label:"100-150 sqft"},{value:"150-200",label:"150-200 sqft"},{value:"200-300",label:"200-300 sqft"},{value:"300-500",label:"300-500 sqft"},{value:"500+",label:"500+ sqft"}].map(o=>(
                <button key={o.value} onClick={()=>setWsSqftRange(o.value)} style={{ padding:"12px", borderRadius:"10px", border:wsSqftRange===o.value?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)", background:wsSqftRange===o.value?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)", color:"white", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>{o.label}</button>
              ))}
            </div>
          </div>
        )}

        {wsType==="cubicle" && (
          <div style={{ marginBottom:"25px" }}>
            <label style={labelSt}>📐 Cubicle Size *</label>
            <div style={{ display:"flex", gap:"10px" }}>
              {[{value:"standard",label:"Standard"},{value:"large",label:"Large"}].map(o=>(
                <button key={o.value} onClick={()=>setWsSqftRange(o.value)} style={{ flex:1, padding:"12px", borderRadius:"10px", border:wsSqftRange===o.value?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)", background:wsSqftRange===o.value?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)", color:"white", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>{o.label}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom:"25px" }}>
          <label style={labelSt}>🏢 Flooring Type</label>
          <div style={{ display:"flex", gap:"10px" }}>
            {[{value:"hard",label:"Hard Surface"},{value:"low-carpet",label:"Low-pile Carpet"},{value:"high-carpet",label:"High-pile Carpet"}].map(o=>(
              <button key={o.value} onClick={()=>setWsFlooring(o.value)} style={{ flex:1, padding:"12px", borderRadius:"10px", border:wsFlooring===o.value?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)", background:wsFlooring===o.value?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)", color:"white", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>{o.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"25px" }}>
          <label style={labelSt}>⭐ Special Considerations</label>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {[{key:"trashRemoval",label:"Trash Removal Required",note:"+$1 per workspace"},{key:"multiMonitor",label:"Multiple Monitors/Complex Setup",note:"Note for crew"},{key:"sensitiveDocs",label:"Sensitive Documents",note:"Extra care needed"},{key:"plants",label:"Plants/Decor Items",note:"Work around them"}].map(f=>(
              <label key={f.key} style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderRadius:"10px", border:"2px solid rgba(255,255,255,0.1)", background:wsFeatures[f.key]?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)", cursor:"pointer" }}>
                <input type="checkbox" checked={wsFeatures[f.key]} onChange={e=>setWsFeatures({...wsFeatures,[f.key]:e.target.checked})} style={{ marginRight:"12px", width:"18px", height:"18px", cursor:"pointer" }}/>
                <div>
                  <div style={{ color:"white", fontSize:"13px", fontWeight:"800" }}>{f.label}</div>
                  <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", fontWeight:"600", marginTop:"2px" }}>{f.note}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"30px" }}>
          <label style={labelSt}>🔢 Quantity</label>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", background:"rgba(255,255,255,0.05)", padding:"16px", borderRadius:"12px" }}>
            <button onClick={()=>setWsQuantity(Math.max(1,wsQuantity-10))} style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"14px", fontWeight:"900", cursor:"pointer" }}>-10</button>
            <button onClick={()=>setWsQuantity(Math.max(1,wsQuantity-1))}  style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"16px", fontWeight:"900", cursor:"pointer" }}>-1</button>
            <div style={{ flex:1, textAlign:"center", fontSize:"28px", fontWeight:"900", color:"white" }}>{wsQuantity}</div>
            <button onClick={()=>setWsQuantity(wsQuantity+1)}  style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#B87333,#D4955A)", color:"white", fontSize:"16px", fontWeight:"900", cursor:"pointer" }}>+1</button>
            <button onClick={()=>setWsQuantity(wsQuantity+10)} style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#B87333,#D4955A)", color:"white", fontSize:"14px", fontWeight:"900", cursor:"pointer" }}>+10</button>
          </div>
        </div>

        <div style={{ display:"flex", gap:"12px" }}>
          <button onClick={()=>{setShowWsModal(false);setWsType("");setWsSqftRange("");setWsFlooring("hard");setWsFeatures({trashRemoval:false,multiMonitor:false,sensitiveDocs:false,plants:false});setWsQuantity(1);setWsEditingIndex(null);}}
            style={{ flex:1, padding:"16px", borderRadius:"12px", border:"2px solid rgba(255,255,255,0.2)", background:"transparent", color:"white", fontSize:"14px", fontWeight:"800", cursor:"pointer" }}>Cancel</button>
          <button onClick={saveWorkspace} disabled={!wsType||(wsType!=="open-desk"&&!wsSqftRange)}
            style={{ flex:2, padding:"16px", borderRadius:"12px", border:"none", background:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#B87333,#D4955A)", color:"white", fontSize:"14px", fontWeight:"800", cursor:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?"not-allowed":"pointer", opacity:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?0.5:1 }}>
            {wsEditingIndex!==null?"Update Workspace":"Save Workspace"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Success Modal ─────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"20px" }}>
      <div style={{ background:"linear-gradient(135deg,#2E3A47,#3D4F5C)", borderRadius:"32px", padding:"50px 40px", maxWidth:"500px", width:"100%", textAlign:"center", border:"1px solid rgba(184,115,51,0.3)", boxShadow:"0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#B87333,#D4955A)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 30px" }}>
          <CheckCircle2 size={48} color="white"/>
        </div>
        <h2 style={{ fontSize:"32px", fontWeight:"900", color:"white", marginBottom:"15px" }}>Request Submitted!</h2>
        <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.9)", fontWeight:"600", lineHeight:"1.6", marginBottom:"30px" }}>
          Thank you for choosing Cleaning Su Oficina! Our team will review your request and contact you within 24 hours to confirm details and schedule your service.
        </p>
        <button onClick={()=>window.location.reload()} style={{ padding:"18px 40px", borderRadius:"16px", border:"none", background:"linear-gradient(135deg,#B87333,#D4955A)", color:"white", fontSize:"16px", fontWeight:"800", cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.5px" }}>Done</button>
      </div>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  const pct = step===1?"33%":step===2?"66%":"100%";

  return (
    <div style={BG_STYLE}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.4); }
        @media (max-width:900px) { .of-layout { grid-template-columns:1fr !important; } .of-sidebar { display:none !important; } }
      `}</style>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"30px 20px", display:"grid", gridTemplateColumns:"1fr 420px", gap:"30px", alignItems:"start" }}>
        <div className="of-layout" style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"30px", alignItems:"start" }}>

          {/* Form card */}
          <div style={CARD_STYLE}>
            {/* Header */}
            <div style={{ backgroundColor:"rgba(15,23,30,0.4)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(184,115,51,0.2)", padding:"30px", textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:"radial-gradient(circle at 50% 50%, rgba(212,149,90,0.2) 0%, transparent 70%)", pointerEvents:"none" }}/>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
                  <div style={{ fontFamily:"'Oswald', sans-serif", fontSize:"42px", fontWeight:"300", letterSpacing:"8px", color:"white" }}>CLEANING</div>
                  <div style={{ fontFamily:"'Allura', cursive", fontSize:"46px", color:"#B87333", letterSpacing:"3px", marginTop:"-8px" }}>Su Oficina</div>
                </div>
                <div style={{ height:"2px", width:"60px", background:"linear-gradient(90deg,transparent,#B87333,transparent)", margin:"14px auto 10px" }}/>
                <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px", fontWeight:"600", letterSpacing:"2px", textTransform:"uppercase" }}>🏢 Office Cleaning Quote</div>
              </div>
            </div>
            {/* Progress */}
            <div style={{ height:"6px", background:"rgba(255,255,255,0.1)" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,#8a5523,#B87333,#D4955A)", width:pct, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 0 15px rgba(184,115,51,0.6)" }}/>
            </div>
            <div style={{ padding:"50px 40px" }}>
              {step===1 && renderStep1()}
              {step===2 && renderStep2()}
              {step===3 && renderStep3()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="of-sidebar"><Sidebar/></div>
        </div>
      </div>

      {showWsModal && renderWsModal()}
      {showSuccess  && renderSuccess()}
    </div>
  );
}
