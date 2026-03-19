import React, { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

// ─── PRICING ──────────────────────────────────────────────────────────────────
const PRICING = {
  baseRatesTiered: {
    healthcare: [
      { max: 2000,    rate: 0.22 },
      { max: 3000,    rate: 0.20 },
      { max: 5000,    rate: 0.18 },
      { max: 10000,   rate: 0.16 },
      { max: 20000,   rate: 0.14 },
      { max: 50000,   rate: 0.12 },
      { max: Infinity,rate: 0.11 },
    ],
    retail: [
      { max: 2000,    rate: 0.13 },
      { max: 3000,    rate: 0.11 },
      { max: 5000,    rate: 0.10 },
      { max: 10000,   rate: 0.09 },
      { max: 20000,   rate: 0.08 },
      { max: 50000,   rate: 0.07 },
      { max: Infinity,rate: 0.06 },
    ],
    industrial: [
      { max: 5000,    rate: 0.09 },
      { max: 10000,   rate: 0.08 },
      { max: 20000,   rate: 0.07 },
      { max: 50000,   rate: 0.06 },
      { max: Infinity,rate: 0.05 },
    ],
  },
  frequencyMultipliers: {
    "monthly":   0.15,
    "bi-weekly": 0.28,
    "weekly":    0.50,
    "2x-week":   1.00,
    "3x-week":   1.42,
    "4x-week":   1.93,
    "daily":     2.39,
  },
  frequencyDiscounts: {
    "monthly":   -0.20,
    "bi-weekly": -0.12,
    "weekly":     0.00,
    "2x-week":    0.00,
    "3x-week":    0.05,
    "4x-week":    0.09,
    "daily":      0.13,
  },
  rooms: {
    // Healthcare
    examRoom:          40,
    waitingArea:       30,
    procedureRoom:     60,
    laboratory:        75,
    sterilizationRoom: 65,
    nurseStation:      35,
    consultRoom:       35,
    // Retail
    fittingRoom:       18,
    showroomDisplay:   30,
    stockroom:         25,
    customerRestroom:  35,
    posCheckout:       20,
    // Industrial
    loadingDock:       50,
    equipmentArea:     40,
    industrialBreakRoom: 30,
    industrialRestroom:  35,
    officeArea:        25,
  },
  addOns: {
    windowCleaning:   150,
    floorWaxing:      200,
    carpetCleaning:   0.35,
    pressureWashing:  0.25,
    postConstruction: 0.50,
    disinfection:     0.15,
  },
  minimums: { healthcare: 399, retail: 249, industrial: 199 },
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const PAGE_BG = {
  minHeight: "100vh",
  backgroundColor: "#0F171E",
  backgroundImage: `radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)`,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  padding: "20px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};
const CARD_BG = {
  backgroundColor: "#0F171E",
  backgroundImage: `radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)`,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  borderRadius: "32px", overflow: "hidden",
  boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
  border: "1px solid rgba(184,115,51,0.2)",
};

// ─── REUSABLE COUNTER ─────────────────────────────────────────────────────────
function Counter({ icon, label, price, value, onDec, onInc }) {
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(138,85,35,0.08) 0%, rgba(184,115,51,0.08) 100%)", border: "1px solid rgba(184,115,51,0.2)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#B87333", marginBottom: "2px" }}>{icon} {label}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>${price} each</div>
        </div>
        <div style={{ fontSize: "24px", fontWeight: "900", color: "white", minWidth: "40px", textAlign: "right" }}>{value}</div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onDec} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: value > 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)", color: value > 0 ? "#ef4444" : "rgba(255,255,255,0.3)", fontSize: "18px", fontWeight: "900", cursor: value > 0 ? "pointer" : "not-allowed" }}>−</button>
        <button onClick={onInc} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)", color: "white", fontSize: "18px", fontWeight: "900", cursor: "pointer" }}>+</button>
      </div>
    </div>
  );
}

// ─── FREQUENCY SELECTOR ───────────────────────────────────────────────────────
function FreqSelector({ value, onChange }) {
  const opts = [
    { value: "4x-week",   label: "4x Week",   sub: "9% OFF"  },
    { value: "3x-week",   label: "3x Week",   sub: "5% OFF"  },
    { value: "2x-week",   label: "2x Week",   sub: "BASE"    },
    { value: "weekly",    label: "Weekly",    sub: "BASE"    },
    { value: "bi-weekly", label: "Bi-Weekly", sub: "+12%"    },
    { value: "monthly",   label: "Monthly",   sub: "+20%"    },
  ];
  const card = (v) => ({
    padding: "14px 10px", borderRadius: "10px", cursor: "pointer",
    border: value === v ? "2px solid #5DEBF1" : "2px solid rgba(184,115,51,0.3)",
    background: value === v ? "linear-gradient(135deg, rgba(93,235,241,0.15) 0%, rgba(93,235,241,0.05) 100%)" : "rgba(255,255,255,0.03)",
    boxShadow: value === v ? "0 0 20px rgba(93,235,241,0.3)" : "none",
    transform: value === v ? "scale(1.02)" : "scale(1)",
    transition: "all 0.2s ease", textAlign: "center",
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
      {/* Daily — full width */}
      <div onClick={() => onChange("daily")} style={{ ...card("daily"), gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "15px", fontWeight: "800", color: value === "daily" ? "#5DEBF1" : "white", marginBottom: "3px" }}>Daily</div>
        <div style={{ fontSize: "11px", fontWeight: "600", color: value === "daily" ? "#5DEBF1" : "rgba(255,255,255,0.6)" }}>13% OFF</div>
      </div>
      {opts.map(o => (
        <div key={o.value} onClick={() => onChange(o.value)} style={card(o.value)}>
          <div style={{ fontSize: "14px", fontWeight: "800", color: value === o.value ? "#5DEBF1" : "white", marginBottom: "3px" }}>{o.label}</div>
          <div style={{ fontSize: "11px", fontWeight: "600", color: value === o.value ? "#5DEBF1" : "rgba(255,255,255,0.6)" }}>{o.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function OtherForm({ sharedInfo, onBack }) {
  const [step, setStep]               = useState(1); // 1 = type select, 2 = details, 3 = addons/schedule, 4 = review
  const [segment, setSegment]         = useState(""); // "healthcare" | "retail" | "industrial"
  const [subType, setSubType]         = useState("");
  const [squareFeet, setSquareFeet]   = useState("");
  const [frequency, setFrequency]     = useState("");

  // Healthcare counters
  const [examRooms,          setExamRooms]          = useState(0);
  const [waitingAreas,       setWaitingAreas]       = useState(0);
  const [procedureRooms,     setProcedureRooms]     = useState(0);
  const [laboratories,       setLaboratories]       = useState(0);
  const [sterilizationRooms, setSterilizationRooms] = useState(0);
  const [nurseStations,      setNurseStations]      = useState(0);
  const [consultRooms,       setConsultRooms]       = useState(0);

  // Retail counters
  const [fittingRooms,      setFittingRooms]      = useState(0);
  const [showroomDisplays,  setShowroomDisplays]  = useState(0);
  const [stockrooms,        setStockrooms]        = useState(0);
  const [customerRestrooms, setCustomerRestrooms] = useState(0);
  const [posCheckouts,      setPosCheckouts]      = useState(0);

  // Industrial counters
  const [loadingDocks,         setLoadingDocks]         = useState(0);
  const [equipmentAreas,       setEquipmentAreas]       = useState(0);
  const [industrialBreakRooms, setIndustrialBreakRooms] = useState(0);
  const [industrialRestrooms,  setIndustrialRestrooms]  = useState(0);
  const [officeAreas,          setOfficeAreas]          = useState(0);

  // Add-ons & schedule
  const [addOns, setAddOns] = useState({
    windowCleaning: false, floorWaxing: false, carpetCleaning: false,
    pressureWashing: false, postConstruction: false, disinfection: false,
  });
  const [preferredDays,       setPreferredDays]       = useState([]);
  const [preferredTime,       setPreferredTime]       = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showSuccessModal,    setShowSuccessModal]    = useState(false);

  // ── SUBTYPES ────────────────────────────────────────────────────────────────
  const SUBTYPES = {
    healthcare: [
      { value: "dental",     icon: "🦷", label: "Dental Office"     },
      { value: "medical",    icon: "🩺", label: "Medical Clinic"    },
      { value: "therapy",    icon: "💆", label: "Therapy / Rehab"   },
      { value: "urgent",     icon: "🚑", label: "Urgent Care"       },
      { value: "optometry",  icon: "👁️", label: "Optometry"         },
      { value: "veterinary", icon: "🐾", label: "Veterinary"        },
    ],
    retail: [
      { value: "clothing",  icon: "👗", label: "Clothing / Apparel" },
      { value: "grocery",   icon: "🛒", label: "Grocery / Market"   },
      { value: "boutique",  icon: "🏪", label: "Boutique / Specialty"},
      { value: "auto",      icon: "🚗", label: "Auto Dealership"    },
      { value: "furniture", icon: "🛋️", label: "Furniture / Home"   },
      { value: "other",     icon: "🏬", label: "Other Retail"       },
    ],
    industrial: [
      { value: "warehouse",      icon: "📦", label: "Warehouse"           },
      { value: "manufacturing",  icon: "🏭", label: "Manufacturing"       },
      { value: "distribution",   icon: "🚛", label: "Distribution Center" },
      { value: "auto_shop",      icon: "🔧", label: "Auto Shop / Garage"  },
      { value: "food_production",icon: "🍽️", label: "Food Production"     },
      { value: "other",          icon: "🏗️", label: "Other Industrial"    },
    ],
  };

  // ── PRICING HELPERS ─────────────────────────────────────────────────────────
  const getRate = (sqft) => {
    if (!segment || !sqft) return 0;
    const tiers = PRICING.baseRatesTiered[segment];
    const tier = tiers.find(t => sqft <= t.max);
    return tier ? tier.rate : tiers[tiers.length - 1].rate;
  };

  const calcRoomCharges = () => {
    if (segment === "healthcare") {
      return examRooms * PRICING.rooms.examRoom
        + waitingAreas       * PRICING.rooms.waitingArea
        + procedureRooms     * PRICING.rooms.procedureRoom
        + laboratories       * PRICING.rooms.laboratory
        + sterilizationRooms * PRICING.rooms.sterilizationRoom
        + nurseStations      * PRICING.rooms.nurseStation
        + consultRooms       * PRICING.rooms.consultRoom;
    }
    if (segment === "retail") {
      return fittingRooms      * PRICING.rooms.fittingRoom
        + showroomDisplays     * PRICING.rooms.showroomDisplay
        + stockrooms           * PRICING.rooms.stockroom
        + customerRestrooms    * PRICING.rooms.customerRestroom
        + posCheckouts         * PRICING.rooms.posCheckout;
    }
    if (segment === "industrial") {
      return loadingDocks         * PRICING.rooms.loadingDock
        + equipmentAreas          * PRICING.rooms.equipmentArea
        + industrialBreakRooms    * PRICING.rooms.industrialBreakRoom
        + industrialRestrooms     * PRICING.rooms.industrialRestroom
        + officeAreas             * PRICING.rooms.officeArea;
    }
    return 0;
  };

  const calcSubtotal = () => {
    const sqft = parseInt(squareFeet) || 0;
    if (!sqft || !frequency || !segment) return 0;
    const base = sqft * getRate(sqft) * (PRICING.frequencyMultipliers[frequency] || 1);
    const rooms = calcRoomCharges();
    const sqftN = sqft;
    let addOnTotal = 0;
    if (addOns.windowCleaning)   addOnTotal += PRICING.addOns.windowCleaning;
    if (addOns.floorWaxing)      addOnTotal += PRICING.addOns.floorWaxing;
    if (addOns.carpetCleaning)   addOnTotal += sqftN * PRICING.addOns.carpetCleaning;
    if (addOns.pressureWashing)  addOnTotal += sqftN * PRICING.addOns.pressureWashing;
    if (addOns.postConstruction) addOnTotal += sqftN * PRICING.addOns.postConstruction;
    if (addOns.disinfection)     addOnTotal += sqftN * PRICING.addOns.disinfection;
    const total = base + rooms + addOnTotal;
    const minimum = PRICING.minimums[segment] || 199;
    return Math.max(total, minimum);
  };

  const calcTotal = () => {
    const sub = calcSubtotal();
    const disc = PRICING.frequencyDiscounts[frequency] || 0;
    return disc >= 0 ? sub * (1 - disc) : sub * (1 + Math.abs(disc));
  };

  // ── SUBMIT ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const formData = new FormData();
    const { firstName, lastName, email, phone, businessName, streetAddress, suiteUnit, city, state, zipCode } = sharedInfo;
    formData.append("First Name",    firstName);
    formData.append("Last Name",     lastName);
    formData.append("Email",         email);
    formData.append("Phone",         phone);
    formData.append("Business Name", businessName || "Not provided");
    formData.append("Address",       streetAddress);
    if (suiteUnit) formData.append("Suite/Unit", suiteUnit);
    formData.append("City",          city);
    formData.append("State",         state);
    formData.append("ZIP",           zipCode);
    formData.append("Segment",       segment);
    formData.append("Business Type", subType || "Not specified");
    formData.append("Square Feet",   squareFeet);
    formData.append("Frequency",     frequency);

    if (segment === "healthcare") {
      formData.append("Exam Rooms",          examRooms);
      formData.append("Waiting Areas",       waitingAreas);
      formData.append("Procedure Rooms",     procedureRooms);
      formData.append("Laboratories",        laboratories);
      formData.append("Sterilization Rooms", sterilizationRooms);
      formData.append("Nurse Stations",      nurseStations);
      formData.append("Consult Rooms",       consultRooms);
    } else if (segment === "retail") {
      formData.append("Fitting Rooms",       fittingRooms);
      formData.append("Showrooms",           showroomDisplays);
      formData.append("Stockrooms",          stockrooms);
      formData.append("Customer Restrooms",  customerRestrooms);
      formData.append("POS/Checkout Areas",  posCheckouts);
    } else if (segment === "industrial") {
      formData.append("Loading Docks",       loadingDocks);
      formData.append("Equipment Areas",     equipmentAreas);
      formData.append("Break Rooms",         industrialBreakRooms);
      formData.append("Restrooms",           industrialRestrooms);
      formData.append("Office/Admin Areas",  officeAreas);
    }

    formData.append("Add-ons",             Object.keys(addOns).filter(k => addOns[k]).join(", ") || "None");
    formData.append("Preferred Days",      preferredDays.join(", ") || "Not specified");
    formData.append("Preferred Time",      preferredTime || "Not specified");
    formData.append("Special Instructions",specialInstructions || "None");
    formData.append("Est. Monthly Total",  `$${calcTotal().toFixed(2)}`);
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const res = await fetch("https://formsubmit.co/ajax/AkCleaningSuCasa@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = await res.json();
      if (result.success) setShowSuccessModal(true);
      else alert("There was an error submitting. Please try again or call us directly.");
    } catch {
      alert("There was an error submitting. Please try again or call us directly.");
    }
  };

  const resetAll = () => {
    setStep(1); setSegment(""); setSubType(""); setSquareFeet(""); setFrequency("");
    setExamRooms(0); setWaitingAreas(0); setProcedureRooms(0); setLaboratories(0);
    setSterilizationRooms(0); setNurseStations(0); setConsultRooms(0);
    setFittingRooms(0); setShowroomDisplays(0); setStockrooms(0);
    setCustomerRestrooms(0); setPosCheckouts(0);
    setLoadingDocks(0); setEquipmentAreas(0); setIndustrialBreakRooms(0);
    setIndustrialRestrooms(0); setOfficeAreas(0);
    setAddOns({ windowCleaning: false, floorWaxing: false, carpetCleaning: false, pressureWashing: false, postConstruction: false, disinfection: false });
    setPreferredDays([]); setPreferredTime(""); setSpecialInstructions("");
    setShowSuccessModal(false);
    onBack();
  };

  const scroll = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goNext = () => { scroll(); setTimeout(() => setStep(s => s + 1), 100); };
  const goBack = () => {
    if (step === 1) { onBack(); return; }
    scroll(); setTimeout(() => setStep(s => s - 1), 100);
  };

  const step2Valid = squareFeet && frequency;
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  // ── SEGMENT ICON ────────────────────────────────────────────────────────────
  const segmentMeta = {
    healthcare: { icon: "🏥", label: "Healthcare",  color: "#5DEBF1" },
    retail:     { icon: "🛍️", label: "Retail",      color: "#D4955A" },
    industrial: { icon: "🏭", label: "Industrial",  color: "#B87333" },
  };

  return (
    <div style={PAGE_BG}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .hero-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .hero-orb-1 { width:400px; height:400px; background:rgba(46,58,71,0.6); top:-100px; left:-100px; }
        .hero-orb-2 { width:300px; height:300px; background:rgba(61,79,92,0.5); bottom:-80px; right:-80px; }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.4); }
      `}</style>

      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
        <div className="hero-orb hero-orb-1"/><div className="hero-orb hero-orb-2"/>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"30px 20px", display:"grid", gridTemplateColumns:"1fr 420px", gap:"30px", alignItems:"start", position:"relative", zIndex:1 }}>
        <div style={CARD_BG}>

          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <div style={{ backgroundColor:"rgba(15,23,30,0.4)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(184,115,51,0.2)", padding:"30px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:"radial-gradient(circle at 50% 50%, rgba(212,149,90,0.2) 0%, transparent 70%)", pointerEvents:"none" }}/>
            <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
              <div style={{ fontFamily:"'Oswald', sans-serif", fontSize:"52px", fontWeight:"300", letterSpacing:"8px", lineHeight:"1", color:"white" }}>CLEANING</div>
              <div style={{ fontFamily:"'Allura', cursive", fontSize:"56px", color:"#B87333", letterSpacing:"3px", marginTop:"-8px", lineHeight:"1" }}>Su Oficina</div>
              {segment && (
                <div style={{ marginTop:"8px", padding:"6px 18px", borderRadius:"20px", background:"rgba(184,115,51,0.15)", border:"1px solid rgba(184,115,51,0.3)", fontSize:"13px", fontWeight:"700", color:"#D4955A", letterSpacing:"1px", textTransform:"uppercase" }}>
                  {segmentMeta[segment]?.icon} {segmentMeta[segment]?.label} Cleaning Quote
                </div>
              )}
            </div>
          </div>

          {/* ── PROGRESS BAR ────────────────────────────────────────────────── */}
          <div style={{ height:"6px", background:"rgba(255,255,255,0.1)" }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg, #8a5523 0%, #B87333 50%, #D4955A 100%)", width:`${(step/4)*100}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 0 15px rgba(184,115,51,0.6)" }}/>
          </div>

          <div style={{ padding:"50px 40px" }}>

            {/* ════════════════════════════════════════════════════════════════
                STEP 1 — Segment + Sub-type
            ════════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="fade-in-up">
                <div style={{ textAlign:"center", marginBottom:"40px" }}>
                  <div style={{ width:"90px", height:"90px", background:"linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 20px 50px rgba(184,115,51,0.4)", border:"4px solid rgba(255,255,255,0.2)", fontSize:"44px" }}>
                    {segment ? segmentMeta[segment].icon : "🏢"}
                  </div>
                  <h2 style={{ fontSize:"28px", fontWeight:"900", color:"white", margin:"0 0 10px", letterSpacing:"-0.5px", textTransform:"uppercase" }}>What kind of business?</h2>
                  <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", fontWeight:"500" }}>Select your industry, then your specific type</p>
                </div>

                {/* Segment picker */}
                <div style={{ marginBottom:"30px" }}>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>Industry *</label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
                    {[
                      { value:"healthcare", icon:"🏥", label:"Healthcare" },
                      { value:"retail",     icon:"🛍️", label:"Retail"     },
                      { value:"industrial", icon:"🏭", label:"Industrial" },
                    ].map(s => (
                      <div key={s.value} onClick={() => { setSegment(s.value); setSubType(""); }} style={{ padding:"20px 12px", borderRadius:"16px", border: segment === s.value ? "2px solid #5DEBF1" : "2px solid rgba(184,115,51,0.3)", background: segment === s.value ? "linear-gradient(135deg, rgba(93,235,241,0.15) 0%, rgba(93,235,241,0.05) 100%)" : "rgba(255,255,255,0.03)", cursor:"pointer", textAlign:"center", transition:"all 0.2s ease", boxShadow: segment === s.value ? "0 0 20px rgba(93,235,241,0.3)" : "none" }}>
                        <div style={{ fontSize:"30px", marginBottom:"8px" }}>{s.icon}</div>
                        <div style={{ fontSize:"13px", fontWeight:"800", color: segment === s.value ? "#5DEBF1" : "#B87333" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-type picker */}
                {segment && (
                  <div style={{ marginBottom:"35px" }}>
                    <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>Business Type <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:"600", textTransform:"none" }}>(optional)</span></label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
                      {SUBTYPES[segment].map(t => (
                        <div key={t.value} onClick={() => setSubType(t.value)} style={{ padding:"14px 16px", borderRadius:"12px", border: subType === t.value ? "2px solid #D4955A" : "1px solid rgba(184,115,51,0.25)", background: subType === t.value ? "rgba(212,149,90,0.12)" : "rgba(255,255,255,0.02)", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", transition:"all 0.2s ease" }}>
                          <span style={{ fontSize:"20px" }}>{t.icon}</span>
                          <span style={{ fontSize:"13px", fontWeight:"700", color: subType === t.value ? "#D4955A" : "rgba(255,255,255,0.85)" }}>{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display:"flex", gap:"15px" }}>
                  <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!segment} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background: segment ? "linear-gradient(135deg, #D4955A 0%, #D4955A 100%)" : "rgba(255,255,255,0.1)", color:"white", fontSize:"15px", fontWeight:"800", cursor: segment ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 2 — Square Footage, Frequency, Room Counters
            ════════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="fade-in-up">

                {/* Square Footage */}
                <div style={{ marginBottom:"28px", background:"linear-gradient(135deg, rgba(184,115,51,0.08) 0%, rgba(143,170,184,0.08) 100%)", borderRadius:"16px", padding:"20px", border:"1px solid rgba(184,115,51,0.2)" }}>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>📐 Total Square Footage *</label>
                  <input
                    type="number" placeholder="e.g. 3500"
                    value={squareFeet} onChange={e => setSquareFeet(e.target.value)}
                    style={{ width:"100%", padding:"16px 20px", borderRadius:"12px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"600", outline:"none", boxSizing:"border-box" }}
                  />
                </div>

                {/* Frequency */}
                <div style={{ marginBottom:"28px", background:"linear-gradient(135deg, rgba(184,115,51,0.08) 0%, rgba(143,170,184,0.08) 100%)", borderRadius:"16px", padding:"20px", border:"1px solid rgba(184,115,51,0.2)" }}>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>📅 Cleaning Frequency *</label>
                  <FreqSelector value={frequency} onChange={setFrequency} />
                  {squareFeet && frequency && (
                    <div style={{ marginTop:"14px", padding:"14px 18px", borderRadius:"12px", background:"linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.12) 100%)", border:"2px solid rgba(16,185,129,0.25)" }}>
                      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:"700", marginBottom:"4px", letterSpacing:"0.5px" }}>EST. MONTHLY BASE</div>
                      <div style={{ fontSize:"26px", fontWeight:"900", color:"#10b981" }}>${calcSubtotal().toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Room counters — Healthcare */}
                {segment === "healthcare" && (
                  <div style={{ marginBottom:"28px" }}>
                    <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>🏥 Healthcare Rooms</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
                      <Counter icon="🩺" label="Exam Rooms"        price={40} value={examRooms}          onDec={()=>setExamRooms(Math.max(0,examRooms-1))}                   onInc={()=>setExamRooms(examRooms+1)} />
                      <Counter icon="🪑" label="Waiting Areas"     price={30} value={waitingAreas}       onDec={()=>setWaitingAreas(Math.max(0,waitingAreas-1))}             onInc={()=>setWaitingAreas(waitingAreas+1)} />
                      <Counter icon="⚕️" label="Procedure Rooms"   price={60} value={procedureRooms}     onDec={()=>setProcedureRooms(Math.max(0,procedureRooms-1))}         onInc={()=>setProcedureRooms(procedureRooms+1)} />
                      <Counter icon="🔬" label="Laboratories"      price={75} value={laboratories}       onDec={()=>setLaboratories(Math.max(0,laboratories-1))}             onInc={()=>setLaboratories(laboratories+1)} />
                      <Counter icon="🧼" label="Sterilization"     price={65} value={sterilizationRooms} onDec={()=>setSterilizationRooms(Math.max(0,sterilizationRooms-1))} onInc={()=>setSterilizationRooms(sterilizationRooms+1)} />
                      <Counter icon="👩‍⚕️" label="Nurse Stations"   price={35} value={nurseStations}      onDec={()=>setNurseStations(Math.max(0,nurseStations-1))}           onInc={()=>setNurseStations(nurseStations+1)} />
                      <Counter icon="💬" label="Consult Rooms"     price={35} value={consultRooms}       onDec={()=>setConsultRooms(Math.max(0,consultRooms-1))}             onInc={()=>setConsultRooms(consultRooms+1)} />
                    </div>
                  </div>
                )}

                {/* Room counters — Retail */}
                {segment === "retail" && (
                  <div style={{ marginBottom:"28px" }}>
                    <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>🛍️ Retail Areas</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
                      <Counter icon="👗" label="Fitting Rooms"      price={18} value={fittingRooms}      onDec={()=>setFittingRooms(Math.max(0,fittingRooms-1))}           onInc={()=>setFittingRooms(fittingRooms+1)} />
                      <Counter icon="🛍️" label="Showrooms"          price={30} value={showroomDisplays}  onDec={()=>setShowroomDisplays(Math.max(0,showroomDisplays-1))}   onInc={()=>setShowroomDisplays(showroomDisplays+1)} />
                      <Counter icon="📦" label="Stockrooms"         price={25} value={stockrooms}        onDec={()=>setStockrooms(Math.max(0,stockrooms-1))}               onInc={()=>setStockrooms(stockrooms+1)} />
                      <Counter icon="🚻" label="Customer Restrooms" price={35} value={customerRestrooms} onDec={()=>setCustomerRestrooms(Math.max(0,customerRestrooms-1))} onInc={()=>setCustomerRestrooms(customerRestrooms+1)} />
                      <Counter icon="🖥️" label="POS / Checkout"     price={20} value={posCheckouts}      onDec={()=>setPosCheckouts(Math.max(0,posCheckouts-1))}           onInc={()=>setPosCheckouts(posCheckouts+1)} />
                    </div>
                  </div>
                )}

                {/* Room counters — Industrial */}
                {segment === "industrial" && (
                  <div style={{ marginBottom:"28px" }}>
                    <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>🏭 Industrial Areas</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
                      <Counter icon="🚢" label="Loading Docks"   price={50} value={loadingDocks}         onDec={()=>setLoadingDocks(Math.max(0,loadingDocks-1))}               onInc={()=>setLoadingDocks(loadingDocks+1)} />
                      <Counter icon="⚙️" label="Equipment Areas" price={40} value={equipmentAreas}       onDec={()=>setEquipmentAreas(Math.max(0,equipmentAreas-1))}           onInc={()=>setEquipmentAreas(equipmentAreas+1)} />
                      <Counter icon="☕" label="Break Rooms"      price={30} value={industrialBreakRooms} onDec={()=>setIndustrialBreakRooms(Math.max(0,industrialBreakRooms-1))} onInc={()=>setIndustrialBreakRooms(industrialBreakRooms+1)} />
                      <Counter icon="🚻" label="Restrooms"        price={35} value={industrialRestrooms}  onDec={()=>setIndustrialRestrooms(Math.max(0,industrialRestrooms-1))}   onInc={()=>setIndustrialRestrooms(industrialRestrooms+1)} />
                      <Counter icon="📋" label="Office / Admin"   price={25} value={officeAreas}          onDec={()=>setOfficeAreas(Math.max(0,officeAreas-1))}                 onInc={()=>setOfficeAreas(officeAreas+1)} />
                    </div>
                  </div>
                )}

                <div style={{ display:"flex", gap:"15px" }}>
                  <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!step2Valid} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background: step2Valid ? "linear-gradient(135deg, #D4955A 0%, #D4955A 100%)" : "rgba(255,255,255,0.1)", color:"white", fontSize:"15px", fontWeight:"800", cursor: step2Valid ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 3 — Add-ons & Schedule
            ════════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="fade-in-up">

                {/* Add-on Services */}
                <div style={{ marginBottom:"30px" }}>
                  <label style={{ fontSize:"13px", fontWeight:"800", color:"#B87333", marginBottom:"15px", display:"block", letterSpacing:"1px", textTransform:"uppercase" }}>✨ Optional Add-on Services</label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
                    {[
                      { key:"windowCleaning",   icon:"🪟", label:"Window Cleaning",    price:"$150/visit"  },
                      { key:"floorWaxing",      icon:"✨", label:"Floor Waxing",        price:"$200/visit"  },
                      { key:"carpetCleaning",   icon:"🧹", label:"Carpet Cleaning",     price:"$0.35/sqft"  },
                      { key:"pressureWashing",  icon:"💦", label:"Pressure Washing",    price:"$0.25/sqft"  },
                      { key:"postConstruction", icon:"🏗️", label:"Post-Construction",   price:"$0.50/sqft"  },
                      { key:"disinfection",     icon:"🦠", label:"Electrostatic Disinfection", price:"$0.15/sqft" },
                    ].map(a => (
                      <div key={a.key} onClick={() => setAddOns(p => ({ ...p, [a.key]: !p[a.key] }))} style={{ padding:"14px", borderRadius:"12px", border: addOns[a.key] ? "2px solid #5DEBF1" : "1px solid rgba(184,115,51,0.25)", background: addOns[a.key] ? "rgba(93,235,241,0.1)" : "rgba(255,255,255,0.02)", cursor:"pointer", transition:"all 0.2s ease" }}>
                        <div style={{ fontSize:"20px", marginBottom:"6px" }}>{a.icon}</div>
                        <div style={{ fontSize:"13px", fontWeight:"700", color: addOns[a.key] ? "#5DEBF1" : "white", marginBottom:"3px" }}>{a.label}</div>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:"600" }}>{a.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Days */}
                <div style={{ marginBottom:"25px" }}>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>📆 Preferred Service Days</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                    {DAYS.map(d => (
                      <button key={d} onClick={() => setPreferredDays(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev,d])} style={{ padding:"10px 16px", borderRadius:"20px", border: preferredDays.includes(d) ? "2px solid #5DEBF1" : "1px solid rgba(184,115,51,0.3)", background: preferredDays.includes(d) ? "rgba(93,235,241,0.12)" : "rgba(255,255,255,0.03)", color: preferredDays.includes(d) ? "#5DEBF1" : "rgba(255,255,255,0.8)", fontSize:"13px", fontWeight:"700", cursor:"pointer", transition:"all 0.2s ease" }}>{d}</button>
                    ))}
                  </div>
                </div>

                {/* Preferred Time */}
                <div style={{ marginBottom:"25px" }}>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>🕐 Preferred Time</label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
                    {["Early Morning (6-9am)","Morning (9am-12pm)","Afternoon (12-5pm)","Evening (5-8pm)","After Hours (8pm+)","Flexible"].map(t => (
                      <div key={t} onClick={() => setPreferredTime(t)} style={{ padding:"12px 8px", borderRadius:"10px", border: preferredTime===t ? "2px solid #5DEBF1" : "1px solid rgba(184,115,51,0.3)", background: preferredTime===t ? "rgba(93,235,241,0.12)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center", transition:"all 0.2s ease" }}>
                        <div style={{ fontSize:"11px", fontWeight:"700", color: preferredTime===t ? "#5DEBF1" : "rgba(255,255,255,0.8)" }}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom:"30px" }}>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:"#B87333", marginBottom:"12px", display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>📝 Special Instructions <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:"600", textTransform:"none", fontSize:"11px" }}>(optional)</span></label>
                  <textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} rows={3} placeholder="Security codes, access instructions, areas to avoid, special requirements..." style={{ width:"100%", padding:"16px 20px", borderRadius:"14px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"14px", fontWeight:"600", outline:"none", resize:"vertical", boxSizing:"border-box" }}/>
                </div>

                <div style={{ display:"flex", gap:"15px" }}>
                  <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background:"linear-gradient(135deg, #D4955A 0%, #D4955A 100%)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>Review Quote <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 4 — Review & Submit
            ════════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="fade-in-up">
                <div style={{ textAlign:"center", marginBottom:"35px" }}>
                  <h2 style={{ fontSize:"28px", fontWeight:"900", color:"white", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"-0.5px" }}>Review Your Quote</h2>
                  <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"14px", fontWeight:"500" }}>Confirm your details before submitting</p>
                </div>

                {/* Summary card */}
                <div style={{ background:"linear-gradient(135deg, rgba(184,115,51,0.1) 0%, rgba(143,170,184,0.1) 100%)", border:"1px solid rgba(184,115,51,0.25)", borderRadius:"20px", padding:"28px", marginBottom:"28px" }}>
                  {/* Contact */}
                  <div style={{ marginBottom:"20px", paddingBottom:"20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#B87333", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"10px" }}>Contact</div>
                    <div style={{ fontSize:"15px", fontWeight:"700", color:"white" }}>{sharedInfo.firstName} {sharedInfo.lastName}</div>
                    <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.65)", marginTop:"3px" }}>{sharedInfo.email} · {sharedInfo.phone}</div>
                    {sharedInfo.businessName && <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.65)", marginTop:"2px" }}>{sharedInfo.businessName}</div>}
                  </div>
                  {/* Address */}
                  <div style={{ marginBottom:"20px", paddingBottom:"20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#B87333", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"10px" }}>Service Address</div>
                    <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.85)", fontWeight:"600" }}>
                      {sharedInfo.streetAddress}{sharedInfo.suiteUnit ? `, ${sharedInfo.suiteUnit}` : ""}<br/>
                      {sharedInfo.city}, {sharedInfo.state} {sharedInfo.zipCode}
                    </div>
                  </div>
                  {/* Service details */}
                  <div style={{ marginBottom:"20px", paddingBottom:"20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#B87333", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"10px" }}>Service Details</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                      {[
                        ["Industry",    `${segmentMeta[segment]?.icon} ${segmentMeta[segment]?.label}`],
                        ["Type",        subType || "Not specified"],
                        ["Square Feet", `${parseInt(squareFeet).toLocaleString()} sqft`],
                        ["Frequency",   frequency],
                      ].map(([k,v]) => (
                        <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:"10px", padding:"12px" }}>
                          <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.5)", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"4px" }}>{k}</div>
                          <div style={{ fontSize:"13px", color:"white", fontWeight:"700", textTransform:"capitalize" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Price */}
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:"700", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" }}>Estimated Monthly Total</div>
                    <div style={{ fontSize:"42px", fontWeight:"900", color:"#D4955A", lineHeight:"1" }}>${calcTotal().toFixed(2)}</div>
                    <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", marginTop:"6px" }}>Final price confirmed after on-site assessment</div>
                  </div>
                </div>

                <div style={{ display:"flex", gap:"15px" }}>
                  <button onClick={goBack} style={{ flex:1, padding:"18px", borderRadius:"16px", border:"2px solid rgba(184,115,51,0.3)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}><ChevronLeft size={20}/> Back</button>
                  <button onClick={handleSubmit} style={{ flex:2, padding:"18px", borderRadius:"16px", border:"none", background:"linear-gradient(135deg, #B87333 0%, #D4955A 100%)", color:"white", fontSize:"15px", fontWeight:"800", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", boxShadow:"0 8px 24px rgba(184,115,51,0.4)" }}>Submit Request <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── SUCCESS MODAL ───────────────────────────────────────────────────── */}
      {showSuccessModal && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"20px" }}>
          <div style={{ background:"linear-gradient(135deg,#2E3A47 0%,#3D4F5C 100%)", borderRadius:"32px", padding:"50px 40px", maxWidth:"500px", width:"100%", textAlign:"center", border:"1px solid rgba(184,115,51,0.3)", boxShadow:"0 30px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#B87333 0%,#D4955A 100%)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 30px" }}>
              <CheckCircle2 size={48} color="white"/>
            </div>
            <h2 style={{ fontSize:"32px", fontWeight:"900", color:"white", marginBottom:"15px" }}>Request Submitted!</h2>
            <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.9)", fontWeight:"600", lineHeight:"1.6", marginBottom:"30px" }}>Thank you for choosing Cleaning Su Oficina! Our team will review your request and contact you within 24 hours.</p>
            <button onClick={resetAll} style={{ padding:"18px 40px", borderRadius:"16px", border:"none", background:"linear-gradient(135deg,#B87333 0%,#D4955A 100%)", color:"white", fontSize:"16px", fontWeight:"800", cursor:"pointer", textTransform:"uppercase" }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
