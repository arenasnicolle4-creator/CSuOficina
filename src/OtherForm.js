import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

// ─── PRICING (healthcare/retail/industrial-specific — do not change) ───────────
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
    examRoom: 40, waitingArea: 30, procedureRoom: 60,
    laboratory: 75, sterilizationRoom: 65, nurseStation: 35, consultRoom: 35,
    fittingRoom: 18, showroomDisplay: 30, stockroom: 25, customerRestroom: 35, posCheckout: 20,
    loadingDock: 50, equipmentArea: 40, industrialBreakRoom: 30, industrialRestroom: 35, officeArea: 25,
  },
  addOns: {
    windowCleaning: 150, floorWaxing: 200, carpetCleaning: 0.35,
    pressureWashing: 0.25, postConstruction: 0.50, disinfection: 0.15,
  },
  minimums: { healthcare: 399, retail: 249, industrial: 199 },
};

// ─── SHARED STYLES (matching OfficeForm light/gold theme) ─────────────────────
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

// ─── Counter (light theme) ────────────────────────────────────────────────────
function Counter({ icon, label, price, value, onDec, onInc }) {
  return (
    <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,245,240,0.95))",border:"1px solid rgba(212,160,23,0.2)",borderRadius:"16px",padding:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:"14px",fontWeight:"800",color:"#4A3728",marginBottom:"2px"}}>{icon} {label}</div>
          <div style={{fontSize:"13px",color:"#A07B15",fontWeight:"700",marginTop:"3px"}}>${price} each</div>
        </div>
        <div style={{fontSize:"24px",fontWeight:"900",color:"#4A3728",minWidth:"40px",textAlign:"right"}}>{value}</div>
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <button onClick={onDec} style={{flex:1,padding:"10px",borderRadius:"10px",border:"none",background:value>0?"rgba(239,68,68,0.12)":"rgba(230,230,230,0.6)",color:value>0?"#ef4444":"rgba(200,200,200,0.8)",fontSize:"18px",fontWeight:"900",cursor:value>0?"pointer":"not-allowed"}}>−</button>
        <div style={{flex:1,position:"relative",overflow:"hidden",borderRadius:"10px"}}>
          <button onClick={onInc} style={{width:"100%",padding:"10px",borderRadius:"10px",border:"1.5px solid rgba(212,160,23,0.5)",background:"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)",color:"#F5E8C0",fontSize:"18px",fontWeight:"900",cursor:"pointer",position:"relative",zIndex:1,boxShadow:"0 2px 8px rgba(180,160,120,0.2)"}}>+</button>
          <svg style={{position:"absolute",bottom:"-34px",left:"-34px",width:"80px",height:"80px",pointerEvents:"none",zIndex:2}} viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="37" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
            <circle cx="40" cy="40" r="27" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
          </svg>
          <div style={{position:"absolute",width:"5px",height:"5px",borderRadius:"50%",background:"rgba(255,220,80,0.85)",bottom:"8px",left:"24px",zIndex:2,pointerEvents:"none",boxShadow:"0 0 6px rgba(255,220,80,0.6)"}}/>
          <div style={{position:"absolute",width:"3px",height:"3px",borderRadius:"50%",background:"rgba(240,192,64,0.8)",top:"6px",right:"10px",zIndex:2,pointerEvents:"none",boxShadow:"0 0 4px rgba(240,192,64,0.6)"}}/>
          <div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"rgba(255,220,80,0.85)",top:"45%",right:"14px",zIndex:2,pointerEvents:"none",boxShadow:"0 0 6px rgba(255,220,80,0.6)"}}/>
        </div>
      </div>
    </div>
  );
}

// ─── FreqSelector (light theme) ───────────────────────────────────────────────
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
    border: value === v ? "2px solid #0891B2" : "2px solid rgba(212,160,23,0.2)",
    background: value === v ? "linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))" : "rgba(255,255,255,0.7)",
    boxShadow: value === v ? "0 0 18px rgba(6,182,212,0.35)" : "0 2px 6px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease", textAlign: "center",
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }} className="of2-freq-grid">
      <div onClick={() => onChange("daily")} style={{ ...card("daily"), gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "15px", fontWeight: "800", color: value === "daily" ? "#0891B2" : "#4A3728", marginBottom: "3px" }}>Daily</div>
        <div style={{ fontSize: "11px", fontWeight: "600", color: value === "daily" ? "#0891B2" : "#888" }}>13% OFF</div>
      </div>
      {opts.map(o => (
        <div key={o.value} onClick={() => onChange(o.value)} style={card(o.value)}>
          <div style={{ fontSize: "14px", fontWeight: "800", color: value === o.value ? "#0891B2" : "#4A3728", marginBottom: "3px" }}>{o.label}</div>
          <div style={{ fontSize: "11px", fontWeight: "600", color: value === o.value ? "#0891B2" : "#888" }}>{o.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function OtherForm({ sharedInfo, onBack }) {
  const [step, setStep]             = useState(1);

  const mobileBarRef = useRef(null);
  const [mobileBarHeight, setMobileBarHeight] = useState(0);
  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMobileBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [segment, setSegment]       = useState("");
  const [subType, setSubType]       = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [frequency, setFrequency]   = useState("");

  const [examRooms,          setExamRooms]          = useState(0);
  const [waitingAreas,       setWaitingAreas]       = useState(0);
  const [procedureRooms,     setProcedureRooms]     = useState(0);
  const [laboratories,       setLaboratories]       = useState(0);
  const [sterilizationRooms, setSterilizationRooms] = useState(0);
  const [nurseStations,      setNurseStations]      = useState(0);
  const [consultRooms,       setConsultRooms]       = useState(0);

  const [fittingRooms,      setFittingRooms]      = useState(0);
  const [showroomDisplays,  setShowroomDisplays]  = useState(0);
  const [stockrooms,        setStockrooms]        = useState(0);
  const [customerRestrooms, setCustomerRestrooms] = useState(0);
  const [posCheckouts,      setPosCheckouts]      = useState(0);

  const [loadingDocks,         setLoadingDocks]         = useState(0);
  const [equipmentAreas,       setEquipmentAreas]       = useState(0);
  const [industrialBreakRooms, setIndustrialBreakRooms] = useState(0);
  const [industrialRestrooms,  setIndustrialRestrooms]  = useState(0);
  const [officeAreas,          setOfficeAreas]          = useState(0);

  const [addOns, setAddOns] = useState({ windowCleaning:false,floorWaxing:false,carpetCleaning:false,pressureWashing:false,postConstruction:false,disinfection:false });
  const [preferredDays,       setPreferredDays]       = useState([]);
  const [preferredTime,       setPreferredTime]       = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showSuccessModal,    setShowSuccessModal]    = useState(false);

  // ── Sub-types (unchanged) ──────────────────────────────────────────────────
  const SUBTYPES = {
    healthcare: [
      { value:"dental",icon:"🦷",label:"Dental Office" },{ value:"medical",icon:"🩺",label:"Medical Clinic" },
      { value:"therapy",icon:"💆",label:"Therapy / Rehab" },{ value:"urgent",icon:"🚑",label:"Urgent Care" },
      { value:"optometry",icon:"👁️",label:"Optometry" },{ value:"veterinary",icon:"🐾",label:"Veterinary" },
    ],
    retail: [
      { value:"clothing",icon:"👗",label:"Clothing / Apparel" },{ value:"grocery",icon:"🛒",label:"Grocery / Market" },
      { value:"boutique",icon:"🏪",label:"Boutique / Specialty" },{ value:"auto",icon:"🚗",label:"Auto Dealership" },
      { value:"furniture",icon:"🛋️",label:"Furniture / Home" },{ value:"other",icon:"🏬",label:"Other Retail" },
    ],
    industrial: [
      { value:"warehouse",icon:"📦",label:"Warehouse" },{ value:"manufacturing",icon:"🏭",label:"Manufacturing" },
      { value:"distribution",icon:"🚛",label:"Distribution Center" },{ value:"auto_shop",icon:"🔧",label:"Auto Shop / Garage" },
      { value:"food_production",icon:"🍽️",label:"Food Production" },{ value:"other",icon:"🏗️",label:"Other Industrial" },
    ],
  };

  const segmentMeta = {
    healthcare: { icon:"🏥", label:"Healthcare" },
    retail:     { icon:"🛍️", label:"Retail"     },
    industrial: { icon:"🏭", label:"Industrial"  },
  };

  // ── Pricing helpers (unchanged) ───────────────────────────────────────────
  const getRate = (sqft) => {
    if (!segment || !sqft) return 0;
    const tiers = PRICING.baseRatesTiered[segment];
    const tier = tiers.find(t => sqft <= t.max);
    return tier ? tier.rate : tiers[tiers.length - 1].rate;
  };

  const calcRoomCharges = () => {
    if (segment === "healthcare") return examRooms*PRICING.rooms.examRoom+waitingAreas*PRICING.rooms.waitingArea+procedureRooms*PRICING.rooms.procedureRoom+laboratories*PRICING.rooms.laboratory+sterilizationRooms*PRICING.rooms.sterilizationRoom+nurseStations*PRICING.rooms.nurseStation+consultRooms*PRICING.rooms.consultRoom;
    if (segment === "retail")     return fittingRooms*PRICING.rooms.fittingRoom+showroomDisplays*PRICING.rooms.showroomDisplay+stockrooms*PRICING.rooms.stockroom+customerRestrooms*PRICING.rooms.customerRestroom+posCheckouts*PRICING.rooms.posCheckout;
    if (segment === "industrial") return loadingDocks*PRICING.rooms.loadingDock+equipmentAreas*PRICING.rooms.equipmentArea+industrialBreakRooms*PRICING.rooms.industrialBreakRoom+industrialRestrooms*PRICING.rooms.industrialRestroom+officeAreas*PRICING.rooms.officeArea;
    return 0;
  };

  const calcSubtotal = () => {
    const sqft = parseInt(squareFeet) || 0;
    if (!sqft || !frequency || !segment) return 0;
    const base = sqft * getRate(sqft) * (PRICING.frequencyMultipliers[frequency] || 1);
    let addOnTotal = 0;
    if (addOns.windowCleaning)   addOnTotal += PRICING.addOns.windowCleaning;
    if (addOns.floorWaxing)      addOnTotal += PRICING.addOns.floorWaxing;
    if (addOns.carpetCleaning)   addOnTotal += sqft * PRICING.addOns.carpetCleaning;
    if (addOns.pressureWashing)  addOnTotal += sqft * PRICING.addOns.pressureWashing;
    if (addOns.postConstruction) addOnTotal += sqft * PRICING.addOns.postConstruction;
    if (addOns.disinfection)     addOnTotal += sqft * PRICING.addOns.disinfection;
    return Math.max(base + calcRoomCharges() + addOnTotal, PRICING.minimums[segment] || 199);
  };

  const calcTotal = () => {
    const sub = calcSubtotal();
    const disc = PRICING.frequencyDiscounts[frequency] || 0;
    return disc >= 0 ? sub * (1 - disc) : sub * (1 + Math.abs(disc));
  };

  const getPriceBreakdown = () => {
    const bd = []; const sqft = parseInt(squareFeet) || 0;
    if (!sqft || !frequency || !segment) return bd;
    bd.push({ label:`Base Cleaning (${sqft.toLocaleString()} sqft)`, amount: sqft * getRate(sqft) * (PRICING.frequencyMultipliers[frequency] || 1) });
    if (segment === "healthcare") {
      if (examRooms > 0)          bd.push({ label:"Exam Rooms",          amount:examRooms*PRICING.rooms.examRoom });
      if (waitingAreas > 0)       bd.push({ label:"Waiting Areas",       amount:waitingAreas*PRICING.rooms.waitingArea });
      if (procedureRooms > 0)     bd.push({ label:"Procedure Rooms",     amount:procedureRooms*PRICING.rooms.procedureRoom });
      if (laboratories > 0)       bd.push({ label:"Laboratories",        amount:laboratories*PRICING.rooms.laboratory });
      if (sterilizationRooms > 0) bd.push({ label:"Sterilization Rooms", amount:sterilizationRooms*PRICING.rooms.sterilizationRoom });
      if (nurseStations > 0)      bd.push({ label:"Nurse Stations",      amount:nurseStations*PRICING.rooms.nurseStation });
      if (consultRooms > 0)       bd.push({ label:"Consultation Rooms",  amount:consultRooms*PRICING.rooms.consultRoom });
    }
    if (segment === "retail") {
      if (fittingRooms > 0)      bd.push({ label:"Fitting Rooms",      amount:fittingRooms*PRICING.rooms.fittingRoom });
      if (showroomDisplays > 0)  bd.push({ label:"Showroom Displays",  amount:showroomDisplays*PRICING.rooms.showroomDisplay });
      if (stockrooms > 0)        bd.push({ label:"Stockrooms",         amount:stockrooms*PRICING.rooms.stockroom });
      if (customerRestrooms > 0) bd.push({ label:"Customer Restrooms", amount:customerRestrooms*PRICING.rooms.customerRestroom });
      if (posCheckouts > 0)      bd.push({ label:"POS/Checkout Areas", amount:posCheckouts*PRICING.rooms.posCheckout });
    }
    if (segment === "industrial") {
      if (loadingDocks > 0)         bd.push({ label:"Loading Docks",   amount:loadingDocks*PRICING.rooms.loadingDock });
      if (equipmentAreas > 0)       bd.push({ label:"Equipment Areas", amount:equipmentAreas*PRICING.rooms.equipmentArea });
      if (industrialBreakRooms > 0) bd.push({ label:"Break Rooms",     amount:industrialBreakRooms*PRICING.rooms.industrialBreakRoom });
      if (industrialRestrooms > 0)  bd.push({ label:"Restrooms",       amount:industrialRestrooms*PRICING.rooms.industrialRestroom });
      if (officeAreas > 0)          bd.push({ label:"Office Areas",    amount:officeAreas*PRICING.rooms.officeArea });
    }
    if (addOns.windowCleaning)   bd.push({ label:"Window Cleaning",           amount:PRICING.addOns.windowCleaning });
    if (addOns.floorWaxing)      bd.push({ label:"Floor Waxing/Buffing",       amount:PRICING.addOns.floorWaxing });
    if (addOns.carpetCleaning)   bd.push({ label:"Carpet Deep Clean",          amount:sqft*PRICING.addOns.carpetCleaning });
    if (addOns.pressureWashing)  bd.push({ label:"Pressure Washing",           amount:sqft*PRICING.addOns.pressureWashing });
    if (addOns.postConstruction) bd.push({ label:"Post-Construction Cleanup",  amount:sqft*PRICING.addOns.postConstruction });
    if (addOns.disinfection)     bd.push({ label:"Electrostatic Disinfection", amount:sqft*PRICING.addOns.disinfection });
    return bd;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const formData = new FormData();
    const { firstName,lastName,email,phone,businessName,streetAddress,suiteUnit,city,state,zipCode } = sharedInfo;
    formData.append("First Name",firstName); formData.append("Last Name",lastName); formData.append("Email",email); formData.append("Phone",phone);
    formData.append("Business Name",businessName||"Not provided"); formData.append("Address",streetAddress);
    if (suiteUnit) formData.append("Suite/Unit",suiteUnit);
    formData.append("City",city); formData.append("State",state); formData.append("ZIP",zipCode);
    formData.append("Segment",segment); formData.append("Business Type",subType||"Not specified");
    formData.append("Square Feet",squareFeet); formData.append("Frequency",frequency);
    if (segment==="healthcare") { formData.append("Exam Rooms",examRooms); formData.append("Waiting Areas",waitingAreas); formData.append("Procedure Rooms",procedureRooms); formData.append("Laboratories",laboratories); formData.append("Sterilization Rooms",sterilizationRooms); formData.append("Nurse Stations",nurseStations); formData.append("Consult Rooms",consultRooms); }
    else if (segment==="retail") { formData.append("Fitting Rooms",fittingRooms); formData.append("Showrooms",showroomDisplays); formData.append("Stockrooms",stockrooms); formData.append("Customer Restrooms",customerRestrooms); formData.append("POS/Checkout Areas",posCheckouts); }
    else if (segment==="industrial") { formData.append("Loading Docks",loadingDocks); formData.append("Equipment Areas",equipmentAreas); formData.append("Break Rooms",industrialBreakRooms); formData.append("Restrooms",industrialRestrooms); formData.append("Office/Admin Areas",officeAreas); }
    formData.append("Add-ons",Object.keys(addOns).filter(k=>addOns[k]).join(", ")||"None");
    formData.append("Preferred Days",preferredDays.join(", ")||"Not specified");
    formData.append("Preferred Time",preferredTime||"Not specified");
    formData.append("Special Instructions",specialInstructions||"None");
    formData.append("Est. Monthly Total",`$${calcTotal().toFixed(2)}`);
    formData.append("_captcha","false"); formData.append("_template","table");
    try {
      const res = await fetch("https://formsubmit.co/ajax/AkCleaningSuOficina@gmail.com",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(Object.fromEntries(formData))});
      const result = await res.json();
      if (result.success) setShowSuccessModal(true); else alert("There was an error submitting. Please try again or call us directly.");
    } catch { alert("There was an error submitting. Please try again or call us directly."); }
  };

  const resetAll = () => {
    setStep(1); setSegment(""); setSubType(""); setSquareFeet(""); setFrequency("");
    setExamRooms(0); setWaitingAreas(0); setProcedureRooms(0); setLaboratories(0); setSterilizationRooms(0); setNurseStations(0); setConsultRooms(0);
    setFittingRooms(0); setShowroomDisplays(0); setStockrooms(0); setCustomerRestrooms(0); setPosCheckouts(0);
    setLoadingDocks(0); setEquipmentAreas(0); setIndustrialBreakRooms(0); setIndustrialRestrooms(0); setOfficeAreas(0);
    setAddOns({windowCleaning:false,floorWaxing:false,carpetCleaning:false,pressureWashing:false,postConstruction:false,disinfection:false});
    setPreferredDays([]); setPreferredTime(""); setSpecialInstructions(""); setShowSuccessModal(false); onBack();
  };

  const scroll = () => window.scrollTo({ top:0, behavior:"smooth" });
  const goNext = () => { scroll(); setTimeout(() => setStep(s => s+1), 100); };
  const goBack = () => { if (step===1) { onBack(); return; } scroll(); setTimeout(() => setStep(s => s-1), 100); };

  const step2Valid = squareFeet && frequency;
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const pct = `${(step/4)*100}%`;

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{maxHeight:"calc(100vh - 40px)",display:"flex",flexDirection:"column"}}>
      <div style={{...CARD_STYLE,borderRadius:"28px",display:"flex",flexDirection:"column",maxHeight:"100%",backgroundColor:"#FEFCF5",border:"1px solid rgba(212,160,23,0.25)"}}>
        <div style={{padding:"25px",textAlign:"center",borderBottom:"1px solid rgba(212,160,23,0.3)",background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",position:"relative",overflow:"hidden"}}>
          <svg width="160" height="160" style={{position:"absolute",top:"-40px",right:"-30px",opacity:0.25,pointerEvents:"none"}} viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
            <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
            <circle cx="80" cy="80" r="34" fill="none" stroke="rgba(240,192,64,0.4)" strokeWidth="0.6"/>
          </svg>
          <div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"rgba(255,240,160,0.7)",top:"18%",right:"18%",boxShadow:"0 0 5px rgba(240,192,64,0.6)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",width:"3px",height:"3px",borderRadius:"50%",background:"rgba(240,192,64,0.6)",top:"65%",right:"8%",boxShadow:"0 0 4px rgba(240,192,64,0.5)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",width:"5px",height:"5px",borderRadius:"50%",background:"rgba(255,240,160,0.5)",bottom:"15%",left:"8%",boxShadow:"0 0 5px rgba(240,192,64,0.4)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:"'Oswald', sans-serif",fontSize:"22px",fontWeight:"300",letterSpacing:"5px",textTransform:"uppercase",background:"linear-gradient(180deg, #FFF0A0 0%, #F0C040 25%, #C8900A 50%, #F0C040 75%, #FFF0A0 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:"8px"}}>Price Breakdown</div>
            <div style={{fontSize:"14px",color:"rgba(240,192,64,0.85)",fontWeight:"700",background:"rgba(255,255,255,0.1)",padding:"4px 12px",borderRadius:"6px",display:"inline-block"}}>Monthly Estimate</div>
          </div>
        </div>
        <div style={{padding:"20px 25px",overflowY:"auto",flex:1}}>
          {getPriceBreakdown().length===0 ? (
            <div style={{textAlign:"center",padding:"40px 20px",color:"#999",fontSize:"14px",fontWeight:"500",fontStyle:"italic"}}>Complete the form to see pricing</div>
          ) : (
            <>
              {getPriceBreakdown().map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 0",borderBottom:i<getPriceBreakdown().length-1?"1px solid rgba(212,160,23,0.12)":"none"}}>
                  <div style={{color:"#4A3728",fontSize:"14px",fontWeight:"600",flex:1}}>{item.label}</div>
                  <div style={{color:"#4A3728",fontSize:"14px",fontWeight:"800"}}>${item.amount.toFixed(2)}</div>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"16px 0",marginTop:"10px",borderTop:"2px solid rgba(93,235,241,0.3)"}}>
                <div style={{color:"#A07B15",fontSize:"14px",fontWeight:"800",textTransform:"uppercase"}}>Subtotal</div>
                <div style={{color:"#4A3728",fontSize:"16px",fontWeight:"900"}}>${calcSubtotal().toFixed(2)}</div>
              </div>
            </>
          )}
        </div>
        <div style={{padding:"12px 20px",background:"rgba(255,255,255,0.1)",borderTop:"1px solid rgba(255,255,255,0.1)",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <p style={{color:"#666",fontSize:"11px",margin:0,fontWeight:"600",textAlign:"center",fontStyle:"italic"}}>💡 Estimate based on monthly contract. Final prices may vary.</p>
        </div>
        <div style={{padding:"25px",background:"linear-gradient(180deg, #E8E0C8 0%, #EDE5CE 40%, #F5F0E0 100%)",borderTop:"1px solid rgba(212,160,23,0.25)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"#4A3728",fontWeight:"900",fontSize:"14px",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"4px"}}>Total</div>
              <div style={{fontSize:"14px",color:"#8B6914",fontWeight:"700",background:"rgba(255,255,255,0.5)",padding:"3px 10px",borderRadius:"6px"}}>per month</div>
            </div>
            <div style={{color:"#2D1800",fontWeight:"900",fontSize:"36px"}}>${calcSubtotal().toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div style={{marginTop:"20px",padding:"14px 16px",background:"linear-gradient(135deg,rgba(46,125,79,0.12),rgba(30,92,56,0.12))",borderRadius:"12px",border:"1px solid rgba(46,125,79,0.3)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:"#2E7D4F",fontSize:"14px",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.5px"}}>✓ 100% Satisfaction Guaranteed</div>
        <div style={{fontSize:"22px"}}>🏆</div>
      </div>
    </div>
  );

  return (
    <div style={{...BG_STYLE, paddingBottom: mobileBarHeight ? mobileBarHeight + 20 : undefined}}>
      {/* Animated background */}
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",filter:"blur(90px)",background:"rgba(240,192,64,0.25)",top:"-120px",left:"-120px"}}/>
        <div style={{position:"absolute",width:"380px",height:"380px",borderRadius:"50%",filter:"blur(80px)",background:"rgba(212,160,23,0.15)",bottom:"-80px",right:"-80px"}}/>
        <div style={{position:"absolute",width:"220px",height:"220px",borderRadius:"50%",filter:"blur(60px)",background:"rgba(240,192,64,0.2)",top:"35%",left:"65%"}}/>
        <svg width="560" height="560" style={{position:"absolute",top:"-100px",left:"28%",opacity:0.8}} viewBox="0 0 560 560">
          <circle cx="280" cy="280" r="240" fill="none" stroke="rgba(240,192,64,0.7)" strokeWidth="1.8"/>
          <circle cx="280" cy="280" r="190" fill="none" stroke="rgba(212,160,23,0.4)" strokeWidth="1.2"/>
          <circle cx="280" cy="280" r="140" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.2"/>
          <circle cx="280" cy="280" r="90" fill="none" stroke="rgba(212,160,23,0.3)" strokeWidth="0.8"/>
        </svg>
        <svg width="300" height="300" style={{position:"absolute",bottom:"-60px",right:"4%",opacity:0.7}} viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="125" fill="none" stroke="rgba(212,160,23,0.55)" strokeWidth="1.8"/>
          <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.2"/>
        </svg>
        {[{w:"7px",l:"22%",b:"12%",dur:"7s",del:"0s"},{w:"5px",l:"48%",b:"18%",dur:"9s",del:"1.5s"},{w:"8px",l:"72%",b:"9%",dur:"8s",del:"0.7s"},{w:"6px",l:"33%",b:"22%",dur:"10s",del:"2s"},{w:"6px",l:"82%",b:"28%",dur:"7.5s",del:"3s"}].map((d,i)=>(
          <div key={i} style={{position:"absolute",width:d.w,height:d.w,borderRadius:"50%",background:"rgba(212,160,23,0.5)",left:d.l,bottom:d.b,animation:`floatUp ${d.dur} ${d.del} infinite ease-in-out`,boxShadow:`0 0 ${parseInt(d.w)*3}px rgba(240,192,64,0.6)`}}/>
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
        .continue-btn:not(:disabled):hover { background: linear-gradient(160deg, #EDE5CE 0%, #4E4840 60%, #3E3830 100%) !important; color: #F5E8C0 !important; box-shadow: 0 4px 16px rgba(180,160,120,0.3) !important; border-color: rgba(212,160,23,0.6) !important; transform: translateY(-1px); }
        .continue-btn:not(:disabled):active { background: linear-gradient(160deg, #DDD5B8 0%, #3E3830 60%, #2C2416 100%) !important; color: #F5E8C0 !important; transform: scale(0.98); }
        .of2-mobile-price { display:none; }
        @media (max-width: 900px) { .of2-layout { grid-template-columns:1fr !important; } .of2-sidebar { display:none !important; } .of2-mobile-price { display:block !important; } }
        @media (max-width: 640px) {
          .of2-layout { padding: 12px !important; gap: 0 !important; }
          .of2-cleaning-title { font-size: 38px !important; letter-spacing: 5px !important; }
          .of2-suoficina-title { font-size: 42px !important; }
          .of2-form-body { padding: 24px 16px !important; }
          .of2-hero-icon { width: 72px !important; height: 72px !important; font-size: 36px !important; margin-bottom: 16px !important; }
          .of2-hero-h2 { font-size: 22px !important; }
          .of2-segment-grid { grid-template-columns: repeat(3,1fr) !important; gap: 8px !important; }
          .of2-segment-card { padding: 14px 8px !important; }
          .of2-segment-icon { font-size: 24px !important; margin-bottom: 4px !important; }
          .of2-segment-label { font-size: 11px !important; }
          .of2-subtype-grid { grid-template-columns: 1fr !important; }
          .of2-rooms-grid { grid-template-columns: 1fr !important; }
          .of2-addons-grid { grid-template-columns: 1fr !important; }
          .of2-days-wrap { gap: 6px !important; }
          .of2-days-wrap button { padding: 8px 12px !important; font-size: 12px !important; }
          .of2-times-grid { grid-template-columns: repeat(2,1fr) !important; }
          .of2-review-grid { grid-template-columns: 1fr !important; }
          .of2-btn-row { gap: 10px !important; }
          .of2-freq-grid { grid-template-columns: repeat(2,1fr) !important; }
          .of2-freq-grid > div:first-child { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 380px) {
          .of2-cleaning-title { font-size: 32px !important; letter-spacing: 4px !important; }
          .of2-suoficina-title { font-size: 36px !important; }
        }
      `}</style>

      <div className="of2-layout" style={{maxWidth:"1400px",margin:"0 auto",padding:"30px 20px",display:"grid",gridTemplateColumns:"1fr 380px",gap:"30px",alignItems:"start",position:"relative",zIndex:1}}>

        <div style={CARD_STYLE}>
          {/* Header */}
          <div style={{background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",borderBottom:"1px solid rgba(212,160,23,0.3)",padding:"30px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <svg width="220" height="220" style={{position:"absolute",top:"-60px",left:"-40px",opacity:0.25,pointerEvents:"none"}} viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
              <circle cx="110" cy="110" r="70" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
            </svg>
            <svg width="180" height="180" style={{position:"absolute",bottom:"-50px",right:"-30px",opacity:0.25,pointerEvents:"none"}} viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
              <circle cx="90" cy="90" r="52" fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
            </svg>
            <div style={{position:"absolute",width:"5px",height:"5px",borderRadius:"50%",background:"rgba(255,240,160,0.7)",top:"20%",left:"12%",boxShadow:"0 0 6px rgba(240,192,64,0.6)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"rgba(240,192,64,0.6)",top:"60%",left:"80%",boxShadow:"0 0 5px rgba(240,192,64,0.5)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",width:"3px",height:"3px",borderRadius:"50%",background:"rgba(255,240,160,0.5)",top:"75%",left:"25%",boxShadow:"0 0 4px rgba(240,192,64,0.4)",pointerEvents:"none"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
                <div style={{fontFamily:"'Oswald', sans-serif",fontSize:"42px",fontWeight:"300",letterSpacing:"8px",color:"white",textShadow:"0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(240,192,64,0.3)"}} className="of2-cleaning-title">CLEANING</div>
                <div style={{fontFamily:"'Allura', cursive",fontSize:"46px",letterSpacing:"3px",marginTop:"-8px",fontWeight:"400",background:"linear-gradient(180deg, #FFF0A0 0%, #F0C040 25%, #C8900A 50%, #F0C040 75%, #FFF0A0 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}} className="of2-suoficina-title">Su Oficina</div>
              </div>
              <div style={{height:"2px",width:"80px",background:"linear-gradient(90deg,transparent,#F0C040,transparent)",margin:"14px auto 10px",boxShadow:"0 0 10px rgba(240,192,64,0.5)"}}/>
              {segment ? (
                <div style={{display:"inline-block",padding:"6px 18px",borderRadius:"20px",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(212,160,23,0.4)",fontSize:"13px",fontWeight:"700",color:"rgba(240,192,64,0.9)",letterSpacing:"1px",textTransform:"uppercase"}}>
                  {segmentMeta[segment]?.icon} {segmentMeta[segment]?.label} Cleaning Quote
                </div>
              ) : (
                <div style={{color:"rgba(240,192,64,0.7)",fontSize:"13px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>🏢 Commercial Cleaning Quote</div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{height:"6px",background:"rgba(212,160,23,0.15)"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#A07B15,#D4A017,#F0C040)",width:pct,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",boxShadow:"0 0 15px rgba(212,160,23,0.6)"}}/>
          </div>

          <div style={{padding:"50px 40px",background:"transparent"}} className="of2-form-body">

            {/* ── STEP 1: Segment + Sub-type ────────────────────────────────── */}
            {step===1&&(
              <div className="fade-in-up">
                <div style={{textAlign:"center",marginBottom:"40px"}}>
                  <div style={{width:"90px",height:"90px",background:"linear-gradient(135deg,#A07B15,#D4A017,#F0C040)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 20px 50px rgba(212,160,23,0.25)",border:"4px solid rgba(255,255,255,0.9)",fontSize:"44px"}} className="of2-hero-icon">
                    {segment ? segmentMeta[segment].icon : "🏢"}
                  </div>
                  <h2 style={{fontSize:"28px",fontWeight:"900",color:"#4A3728",margin:"0 0 10px",letterSpacing:"-0.5px",textTransform:"uppercase"}} className="of2-hero-h2">What kind of business?</h2>
                  <p style={{color:"#666",fontSize:"15px",fontWeight:"500"}}>Select your industry, then your specific type</p>
                </div>

                {/* Segment picker */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{...labelSt,marginBottom:"12px"}}>Industry *</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}} className="of2-segment-grid">
                    {[{value:"healthcare",icon:"🏥",label:"Healthcare"},{value:"retail",icon:"🛍️",label:"Retail"},{value:"industrial",icon:"🏭",label:"Industrial"}].map(s=>(
                      <div key={s.value} onClick={()=>{setSegment(s.value);setSubType("");}} className="of2-segment-card" style={{padding:"20px 12px",borderRadius:"16px",cursor:"pointer",textAlign:"center",transition:"all 0.2s ease",
                        border:segment===s.value?"2px solid #0891B2":"2px solid rgba(212,160,23,0.2)",
                        background:segment===s.value?"linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))":"rgba(255,255,255,0.7)",
                        boxShadow:segment===s.value?"0 0 20px rgba(6,182,212,0.3)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                        <div className="of2-segment-icon" style={{fontSize:"30px",marginBottom:"8px"}}>{s.icon}</div>
                        <div className="of2-segment-label" style={{fontSize:"13px",fontWeight:"800",color:segment===s.value?"#0891B2":"#4A3728"}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-type picker */}
                {segment&&(
                  <div style={{marginBottom:"35px"}}>
                    <label style={{...labelSt,marginBottom:"12px"}}>Business Type <span style={{color:"#999",fontWeight:"600",textTransform:"none"}}>(optional)</span></label>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"10px"}} className="of2-subtype-grid">
                      {SUBTYPES[segment].map(t=>(
                        <div key={t.value} onClick={()=>setSubType(t.value)} style={{padding:"14px 16px",borderRadius:"12px",cursor:"pointer",display:"flex",alignItems:"center",gap:"10px",transition:"all 0.2s ease",
                          border:subType===t.value?"2px solid #D4A017":"2px solid rgba(212,160,23,0.2)",
                          background:subType===t.value?"linear-gradient(135deg,rgba(212,160,23,0.12),rgba(212,175,55,0.06))":"rgba(255,255,255,0.7)"}}>
                          <span style={{fontSize:"20px"}}>{t.icon}</span>
                          <span style={{fontSize:"13px",fontWeight:"700",color:subType===t.value?"#5C4A1E":"#4A3728"}}>{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{display:"flex",gap:"15px"}} className="of2-btn-row">
                  <button onClick={goBack} style={{flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!segment} className="continue-btn" style={{flex:2,padding:"18px",borderRadius:"16px",border:segment?"2px solid rgba(212,160,23,0.6)":"2px solid rgba(212,160,23,0.2)",background:segment?"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)":"rgba(255,255,255,0.4)",fontSize:"15px",fontWeight:"800",cursor:segment?"pointer":"not-allowed",color:segment?"#F5E8C0":"#B8A060",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.25s ease"}}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Sq Ft, Frequency, Room Counters ───────────────────── */}
            {step===2&&(
              <div className="fade-in-up">
                {/* Square Footage */}
                <div style={{marginBottom:"28px",background:"linear-gradient(135deg,rgba(212,160,23,0.05),rgba(240,192,64,0.04))",borderRadius:"16px",padding:"20px",border:"1px solid rgba(212,160,23,0.2)"}}>
                  <label style={{...labelSt,marginBottom:"12px"}}>📐 Total Square Footage *</label>
                  <input type="number" placeholder="e.g. 3500" value={squareFeet} onChange={e=>setSquareFeet(e.target.value)} style={inputSt}/>
                </div>

                {/* Frequency */}
                <div style={{marginBottom:"28px",background:"linear-gradient(135deg,rgba(212,160,23,0.05),rgba(240,192,64,0.04))",borderRadius:"16px",padding:"20px",border:"1px solid rgba(212,160,23,0.2)"}}>
                  <label style={{...labelSt,marginBottom:"12px"}}>📅 Cleaning Frequency *</label>
                  <FreqSelector value={frequency} onChange={setFrequency}/>
                  {squareFeet&&frequency&&(
                    <div style={{marginTop:"14px",padding:"14px 18px",borderRadius:"12px",background:"linear-gradient(135deg,rgba(46,125,79,0.08),rgba(30,92,56,0.06))",border:"2px solid rgba(46,125,79,0.3)"}}>
                      <div style={{fontSize:"11px",color:"#888",fontWeight:"700",marginBottom:"4px",letterSpacing:"0.5px"}}>EST. MONTHLY BASE</div>
                      <div style={{fontSize:"26px",fontWeight:"900",color:"#2E7D4F"}}>${calcSubtotal().toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Healthcare rooms */}
                {segment==="healthcare"&&(
                  <div style={{marginBottom:"28px"}}>
                    <label style={{...labelSt,marginBottom:"12px"}}>🏥 Healthcare Rooms</label>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}} className="of2-rooms-grid">
                      <Counter icon="🩺" label="Exam Rooms"      price={40} value={examRooms}          onDec={()=>setExamRooms(Math.max(0,examRooms-1))}                   onInc={()=>setExamRooms(examRooms+1)}/>
                      <Counter icon="🪑" label="Waiting Areas"   price={30} value={waitingAreas}       onDec={()=>setWaitingAreas(Math.max(0,waitingAreas-1))}             onInc={()=>setWaitingAreas(waitingAreas+1)}/>
                      <Counter icon="⚕️" label="Procedure Rooms" price={60} value={procedureRooms}     onDec={()=>setProcedureRooms(Math.max(0,procedureRooms-1))}         onInc={()=>setProcedureRooms(procedureRooms+1)}/>
                      <Counter icon="🔬" label="Laboratories"    price={75} value={laboratories}       onDec={()=>setLaboratories(Math.max(0,laboratories-1))}             onInc={()=>setLaboratories(laboratories+1)}/>
                      <Counter icon="🧼" label="Sterilization"   price={65} value={sterilizationRooms} onDec={()=>setSterilizationRooms(Math.max(0,sterilizationRooms-1))} onInc={()=>setSterilizationRooms(sterilizationRooms+1)}/>
                      <Counter icon="👩‍⚕️" label="Nurse Stations" price={35} value={nurseStations}      onDec={()=>setNurseStations(Math.max(0,nurseStations-1))}           onInc={()=>setNurseStations(nurseStations+1)}/>
                      <Counter icon="💬" label="Consult Rooms"   price={35} value={consultRooms}       onDec={()=>setConsultRooms(Math.max(0,consultRooms-1))}             onInc={()=>setConsultRooms(consultRooms+1)}/>
                    </div>
                  </div>
                )}

                {/* Retail rooms */}
                {segment==="retail"&&(
                  <div style={{marginBottom:"28px"}}>
                    <label style={{...labelSt,marginBottom:"12px"}}>🛍️ Retail Areas</label>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}} className="of2-rooms-grid">
                      <Counter icon="👗" label="Fitting Rooms"      price={18} value={fittingRooms}      onDec={()=>setFittingRooms(Math.max(0,fittingRooms-1))}           onInc={()=>setFittingRooms(fittingRooms+1)}/>
                      <Counter icon="🛍️" label="Showrooms"          price={30} value={showroomDisplays}  onDec={()=>setShowroomDisplays(Math.max(0,showroomDisplays-1))}   onInc={()=>setShowroomDisplays(showroomDisplays+1)}/>
                      <Counter icon="📦" label="Stockrooms"         price={25} value={stockrooms}        onDec={()=>setStockrooms(Math.max(0,stockrooms-1))}               onInc={()=>setStockrooms(stockrooms+1)}/>
                      <Counter icon="🚻" label="Customer Restrooms" price={35} value={customerRestrooms} onDec={()=>setCustomerRestrooms(Math.max(0,customerRestrooms-1))} onInc={()=>setCustomerRestrooms(customerRestrooms+1)}/>
                      <Counter icon="🖥️" label="POS / Checkout"     price={20} value={posCheckouts}      onDec={()=>setPosCheckouts(Math.max(0,posCheckouts-1))}           onInc={()=>setPosCheckouts(posCheckouts+1)}/>
                    </div>
                  </div>
                )}

                {/* Industrial rooms */}
                {segment==="industrial"&&(
                  <div style={{marginBottom:"28px"}}>
                    <label style={{...labelSt,marginBottom:"12px"}}>🏭 Industrial Areas</label>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}} className="of2-rooms-grid">
                      <Counter icon="🚢" label="Loading Docks"   price={50} value={loadingDocks}         onDec={()=>setLoadingDocks(Math.max(0,loadingDocks-1))}               onInc={()=>setLoadingDocks(loadingDocks+1)}/>
                      <Counter icon="⚙️" label="Equipment Areas" price={40} value={equipmentAreas}       onDec={()=>setEquipmentAreas(Math.max(0,equipmentAreas-1))}           onInc={()=>setEquipmentAreas(equipmentAreas+1)}/>
                      <Counter icon="☕" label="Break Rooms"      price={30} value={industrialBreakRooms} onDec={()=>setIndustrialBreakRooms(Math.max(0,industrialBreakRooms-1))} onInc={()=>setIndustrialBreakRooms(industrialBreakRooms+1)}/>
                      <Counter icon="🚻" label="Restrooms"        price={35} value={industrialRestrooms}  onDec={()=>setIndustrialRestrooms(Math.max(0,industrialRestrooms-1))}   onInc={()=>setIndustrialRestrooms(industrialRestrooms+1)}/>
                      <Counter icon="📋" label="Office / Admin"   price={25} value={officeAreas}          onDec={()=>setOfficeAreas(Math.max(0,officeAreas-1))}                 onInc={()=>setOfficeAreas(officeAreas+1)}/>
                    </div>
                  </div>
                )}

                <div style={{display:"flex",gap:"15px"}} className="of2-btn-row">
                  <button onClick={goBack} style={{flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!step2Valid} className="continue-btn" style={{flex:2,padding:"18px",borderRadius:"16px",border:step2Valid?"2px solid rgba(212,160,23,0.6)":"2px solid rgba(212,160,23,0.2)",background:step2Valid?"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)":"rgba(255,255,255,0.4)",fontSize:"15px",fontWeight:"800",cursor:step2Valid?"pointer":"not-allowed",color:step2Valid?"#F5E8C0":"#B8A060",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.25s ease"}}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Add-ons & Schedule ────────────────────────────────── */}
            {step===3&&(
              <div className="fade-in-up">
                {/* Add-ons */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#A07B15",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <CheckCircle2 size={18} color="#D4A017"/>Optional Add-on Services
                  </label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}} className="of2-addons-grid">
                    {[{key:"windowCleaning",icon:"🪟",label:"Window Cleaning",price:"$150/visit"},{key:"floorWaxing",icon:"✨",label:"Floor Waxing",price:"$200/visit"},{key:"carpetCleaning",icon:"🧹",label:"Carpet Cleaning",price:"$0.35/sqft"},{key:"pressureWashing",icon:"💦",label:"Pressure Washing",price:"$0.25/sqft"},{key:"postConstruction",icon:"🏗️",label:"Post-Construction",price:"$0.50/sqft"},{key:"disinfection",icon:"🦠",label:"Electrostatic Disinfection",price:"$0.15/sqft"}].map(a=>(
                      <div key={a.key} onClick={()=>setAddOns(p=>({...p,[a.key]:!p[a.key]}))} style={{padding:"18px 16px",borderRadius:"16px",cursor:"pointer",transition:"all 0.3s ease",display:"flex",alignItems:"flex-start",gap:"10px",
                        border:addOns[a.key]?"1.5px solid rgba(212,160,23,0.6)":"1.5px solid rgba(212,160,23,0.25)",
                        background:addOns[a.key]?"linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,235,140,0.5) 40%, rgba(212,160,23,0.65) 100%)":"#EDE5CE",
                        boxShadow:addOns[a.key]?"0 4px 16px rgba(212,160,23,0.3)":"0 2px 6px rgba(0,0,0,0.04)"}}>
                        <div style={{width:"20px",height:"20px",borderRadius:"6px",border:addOns[a.key]?"none":"2px solid rgba(212,160,23,0.4)",background:addOns[a.key]?"linear-gradient(135deg,#3DA864,#2D7A4A)":"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}>
                          {addOns[a.key]&&<CheckCircle2 size={14} color="white"/>}
                        </div>
                        <div>
                          <div style={{fontSize:"14px",fontWeight:"800",marginBottom:"3px",color:addOns[a.key]?"#2D1E00":"#4A3728"}}>{a.icon} {a.label}</div>
                          <div style={{fontSize:"11px",color:addOns[a.key]?"rgba(61,40,0,0.75)":"#A07B15",fontWeight:"700"}}>{a.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Days */}
                <div style={{marginBottom:"25px"}}>
                  <label style={{...labelSt,marginBottom:"12px"}}>📆 Preferred Service Days</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}} className="of2-days-wrap">
                    {DAYS.map(d=>(
                      <button key={d} onClick={()=>setPreferredDays(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d])} style={{padding:"10px 16px",borderRadius:"20px",cursor:"pointer",transition:"all 0.2s ease",
                        border:preferredDays.includes(d)?"2px solid #D4A017":"2px solid rgba(212,160,23,0.3)",
                        background:preferredDays.includes(d)?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                        color:preferredDays.includes(d)?"white":"#4A3728",
                        fontSize:"13px",fontWeight:"700"}}>{d}</button>
                    ))}
                  </div>
                </div>

                {/* Preferred Time */}
                <div style={{marginBottom:"25px"}}>
                  <label style={{...labelSt,marginBottom:"12px"}}>🕐 Preferred Time</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}} className="of2-times-grid">
                    {["Early Morning (6-9am)","Morning (9am-12pm)","Afternoon (12-5pm)","Evening (5-8pm)","After Hours (8pm+)","Flexible"].map(t=>(
                      <div key={t} onClick={()=>setPreferredTime(t)} style={{padding:"12px 8px",borderRadius:"10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s ease",
                        border:preferredTime===t?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",
                        background:preferredTime===t?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                        color:preferredTime===t?"white":"#4A3728"}}>
                        <div style={{fontSize:"11px",fontWeight:"700"}}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{...labelSt,marginBottom:"12px"}}>📝 Special Instructions <span style={{color:"#999",fontWeight:"600",textTransform:"none",fontSize:"11px"}}>(optional)</span></label>
                  <textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} rows={3} placeholder="Security codes, access instructions, areas to avoid, special requirements..." style={{...inputSt,resize:"vertical",fontFamily:"inherit"}}/>
                </div>

                <div style={{display:"flex",gap:"15px"}} className="of2-btn-row">
                  <button onClick={goBack} style={{flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} className="continue-btn" style={{flex:2,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.6)",background:"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)",fontSize:"15px",fontWeight:"800",cursor:"pointer",color:"#F5E8C0",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.25s ease"}}>Review Quote <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Review & Submit ───────────────────────────────────── */}
            {step===4&&(
              <div className="fade-in-up">
                <div style={{textAlign:"center",marginBottom:"35px"}}>
                  <h2 style={{fontSize:"28px",fontWeight:"900",color:"#4A3728",margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"-0.5px"}}>Review Your Quote</h2>
                  <p style={{color:"#666",fontSize:"14px",fontWeight:"500"}}>Confirm your details before submitting</p>
                </div>

                {/* Summary card */}
                <div style={{background:"linear-gradient(135deg,rgba(212,160,23,0.06),rgba(240,192,64,0.04))",border:"1px solid rgba(212,160,23,0.2)",borderRadius:"20px",padding:"28px",marginBottom:"28px"}}>
                  <div style={{marginBottom:"20px",paddingBottom:"20px",borderBottom:"1px solid rgba(212,160,23,0.12)"}}>
                    <div style={{...labelSt,marginBottom:"10px"}}>Contact</div>
                    <div style={{fontSize:"15px",fontWeight:"700",color:"#4A3728"}}>{sharedInfo.firstName} {sharedInfo.lastName}</div>
                    <div style={{fontSize:"13px",color:"#888",marginTop:"3px"}}>{sharedInfo.email} · {sharedInfo.phone}</div>
                    {sharedInfo.businessName&&<div style={{fontSize:"13px",color:"#888",marginTop:"2px"}}>{sharedInfo.businessName}</div>}
                  </div>
                  <div style={{marginBottom:"20px",paddingBottom:"20px",borderBottom:"1px solid rgba(212,160,23,0.12)"}}>
                    <div style={{...labelSt,marginBottom:"10px"}}>Service Address</div>
                    <div style={{fontSize:"14px",color:"#4A3728",fontWeight:"600"}}>
                      {sharedInfo.streetAddress}{sharedInfo.suiteUnit?`, ${sharedInfo.suiteUnit}`:""}<br/>
                      {sharedInfo.city}, {sharedInfo.state} {sharedInfo.zipCode}
                    </div>
                  </div>
                  <div style={{marginBottom:"20px",paddingBottom:"20px",borderBottom:"1px solid rgba(212,160,23,0.12)"}}>
                    <div style={{...labelSt,marginBottom:"10px"}}>Service Details</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}} className="of2-review-grid">
                      {[["Industry",`${segmentMeta[segment]?.icon} ${segmentMeta[segment]?.label}`],["Type",subType||"Not specified"],["Square Feet",`${parseInt(squareFeet).toLocaleString()} sqft`],["Frequency",frequency]].map(([k,v])=>(
                        <div key={k} style={{background:"rgba(255,255,255,0.8)",borderRadius:"10px",padding:"12px",border:"1px solid rgba(212,160,23,0.1)"}}>
                          <div style={{fontSize:"10px",color:"#A07B15",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"4px"}}>{k}</div>
                          <div style={{fontSize:"13px",color:"#4A3728",fontWeight:"700",textTransform:"capitalize"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"11px",color:"#A07B15",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Estimated Monthly Total</div>
                    <div style={{fontSize:"42px",fontWeight:"900",color:"#4A3728",lineHeight:"1"}}>${calcTotal().toFixed(2)}</div>
                    <div style={{fontSize:"12px",color:"#888",marginTop:"6px"}}>Final price confirmed after on-site assessment</div>
                  </div>
                </div>

                {/* Terms */}
                <div style={{padding:"20px",borderRadius:"16px",background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.2)",marginBottom:"28px"}}>
                  <p style={{fontSize:"12px",color:"#555",fontWeight:"600",lineHeight:"1.6",margin:0}}>
                    By submitting this request, you agree to our{" "}
                    <a href="/TermsAndConditions.pdf" target="_blank" rel="noopener noreferrer" style={{color:"#F0C040",textDecoration:"underline",fontWeight:"700"}}>Terms & Conditions</a>.{" "}
                    Our team will review your request and contact you within 24 hours.
                  </p>
                </div>

                <div style={{display:"flex",gap:"15px"}} className="of2-btn-row">
                  <button onClick={goBack} style={{flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><ChevronLeft size={20}/> Back</button>
                  <button onClick={handleSubmit} style={{flex:2,padding:"18px",borderRadius:"16px",border:"none",background:"linear-gradient(135deg,#3DA864,#2D7A4A)",color:"white",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 8px 24px rgba(46,125,79,0.3)"}}>Submit Request <CheckCircle2 size={20}/></button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar */}
        <div className="of2-sidebar" style={{position:"sticky",top:"20px",height:"fit-content"}}><Sidebar/></div>
      </div>

      {/* Mobile sticky price bar */}
      <div ref={mobileBarRef} className="of2-mobile-price" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000}}>
        <div style={{background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",borderTop:"2px solid rgba(212,160,23,0.4)",boxShadow:"0 -8px 30px rgba(0,0,0,0.3)"}}>
          <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"rgba(240,192,64,0.8)",fontSize:"11px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase"}}>Monthly Estimate</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#FFF0A0",fontSize:"28px",fontWeight:"900",lineHeight:"1"}}>${calcSubtotal().toFixed(2)}</div>
              <div style={{color:"rgba(240,192,64,0.6)",fontSize:"10px",fontWeight:"600"}}>per month</div>
            </div>
          </div>
          {getPriceBreakdown().length>0&&(
            <div style={{borderTop:"1px solid rgba(212,160,23,0.25)",overflowY:"scroll",maxHeight:"120px",padding:"6px 20px 10px",WebkitOverflowScrolling:"touch"}}>
              {getPriceBreakdown().map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",fontSize:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{color:"rgba(240,192,64,0.85)",fontWeight:"600",flex:1,marginRight:"8px"}}>{item.label}</span>
                  <span style={{color:"#FFF0A0",fontWeight:"700",flexShrink:0}}>${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Success Modal */}
      {showSuccessModal&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px"}}>
          <div style={{background:"linear-gradient(135deg,#FFFFFF,#FBF6EF)",borderRadius:"32px",padding:"50px 40px",maxWidth:"500px",width:"100%",textAlign:"center",border:"1px solid rgba(212,160,23,0.25)",boxShadow:"0 30px 80px rgba(0,0,0,0.12)"}}>
            <div style={{width:"80px",height:"80px",borderRadius:"50%",background:"linear-gradient(135deg,#D4A017,#F0C040)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 30px"}}>
              <CheckCircle2 size={48} color="white"/>
            </div>
            <h2 style={{fontSize:"32px",fontWeight:"900",color:"#4A3728",marginBottom:"15px"}}>Request Submitted!</h2>
            <p style={{fontSize:"16px",color:"#444",fontWeight:"500",lineHeight:"1.6",marginBottom:"30px"}}>Thank you for choosing Cleaning Su Oficina! Our team will review your request and contact you within 24 hours to confirm details and schedule your service.</p>
            <button onClick={resetAll} style={{padding:"18px 40px",borderRadius:"16px",border:"none",background:"linear-gradient(135deg,#D4A017,#F0C040)",color:"white",fontSize:"16px",fontWeight:"800",cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.5px"}}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
