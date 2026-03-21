import React, { useState, useRef, useEffect } from "react";
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
  backgroundColor: "#F2EFE8",
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(180,190,200,0.5) 0%, transparent 45%),
    radial-gradient(circle at 80% 68%, rgba(200,210,220,0.4) 0%, transparent 40%),
    radial-gradient(circle at 55% 8%, rgba(212,160,23,0.08) 0%, transparent 30%),
    radial-gradient(ellipse at 5% 88%, rgba(180,190,200,0.35) 0%, transparent 40%),
    radial-gradient(circle 1px at center, rgba(100,110,120,0.08) 0%, transparent 100%)
  `,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  padding: "20px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const CARD_STYLE = {
  backgroundColor: "#FFFFFF",
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(180,190,200,0.25) 0%, transparent 45%),
    radial-gradient(circle at 80% 68%, rgba(200,210,220,0.2) 0%, transparent 40%),
    radial-gradient(circle at 55% 8%, rgba(212,160,23,0.05) 0%, transparent 30%),
    radial-gradient(ellipse at 5% 88%, rgba(180,190,200,0.18) 0%, transparent 40%),
    radial-gradient(circle 1px at center, rgba(100,110,120,0.05) 0%, transparent 100%)
  `,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  borderRadius: "32px",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
  border: "1px solid rgba(212,160,23,0.2)",
};

const labelSt = {
  fontSize: "12px", fontWeight: "700", color: "#A07B15",
  marginBottom: "8px", display: "block", letterSpacing: "0.5px", textTransform: "uppercase",
};

const inputSt = {
  width: "100%", padding: "16px 18px", borderRadius: "14px",
  border: "2px solid rgba(212,160,23,0.35)", background: "#F8F9FA",
  color: "#4A3728", fontSize: "16px", fontWeight: "600", outline: "none",
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
    border: sel ? "2px solid #0891B2" : "1px solid rgba(212,160,23,0.25)",
    background: sel ? "linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))" : "rgba(255,255,255,0.7)",
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
      <div onClick={() => onChange("daily")} style={{ ...fc(value === "daily"), gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: value === "daily" ? "#0891B2" : "#4A3728", marginBottom: "2px" }}>Daily</div>
        <div style={{ fontSize: "9px", fontWeight: "600", color: value === "daily" ? "#0891B2" : "#A07B15" }}>18% OFF</div>
      </div>
      {options.map(o => (
        <div key={o.value} onClick={() => onChange(o.value)} style={fc(value === o.value)}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: value === o.value ? "#0891B2" : "#4A3728", marginBottom: "2px" }}>{o.label}</div>
          <div style={{ fontSize: "9px", fontWeight: "600", color: value === o.value ? "#0891B2" : "rgba(100,100,100,0.7)" }}>{o.disc}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OfficeForm({ sharedInfo, onBack }) {
  const [step,       setStep]       = useState(1);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => window.emailjs.init('ZsAm6x2gjm0hFV69o');
    document.head.appendChild(script);
  }, []);

  const mobileBarRef = useRef(null);
  const [mobileBarHeight, setMobileBarHeight] = useState(0);
  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMobileBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
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
  const [startMonth,          setStartMonth]          = useState("");
  const [timeFrom,            setTimeFrom]            = useState("8:00 AM");
  const [timeTo,              setTimeTo]              = useState("5:00 PM");
  const [timeWindows,         setTimeWindows]         = useState([]);
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

  const rawTotal = adjBaseCost + trashCost + facilityTotal;
  const subtotal = (sqft && frequency) ? Math.max(MINIMUM, rawTotal) : rawTotal;

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
      originalAmount: frequency !== "2x-week" && frequency !== "weekly" ? fullRate : null,
      discountAmount: hasDiscount ? fullRate - adjBaseCost : 0,
      isUpcharge: isPremium,
    });

    if (workspaceConfigs.length > 0) {
      const totalWs = workspaceConfigs.reduce((s, c) => s + c.quantity, 0);
      items.push({ label: `📋 ${totalWs} workspace(s) configured`, subtitle: "included in base rate", amount: 0, isInfo: true });
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
    // Build add-ons list
    const addonLines = Object.keys(addOns).filter(k => addOns[k]).map(k => `• ${k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}`);
    // Build price breakdown
    const breakdownLines = breakdown.filter(i=>!i.isInfo).map(i =>
      `${i.label.padEnd(32,'.')} $${i.amount.toFixed(2)}${i.discountPercent ? ` (-${i.discountPercent})` : ''}`
    ).join('\n');

    const templateParams = {
      first_name:        sharedInfo.firstName,
      last_name:         sharedInfo.lastName,
      email:             sharedInfo.email,
      phone:             sharedInfo.phone,
      business_name:     sharedInfo.businessName || 'N/A',
      address:           sharedInfo.streetAddress,
      address2:          sharedInfo.suiteUnit || 'N/A',
      city:              sharedInfo.city,
      state:             sharedInfo.state,
      zip:               sharedInfo.zipCode,
      office_type:       officeType,
      square_feet:       squareFeet,
      frequency:         frequency,
      workspace_configs: workspaceConfigs.length ? workspaceConfigs.map(c=>`${c.type} (${c.sqftRange} sqft)`).join(', ') : 'None',
      conference_rooms:  String(conferenceRooms),
      break_rooms:       String(breakRooms),
      restrooms:         String(restrooms),
      receptions:        String(receptions),
      server_rooms:      String(serverRooms),
      storage_rooms:     String(storageRooms),
      addons_list:       addonLines.length ? addonLines.join('\n') : 'None selected',
      preferred_days:    preferredDays.join(', ') || 'Not specified',
      start_month:       startMonth || 'Not specified',
      preferred_times:   timeWindows.length ? timeWindows.join(', ') : 'Not specified',
      special_instructions: specialInstructions || 'None',
      price_breakdown:   breakdownLines || 'No items',
      total_savings:     totalSavings > 0 ? `-$${totalSavings.toFixed(2)}` : 'None',
      total_monthly:     `$${total.toFixed(2)}`,
    };

    try {
      const result = await window.emailjs.send(
        'service_8bkln92',
        'template_k9i52q5',
        templateParams,
        'ZsAm6x2gjm0hFV69o'
      );
      if (result.status === 200) setShowSuccess(true);
      else alert("There was an error submitting. Please try again or call us directly.");
    } catch (e) {
      console.error(e);
      alert("There was an error submitting. Please try again or call us directly.");
    }
  };

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{ maxHeight:"calc(100vh - 40px)", display:"flex", flexDirection:"column" }}>
      <div style={{ ...CARD_STYLE, borderRadius:"28px", display:"flex", flexDirection:"column", maxHeight:"100%", backgroundColor:"#FEFCF5", border:"1px solid rgba(212,160,23,0.25)" }}>
        <div style={{ padding:"25px", textAlign:"center", borderBottom:"1px solid rgba(212,160,23,0.3)", background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)", position:"relative", overflow:"hidden" }}>
          {/* Rings top-right */}
          <svg width="160" height="160" style={{ position:"absolute", top:"-40px", right:"-30px", opacity:0.25, pointerEvents:"none" }} viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
            <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
            <circle cx="80" cy="80" r="34" fill="none" stroke="rgba(240,192,64,0.4)" strokeWidth="0.6"/>
          </svg>
          {/* Dots */}
          <div style={{ position:"absolute", width:"4px", height:"4px", borderRadius:"50%", background:"rgba(255,240,160,0.7)", top:"18%", right:"18%", boxShadow:"0 0 5px rgba(240,192,64,0.6)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(240,192,64,0.6)", top:"65%", right:"8%", boxShadow:"0 0 4px rgba(240,192,64,0.5)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", width:"5px", height:"5px", borderRadius:"50%", background:"rgba(255,240,160,0.5)", bottom:"15%", left:"8%", boxShadow:"0 0 5px rgba(240,192,64,0.4)", pointerEvents:"none" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontFamily:"'Oswald', sans-serif", fontSize:"22px", fontWeight:"300", letterSpacing:"5px", textTransform:"uppercase", background:"linear-gradient(180deg, #FFF0A0 0%, #F0C040 25%, #C8900A 50%, #F0C040 75%, #FFF0A0 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:"8px" }}>Price Breakdown</div>
            <div style={{ fontSize:"14px", color:"rgba(240,192,64,0.85)", fontWeight:"700", background:"rgba(255,255,255,0.1)", padding:"4px 12px", borderRadius:"6px", display:"inline-block" }}>Monthly Estimate</div>
          </div>
        </div>
        <div style={{ padding:"20px 25px", overflowY:"auto", flex:1 }}>
          {breakdown.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#999", fontSize:"14px", fontWeight:"500", fontStyle:"italic" }}>Complete the form to see pricing</div>
          ) : (
            <>
              {breakdown.map((item, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"12px 0", borderBottom: i < breakdown.length-1 ? "1px solid rgba(212,160,23,0.12)" : "none" }}>
                  <div style={{ color:"#4A3728", fontSize:"14px", fontWeight:"600", flex:1 }}>
                    {item.label}
                    {item.subtitle && (
                      <div style={{ fontSize:"11px", color:"#A07B15", fontWeight:"500", fontStyle:"italic", marginTop:"3px" }}>{item.subtitle}</div>
                    )}
                    {item.discountPercent && (
                      <span style={{ display:"inline-block", marginLeft:"8px", padding:"2px 6px", borderRadius:"4px", background: item.isUpcharge ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#3DA864,#2D7A4A)", fontSize:"10px", fontWeight:"900", color:"white" }}>
                        {item.isUpcharge ? `+${item.discountPercent}` : `-${item.discountPercent}`}
                      </span>
                    )}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"2px" }}>
                    {item.originalAmount && <div style={{ color:"rgba(100,100,100,0.5)", fontSize:"12px", textDecoration:"line-through", fontWeight:"600" }}>${item.originalAmount.toFixed(2)}</div>}
                    {!item.isInfo && <div style={{ color: item.discountPercent && !item.isUpcharge ? "#1E5C38" : "#4A3728", fontSize:"14px", fontWeight:"800" }}>${item.amount.toFixed(2)}</div>}
                  </div>
                </div>
              ))}
              {totalSavings > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 16px", marginTop:"10px", borderRadius:"10px", background:"linear-gradient(135deg,rgba(46,125,79,0.12),rgba(30,92,56,0.12))", border:"1px solid rgba(46,125,79,0.3)" }}>
                  <div style={{ color:"#2E7D4F", fontSize:"14px", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.5px" }}>✓ Total Savings</div>
                  <div style={{ color:"#2E7D4F", fontSize:"16px", fontWeight:"900" }}>-${totalSavings.toFixed(2)}</div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0", marginTop:"10px", borderTop:"2px solid rgba(93,235,241,0.3)" }}>
                <div style={{ color:"#A07B15", fontSize:"14px", fontWeight:"800", textTransform:"uppercase" }}>Subtotal</div>
                <div style={{ color:"#4A3728", fontSize:"16px", fontWeight:"900" }}>${subtotal.toFixed(2)}</div>
              </div>
            </>
          )}
        </div>
        <div style={{ padding:"12px 20px", background:"rgba(255,255,255,0.1)", borderTop:"1px solid rgba(255,255,255,0.1)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color:"#666", fontSize:"11px", margin:0, fontWeight:"600", textAlign:"center", fontStyle:"italic" }}>💡 Estimate based on monthly contract. Final prices may vary.</p>
        </div>
        <div style={{ padding:"25px", background:"linear-gradient(180deg, #E8E0C8 0%, #EDE5CE 40%, #F5F0E0 100%)", borderTop:"1px solid rgba(212,160,23,0.25)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:"#4A3728", fontWeight:"900", fontSize:"14px", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"4px" }}>Total</div>
              <div style={{ fontSize:"14px", color:"#8B6914", fontWeight:"700", background:"rgba(255,255,255,0.5)", padding:"3px 10px", borderRadius:"6px" }}>per month</div>
            </div>
            <div style={{ color:"#2D1800", fontWeight:"900", fontSize:"36px" }}>${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop:"20px", padding:"14px 16px", background:"linear-gradient(135deg,rgba(46,125,79,0.12),rgba(30,92,56,0.12))", borderRadius:"12px", border:"1px solid rgba(46,125,79,0.3)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ color:"#2E7D4F", fontSize:"14px", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.5px" }}>✓ 100% Satisfaction Guaranteed</div>
        <div style={{ fontSize:"22px" }}>🏆</div>
      </div>
    </div>
  );

  // ── STEP 1: Office Type ───────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="fade-in-up">
      <div style={{ textAlign:"center", marginBottom:"40px" }}>
        <div style={{ width:"90px", height:"90px", background:"linear-gradient(135deg,#A07B15,#D4A017,#F0C040)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", boxShadow:"0 20px 50px rgba(212,160,23,0.25)", border:"4px solid rgba(255,255,255,0.9)", fontSize:"44px" }} className="of-hero-icon">🏢</div>
        <h2 style={{ fontSize:"28px", fontWeight:"900", color:"#4A3728", margin:"0 0 12px", letterSpacing:"-0.5px" }} className="of-step1-h2">What type of office?</h2>
        <p style={{ color:"#666", fontSize:"16px", fontWeight:"500", margin:0 }}>Select the option that best describes your space</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px", marginBottom:"40px" }} className="of-step1-grid">
        {OFFICE_TYPES.map(ot => (
          <div key={ot.value} onClick={() => setOfficeType(ot.value)} style={{
            padding:"20px 16px", borderRadius:"16px", cursor:"pointer", transition:"all 0.2s ease",
            border: officeType===ot.value ? "2px solid #0891B2" : "2px solid rgba(212,160,23,0.2)",
            background: officeType===ot.value ? "linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))" : "rgba(255,255,255,0.7)",
            boxShadow: officeType===ot.value ? "0 0 18px rgba(6,182,212,0.3)" : "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize:"15px", fontWeight:"800", color: officeType===ot.value?"#0891B2":"#4A3728", marginBottom:"4px" }}>{ot.label}</div>
            <div style={{ fontSize:"12px", color:"#888", fontWeight:"600" }}>{ot.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:"15px" }} className="of-btn-row">
        <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(212,160,23,0.3)", background:"white", color:"#A07B15", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <ChevronLeft size={20}/> Back
        </button>
        <button onClick={goNext} disabled={!officeType} className="continue-btn" style={{ flex:2, padding:"18px", borderRadius:"16px", border: officeType?"2px solid rgba(212,160,23,0.6)":"2px solid rgba(212,160,23,0.2)", background: officeType?"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)":"rgba(255,255,255,0.4)", fontSize:"15px", fontWeight:"800", cursor:officeType?"pointer":"not-allowed", color:officeType?"#F5E8C0":"#B8A060", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"all 0.25s ease", boxShadow: officeType?"0 2px 8px rgba(212,160,23,0.2)":"none" }}>
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
        <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"14px", fontWeight:"800", color:"#A07B15", marginBottom:"20px", letterSpacing:"1px", textTransform:"uppercase", flexWrap:"wrap", gap:"8px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><Building2 size={18} color="#A07B15"/>Total Square Footage *</div>
          <div style={{ fontSize:"24px", fontWeight:"900", color:"#4A3728" }}>{sqft.toLocaleString()} sqft</div>
        </label>

        {/* Running total box */}
        <div style={{ padding:"12px 16px", borderRadius:"12px", background:"linear-gradient(135deg,rgba(212,160,23,0.06),rgba(240,192,64,0.1))", border:"2px solid #0891B2", boxShadow:"0 0 10px rgba(8,145,178,0.2)", marginBottom:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"14px", color:"#555", fontWeight:"600", marginBottom:"4px" }}>Base Monthly Cost</div>
          {frequency && sqft ? (() => {
            const v    = VISITS[frequency] || 8;
            const bpv  = baseCost / 8;
            const full = bpv * v;
            const disc = adjBaseCost < full;
            const prem = adjBaseCost > full;
            const lbl  = { "monthly":"Monthly","bi-weekly":"Bi-weekly","weekly":"Weekly","2x-week":"2x/Week","3x-week":"3x/Week","4x-week":"4x/Week","daily":"Daily" }[frequency];
            return (
              <>
                {frequency !== "2x-week" && frequency !== "weekly" && <div style={{ fontSize:"18px", fontWeight:"700", color:"rgba(100,100,100,0.4)", textDecoration:"line-through", marginBottom:"4px" }}>${full.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>}
                <div style={{ fontSize:"28px", fontWeight:"900", color:disc?"#2E7D4F":prem?"#d97706":"#A07B15", }}>${adjBaseCost.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                <div style={{ fontSize:"13px", color:disc?"#2E7D4F":prem?"#d97706":"#A07B15", marginTop:"6px", fontWeight:"800" }}>{lbl} • Monthly Total</div>
              </>
            );
          })() : (
            <>
              <div style={{ fontSize:"28px", fontWeight:"900", color:"#A07B15" }}>${baseCost.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
              <div style={{ fontSize:"12px", color:"#A07B15", marginTop:"6px", fontWeight:"700", background:"rgba(212,160,23,0.12)", padding:"4px 8px", borderRadius:"6px", display:"inline-block" }}>2x/week base rate — select frequency below</div>
            </>
          )}
        </div>

        {/* Slider */}
        <input type="range" min="500" max="50000" step="100" value={squareFeet||500} onChange={e=>setSquareFeet(e.target.value)}
          style={{ width:"100%", height:"8px", borderRadius:"4px", outline:"none", cursor:"pointer", WebkitAppearance:"none", appearance:"none", marginBottom:"16px",
            background:`linear-gradient(to right, #D4A017 0%, #D4A017 ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(212,160,23,0.15) ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(212,160,23,0.15) 100%)` }}/>
        <style>{`input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#A07B15,#D4A017,#F0C040);cursor:pointer;border:3px solid white;box-shadow:0 4px 12px rgba(143,170,184,0.5);}input[type="range"]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#A07B15,#D4A017,#F0C040);cursor:pointer;border:3px solid white;}`}</style>

        {/* Manual input */}
        <div style={{ position:"relative" }}>
          <input type="number" min="500" max="50000" value={squareFeet||""} onChange={e=>setSquareFeet(e.target.value)} onBlur={e=>{const v=parseInt(e.target.value)||0;if(v<500)setSquareFeet("500");else if(v>50000)setSquareFeet("50000");}} placeholder="Enter square feet..."
            style={{ ...inputSt, paddingRight:"55px", fontSize:"17px", fontWeight:"700" }}/>
          <div style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", color:"#A07B15", fontSize:"14px", fontWeight:"700", pointerEvents:"none" }}>sqft</div>
        </div>
      </div>

      {/* Cleaning Frequency */}
      <div style={{ marginBottom:"24px", background:"linear-gradient(135deg,rgba(212,160,23,0.05),rgba(240,192,64,0.04))", borderRadius:"16px", padding:"20px", border:"1px solid rgba(212,160,23,0.2)" }}>
        <label style={{ ...labelSt, marginBottom:"12px", color:"#A07B15" }}>📅 Cleaning Frequency *</label>
        <div className="of-freq-layout" style={{ display:"grid", gridTemplateColumns:"minmax(0,280px) 1fr", gap:"16px", alignItems:"start" }}>
          {/* Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
            <div onClick={()=>setFrequency("daily")} style={{ gridColumn:"1/-1", padding:"14px 12px", borderRadius:"10px", cursor:"pointer", transition:"all 0.2s ease", textAlign:"center",
              border:frequency==="daily"?"2px solid #0891B2":"2px solid rgba(212,160,23,0.2)",
              background:frequency==="daily"?"linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))":"rgba(255,255,255,0.7)",
              boxShadow:frequency==="daily"?"0 0 18px rgba(6,182,212,0.35)":"0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:"15px", fontWeight:"800", color:frequency==="daily"?"#0891B2":"#4A3728", marginBottom:"3px" }}>Daily</div>
              <div style={{ fontSize:"11px", fontWeight:"600", color:frequency==="daily"?"#0891B2":"#888" }}>13% OFF</div>
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
                border:frequency===o.value?"2px solid #0891B2":"2px solid rgba(212,160,23,0.2)",
                background:frequency===o.value?"linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))":"rgba(255,255,255,0.7)",
                boxShadow:frequency===o.value?"0 0 18px rgba(6,182,212,0.35)":"0 2px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:"14px", fontWeight:"800", color:frequency===o.value?"#0891B2":"#4A3728", marginBottom:"3px" }}>{o.label}</div>
                <div style={{ fontSize:"11px", fontWeight:"600", color:frequency===o.value?"#0891B2":"#888" }}>{o.disc}</div>
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
              <div style={{ padding:"16px 20px", borderRadius:"12px", background:"linear-gradient(135deg,rgba(46,125,79,0.08),rgba(30,92,56,0.06))", border:"2px solid rgba(46,125,79,0.4)", boxShadow: disc ? "0 0 20px rgba(46,125,79,0.3), 0 0 40px rgba(30,92,56,0.15)" : "none" }}>
                <div style={{ fontSize:"11px", color:"#888", fontWeight:"700", marginBottom:"6px", letterSpacing:"0.5px" }}>PRICE PER VISIT</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginBottom:"12px" }}>
                  {(disc||prem) && <div style={{ fontSize:"16px", color:"rgba(100,100,100,0.4)", textDecoration:"line-through", fontWeight:"600" }}>${bpv.toFixed(2)}</div>}
                  <div style={{ fontSize:"28px", fontWeight:"900", color:disc?"#2E7D4F":prem?"#d97706":"#A07B15", lineHeight:"1" }}>${ppv.toFixed(2)}</div>
                </div>
                {disc && <div style={{ padding:"8px 14px", borderRadius:"8px", background:"linear-gradient(135deg,#3DA864,#2D7A4A)", display:"inline-block", boxShadow:"0 0 18px rgba(46,125,79,0.6), 0 0 35px rgba(30,92,56,0.3), 0 4px 12px rgba(46,125,79,0.3)" }}>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.9)", fontWeight:"600", marginBottom:"2px" }}>YOU SAVE</div>
                  <div style={{ fontSize:"18px", color:"white", fontWeight:"900",  }}>{Math.round(((bpv-ppv)/bpv)*100)}%</div>
                </div>}
                {prem && <div style={{ padding:"8px 14px", borderRadius:"8px", background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"inline-block" }}>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.9)", fontWeight:"600", marginBottom:"2px" }}>PREMIUM</div>
                  <div style={{ fontSize:"18px", color:"white", fontWeight:"900" }}>+{Math.round(((ppv-bpv)/bpv)*100)}%</div>
                </div>}
              </div>
            );
          })() : (
            <div style={{ padding:"16px 20px", borderRadius:"12px", background:"rgba(212,160,23,0.04)", border:"2px dashed rgba(212,160,23,0.2)", textAlign:"center", color:"rgba(100,100,100,0.6)", fontSize:"13px", fontStyle:"italic" }}>Select frequency to see price per visit</div>
          )}
        </div>
        <div style={{ fontSize:"11px", color:"#7A6520", marginTop:"12px", fontStyle:"italic" }}>Base rates assume 2x per week cleaning. More frequent service receives volume discounts.</div>
      </div>

      {/* Workspace button */}
      <div style={{ marginBottom:"20px", background:"linear-gradient(135deg,rgba(255,255,255,0.85),rgba(255,248,220,0.7))", border:"2px dashed rgba(8,145,178,0.5)", borderRadius:"16px", padding:"20px", display:"flex", flexDirection:"column", gap:"15px" }}>
        <div style={{ fontSize:"11px", fontWeight:"800", color:"#0891B2", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"8px", display:"flex", alignItems:"center", gap:"6px" }}><span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#0891B2", display:"inline-block" }}></span>Step Required — Click to Configure</div>
        <button onClick={()=>{setWsEditingIndex(null);setShowWsModal(true);}} style={{ width:"100%", padding:"24px 20px", borderRadius:"14px", background:"linear-gradient(180deg, #E8E0C8 0%, #EDE5CE 40%, #F5F0E0 100%)", color:"#5C3D10", cursor:"pointer", boxShadow:"0 4px 20px rgba(212,160,23,0.25), 0 1px 4px rgba(212,160,23,0.15)", border:"2px solid #0891B2", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"-75%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", transform:"skewX(-20deg)", pointerEvents:"none" }}/>
          <div style={{ fontSize:"22px", fontWeight:"900", letterSpacing:"0.5px", textTransform:"uppercase", color:"#5C3D10", textShadow:"none" }}>💼 Configure Workspaces</div>
          <div style={{ fontSize:"13px", fontWeight:"700", marginTop:"7px", color:"rgba(61,46,0,0.8)", letterSpacing:"0.6px", textTransform:"uppercase", borderTop:"1px solid rgba(212,160,23,0.3)", paddingTop:"8px" }}>👆 Tap to tell us your offices, cubicles & desks — Required for accurate quote</div>
        </button>
        {workspaceConfigs.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {workspaceConfigs.map((cfg, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.8)", borderRadius:"10px", padding:"12px 15px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid rgba(212,160,23,0.15)" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"700", color:"#4A3728", marginBottom:"3px" }}>{getWsLabel(cfg)} × {cfg.quantity}</div>
                  <div style={{ fontSize:"11px", color:"#888", fontWeight:"600" }}>{cfg.flooring==="hard"?"Hard Surface":cfg.flooring==="low-carpet"?"Low-pile Carpet":"High-pile Carpet"}{cfg.specialFeatures?.trashRemoval&&" • Trash removal"}</div>
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={()=>editWorkspace(i)} style={{ padding:"6px 12px", borderRadius:"6px", border:"none", background:"rgba(212,160,23,0.2)", color:"#F0C040", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>Edit</button>
                  <button onClick={()=>setWorkspaceConfigs(workspaceConfigs.filter((_,idx)=>idx!==i))} style={{ padding:"6px 12px", borderRadius:"6px", border:"none", background:"rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facility counters */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px", marginBottom:"30px" }} className="of-rooms-grid">
        {[
          {label:"🗂️ Conference Rooms", price:"$45 / clean", val:conferenceRooms, set:setConferenceRooms, freq:confFreq,    setFreq:setConfFreq},
          {label:"☕ Break Rooms",       price:"$35 / clean", val:breakRooms,      set:setBreakRooms,      freq:breakFreq,   setFreq:setBreakFreq},
          {label:"🚻 Restrooms",         price:"$25 / clean", val:restrooms,       set:setRestrooms,       freq:restrFreq,   setFreq:setRestrFreq},
          {label:"🏛️ Reception / Lobby", price:"$40 / clean", val:receptions,      set:setReceptions,      freq:recepFreq,   setFreq:setRecepFreq},
          {label:"🖥️ Server / IT Rooms", price:"$30 / clean", val:serverRooms,     set:setServerRooms,     freq:serverFreq,  setFreq:setServerFreq},
          {label:"📦 Storage / Archive", price:"$20 / clean", val:storageRooms,    set:setStorageRooms,    freq:storageFreq, setFreq:setStorageFreq},
        ].map(f=>(
          <div key={f.label} style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,245,240,0.95))", border:"1px solid rgba(212,160,23,0.2)", borderRadius:"16px", padding:"16px", display:"flex", flexDirection:"column", gap:"10px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:"16px", fontWeight:"800", color:"#4A3728", marginBottom:"2px", letterSpacing:"-0.2px" }}>{f.label}</div>
                <div style={{ fontSize:"13px", color:"#A07B15", fontWeight:"700", marginTop:"3px", letterSpacing:"0.3px" }}>{f.price}</div>
              </div>
              <div style={{ fontSize:"24px", fontWeight:"900", color:"#4A3728", minWidth:"40px", textAlign:"right" }}>{f.val}</div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={()=>f.set(Math.max(0,f.val-1))} style={{ flex:1, padding:"10px", borderRadius:"10px", border:"none", background:f.val>0?"rgba(239,68,68,0.12)":"rgba(230,230,230,0.6)", color:f.val>0?"#ef4444":"rgba(255,255,255,0.3)", fontSize:"18px", fontWeight:"900", cursor:f.val>0?"pointer":"not-allowed" }}>−</button>
              <div style={{ flex:1, position:"relative", overflow:"hidden", borderRadius:"10px" }}>
                <button onClick={()=>f.set(f.val+1)} style={{ width:"100%", padding:"10px", borderRadius:"10px", border:"1.5px solid rgba(212,160,23,0.5)", background:"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)", color:"#F5E8C0", fontSize:"18px", fontWeight:"900", cursor:"pointer", position:"relative", zIndex:1, boxShadow:"0 2px 8px rgba(180,160,120,0.2)" }}>+</button>
                {/* Rings bottom-left — peeking from corner */}
                <svg style={{ position:"absolute", bottom:"-34px", left:"-34px", width:"80px", height:"80px", pointerEvents:"none", zIndex:2 }} viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="37" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
                  <circle cx="40" cy="40" r="27" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
                </svg>
                {/* Dots — gold with glow */}
                <div style={{ position:"absolute", width:"5px", height:"5px", borderRadius:"50%", background:"rgba(255,220,80,0.85)", bottom:"8px", left:"24px", zIndex:2, pointerEvents:"none", boxShadow:"0 0 6px rgba(255,220,80,0.6)" }}/>
                <div style={{ position:"absolute", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(240,192,64,0.8)", top:"6px", right:"10px", zIndex:2, pointerEvents:"none", boxShadow:"0 0 4px rgba(240,192,64,0.6)" }}/>
                <div style={{ position:"absolute", width:"4px", height:"4px", borderRadius:"50%", background:"rgba(255,220,80,0.85)", top:"45%", right:"14px", zIndex:2, pointerEvents:"none", boxShadow:"0 0 6px rgba(255,220,80,0.6)" }}/>
              </div>
            </div>
            {f.val > 0 && <FreqGrid value={f.freq} onChange={f.setFreq}/>}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:"15px" }} className="of-btn-row">
        <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(212,160,23,0.3)", background:"white", color:"#A07B15", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <ChevronLeft size={20}/> Back
        </button>
        <button onClick={goNext} disabled={!squareFeet||!frequency} className="continue-btn" style={{ flex:2, padding:"18px", borderRadius:"16px", border: (squareFeet&&frequency)?"2px solid rgba(212,160,23,0.6)":"2px solid rgba(212,160,23,0.2)", background: (squareFeet&&frequency)?"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)":"rgba(255,255,255,0.4)", fontSize:"15px", fontWeight:"800", cursor:(squareFeet&&frequency)?"pointer":"not-allowed", color:(squareFeet&&frequency)?"#F5E8C0":"#B8A060", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"all 0.25s ease", boxShadow: (squareFeet&&frequency)?"0 2px 8px rgba(212,160,23,0.2)":"none" }}>
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
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#A07B15", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <CheckCircle2 size={18} color="#D4A017"/>Additional Services (Optional)
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }} className="of-addons-grid">
          {[
            {key:"windowCleaning",   label:"Window Cleaning",     price:"$150"},
            {key:"floorWaxing",      label:"Floor Waxing/Buffing", price:"$200"},
            {key:"carpetCleaning",   label:"Carpet Deep Clean",    price:"$0.35/sqft"},
            {key:"pressureWashing",  label:"Pressure Washing",     price:"$0.25/sqft"},
            {key:"postConstruction", label:"Post-Construction",    price:"$0.50/sqft"},
            {key:"disinfection",     label:"Disinfection",         price:"$0.15/sqft"},
          ].map(a=>(
            <div key={a.key} onClick={()=>setAddOns({...addOns,[a.key]:!addOns[a.key]})} style={{ padding:"18px 16px", borderRadius:"16px", cursor:"pointer", transition:"all 0.3s ease", display:"flex", alignItems:"flex-start", gap:"10px",
              border:addOns[a.key]?"1.5px solid rgba(212,160,23,0.6)":"1.5px solid rgba(212,160,23,0.25)",
              background:addOns[a.key]?"linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,235,140,0.5) 40%, rgba(212,160,23,0.65) 100%)":"#EDE5CE",
              boxShadow:addOns[a.key]?"0 4px 16px rgba(212,160,23,0.3)":"0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ width:"20px", height:"20px", borderRadius:"6px", border:addOns[a.key]?"none":"2px solid rgba(212,160,23,0.4)", background:addOns[a.key]?"linear-gradient(135deg,#3DA864,#2D7A4A)":"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
                {addOns[a.key]&&<CheckCircle2 size={14} color="white"/>}
              </div>
              <div>
                <div style={{ fontSize:"14px", fontWeight:"800", marginBottom:"3px", color:addOns[a.key]?"#2D1E00":"#4A3728" }}>{a.label}</div>
                <div style={{ fontSize:"11px", color:addOns[a.key]?"rgba(61,40,0,0.75)":"#A07B15", fontWeight:"700" }}>{a.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Start Month */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#A07B15", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <Calendar size={18} color="#A07B15"/>Expected Start Month (Optional)
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
          {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m=>(
            <div key={m} onClick={()=>setStartMonth(startMonth===m?"":m)}
              style={{ padding:"12px 10px", borderRadius:"12px", cursor:"pointer", textAlign:"center", transition:"all 0.2s ease",
                border:startMonth===m?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",
                background:startMonth===m?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                color:startMonth===m?"white":"#4A3728",
                boxShadow:startMonth===m?"0 4px 14px rgba(212,160,23,0.35)":"0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:"13px", fontWeight:"800" }}>{m.slice(0,3)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferred Days */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#A07B15", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <Calendar size={18} color="#A07B15"/>Preferred Days (Optional)
        </label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }} className="of-days-grid">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
            <div key={d} onClick={()=>setPreferredDays(preferredDays.includes(d)?preferredDays.filter(x=>x!==d):[...preferredDays,d])}
              style={{ padding:"14px 10px", borderRadius:"12px", cursor:"pointer", textAlign:"center", fontSize:"14px", fontWeight:"800", transition:"all 0.3s ease",
                border:preferredDays.includes(d)?"2px solid #D4A017":"2px solid rgba(212,160,23,0.3)",
                background:preferredDays.includes(d)?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                color:preferredDays.includes(d)?"white":"#4A3728",
                boxShadow:preferredDays.includes(d)?"0 4px 14px rgba(212,160,23,0.35)":"0 2px 6px rgba(0,0,0,0.04)" }}>{d}</div>
          ))}
        </div>
      </div>

      {/* Preferred Time */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#A07B15", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
          <Clock size={18} color="#A07B15"/>Preferred Service Times (Optional)
        </label>
        <p style={{ fontSize:"12px", color:"#888", fontWeight:"600", marginTop:"-10px", marginBottom:"14px" }}>Add one or more time windows when cleaning is welcome.</p>
        {/* From / To row */}
        <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"12px", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:"120px" }}>
            <label style={{ fontSize:"11px", fontWeight:"700", color:"#A07B15", letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>From</label>
            <select value={timeFrom} onChange={e=>setTimeFrom(e.target.value)} style={{ width:"100%", padding:"12px 14px", borderRadius:"12px", border:"2px solid rgba(212,160,23,0.35)", background:"#F8F9FA", color:"#4A3728", fontSize:"15px", fontWeight:"600", outline:"none", boxSizing:"border-box" }}>
              {["12:00 AM","12:30 AM","1:00 AM","1:30 AM","2:00 AM","2:30 AM","3:00 AM","3:30 AM","4:00 AM","4:30 AM","5:00 AM","5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ paddingTop:"22px", color:"#A07B15", fontWeight:"800", fontSize:"14px" }}>to</div>
          <div style={{ flex:1, minWidth:"120px" }}>
            <label style={{ fontSize:"11px", fontWeight:"700", color:"#A07B15", letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>To</label>
            <select value={timeTo} onChange={e=>setTimeTo(e.target.value)} style={{ width:"100%", padding:"12px 14px", borderRadius:"12px", border:"2px solid rgba(212,160,23,0.35)", background:"#F8F9FA", color:"#4A3728", fontSize:"15px", fontWeight:"600", outline:"none", boxSizing:"border-box" }}>
              {["12:00 AM","12:30 AM","1:00 AM","1:30 AM","2:00 AM","2:30 AM","3:00 AM","3:30 AM","4:00 AM","4:30 AM","5:00 AM","5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ paddingTop:"22px" }}>
            <button onClick={()=>{ const w=`${timeFrom} – ${timeTo}`; if(!timeWindows.includes(w)) setTimeWindows([...timeWindows,w]); }} style={{ padding:"12px 18px", borderRadius:"12px", border:"2px solid rgba(212,160,23,0.5)", background:"linear-gradient(135deg,#D4A017,#F0C040)", color:"white", fontSize:"13px", fontWeight:"800", cursor:"pointer", whiteSpace:"nowrap" }}>+ Add</button>
          </div>
        </div>
        {/* Added windows */}
        {timeWindows.length>0&&(
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {timeWindows.map((w,i)=>(
              <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 14px", borderRadius:"20px", background:"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(240,192,64,0.1))", border:"1.5px solid rgba(212,160,23,0.4)" }}>
                <span style={{ fontSize:"13px", fontWeight:"700", color:"#4A3728" }}>{w}</span>
                <button onClick={()=>setTimeWindows(timeWindows.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", cursor:"pointer", color:"#A07B15", fontSize:"16px", fontWeight:"900", lineHeight:"1", padding:"0" }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Special Instructions */}
      <div style={{ marginBottom:"30px" }}>
        <label style={{ ...labelSt, fontSize:"14px", fontWeight:"800", marginBottom:"15px", letterSpacing:"1px", textTransform:"uppercase" }}>Special Instructions (Optional)</label>
        <textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} placeholder="Any specific requirements, access instructions, or special requests..." rows={4}
          style={{ ...inputSt, resize:"vertical", fontFamily:"inherit" }}/>
      </div>

      {/* Terms */}
      <div style={{ padding:"20px", borderRadius:"16px", background:"rgba(212,160,23,0.06)", border:"1px solid rgba(212,160,23,0.2)", marginBottom:"30px" }}>
        <p style={{ fontSize:"12px", color:"#555", fontWeight:"600", lineHeight:"1.6", margin:0 }}>
          By submitting this request, you agree to our{" "}
          <a href="/TermsAndConditions.pdf" target="_blank" rel="noopener noreferrer" style={{ color:"#F0C040", textDecoration:"underline", fontWeight:"700" }}>Terms & Conditions</a>.{" "}
          Our team will review your request and contact you within 24 hours to confirm details and schedule service.
        </p>
      </div>

      <div style={{ display:"flex", gap:"15px" }} className="of-btn-row">
        <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(212,160,23,0.3)", background:"white", color:"#A07B15", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <ChevronLeft size={20}/> Back
        </button>
        <button onClick={handleSubmit} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background:"linear-gradient(135deg,#3DA864,#2D7A4A)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          Submit Request <CheckCircle2 size={20}/>
        </button>
      </div>
    </div>
  );

  // ── Workspace Modal ───────────────────────────────────────────────────────
  const renderWsModal = () => (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"20px", overflowY:"auto" }}>
      <div style={{ background:"linear-gradient(135deg,#FFFFFF,#F5F0EB)", borderRadius:"20px", padding:"30px 24px", maxWidth:"700px", width:"100%", maxHeight:"90vh", overflowY:"auto", border:"1px solid rgba(212,160,23,0.25)", boxShadow:"0 30px 80px rgba(0,0,0,0.15)" }} className="of-ws-modal-inner">
        <h2 style={{ fontSize:"26px", fontWeight:"900", color:"#4A3728", minWidth:"40px", textAlign:"right", marginBottom:"8px" }}>💼 Configure Workspace</h2>
        <p style={{ fontSize:"14px", color:"#666", marginBottom:"30px", fontWeight:"600" }}>{wsEditingIndex!==null?"Update workspace configuration":"Document workspace types for cleaning crew"}</p>

        <div style={{ marginBottom:"25px" }}>
          <label style={labelSt}>🏢 Workspace Type *</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }} className="of-ws-type-grid">
            {[{id:"executive",icon:"🏢",name:"Executive Office"},{id:"manager",icon:"💼",name:"Manager Office"},{id:"standard",icon:"📋",name:"Standard Office"},{id:"cubicle",icon:"🪑",name:"Cubicle"},{id:"open-desk",icon:"💻",name:"Open Desk"},{id:"collaborative",icon:"🤝",name:"Collaborative Workspace"}].map(t=>(
              <button key={t.id} onClick={()=>setWsType(t.id)} style={{ padding:"16px 14px", borderRadius:"12px", border:wsType===t.id?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)", background:wsType===t.id?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)", color:wsType===t.id?"#5C4A1E":"#4A3728", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:"22px", marginBottom:"4px" }}>{t.icon}</div>
                <div style={{ fontSize:"13px", fontWeight:"800" }}>{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {wsType && wsType!=="cubicle" && wsType!=="open-desk" && (
          <div style={{ marginBottom:"25px" }}>
            <label style={labelSt}>📏 Square Footage Range *</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }} className="of-ws-sqft-grid">
              {[{value:"100-150",label:"100-150 sqft"},{value:"150-200",label:"150-200 sqft"},{value:"200-300",label:"200-300 sqft"},{value:"300-500",label:"300-500 sqft"},{value:"500+",label:"500+ sqft"}].map(o=>(
                <button key={o.value} onClick={()=>setWsSqftRange(o.value)} style={{ padding:"12px", borderRadius:"10px", border:wsSqftRange===o.value?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)", background:wsSqftRange===o.value?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)", color:wsSqftRange===o.value?"#5C4A1E":"#4A3728", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>{o.label}</button>
              ))}
            </div>
          </div>
        )}

        {wsType==="cubicle" && (
          <div style={{ marginBottom:"25px" }}>
            <label style={labelSt}>📐 Cubicle Size *</label>
            <div style={{ display:"flex", gap:"10px" }}>
              {[{value:"standard",label:"Standard"},{value:"large",label:"Large"}].map(o=>(
                <button key={o.value} onClick={()=>setWsSqftRange(o.value)} style={{ flex:1, padding:"12px", borderRadius:"10px", border:wsSqftRange===o.value?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)", background:wsSqftRange===o.value?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)", color:wsSqftRange===o.value?"#5C4A1E":"#4A3728", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>{o.label}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom:"25px" }}>
          <label style={labelSt}>🏢 Flooring Type</label>
          <div style={{ display:"flex", gap:"10px" }}>
            {[{value:"hard",label:"Hard Surface"},{value:"low-carpet",label:"Low-pile Carpet"},{value:"high-carpet",label:"High-pile Carpet"}].map(o=>(
              <button key={o.value} onClick={()=>setWsFlooring(o.value)} style={{ flex:1, padding:"12px", borderRadius:"10px", border:wsFlooring===o.value?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)", background:wsFlooring===o.value?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)", color:wsFlooring===o.value?"#5C4A1E":"#4A3728", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>{o.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"25px" }}>
          <label style={labelSt}>⭐ Special Considerations</label>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {[{key:"trashRemoval",label:"Trash Removal Required",note:"+$1 per workspace"},{key:"multiMonitor",label:"Multiple Monitors/Complex Setup",note:"Note for crew"},{key:"sensitiveDocs",label:"Sensitive Documents",note:"Extra care needed"},{key:"plants",label:"Plants/Decor Items",note:"Work around them"}].map(f=>(
              <label key={f.key} style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderRadius:"10px", border:"1px solid rgba(212,160,23,0.25)", background:wsFeatures[f.key]?"linear-gradient(135deg,rgba(212,160,23,0.12),rgba(212,175,55,0.06))":"rgba(255,255,255,0.7)", cursor:"pointer" }}>
                <input type="checkbox" checked={wsFeatures[f.key]} onChange={e=>setWsFeatures({...wsFeatures,[f.key]:e.target.checked})} style={{ marginRight:"12px", width:"18px", height:"18px", cursor:"pointer" }}/>
                <div>
                  <div style={{ color:"#4A3728", fontSize:"13px", fontWeight:"800" }}>{f.label}</div>
                  <div style={{ color:"#888", fontSize:"11px", fontWeight:"600", marginTop:"2px" }}>{f.note}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"30px" }}>
          <label style={labelSt}>🔢 Quantity</label>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", background:"rgba(212,160,23,0.06)", padding:"16px", borderRadius:"12px" }}>
            <button onClick={()=>setWsQuantity(Math.max(1,wsQuantity-10))} style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"14px", fontWeight:"900", cursor:"pointer" }}>-10</button>
            <button onClick={()=>setWsQuantity(Math.max(1,wsQuantity-1))}  style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"16px", fontWeight:"900", cursor:"pointer" }}>-1</button>
            <div style={{ flex:1, textAlign:"center", fontSize:"28px", fontWeight:"900", color:"#4A3728" }}>{wsQuantity}</div>
            <button onClick={()=>setWsQuantity(wsQuantity+1)}  style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#D4A017,#F0C040)", color:"white", fontSize:"16px", fontWeight:"900", cursor:"pointer" }}>+1</button>
            <button onClick={()=>setWsQuantity(wsQuantity+10)} style={{ padding:"10px 16px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#D4A017,#F0C040)", color:"white", fontSize:"14px", fontWeight:"900", cursor:"pointer" }}>+10</button>
          </div>
        </div>

        <div style={{ display:"flex", gap:"12px" }}>
          <button onClick={()=>{setShowWsModal(false);setWsType("");setWsSqftRange("");setWsFlooring("hard");setWsFeatures({trashRemoval:false,multiMonitor:false,sensitiveDocs:false,plants:false});setWsQuantity(1);setWsEditingIndex(null);}}
            style={{ flex:1, padding:"16px", borderRadius:"12px", border:"2px solid rgba(212,160,23,0.3)", background:"white", color:"#A07B15", fontSize:"14px", fontWeight:"800", cursor:"pointer" }}>Cancel</button>
          <button onClick={saveWorkspace} disabled={!wsType||(wsType!=="open-desk"&&!wsSqftRange)}
            style={{ flex:2, padding:"16px", borderRadius:"12px", border:"none", background:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?"rgba(212,160,23,0.15)":"linear-gradient(135deg,#D4A017,#F0C040)", color:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?"#9A8030":"white", fontSize:"14px", fontWeight:"800", cursor:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?"not-allowed":"pointer", opacity:(!wsType||(wsType!=="open-desk"&&!wsSqftRange))?0.5:1 }}>
            {wsEditingIndex!==null?"Update Workspace":"Save Workspace"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Success Modal ─────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"20px", animation:"fadeIn 0.3s ease-out" }}
      onClick={() => { setShowSuccess(false); window.location.reload(); }}>
      <div style={{ background:"linear-gradient(135deg, #3E3830 0%, #4E4840 60%, #3E3830 100%)", borderRadius:"32px", padding:"50px 40px", maxWidth:"500px", width:"100%", boxShadow:"0 30px 80px rgba(0,0,0,0.5)", border:"2px solid rgba(212,160,23,0.4)", textAlign:"center", position:"relative", animation:"slideInUp 0.4s ease-out", overflow:"hidden" }}
        onClick={e => e.stopPropagation()}>
        {/* Rings decoration */}
        <svg width="180" height="180" style={{ position:"absolute", top:"-50px", right:"-40px", opacity:0.15, pointerEvents:"none" }} viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
          <circle cx="90" cy="90" r="52" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
        </svg>
        {/* Icon */}
        <div style={{ width:"100px", height:"100px", background:"linear-gradient(135deg,#3DA864,#2D7A4A)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 30px", boxShadow:"0 20px 50px rgba(46,125,79,0.5)", animation:"scaleIn 0.5s ease-out 0.2s backwards" }}>
          <div style={{ fontSize:"50px", animation:"rotateIn 0.6s ease-out 0.4s backwards" }}>✓</div>
        </div>
        <h2 style={{ fontSize:"32px", fontWeight:"900", color:"#FFF0A0", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Request Submitted!</h2>
        <p style={{ fontSize:"18px", color:"rgba(255,255,255,0.9)", lineHeight:"1.6", marginBottom:"10px", fontWeight:"600" }}>
          Thank you for choosing Cleaning Su Oficina!
        </p>
        <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.75)", lineHeight:"1.6", marginBottom:"30px", fontWeight:"500" }}>
          Your quote for{" "}
          <strong style={{ color:"#F0C040", fontSize:"20px" }}>${total.toFixed(2)}/mo</strong>{" "}
          has been submitted.<br/>
          We'll contact you at{" "}
          <strong style={{ color:"white" }}>{sharedInfo.email}</strong> shortly!
        </p>
        <button onClick={() => { setShowSuccess(false); window.location.reload(); }}
          style={{ padding:"18px 40px", background:"linear-gradient(135deg,#D4A017,#F0C040)", color:"#2D1800", border:"none", borderRadius:"16px", fontSize:"16px", fontWeight:"800", cursor:"pointer", boxShadow:"0 10px 30px rgba(212,160,23,0.4)", textTransform:"uppercase", letterSpacing:"0.5px" }}>
          Got It!
        </button>
      </div>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  const pct = step===1?"33%":step===2?"66%":"100%";

  return (
    <div style={{...BG_STYLE, paddingBottom: mobileBarHeight ? mobileBarHeight + 20 : undefined}}>
      {/* Animated background */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
        {/* Orbs */}
        <div style={{ position:"absolute", width:"500px", height:"500px", borderRadius:"50%", filter:"blur(90px)", background:"rgba(240,192,64,0.25)", top:"-120px", left:"-120px" }}/>
        <div style={{ position:"absolute", width:"380px", height:"380px", borderRadius:"50%", filter:"blur(80px)", background:"rgba(212,160,23,0.15)", bottom:"-80px", right:"-80px" }}/>
        <div style={{ position:"absolute", width:"220px", height:"220px", borderRadius:"50%", filter:"blur(60px)", background:"rgba(240,192,64,0.2)", top:"35%", left:"65%" }}/>
        {/* Rings */}
        <svg width="560" height="560" style={{ position:"absolute", top:"-100px", left:"28%", opacity:0.8 }} viewBox="0 0 560 560">
          <circle cx="280" cy="280" r="240" fill="none" stroke="rgba(240,192,64,0.7)" strokeWidth="1.8"/>
          <circle cx="280" cy="280" r="190" fill="none" stroke="rgba(212,160,23,0.4)" strokeWidth="1.2"/>
          <circle cx="280" cy="280" r="140" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.2"/>
          <circle cx="280" cy="280" r="90" fill="none" stroke="rgba(212,160,23,0.3)" strokeWidth="0.8"/>
        </svg>
        <svg width="300" height="300" style={{ position:"absolute", bottom:"-60px", right:"4%", opacity:0.7 }} viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="125" fill="none" stroke="rgba(212,160,23,0.55)" strokeWidth="1.8"/>
          <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.2"/>
        </svg>
        {/* Floating dots */}
        {[
          { w:"7px", l:"22%", b:"12%", dur:"7s", del:"0s"   },
          { w:"5px", l:"48%", b:"18%", dur:"9s", del:"1.5s" },
          { w:"8px", l:"72%", b:"9%",  dur:"8s", del:"0.7s" },
          { w:"6px", l:"33%", b:"22%", dur:"10s",del:"2s"   },
          { w:"6px", l:"82%", b:"28%", dur:"7.5s",del:"3s"  },
        ].map((d,i) => (
          <div key={i} style={{ position:"absolute", width:d.w, height:d.w, borderRadius:"50%", background:"rgba(212,160,23,0.5)", left:d.l, bottom:d.b, animation:`floatUp ${d.dur} ${d.del} infinite ease-in-out`, boxShadow:`0 0 ${parseInt(d.w)*3}px rgba(240,192,64,0.6)` }}/>
        ))}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        input, textarea, select { font-size: 16px !important; touch-action: manipulation; }
        input::placeholder, textarea::placeholder { color: rgba(100,100,100,0.5); }
        button { touch-action: manipulation; }
        html, body, * { -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
        @keyframes floatUp { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-22px);opacity:1} }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideInUp { from { opacity:0; transform:translateY(50px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0); } to { opacity:1; transform:scale(1); } }
        @keyframes rotateIn { from { opacity:0; transform:rotate(-180deg); } to { opacity:1; transform:rotate(0); } }
        .continue-btn:not(:disabled):hover { background: linear-gradient(160deg, #EDE5CE 0%, #4E4840 60%, #3E3830 100%) !important; color: #F5E8C0 !important; box-shadow: 0 4px 16px rgba(180,160,120,0.3) !important; border-color: rgba(212,160,23,0.6) !important; transform: translateY(-1px); }
        .continue-btn:not(:disabled):active { background: linear-gradient(160deg, #DDD5B8 0%, #3E3830 60%, #2C2416 100%) !important; color: #F5E8C0 !important; box-shadow: 0 2px 6px rgba(180,160,120,0.25) !important; transform: scale(0.98); }
        .of-mobile-price { display:none; }
        @media (max-width:900px) { .of-layout { grid-template-columns:1fr !important; } .of-sidebar { display:none !important; } .of-mobile-price { display:block !important; } }
        @media (max-width: 640px) {
          .of-layout { padding: 12px !important; gap: 0 !important; }
          .of-header { padding: 24px 16px !important; }
          .of-cleaning-title { font-size: 38px !important; letter-spacing: 5px !important; }
          .of-suoficina-title { font-size: 42px !important; }
          .of-form-body { padding: 24px 16px !important; }
          .of-step1-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .of-freq-layout { grid-template-columns: 1fr !important; gap: 12px !important; }
          .of-freq-cards { grid-template-columns: repeat(2,1fr) !important; }
          .of-rooms-grid { grid-template-columns: 1fr !important; }
          .of-addons-grid { grid-template-columns: 1fr !important; }
          .of-days-grid { grid-template-columns: repeat(4,1fr) !important; }
          .of-times-grid { grid-template-columns: repeat(2,1fr) !important; }
          .of-ws-modal-inner { padding: 24px 18px !important; }
          .of-ws-type-grid { grid-template-columns: repeat(2,1fr) !important; }
          .of-ws-sqft-grid { grid-template-columns: repeat(2,1fr) !important; }
          .of-hosp-type-grid { grid-template-columns: repeat(3,1fr) !important; }
          .of-sqft-label { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .of-sqft-label-num { font-size: 18px !important; }
          .of-hero-icon { width: 72px !important; height: 72px !important; font-size: 36px !important; }
          .of-step1-h2 { font-size: 22px !important; }
          .of-btn-row { gap: 10px !important; }
        }
        @media (max-width: 380px) {
          .of-cleaning-title { font-size: 32px !important; letter-spacing: 4px !important; }
          .of-suoficina-title { font-size: 36px !important; }
          .of-days-grid { grid-template-columns: repeat(4,1fr) !important; }
        }
      `}</style>

      <div className="of-layout" style={{ maxWidth:"1400px", margin:"0 auto", padding:"30px 20px", display:"grid", gridTemplateColumns:"1fr 380px", gap:"30px", alignItems:"start", position:"relative", zIndex:1 }}>

          {/* Form card */}
          <div style={CARD_STYLE}>
            {/* Header */}
            <div style={{ background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)", borderBottom:"1px solid rgba(212,160,23,0.3)", padding:"30px", textAlign:"center", position:"relative", overflow:"hidden" }}>
              {/* Rings inside header */}
              <svg width="220" height="220" style={{ position:"absolute", top:"-60px", left:"-40px", opacity:0.25, pointerEvents:"none" }} viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
                <circle cx="110" cy="110" r="70"  fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
              </svg>
              <svg width="180" height="180" style={{ position:"absolute", bottom:"-50px", right:"-30px", opacity:0.25, pointerEvents:"none" }} viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
                <circle cx="90" cy="90" r="52" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
              </svg>
              {/* Floating dots inside header */}
              <div style={{ position:"absolute", width:"5px", height:"5px", borderRadius:"50%", background:"rgba(255,240,160,0.7)", top:"20%", left:"12%", boxShadow:"0 0 6px rgba(240,192,64,0.6)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", width:"4px", height:"4px", borderRadius:"50%", background:"rgba(240,192,64,0.6)", top:"60%", left:"80%", boxShadow:"0 0 5px rgba(240,192,64,0.5)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(255,240,160,0.5)", top:"75%", left:"25%", boxShadow:"0 0 4px rgba(240,192,64,0.4)", pointerEvents:"none" }}/>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
                  <div style={{ fontFamily:"'Oswald', sans-serif", fontSize:"42px", fontWeight:"300", letterSpacing:"8px", color:"white", textShadow:"0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(240,192,64,0.3)" }} className="of-cleaning-title">CLEANING</div>
                  <div style={{ fontFamily:"'Allura', cursive", fontSize:"46px", letterSpacing:"3px", marginTop:"-8px", fontWeight:"400", background:"linear-gradient(180deg, #FFF0A0 0%, #F0C040 25%, #C8900A 50%, #F0C040 75%, #FFF0A0 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }} className="of-suoficina-title">Su Oficina</div>
                </div>
                <div style={{ height:"2px", width:"80px", background:"linear-gradient(90deg,transparent,#F0C040,transparent)", margin:"14px auto 10px", boxShadow:"0 0 10px rgba(240,192,64,0.5)" }}/>
                <div style={{ color:"rgba(240,192,64,0.7)", fontSize:"13px", fontWeight:"700", letterSpacing:"2px", textTransform:"uppercase" }}>🏢 Office Cleaning Quote</div>
              </div>
            </div>
            {/* Progress */}
            <div style={{ height:"6px", background:"rgba(212,160,23,0.15)" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,#A07B15,#D4A017,#F0C040)", width:pct, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 0 15px rgba(212,160,23,0.6)" }}/>
            </div>
            <div className="of-form-body" style={{ padding:"50px 40px", background:"transparent" }}>
              {step===1 && renderStep1()}
              {step===2 && renderStep2()}
              {step===3 && renderStep3()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="of-sidebar" style={{ position:"sticky", top:"20px", height:"fit-content" }}><Sidebar/></div>
      </div>

      {/* Mobile sticky price bar */}
      <div ref={mobileBarRef} className="of-mobile-price" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000}}>
        <div style={{background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",borderTop:"2px solid rgba(212,160,23,0.4)",boxShadow:"0 -8px 30px rgba(0,0,0,0.3)"}}>
          {/* Total row — always visible, fixed height ~56px */}
          <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div>
              <div style={{color:"rgba(240,192,64,0.8)",fontSize:"11px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase"}}>Monthly Estimate</div>
              {totalSavings>0&&<div style={{color:"#3DA864",fontSize:"11px",fontWeight:"700",marginTop:"2px"}}>✓ Saving ${totalSavings.toFixed(2)}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#FFF0A0",fontSize:"28px",fontWeight:"900",lineHeight:"1"}}>${total.toFixed(2)}</div>
              <div style={{color:"rgba(240,192,64,0.6)",fontSize:"10px",fontWeight:"600"}}>per month</div>
            </div>
          </div>
          {/* Line items — HARD capped at 120px, always scrollable */}
          {breakdown.length>0&&(
            <div style={{borderTop:"1px solid rgba(212,160,23,0.25)",overflowY:"scroll",maxHeight:"120px",padding:"6px 20px 10px",WebkitOverflowScrolling:"touch"}}>
              {breakdown.map((item,i)=>(
                !item.isInfo&&<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",fontSize:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{color:"rgba(240,192,64,0.85)",fontWeight:"600",flex:1,marginRight:"8px"}}>{item.label}{item.discountPercent&&<span style={{marginLeft:"6px",padding:"1px 5px",borderRadius:"3px",background:item.isUpcharge?"#d97706":"#2E7D4F",color:"white",fontSize:"9px",fontWeight:"900"}}>{item.isUpcharge?`+${item.discountPercent}`:`-${item.discountPercent}`}</span>}</span>
                  <span style={{color:"#FFF0A0",fontWeight:"700",flexShrink:0}}>{item.originalAmount&&<span style={{color:"rgba(255,255,255,0.3)",textDecoration:"line-through",marginRight:"4px",fontSize:"10px"}}>${item.originalAmount.toFixed(2)}</span>}${item.amount.toFixed(2)}</span>
                </div>
              ))}
              {totalSavings>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"5px 0 0",borderTop:"1px solid rgba(46,125,79,0.4)",marginTop:"3px"}}>
                <span style={{color:"#3DA864",fontSize:"12px",fontWeight:"800"}}>✓ Total Savings</span>
                <span style={{color:"#3DA864",fontSize:"12px",fontWeight:"900"}}>-${totalSavings.toFixed(2)}</span>
              </div>}
            </div>
          )}
        </div>
      </div>

      {showWsModal && renderWsModal()}
      {showSuccess  && renderSuccess()}
    </div>
  );
}
