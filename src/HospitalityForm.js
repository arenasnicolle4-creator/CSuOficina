import React, { useState, useRef, useEffect } from "react";
import { Building2, Calendar, Clock, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

// ─── PRICING (hospitality-specific — do not change) ───────────────────────────
const PRICING = {
  baseRatesTiered: {
    hospitality: [
      {max:2000,rate:0.18},{max:3000,rate:0.16},{max:5000,rate:0.15},
      {max:10000,rate:0.13},{max:20000,rate:0.12},{max:50000,rate:0.11},{max:Infinity,rate:0.10},
    ],
  },
  addOns: { windowCleaning:150, floorWaxing:200, carpetCleaning:0.35, pressureWashing:0.25, postConstruction:0.50, disinfection:0.15 },
  minimum: 349,
};
const FREQ_VISITS = { daily:22,"4x-week":17,"3x-week":12,"2x-week":8,weekly:4,"bi-weekly":2,monthly:1 };
const FREQ_MULT   = { daily:0.82,"4x-week":0.86,"3x-week":0.90,"2x-week":1.0,weekly:1.05,"bi-weekly":1.12,monthly:1.20 };
const FREQ_LABELS = { daily:"18%","4x-week":"14%","3x-week":"10%","2x-week":"","weekly":"5%","bi-weekly":"12%","monthly":"20%" };

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

// ─── FacilityFreqSelector (light theme) ──────────────────────────────────────
function FacilityFreqSelector({ value, onChange }) {
  const opts = [
    {value:"4x-week",label:"4x/Week",discount:"14% OFF"},
    {value:"3x-week",label:"3x/Week",discount:"10% OFF"},
    {value:"2x-week",label:"2x/Week",discount:"BASE"},
    {value:"weekly",label:"Weekly",discount:"+5%"},
    {value:"bi-weekly",label:"Bi-Weekly",discount:"+12%"},
    {value:"monthly",label:"Monthly",discount:"+20%"},
  ];
  const sel = (v) => ({
    padding:"10px 8px", borderRadius:"8px", cursor:"pointer",
    transition:"all 0.15s ease", textAlign:"center",
    border: value===v ? "2px solid #0891B2" : "1px solid rgba(212,160,23,0.25)",
    background: value===v ? "linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))" : "rgba(255,255,255,0.7)",
  });
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px"}}>
      <div onClick={()=>onChange("daily")} style={{...sel("daily"),gridColumn:"1 / -1"}}>
        <div style={{fontSize:"12px",fontWeight:"700",color:value==="daily"?"#0891B2":"#4A3728",marginBottom:"2px"}}>Daily</div>
        <div style={{fontSize:"9px",color:value==="daily"?"#0891B2":"#A07B15",fontWeight:"600"}}>18% OFF</div>
      </div>
      {opts.map(o=>(
        <div key={o.value} onClick={()=>onChange(o.value)} style={sel(o.value)}>
          <div style={{fontSize:"12px",fontWeight:"700",color:value===o.value?"#0891B2":"#4A3728",marginBottom:"2px"}}>{o.label}</div>
          <div style={{fontSize:"9px",color:value===o.value?"#0891B2":"rgba(100,100,100,0.7)",fontWeight:"600"}}>{o.discount}</div>
        </div>
      ))}
    </div>
  );
}

// ─── RoomCounter (light theme) ────────────────────────────────────────────────
function RoomCounter({icon,label,price,count,onDec,onInc,freq,onFreqChange}) {
  return (
    <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,245,240,0.95))",border:"1px solid rgba(212,160,23,0.2)",borderRadius:"16px",padding:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:"14px",fontWeight:"800",color:"#4A3728",marginBottom:"2px"}}>{icon} {label}</div>
          <div style={{fontSize:"13px",color:"#A07B15",fontWeight:"700",marginTop:"3px"}}>{price}</div>
        </div>
        <div style={{fontSize:"24px",fontWeight:"900",color:"#4A3728",minWidth:"40px",textAlign:"right"}}>{count}</div>
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <button onClick={onDec} style={{flex:1,padding:"10px",borderRadius:"10px",border:"none",background:count>0?"rgba(239,68,68,0.12)":"rgba(230,230,230,0.6)",color:count>0?"#ef4444":"rgba(255,255,255,0.3)",fontSize:"18px",fontWeight:"900",cursor:count>0?"pointer":"not-allowed"}}>−</button>
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
      {count>0 && <FacilityFreqSelector value={freq} onChange={onFreqChange}/>}
    </div>
  );
}

export default function HospitalityForm({ sharedInfo, onBack }) {
  const [step, setStep] = useState(3);

  const mobileBarRef = useRef(null);
  const [mobileBarHeight, setMobileBarHeight] = useState(0);
  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMobileBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [hospType, setHospType]     = useState("");
  const [squareFeet, setSquareFeet] = useState("");

  const [showGuestRoomModal, setShowGuestRoomModal] = useState(false);
  const [guestRoomConfigs, setGuestRoomConfigs]     = useState([]);
  const [modalTemplate, setModalTemplate]           = useState("");
  const [modalBeds, setModalBeds]                   = useState(1);
  const [modalBathrooms, setModalBathrooms]         = useState(1);
  const [modalKitchen, setModalKitchen]             = useState("none");
  const [modalSize, setModalSize]                   = useState("medium");
  const [modalLivingArea, setModalLivingArea]       = useState(false);
  const [modalQuantity, setModalQuantity]           = useState(1);
  const [modalFreqCount, setModalFreqCount]         = useState(1);
  const [modalFreqType, setModalFreqType]           = useState("per-day");
  const [editingIndex, setEditingIndex]             = useState(null);

  const [commonAreas,    setCommonAreas]    = useState(0);
  const [diningAreas,    setDiningAreas]    = useState(0);
  const [fitnessCenters, setFitnessCenters] = useState(0);
  const [poolSpas,       setPoolSpas]       = useState(0);
  const [eventSpaces,    setEventSpaces]    = useState(0);
  const [laundryRooms,   setLaundryRooms]   = useState(0);
  const [lobbyReceptions,setLobbyReceptions]= useState(0);
  const [sharedBathrooms,setSharedBathrooms]= useState(0);

  const [commonAreasFreq,     setCommonAreasFreq]     = useState("");
  const [diningAreasFreq,     setDiningAreasFreq]     = useState("");
  const [fitnessCentersFreq,  setFitnessCentersFreq]  = useState("");
  const [poolSpasFreq,        setPoolSpasFreq]        = useState("");
  const [eventSpacesFreq,     setEventSpacesFreq]     = useState("");
  const [laundryRoomsFreq,    setLaundryRoomsFreq]    = useState("");
  const [lobbyReceptionsFreq, setLobbyReceptionsFreq] = useState("");
  const [sharedBathroomsFreq, setSharedBathroomsFreq] = useState("");

  const [addOns, setAddOns] = useState({windowCleaning:false,floorWaxing:false,carpetCleaning:false,pressureWashing:false,postConstruction:false,disinfection:false});
  const [preferredDays, setPreferredDays]             = useState([]);
  const [startMonth,    setStartMonth]                = useState("");
  const [preferredTime, setPreferredTime]             = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showSuccessModal, setShowSuccessModal]       = useState(false);

  // ── Pricing helpers (hospitality-specific) ────────────────────────────────
  const calcGuestPrice=(c)=>{ let p=25; if(c.beds===0)p+=10; else if(c.beds===1)p+=15; else if(c.beds===2)p+=25; else p+=35; const f=Math.floor(c.bathrooms); const h=c.bathrooms%1!==0; p+=(f*15)+(h?8:0); if(c.kitchen==="kitchenette")p+=8; else if(c.kitchen==="full")p+=15; if(c.size==="medium")p+=5; else if(c.size==="large")p+=10; else if(c.size==="xl")p+=15; if(c.livingArea)p+=12; return p; };
  const getRoomTypeLabel=(c)=>{ let l=""; if(c.beds===0)l="Studio"; else if(c.beds===1)l="1-Bed"; else if(c.beds===2)l="2-Bed"; else l=`${c.beds}-Bed`; if(c.livingArea)l+=" Suite"; if(c.kitchen==="kitchenette")l+=" + Kitchenette"; else if(c.kitchen==="full")l+=" + Kitchen"; l+=` (${c.bathrooms} bath${c.bathrooms>1?"s":""})`; return l; };
  const applyTemplate=(t)=>{ setModalTemplate(t); const m={studio:[0,1,"kitchenette","small",false],standard:[2,1,"none","medium",false],deluxe:[2,1,"none","large",false],suite:[1,1.5,"kitchenette","large",true],custom:[1,1,"none","medium",false]}[t]||[1,1,"none","medium",false]; setModalBeds(m[0]);setModalBathrooms(m[1]);setModalKitchen(m[2]);setModalSize(m[3]);setModalLivingArea(m[4]); };

  // freqCount = number of rooms of this type cleaned per day/week/month (not multiplied by quantity)
  // Monthly cost = freqCount × period_multiplier × pricePerClean
  // e.g. 6 studios/day × 30 days × $43/clean = $7,740/month
  const calcMonthlyCleans=(freqType, freqCount)=>{
    const n = parseFloat(freqCount) || 0;
    if (freqType==="per-day")   return n * 30;      // rooms cleaned/day × 30 days
    if (freqType==="per-week")  return n * 4.33;    // rooms cleaned/week × 4.33 weeks
    if (freqType==="per-month") return n;            // rooms cleaned/month
    return 0;
  };

  // Monthly cost for one config: freqCount-rooms-cleaned × period × pricePerClean
  const calcConfigMonthlyCost=(c)=> calcMonthlyCleans(c.freqType, c.freqCount) * (c.pricePerClean||0);

  const freqLabel=(freqType, freqCount)=>{
    const n = parseFloat(freqCount) || 0;
    if (freqType==="per-day")   return `${n} rooms/day`;
    if (freqType==="per-week")  return `${n} rooms/week`;
    if (freqType==="per-month") return `${n} rooms/month`;
    return "";
  };

  // Volume discount based on total monthly room-cleans across all guest room types
  const calcVolumeDiscount=(totalMonthlyCleans)=>{
    if (totalMonthlyCleans>=1200) return 0.15;
    if (totalMonthlyCleans>=900)  return 0.12;
    if (totalMonthlyCleans>=600)  return 0.09;
    if (totalMonthlyCleans>=450)  return 0.07;
    if (totalMonthlyCleans>=300)  return 0.05;
    if (totalMonthlyCleans>=150)  return 0.03;
    return 0;
  };

  const resetModal=()=>{ setModalTemplate("");setModalBeds(1);setModalBathrooms(1);setModalKitchen("none");setModalSize("medium");setModalLivingArea(false);setModalQuantity(1);setModalFreqCount(1);setModalFreqType("per-day");setEditingIndex(null); };

  const saveGuestRoom=()=>{
    const ppc = calcGuestPrice({beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea});
    const monthly = calcMonthlyCleans(modalFreqType, modalFreqCount); // total room-cleans/month
    const c = {beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea,quantity:modalQuantity,pricePerClean:ppc,freqCount:modalFreqCount,freqType:modalFreqType,monthlyCleans:monthly};
    if(editingIndex!==null){const u=[...guestRoomConfigs];u[editingIndex]=c;setGuestRoomConfigs(u);}
    else{setGuestRoomConfigs([...guestRoomConfigs,c]);}
    setShowGuestRoomModal(false); resetModal();
  };

  const editGuestRoom=(i)=>{
    const c=guestRoomConfigs[i];
    setModalBeds(c.beds);setModalBathrooms(c.bathrooms);setModalKitchen(c.kitchen);setModalSize(c.size);
    setModalLivingArea(c.livingArea);setModalQuantity(c.quantity);
    setModalFreqCount(c.freqCount||1);setModalFreqType(c.freqType||"per-day");
    setEditingIndex(i);setShowGuestRoomModal(true);
  };

  const getFacilityMonthlyCost=(qty,price,freq)=>{ if(!qty||!freq)return 0; return qty*price*(FREQ_VISITS[freq]||0)*(FREQ_MULT[freq]||1.0); };
  const getRateForSqft=(sqft)=>{ const tier=PRICING.baseRatesTiered.hospitality.find(t=>sqft<=t.max); return tier?tier.rate:0.10; };

  // Total monthly room-cleans across all guest room configs (drives volume discount)
  const totalGuestMonthlyCleans=()=>guestRoomConfigs.reduce((s,c)=>s+(c.monthlyCleans||0),0);

  const calculateSubtotal=()=>{
    if(!squareFeet)return 0;
    const sqft=parseInt(squareFeet);
    let total=sqft*getRateForSqft(sqft);
    if(guestRoomConfigs.length>0){
      const rawGuestTotal=guestRoomConfigs.reduce((s,c)=>s+calcConfigMonthlyCost(c),0);
      const vd=calcVolumeDiscount(totalGuestMonthlyCleans());
      total+=rawGuestTotal*(1-vd);
    }
    total+=getFacilityMonthlyCost(commonAreas,35,commonAreasFreq)+getFacilityMonthlyCost(diningAreas,50,diningAreasFreq)+getFacilityMonthlyCost(fitnessCenters,60,fitnessCentersFreq)+getFacilityMonthlyCost(poolSpas,75,poolSpasFreq)+getFacilityMonthlyCost(eventSpaces,100,eventSpacesFreq)+getFacilityMonthlyCost(laundryRooms,40,laundryRoomsFreq)+getFacilityMonthlyCost(lobbyReceptions,55,lobbyReceptionsFreq);
    if(sharedBathrooms>0&&sharedBathroomsFreq){ const f=Math.floor(sharedBathrooms); const h=sharedBathrooms%1!==0; const ppc=(f*21)+(h?14:0); total+=getFacilityMonthlyCost(1,ppc,sharedBathroomsFreq); }
    if(addOns.windowCleaning)total+=150; if(addOns.floorWaxing)total+=200; if(addOns.carpetCleaning)total+=parseInt(squareFeet)*0.35; if(addOns.pressureWashing)total+=parseInt(squareFeet)*0.25; if(addOns.postConstruction)total+=parseInt(squareFeet)*0.50; if(addOns.disinfection)total+=parseInt(squareFeet)*0.15;
    return Math.max(total,PRICING.minimum);
  };

  const getPriceBreakdown=()=>{
    const bd=[]; if(!squareFeet)return bd;
    const sqft=parseInt(squareFeet);
    bd.push({label:`Base Cleaning (${sqft.toLocaleString()} sqft)`,amount:sqft*getRateForSqft(sqft)});
    if(guestRoomConfigs.length>0){
      const vd=calcVolumeDiscount(totalGuestMonthlyCleans());
      guestRoomConfigs.forEach(c=>{
        const raw=calcConfigMonthlyCost(c);
        const discounted=raw*(1-vd);
        bd.push({
          label:`${getRoomTypeLabel(c)} × ${c.quantity} (${freqLabel(c.freqType,c.freqCount)})`,
          amount:discounted,
          originalAmount:vd>0?raw:null,
          discountAmount:vd>0?raw*vd:0,
          discountPercent:vd>0?`${Math.round(vd*100)}% vol.`:"",
        });
      });
      if(vd===0&&totalGuestMonthlyCleans()>0){
        const next=totalGuestMonthlyCleans()<150?150:totalGuestMonthlyCleans()<300?300:totalGuestMonthlyCleans()<450?450:totalGuestMonthlyCleans()<600?600:totalGuestMonthlyCleans()<900?900:1200;
        bd.push({label:`💡 ${Math.round(next-totalGuestMonthlyCleans())} more cleans/mo unlocks 3% volume discount`,amount:0,isInfo:true});
      }
    }
    const rooms=[[commonAreas,35,commonAreasFreq,"Common Areas"],[diningAreas,50,diningAreasFreq,"Dining Areas"],[fitnessCenters,60,fitnessCentersFreq,"Fitness Centers"],[poolSpas,75,poolSpasFreq,"Pool/Spa Areas"],[eventSpaces,100,eventSpacesFreq,"Event Spaces"],[laundryRooms,40,laundryRoomsFreq,"Laundry Rooms"],[lobbyReceptions,55,lobbyReceptionsFreq,"Lobby/Reception"]];
    rooms.forEach(([qty,price,freq,label])=>{ if(qty>0&&freq){const v=FREQ_VISITS[freq];const m=FREQ_MULT[freq];const base=qty*price*v;const cost=base*m;bd.push({label:`${label} (${freq})`,amount:cost,originalAmount:m!==1?base:null,discountPercent:FREQ_LABELS[freq],discountAmount:m<1?(base-cost):0,isUpcharge:m>1});} });
    if(sharedBathrooms>0&&sharedBathroomsFreq){const f=Math.floor(sharedBathrooms);const h=sharedBathrooms%1!==0;const ppc=(f*21)+(h?14:0);const v=FREQ_VISITS[sharedBathroomsFreq];const m=FREQ_MULT[sharedBathroomsFreq];const base=ppc*v;const cost=base*m;bd.push({label:`Shared Bathrooms (${sharedBathroomsFreq})`,amount:cost,originalAmount:m!==1?base:null,discountPercent:FREQ_LABELS[sharedBathroomsFreq],discountAmount:m<1?(base-cost):0,isUpcharge:m>1});}
    if(addOns.windowCleaning)bd.push({label:"Window Cleaning",amount:150}); if(addOns.floorWaxing)bd.push({label:"Floor Waxing",amount:200}); if(addOns.carpetCleaning)bd.push({label:"Carpet Deep Clean",amount:parseInt(squareFeet)*0.35}); if(addOns.pressureWashing)bd.push({label:"Pressure Washing",amount:parseInt(squareFeet)*0.25}); if(addOns.postConstruction)bd.push({label:"Post-Construction",amount:parseInt(squareFeet)*0.50}); if(addOns.disinfection)bd.push({label:"Disinfection",amount:parseInt(squareFeet)*0.15});
    return bd;
  };
  const totalSavings=()=>getPriceBreakdown().reduce((s,i)=>s+(i.discountAmount&&!i.isUpcharge?i.discountAmount:0),0);

  const handleSubmit=async()=>{
    const {firstName,lastName,email,phone,businessName,streetAddress,suiteUnit,city,state,zipCode}=sharedInfo;
    const fd=new FormData();
    fd.append("First Name",firstName);fd.append("Last Name",lastName);fd.append("Email",email);fd.append("Phone",phone);fd.append("Business Name",businessName||"N/A");
    fd.append("Address",streetAddress);fd.append("Suite/Unit",suiteUnit||"N/A");fd.append("City",city);fd.append("State",state);fd.append("ZIP",zipCode);
    fd.append("Hospitality Type",hospType||"Not specified");fd.append("Market Segment","hospitality");fd.append("Square Feet",squareFeet);
    if(guestRoomConfigs.length>0)fd.append("Guest Room Configs",JSON.stringify(guestRoomConfigs.map(c=>({...c,freqSummary:freqLabel(c.freqType,c.freqCount)}))));
    fd.append("Common Areas",commonAreas);fd.append("Dining Areas",diningAreas);fd.append("Fitness Centers",fitnessCenters);fd.append("Pool/Spas",poolSpas);fd.append("Event Spaces",eventSpaces);fd.append("Laundry Rooms",laundryRooms);fd.append("Lobby/Reception",lobbyReceptions);fd.append("Shared Bathrooms",sharedBathrooms);
    fd.append("Add-ons",Object.keys(addOns).filter(k=>addOns[k]).join(", ")||"None");fd.append("Preferred Days",preferredDays.join(", ")||"Not specified");fd.append("Expected Start Month",startMonth||"Not specified");fd.append("Preferred Time",preferredTime||"Not specified");fd.append("Special Instructions",specialInstructions||"None");fd.append("TOTAL PRICE",`$${calculateSubtotal().toFixed(2)}`);fd.append("_captcha","false");fd.append("_template","table");
    try{const r=await fetch("https://formsubmit.co/ajax/AkCleaningSuOficina@gmail.com",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(Object.fromEntries(fd))});const res=await r.json();if(res.success)setShowSuccessModal(true);else alert("Error. Please try again.");}catch{alert("Error. Please try again.");}
  };

  const resetAll=()=>{setShowSuccessModal(false);setStep(3);setHospType("");setSquareFeet("");setGuestRoomConfigs([]);setCommonAreas(0);setDiningAreas(0);setFitnessCenters(0);setPoolSpas(0);setEventSpaces(0);setLaundryRooms(0);setLobbyReceptions(0);setSharedBathrooms(0);setCommonAreasFreq("");setDiningAreasFreq("");setFitnessCentersFreq("");setPoolSpasFreq("");setEventSpacesFreq("");setLaundryRoomsFreq("");setLobbyReceptionsFreq("");setSharedBathroomsFreq("");setAddOns({windowCleaning:false,floorWaxing:false,carpetCleaning:false,pressureWashing:false,postConstruction:false,disinfection:false});setPreferredDays([]);setPreferredTime("");setSpecialInstructions("");onBack();};

  const goNext=()=>{window.scrollTo({top:0,behavior:"smooth"});setTimeout(()=>setStep(s=>s+1),100);};
  const goBack=()=>{if(step===3){onBack();return;}window.scrollTo({top:0,behavior:"smooth"});setTimeout(()=>setStep(s=>s-1),100);};

  const pct = step===3 ? "75%" : "100%";

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{maxHeight:"calc(100vh - 40px)",display:"flex",flexDirection:"column"}}>
      <div style={{...CARD_STYLE,borderRadius:"28px",display:"flex",flexDirection:"column",maxHeight:"100%",backgroundColor:"#FEFCF5",border:"1px solid rgba(212,160,23,0.25)"}}>
        {/* Sidebar header — espresso-steel */}
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
                  <div style={{color:"#4A3728",fontSize:"14px",fontWeight:"600",flex:1}}>
                    {item.label}
                    {item.discountPercent&&(
                      <span style={{display:"inline-block",marginLeft:"8px",padding:"2px 6px",borderRadius:"4px",background:item.isUpcharge?"linear-gradient(135deg,#f59e0b,#d97706)":"linear-gradient(135deg,#3DA864,#2D7A4A)",fontSize:"10px",fontWeight:"900",color:"white"}}>
                        {item.isUpcharge?`+${item.discountPercent}`:`-${item.discountPercent}`}
                      </span>
                    )}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"2px"}}>
                    {item.originalAmount&&<div style={{color:"rgba(100,100,100,0.5)",fontSize:"12px",textDecoration:"line-through",fontWeight:"600"}}>${item.originalAmount.toFixed(2)}</div>}
                    <div style={{color:item.discountPercent&&!item.isUpcharge?"#1E5C38":"#4A3728",fontSize:"14px",fontWeight:"800"}}>${item.amount.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {totalSavings()>0&&(
                <div style={{display:"flex",justifyContent:"space-between",padding:"14px 16px",marginTop:"10px",borderRadius:"10px",background:"linear-gradient(135deg,rgba(46,125,79,0.12),rgba(30,92,56,0.12))",border:"1px solid rgba(46,125,79,0.3)"}}>
                  <div style={{color:"#2E7D4F",fontSize:"14px",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.5px"}}>✓ Total Savings</div>
                  <div style={{color:"#2E7D4F",fontSize:"16px",fontWeight:"900"}}>-${totalSavings().toFixed(2)}</div>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",padding:"16px 0",marginTop:"10px",borderTop:"2px solid rgba(93,235,241,0.3)"}}>
                <div style={{color:"#A07B15",fontSize:"14px",fontWeight:"800",textTransform:"uppercase"}}>Subtotal</div>
                <div style={{color:"#4A3728",fontSize:"16px",fontWeight:"900"}}>${calculateSubtotal().toFixed(2)}</div>
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
            <div style={{color:"#2D1800",fontWeight:"900",fontSize:"36px"}}>${calculateSubtotal().toFixed(2)}</div>
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
        .continue-btn:not(:disabled):active { background: linear-gradient(160deg, #DDD5B8 0%, #3E3830 60%, #2C2416 100%) !important; color: #F5E8C0 !important; box-shadow: 0 2px 6px rgba(180,160,120,0.25) !important; transform: scale(0.98); }
        .hf-mobile-price { display:none; }
        @media (max-width:900px) { .hf-layout { grid-template-columns:1fr !important; } .hf-sidebar { display:none !important; } .hf-mobile-price { display:block !important; } }
        @media (max-width: 640px) {
          .hf-layout { padding: 12px !important; gap: 0 !important; }
          .hf-header { padding: 24px 16px !important; }
          .hf-cleaning-title { font-size: 38px !important; letter-spacing: 5px !important; }
          .hf-suoficina-title { font-size: 42px !important; }
          .hf-form-body { padding: 24px 16px !important; }
          .hf-prop-type-grid { grid-template-columns: repeat(3,1fr) !important; gap: 8px !important; }
          .hf-prop-type-card { padding: 12px 6px !important; }
          .hf-prop-type-icon { font-size: 20px !important; margin-bottom: 4px !important; }
          .hf-prop-type-label { font-size: 10px !important; }
          .hf-sqft-label { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .hf-rooms-grid { grid-template-columns: 1fr !important; }
          .hf-addons-grid { grid-template-columns: 1fr !important; }
          .hf-days-grid { grid-template-columns: repeat(4,1fr) !important; }
          .hf-times-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hf-btn-row { gap: 10px !important; }
          .hf-modal-inner { padding: 24px 18px !important; border-radius: 18px !important; }
          .hf-modal-template-grid { grid-template-columns: repeat(3,1fr) !important; }
          .hf-freq-type-row { flex-direction: column !important; gap: 8px !important; }
          .hf-freq-type-row button { flex: none !important; width: 100% !important; }
        }
        @media (max-width: 380px) {
          .hf-cleaning-title { font-size: 32px !important; letter-spacing: 4px !important; }
          .hf-suoficina-title { font-size: 36px !important; }
          .hf-prop-type-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>

      <div className="hf-layout" style={{maxWidth:"1400px",margin:"0 auto",padding:"30px 20px",display:"grid",gridTemplateColumns:"1fr 380px",gap:"30px",alignItems:"start",position:"relative",zIndex:1}}>

        {/* Form card */}
        <div style={CARD_STYLE}>
          {/* Header */}
          <div style={{background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",borderBottom:"1px solid rgba(212,160,23,0.3)",padding:"30px",textAlign:"center",position:"relative",overflow:"hidden"}} className="hf-header">
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
                <div style={{fontFamily:"'Oswald', sans-serif",fontSize:"42px",fontWeight:"300",letterSpacing:"8px",color:"white",textShadow:"0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(240,192,64,0.3)"}} className="hf-cleaning-title">CLEANING</div>
                <div style={{fontFamily:"'Allura', cursive",fontSize:"46px",letterSpacing:"3px",marginTop:"-8px",fontWeight:"400",background:"linear-gradient(180deg, #FFF0A0 0%, #F0C040 25%, #C8900A 50%, #F0C040 75%, #FFF0A0 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}} className="hf-suoficina-title">Su Oficina</div>
              </div>
              <div style={{height:"2px",width:"80px",background:"linear-gradient(90deg,transparent,#F0C040,transparent)",margin:"14px auto 10px",boxShadow:"0 0 10px rgba(240,192,64,0.5)"}}/>
              <div style={{color:"rgba(240,192,64,0.7)",fontSize:"13px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>🏨 Hospitality Cleaning Quote</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{height:"6px",background:"rgba(212,160,23,0.15)"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#A07B15,#D4A017,#F0C040)",width:pct,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",boxShadow:"0 0 15px rgba(212,160,23,0.6)"}}/>
          </div>

          <div style={{padding:"50px 40px",background:"transparent"}} className="hf-form-body">

            {/* ── STEP 3: Property Details ─────────────────────────────────── */}
            {step===3&&(
              <div className="fade-in-up">
                {/* Hospitality Type */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{...labelSt,fontSize:"14px",fontWeight:"800",marginBottom:"15px",letterSpacing:"1px"}}>🏨 Property Type</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}} className="hf-prop-type-grid">
                    {[{value:"hotel",icon:"🏨",label:"Hotel"},{value:"bnb",icon:"🏡",label:"B&B / Inn"},{value:"resort",icon:"🌴",label:"Resort"},{value:"motel",icon:"🛣️",label:"Motel"},{value:"vacation",icon:"🏖️",label:"Vacation Rental"},{value:"extended",icon:"🏢",label:"Extended Stay"},{value:"hostel",icon:"🎒",label:"Hostel"},{value:"event-venue",icon:"🎉",label:"Event Venue"},{value:"other-hosp",icon:"🏠",label:"Other"}].map(t=>(
                      <div key={t.value} onClick={()=>setHospType(t.value)} className="hf-prop-type-card" style={{padding:"16px 10px",borderRadius:"12px",cursor:"pointer",transition:"all 0.2s ease",textAlign:"center",
                        border:hospType===t.value?"2px solid #0891B2":"2px solid rgba(212,160,23,0.2)",
                        background:hospType===t.value?"linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))":"rgba(255,255,255,0.7)",
                        boxShadow:hospType===t.value?"0 0 18px rgba(6,182,212,0.3)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                        <div className="hf-prop-type-icon" style={{fontSize:"24px",marginBottom:"6px"}}>{t.icon}</div>
                        <div className="hf-prop-type-label" style={{fontSize:"12px",fontWeight:"800",color:hospType===t.value?"#0891B2":"#4A3728"}}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Square Footage */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"14px",fontWeight:"800",color:"#A07B15",marginBottom:"20px",letterSpacing:"1px",textTransform:"uppercase",flexWrap:"wrap",gap:"8px"}} className="hf-sqft-label">
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}><Building2 size={18} color="#A07B15"/>Total Square Footage *</div>
                    <div style={{fontSize:"24px",fontWeight:"900",color:"#4A3728"}}>{parseInt(squareFeet||0).toLocaleString()} sqft</div>
                  </label>
                  <input type="range" min="500" max="50000" step="100" value={squareFeet||500} onChange={e=>setSquareFeet(e.target.value)}
                    style={{width:"100%",height:"8px",borderRadius:"4px",outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none",marginBottom:"16px",
                      background:`linear-gradient(to right, #D4A017 0%, #D4A017 ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(212,160,23,0.15) ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(212,160,23,0.15) 100%)`}}/>
                  <style>{`input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#A07B15,#D4A017,#F0C040);cursor:pointer;border:3px solid white;box-shadow:0 4px 12px rgba(143,170,184,0.5);}input[type="range"]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#A07B15,#D4A017,#F0C040);cursor:pointer;border:3px solid white;}`}</style>
                  <div style={{position:"relative"}}>
                    <input type="number" min="500" max="50000" value={squareFeet||""} onChange={e=>setSquareFeet(e.target.value)} placeholder="Enter square feet..." style={{...inputSt,paddingRight:"55px",fontSize:"17px",fontWeight:"700"}}/>
                    <div style={{position:"absolute",right:"20px",top:"50%",transform:"translateY(-50%)",color:"#A07B15",fontSize:"14px",fontWeight:"700",pointerEvents:"none"}}>sqft</div>
                  </div>
                </div>

                {/* Guest Room Builder */}
                <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.85),rgba(255,248,220,0.7))",border:"2px dashed rgba(8,145,178,0.5)",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column",gap:"15px",marginBottom:"20px"}}>
                  <div style={{fontSize:"11px",fontWeight:"800",color:"#0891B2",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px",display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#0891B2",display:"inline-block"}}></span>Step Required — Click to Configure
                  </div>
                  <button onClick={()=>{setEditingIndex(null);setShowGuestRoomModal(true);}} style={{width:"100%",padding:"24px 20px",borderRadius:"14px",background:"linear-gradient(180deg, #E8E0C8 0%, #EDE5CE 40%, #F5F0E0 100%)",color:"#5C3D10",cursor:"pointer",boxShadow:"0 4px 20px rgba(212,160,23,0.25), 0 1px 4px rgba(212,160,23,0.15)",border:"2px solid #0891B2",textAlign:"center",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:"-75%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",transform:"skewX(-20deg)",pointerEvents:"none"}}/>
                    <div style={{fontSize:"22px",fontWeight:"900",letterSpacing:"0.5px",textTransform:"uppercase",color:"#5C3D10",textShadow:"none"}}>🛏️ Configure Guest Rooms</div>
                    <div style={{fontSize:"13px",fontWeight:"700",marginTop:"7px",color:"rgba(61,46,0,0.8)",letterSpacing:"0.6px",textTransform:"uppercase",borderTop:"1px solid rgba(212,160,23,0.3)",paddingTop:"8px"}}>👆 Tap to tell us your room types & configurations — Required for accurate quote</div>
                  </button>
                  {guestRoomConfigs.length>0&&(
                    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                      {guestRoomConfigs.map((c,i)=>(
                        <div key={i} style={{background:"rgba(255,255,255,0.8)",borderRadius:"10px",padding:"12px 15px",display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid rgba(212,160,23,0.15)"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:"13px",fontWeight:"700",color:"#4A3728",marginBottom:"3px"}}>{getRoomTypeLabel(c)} × {c.quantity}</div>
                            <div style={{fontSize:"11px",color:"#A07B15",fontWeight:"600"}}>{(()=>{const vd=calcVolumeDiscount(totalGuestMonthlyCleans());const displayPpc=vd>0?Math.floor(c.pricePerClean*(1-vd)):c.pricePerClean;return `$${displayPpc}/clean${vd>0?` (was $${c.pricePerClean})`:""}`;})()} · {freqLabel(c.freqType,c.freqCount)} · ~${calcConfigMonthlyCost(c).toFixed(0)}/mo</div>
                          </div>
                          <div style={{display:"flex",gap:"8px"}}>
                            <button onClick={()=>editGuestRoom(i)} style={{padding:"6px 12px",borderRadius:"6px",border:"none",background:"rgba(212,160,23,0.2)",color:"#A07B15",fontSize:"11px",fontWeight:"700",cursor:"pointer"}}>Edit</button>
                            <button onClick={()=>setGuestRoomConfigs(guestRoomConfigs.filter((_,j)=>j!==i))} style={{padding:"6px 12px",borderRadius:"6px",border:"none",background:"rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"11px",fontWeight:"700",cursor:"pointer"}}>×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Facility counters */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px",marginBottom:"30px"}} className="hf-rooms-grid">
                  <RoomCounter icon="🛋️" label="Common Areas"    price="$35/clean"  count={commonAreas}     onDec={()=>setCommonAreas(Math.max(0,commonAreas-1))}         onInc={()=>setCommonAreas(commonAreas+1)}         freq={commonAreasFreq}     onFreqChange={setCommonAreasFreq}/>
                  <RoomCounter icon="🍽️" label="Dining Areas"    price="$50/clean"  count={diningAreas}     onDec={()=>setDiningAreas(Math.max(0,diningAreas-1))}         onInc={()=>setDiningAreas(diningAreas+1)}         freq={diningAreasFreq}     onFreqChange={setDiningAreasFreq}/>
                  <RoomCounter icon="🏋️" label="Fitness Centers" price="$60/clean"  count={fitnessCenters}  onDec={()=>setFitnessCenters(Math.max(0,fitnessCenters-1))}   onInc={()=>setFitnessCenters(fitnessCenters+1)}   freq={fitnessCentersFreq}  onFreqChange={setFitnessCentersFreq}/>
                  <RoomCounter icon="🏊" label="Pool/Spa Areas"  price="$75/clean"  count={poolSpas}        onDec={()=>setPoolSpas(Math.max(0,poolSpas-1))}               onInc={()=>setPoolSpas(poolSpas+1)}               freq={poolSpasFreq}        onFreqChange={setPoolSpasFreq}/>
                  <RoomCounter icon="🎉" label="Event Spaces"    price="$100/clean" count={eventSpaces}     onDec={()=>setEventSpaces(Math.max(0,eventSpaces-1))}         onInc={()=>setEventSpaces(eventSpaces+1)}         freq={eventSpacesFreq}     onFreqChange={setEventSpacesFreq}/>
                  <RoomCounter icon="🧺" label="Laundry Rooms"   price="$40/clean"  count={laundryRooms}    onDec={()=>setLaundryRooms(Math.max(0,laundryRooms-1))}       onInc={()=>setLaundryRooms(laundryRooms+1)}       freq={laundryRoomsFreq}    onFreqChange={setLaundryRoomsFreq}/>
                  <RoomCounter icon="🏨" label="Lobby/Reception" price="$55/clean"  count={lobbyReceptions} onDec={()=>setLobbyReceptions(Math.max(0,lobbyReceptions-1))} onInc={()=>setLobbyReceptions(lobbyReceptions+1)} freq={lobbyReceptionsFreq} onFreqChange={setLobbyReceptionsFreq}/>
                  <RoomCounter icon="🚻" label="Shared Bathrooms" price="$21+/clean" count={sharedBathrooms} onDec={()=>setSharedBathrooms(Math.max(0,sharedBathrooms-1))} onInc={()=>setSharedBathrooms(sharedBathrooms+1)} freq={sharedBathroomsFreq} onFreqChange={setSharedBathroomsFreq}/>
                </div>

                <div style={{display:"flex",gap:"15px",marginTop:"30px"}} className="hf-btn-row">
                  <button onClick={goBack} style={{flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                    <ChevronLeft size={20}/> Back
                  </button>
                  <button onClick={goNext} disabled={!squareFeet} className="continue-btn" style={{flex:2,padding:"18px",borderRadius:"16px",border:squareFeet?"2px solid rgba(212,160,23,0.6)":"2px solid rgba(212,160,23,0.2)",background:squareFeet?"linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)":"rgba(255,255,255,0.4)",fontSize:"15px",fontWeight:"800",cursor:squareFeet?"pointer":"not-allowed",color:squareFeet?"#F5E8C0":"#B8A060",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.25s ease"}}>
                    Continue <ChevronRight size={20}/>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Add-ons & Schedule ───────────────────────────────── */}
            {step===4&&(
              <div className="fade-in-up">
                {/* Add-ons */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#A07B15",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <CheckCircle2 size={18} color="#D4A017"/>Additional Services (Optional)
                  </label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}} className="hf-addons-grid">
                    {[{key:"windowCleaning",label:"Window Cleaning",price:"$150"},{key:"floorWaxing",label:"Floor Waxing/Buffing",price:"$200"},{key:"carpetCleaning",label:"Carpet Deep Clean",price:"$0.35/sqft"},{key:"pressureWashing",label:"Pressure Washing",price:"$0.25/sqft"},{key:"postConstruction",label:"Post-Construction",price:"$0.50/sqft"},{key:"disinfection",label:"Disinfection",price:"$0.15/sqft"}].map(a=>(
                      <div key={a.key} onClick={()=>setAddOns({...addOns,[a.key]:!addOns[a.key]})} style={{padding:"18px 16px",borderRadius:"16px",cursor:"pointer",transition:"all 0.3s ease",display:"flex",alignItems:"flex-start",gap:"10px",
                        border:addOns[a.key]?"1.5px solid rgba(212,160,23,0.6)":"1.5px solid rgba(212,160,23,0.25)",
                        background:addOns[a.key]?"linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,235,140,0.5) 40%, rgba(212,160,23,0.65) 100%)":"#EDE5CE",
                        boxShadow:addOns[a.key]?"0 4px 16px rgba(212,160,23,0.3)":"0 2px 6px rgba(0,0,0,0.04)"}}>
                        <div style={{width:"20px",height:"20px",borderRadius:"6px",border:addOns[a.key]?"none":"2px solid rgba(212,160,23,0.4)",background:addOns[a.key]?"linear-gradient(135deg,#3DA864,#2D7A4A)":"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}>
                          {addOns[a.key]&&<CheckCircle2 size={14} color="white"/>}
                        </div>
                        <div>
                          <div style={{fontSize:"14px",fontWeight:"800",marginBottom:"3px",color:addOns[a.key]?"#2D1E00":"#4A3728"}}>{a.label}</div>
                          <div style={{fontSize:"11px",color:addOns[a.key]?"rgba(61,40,0,0.75)":"#A07B15",fontWeight:"700"}}>{a.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Start Month */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#A07B15",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <Calendar size={18} color="#A07B15"/>Expected Start Month (Optional)
                  </label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                    {Array.from({length:12},(_,i)=>{
                      const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()+i);
                      const label=d.toLocaleDateString("en-US",{month:"long",year:"numeric"});
                      const short=d.toLocaleDateString("en-US",{month:"short",year:"2-digit"});
                      return (
                        <div key={label} onClick={()=>setStartMonth(startMonth===label?"":label)}
                          style={{padding:"12px 10px",borderRadius:"12px",cursor:"pointer",textAlign:"center",transition:"all 0.2s ease",
                            border:startMonth===label?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",
                            background:startMonth===label?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                            color:startMonth===label?"white":"#4A3728",
                            boxShadow:startMonth===label?"0 4px 14px rgba(212,160,23,0.35)":"0 2px 6px rgba(0,0,0,0.04)"}}>
                          <div style={{fontSize:"13px",fontWeight:"800"}}>{short}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Days */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#A07B15",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <Calendar size={18} color="#A07B15"/>Preferred Days (Optional)
                  </label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}} className="hf-days-grid">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                      <div key={d} onClick={()=>setPreferredDays(preferredDays.includes(d)?preferredDays.filter(x=>x!==d):[...preferredDays,d])}
                        style={{padding:"14px 10px",borderRadius:"12px",cursor:"pointer",textAlign:"center",fontSize:"14px",fontWeight:"800",transition:"all 0.3s ease",
                          border:preferredDays.includes(d)?"2px solid #D4A017":"2px solid rgba(212,160,23,0.3)",
                          background:preferredDays.includes(d)?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                          color:preferredDays.includes(d)?"white":"#4A3728",
                          boxShadow:preferredDays.includes(d)?"0 4px 14px rgba(212,160,23,0.35)":"0 2px 6px rgba(0,0,0,0.04)"}}>{d}</div>
                    ))}
                  </div>
                </div>

                {/* Preferred Time */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#A07B15",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <Clock size={18} color="#A07B15"/>Preferred Time (Optional)
                  </label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}} className="hf-times-grid">
                    {["Morning (6-10am)","Mid-Day (10am-2pm)","Afternoon (2-6pm)","Evening (6-10pm)","Overnight (10pm-6am)"].map(t=>(
                      <div key={t} onClick={()=>setPreferredTime(t)} style={{padding:"14px 12px",borderRadius:"12px",cursor:"pointer",fontSize:"12px",fontWeight:"800",textAlign:"center",transition:"all 0.3s ease",
                        border:preferredTime===t?"2px solid #D4A017":"2px solid rgba(212,160,23,0.3)",
                        background:preferredTime===t?"linear-gradient(135deg,#D4A017,#F0C040)":"rgba(255,255,255,0.85)",
                        color:preferredTime===t?"white":"#4A3728",
                        boxShadow:preferredTime===t?"0 4px 14px rgba(212,160,23,0.35)":"0 2px 6px rgba(0,0,0,0.04)"}}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{...labelSt,fontSize:"14px",fontWeight:"800",marginBottom:"15px",letterSpacing:"1px",textTransform:"uppercase"}}>Special Instructions (Optional)</label>
                  <textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} placeholder="Any specific requirements..." rows={4} style={{...inputSt,resize:"vertical",fontFamily:"inherit"}}/>
                </div>

                {/* Terms */}
                <div style={{padding:"20px",borderRadius:"16px",background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.2)",marginBottom:"30px"}}>
                  <p style={{fontSize:"12px",color:"#555",fontWeight:"600",lineHeight:"1.6",margin:0}}>
                    By submitting this request, you agree to our{" "}
                    <a href="/TermsAndConditions.pdf" target="_blank" rel="noopener noreferrer" style={{color:"#F0C040",textDecoration:"underline",fontWeight:"700"}}>Terms & Conditions</a>.{" "}
                    Our team will review your request and contact you within 24 hours to confirm details and schedule service.
                  </p>
                </div>

                <div style={{display:"flex",gap:"15px"}} className="hf-btn-row">
                  <button onClick={goBack} style={{flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                    <ChevronLeft size={20}/> Back
                  </button>
                  <button onClick={handleSubmit} style={{flex:2,padding:"18px",borderRadius:"16px",border:"none",background:"linear-gradient(135deg,#3DA864,#2D7A4A)",color:"white",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                    Submit Request <CheckCircle2 size={20}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hf-sidebar" style={{position:"sticky",top:"20px",height:"fit-content"}}><Sidebar/></div>
      </div>

      {/* Mobile sticky price bar */}
      <div ref={mobileBarRef} className="hf-mobile-price" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000}}>
        <div style={{background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",borderTop:"2px solid rgba(212,160,23,0.4)",boxShadow:"0 -8px 30px rgba(0,0,0,0.3)"}}>
          <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"rgba(240,192,64,0.8)",fontSize:"11px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase"}}>Monthly Estimate</div>
              {totalSavings()>0&&<div style={{color:"#3DA864",fontSize:"11px",fontWeight:"700",marginTop:"2px"}}>✓ Saving ${totalSavings().toFixed(2)}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#FFF0A0",fontSize:"28px",fontWeight:"900",lineHeight:"1"}}>${calculateSubtotal().toFixed(2)}</div>
              <div style={{color:"rgba(240,192,64,0.6)",fontSize:"10px",fontWeight:"600"}}>per month</div>
            </div>
          </div>
          {getPriceBreakdown().length>0&&(
            <div style={{borderTop:"1px solid rgba(212,160,23,0.25)",overflowY:"scroll",maxHeight:"120px",padding:"6px 20px 10px",WebkitOverflowScrolling:"touch"}}>
              {getPriceBreakdown().map((item,i)=>(
                !item.isInfo&&<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",fontSize:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{color:"rgba(240,192,64,0.85)",fontWeight:"600",flex:1,marginRight:"8px"}}>{item.label}{item.discountPercent&&<span style={{marginLeft:"6px",padding:"1px 5px",borderRadius:"3px",background:item.isUpcharge?"#d97706":"#2E7D4F",color:"white",fontSize:"9px",fontWeight:"900"}}>{item.isUpcharge?`+${item.discountPercent}`:`-${item.discountPercent}`}</span>}</span>
                  <span style={{color:"#FFF0A0",fontWeight:"700",flexShrink:0}}>{item.originalAmount&&<span style={{color:"rgba(255,255,255,0.3)",textDecoration:"line-through",marginRight:"4px",fontSize:"10px"}}>${item.originalAmount.toFixed(2)}</span>}${item.amount.toFixed(2)}</span>
                </div>
              ))}
              {totalSavings()>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"5px 0 0",borderTop:"1px solid rgba(46,125,79,0.4)",marginTop:"3px"}}>
                <span style={{color:"#3DA864",fontSize:"12px",fontWeight:"800"}}>✓ Total Savings</span>
                <span style={{color:"#3DA864",fontSize:"12px",fontWeight:"900"}}>-${totalSavings().toFixed(2)}</span>
              </div>}
            </div>
          )}
        </div>
      </div>

      {/* Guest Room Modal */}
      {showGuestRoomModal&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",overflowY:"auto"}}>
          <div style={{background:"linear-gradient(135deg,#FFFFFF,#F5F0EB)",borderRadius:"24px",padding:"30px 24px",maxWidth:"700px",width:"100%",maxHeight:"90vh",overflowY:"auto",border:"1px solid rgba(212,160,23,0.25)",boxShadow:"0 30px 80px rgba(0,0,0,0.15)"}} className="hf-modal-inner">
            <h2 style={{fontSize:"26px",fontWeight:"900",color:"#4A3728",marginBottom:"8px"}}>🛏️ Configure Guest Room</h2>
            <p style={{fontSize:"14px",color:"#666",marginBottom:"25px",fontWeight:"600"}}>{editingIndex!==null?"Update room configuration":"Add a guest room type"}</p>

            {/* Templates */}
            <div style={{marginBottom:"25px"}}>
              <label style={labelSt}>Quick Templates</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}} className="hf-modal-template-grid">
                {[{id:"studio",icon:"🏠",name:"Studio"},{id:"standard",icon:"🛏️",name:"Standard"},{id:"deluxe",icon:"⭐",name:"Deluxe"},{id:"suite",icon:"🏰",name:"Suite"},{id:"custom",icon:"✏️",name:"Custom"}].map(t=>(
                  <button key={t.id} onClick={()=>applyTemplate(t.id)} style={{padding:"14px 10px",borderRadius:"10px",border:modalTemplate===t.id?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",background:modalTemplate===t.id?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)",color:modalTemplate===t.id?"#5C4A1E":"#4A3728",cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontSize:"20px",marginBottom:"4px"}}>{t.icon}</div><div style={{fontSize:"12px",fontWeight:"800"}}>{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Beds */}
            <div style={{marginBottom:"20px"}}>
              <label style={labelSt}>🛏️ Beds</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:0,l:"Studio"},{v:1,l:"1 Bed"},{v:2,l:"2 Beds"},{v:3,l:"3+ Beds"}].map(o=>(
                  <button key={o.v} onClick={()=>setModalBeds(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalBeds===o.v?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",background:modalBeds===o.v?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)",color:modalBeds===o.v?"#5C4A1E":"#4A3728",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div style={{marginBottom:"20px"}}>
              <label style={labelSt}>🚿 Bathrooms</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:1,l:"1 Bath"},{v:1.5,l:"1.5 Bath"},{v:2,l:"2 Bath"},{v:0,l:"Shared"}].map(o=>(
                  <button key={o.v} onClick={()=>setModalBathrooms(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalBathrooms===o.v?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",background:modalBathrooms===o.v?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)",color:modalBathrooms===o.v?"#5C4A1E":"#4A3728",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>
                ))}
              </div>
            </div>

            {/* Kitchen */}
            <div style={{marginBottom:"20px"}}>
              <label style={labelSt}>🍳 Kitchen</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:"none",l:"None"},{v:"kitchenette",l:"Kitchenette"},{v:"full",l:"Full Kitchen"}].map(o=>(
                  <button key={o.v} onClick={()=>setModalKitchen(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalKitchen===o.v?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",background:modalKitchen===o.v?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)",color:modalKitchen===o.v?"#5C4A1E":"#4A3728",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{marginBottom:"20px"}}>
              <label style={labelSt}>📐 Room Size</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:"small",l:"Small"},{v:"medium",l:"Medium"},{v:"large",l:"Large"},{v:"xl",l:"XL"}].map(o=>(
                  <button key={o.v} onClick={()=>setModalSize(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalSize===o.v?"2px solid #D4A017":"2px solid rgba(212,160,23,0.25)",background:modalSize===o.v?"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,175,55,0.08))":"rgba(255,255,255,0.8)",color:modalSize===o.v?"#5C4A1E":"#4A3728",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>
                ))}
              </div>
            </div>

            {/* Living Area */}
            <div style={{marginBottom:"20px"}}>
              <label style={{padding:"14px 16px",borderRadius:"10px",border:"2px solid rgba(212,160,23,0.25)",background:modalLivingArea?"linear-gradient(135deg,rgba(212,160,23,0.12),rgba(212,175,55,0.06))":"rgba(255,255,255,0.8)",cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",transition:"all 0.2s ease"}}>
                <input type="checkbox" checked={modalLivingArea} onChange={e=>setModalLivingArea(e.target.checked)} style={{width:"18px",height:"18px",cursor:"pointer"}}/>
                <div>
                  <div style={{color:"#4A3728",fontSize:"13px",fontWeight:"800"}}>🛋️ Separate Living Area / Suite</div>
                  <div style={{color:"#888",fontSize:"11px",fontWeight:"600",marginTop:"2px"}}>Adds seating, sofa, coffee table cleaning</div>
                </div>
              </label>
            </div>

            {/* Quantity */}
            <div style={{marginBottom:"25px"}}>
              <label style={labelSt}>🔢 Quantity of This Room Type</label>
              <div style={{display:"flex",alignItems:"center",gap:"12px",background:"rgba(212,160,23,0.06)",padding:"16px",borderRadius:"12px"}}>
                {[[-10,"rgba(239,68,68,0.2)","#ef4444"],[-1,"rgba(239,68,68,0.2)","#ef4444"]].map(([d,bg,col])=>(
                  <button key={d} onClick={()=>setModalQuantity(Math.max(1,modalQuantity+d))} style={{padding:"10px 16px",borderRadius:"8px",border:"none",background:bg,color:col,fontSize:d===-10?"14px":"16px",fontWeight:"900",cursor:"pointer"}}>{d}</button>
                ))}
                <div style={{flex:1,textAlign:"center",fontSize:"28px",fontWeight:"900",color:"#4A3728"}}>{modalQuantity}</div>
                {[[1,"linear-gradient(135deg,#D4A017,#F0C040)"],[10,"linear-gradient(135deg,#D4A017,#F0C040)"]].map(([d,bg])=>(
                  <button key={d} onClick={()=>setModalQuantity(modalQuantity+d)} style={{padding:"10px 16px",borderRadius:"8px",border:"none",background:bg,color:"white",fontSize:d===1?"16px":"14px",fontWeight:"900",cursor:"pointer"}}>+{d}</button>
                ))}
              </div>
            </div>

            {/* Cleaning Frequency — NEW */}
            <div style={{marginBottom:"25px",background:"linear-gradient(135deg,rgba(8,145,178,0.06),rgba(6,182,212,0.04))",borderRadius:"14px",padding:"20px",border:"2px solid rgba(8,145,178,0.2)"}}>
              <label style={{...labelSt,color:"#0891B2",marginBottom:"14px"}}>🗓️ Cleaning Frequency for This Room Type *</label>

              {/* Frequency type selector */}
              <div style={{display:"flex",gap:"8px",marginBottom:"16px"}} className="hf-freq-type-row">
                {[{v:"per-day",l:"Per Day"},{v:"per-week",l:"Per Week"},{v:"per-month",l:"Per Month"}].map(o=>(
                  <button key={o.v} onClick={()=>setModalFreqType(o.v)} style={{flex:1,padding:"12px 8px",borderRadius:"10px",cursor:"pointer",fontSize:"13px",fontWeight:"800",transition:"all 0.15s ease",
                    border:modalFreqType===o.v?"2px solid #0891B2":"2px solid rgba(212,160,23,0.25)",
                    background:modalFreqType===o.v?"linear-gradient(135deg,rgba(8,145,178,0.15),rgba(6,182,212,0.08))":"rgba(255,255,255,0.8)",
                    color:modalFreqType===o.v?"#0891B2":"#4A3728"}}>{o.l}</button>
                ))}
              </div>

              {/* Count stepper */}
              <div style={{display:"flex",alignItems:"center",gap:"12px",background:"rgba(255,255,255,0.7)",padding:"14px 16px",borderRadius:"10px",border:"1px solid rgba(212,160,23,0.2)"}}>
                <button onClick={()=>setModalFreqCount(Math.max(1,modalFreqCount-1))} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:"rgba(239,68,68,0.12)",color:"#ef4444",fontSize:"20px",fontWeight:"900",cursor:"pointer"}}>−</button>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:"32px",fontWeight:"900",color:"#0891B2",lineHeight:"1"}}>{modalFreqCount}</div>
                  <div style={{fontSize:"12px",color:"#888",fontWeight:"600",marginTop:"4px"}}>
                    {modalFreqType==="per-day"?"times per day":modalFreqType==="per-week"?"times per week":"times per month"}
                  </div>
                </div>
                <button onClick={()=>setModalFreqCount(modalFreqCount+1)} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:"linear-gradient(135deg,#0891B2,#06B6D4)",color:"white",fontSize:"20px",fontWeight:"900",cursor:"pointer"}}>+</button>
              </div>

              {/* Plain-English summary */}
              <div style={{marginTop:"12px",padding:"10px 14px",borderRadius:"8px",background:"rgba(8,145,178,0.08)",border:"1px solid rgba(8,145,178,0.15)",textAlign:"center"}}>
                <div style={{fontSize:"13px",fontWeight:"700",color:"#0891B2"}}>
                  {modalFreqCount} room{modalFreqCount>1?"s":""} of this type cleaned{" "}
                  {modalFreqType==="per-day"?"per day":modalFreqType==="per-week"?"per week":"per month"}
                  {" "}= <strong>~{Math.round(calcMonthlyCleans(modalFreqType,modalFreqCount))} cleans/month</strong>
                </div>
                <div style={{fontSize:"11px",color:"#666",marginTop:"4px",fontWeight:"600"}}>
                  ({modalQuantity} total rooms in building, {modalFreqCount} cleaned {modalFreqType==="per-day"?"daily":modalFreqType==="per-week"?"per week":"per month"})
                </div>
              </div>
            </div>

            {/* Price preview */}
            {(()=>{
              const ppc=calcGuestPrice({beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea});
              const rawMonthly=calcMonthlyCleans(modalFreqType,modalFreqCount)*ppc;
              // Simulate adding this config to existing ones to show live aggregate discount
              const existingCleans=guestRoomConfigs.filter((_,i)=>i!==editingIndex).reduce((s,c)=>s+(c.monthlyCleans||0),0);
              const thisCleans=calcMonthlyCleans(modalFreqType,modalFreqCount);
              const totalCleans=existingCleans+thisCleans;
              const vd=calcVolumeDiscount(totalCleans);
              const discounted=rawMonthly*(1-vd);
              const nextTier=totalCleans<150?150:totalCleans<300?300:totalCleans<450?450:totalCleans<600?600:totalCleans<900?900:totalCleans<1200?1200:null;
              return (
                <div style={{padding:"15px",borderRadius:"10px",background:"linear-gradient(135deg,rgba(46,125,79,0.12),rgba(30,92,56,0.12))",border:"1px solid rgba(46,125,79,0.3)",marginBottom:"25px"}}>
                  <div style={{textAlign:"center",marginBottom:vd>0||nextTier?"10px":"0"}}>
                    <div style={{fontSize:"12px",color:"#888",fontWeight:"600",marginBottom:"8px"}}>ESTIMATED MONTHLY COST — THIS ROOM TYPE</div>
                    {vd>0&&<div style={{fontSize:"14px",color:"rgba(100,100,100,0.5)",textDecoration:"line-through",fontWeight:"600",marginBottom:"2px"}}>${rawMonthly.toFixed(2)}</div>}
                    <div style={{fontSize:"28px",fontWeight:"900",color:"#2E7D4F"}}>${discounted.toFixed(2)}</div>
                    {/* $/clean highlight — shows discounted price when volume discount applies */}
                    <div style={{display:"inline-flex",alignItems:"center",gap:"6px",marginTop:"10px",padding:"8px 14px",borderRadius:"10px",background:"linear-gradient(135deg,rgba(212,160,23,0.15),rgba(240,192,64,0.1))",border:"1.5px solid rgba(212,160,23,0.4)"}}>
                      {vd>0&&<span style={{fontSize:"13px",fontWeight:"600",color:"rgba(100,100,100,0.45)",textDecoration:"line-through",marginRight:"2px"}}>${ppc}</span>}
                      <span style={{fontSize:"18px",fontWeight:"900",color:vd>0?"#2E7D4F":"#A07B15"}}>${vd>0?Math.floor(ppc*(1-vd)):ppc}</span>
                      <span style={{fontSize:"12px",fontWeight:"800",color:vd>0?"#2D7A4A":"#8B6914",textTransform:"uppercase",letterSpacing:"0.5px"}}>/clean</span>
                      <span style={{fontSize:"11px",color:"#999",fontWeight:"600",marginLeft:"4px"}}>× ~{calcMonthlyCleans(modalFreqType,modalFreqCount).toFixed(1)} cleans/mo</span>
                    </div>
                    {vd>0&&<div style={{fontSize:"11px",color:"#888",marginTop:"6px"}}>Volume discount: −{Math.round(vd*100)}%</div>}
                  </div>
                  {vd>0&&(
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                      <div style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"8px 16px",borderRadius:"20px",background:"linear-gradient(135deg,#3DA864,#2D7A4A)",boxShadow:"0 0 18px rgba(46,125,79,0.6), 0 0 35px rgba(30,92,56,0.3), 0 4px 12px rgba(46,125,79,0.3)",whiteSpace:"nowrap"}}>
                        <span style={{fontSize:"11px",color:"rgba(255,255,255,0.85)",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.5px"}}>You Save</span>
                        <span style={{fontSize:"16px",color:"white",fontWeight:"900"}}>{Math.round(vd*100)}%</span>
                        <span style={{fontSize:"10px",color:"rgba(255,255,255,0.7)",fontWeight:"600"}}>({Math.round(totalCleans)} cleans/mo)</span>
                      </div>
                    </div>
                  )}
                  {!vd&&nextTier&&thisCleans>0&&(
                    <div style={{padding:"8px 12px",borderRadius:"8px",background:"rgba(212,160,23,0.1)",border:"1px solid rgba(212,160,23,0.2)",textAlign:"center"}}>
                      <div style={{fontSize:"11px",color:"#A07B15",fontWeight:"700"}}>💡 {Math.round(nextTier-totalCleans)} more cleans/mo unlocks 3% volume discount</div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{display:"flex",gap:"12px"}}>
              <button onClick={()=>{setShowGuestRoomModal(false);resetModal();}} style={{flex:1,padding:"16px",borderRadius:"12px",border:"2px solid rgba(212,160,23,0.3)",background:"white",color:"#A07B15",fontSize:"14px",fontWeight:"800",cursor:"pointer"}}>Cancel</button>
              <button onClick={saveGuestRoom} style={{flex:2,padding:"16px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#D4A017,#F0C040)",color:"white",fontSize:"14px",fontWeight:"800",cursor:"pointer"}}>{editingIndex!==null?"Update Room Type":"Add Room Type"}</button>
            </div>
          </div>
        </div>
      )}

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
