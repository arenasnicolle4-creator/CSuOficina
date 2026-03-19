import React, { useState } from "react";
import { Building2, Calendar, Clock, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

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
const CARD_BG = { backgroundColor:"#0F171E", backgroundImage:`radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)`, backgroundSize:"100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px" };
const PAGE_BG = { ...CARD_BG, minHeight:"100vh", padding:"20px", fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, sans-serif" };

function FacilityFreqSelector({ value, onChange }) {
  const opts = [{value:"4x-week",label:"4x/Week",discount:"14% OFF"},{value:"3x-week",label:"3x/Week",discount:"10% OFF"},{value:"2x-week",label:"2x/Week",discount:"BASE"},{value:"weekly",label:"Weekly",discount:"+5%"},{value:"bi-weekly",label:"Bi-Weekly",discount:"+12%"},{value:"monthly",label:"Monthly",discount:"+20%"}];
  const sel=(v)=>({padding:"10px 8px",borderRadius:"8px",border:value===v?"2px solid #5DEBF1":"1px solid rgba(184,115,51,0.3)",background:value===v?"rgba(93,235,241,0.12)":"rgba(255,255,255,0.02)",cursor:"pointer",transition:"all 0.15s ease",textAlign:"center"});
  return(<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px"}}>
    <div onClick={()=>onChange("daily")} style={{...sel("daily"),gridColumn:"1 / -1"}}><div style={{fontSize:"12px",fontWeight:"700",color:value==="daily"?"#5DEBF1":"white",marginBottom:"2px"}}>Daily</div><div style={{fontSize:"9px",color:value==="daily"?"#5DEBF1":"rgba(255,255,255,0.5)",fontWeight:"600"}}>18% OFF</div></div>
    {opts.map(o=>(<div key={o.value} onClick={()=>onChange(o.value)} style={sel(o.value)}><div style={{fontSize:"12px",fontWeight:"700",color:value===o.value?"#5DEBF1":"white",marginBottom:"2px"}}>{o.label}</div><div style={{fontSize:"9px",color:value===o.value?"#5DEBF1":"rgba(255,255,255,0.5)",fontWeight:"600"}}>{o.discount}</div></div>))}
  </div>);
}

function RoomCounter({icon,label,price,count,onDec,onInc,freq,onFreqChange}){
  return(<div style={{background:"linear-gradient(135deg, rgba(138,85,35,0.08) 0%, rgba(184,115,51,0.08) 100%)",border:"1px solid rgba(184,115,51,0.2)",borderRadius:"16px",padding:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div><div style={{fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"2px"}}>{icon} {label}</div><div style={{fontSize:"11px",color:"rgba(255,255,255,0.6)",fontWeight:"600"}}>{price}</div></div>
      <div style={{fontSize:"24px",fontWeight:"900",color:"white",minWidth:"40px",textAlign:"right"}}>{count}</div>
    </div>
    <div style={{display:"flex",gap:"8px"}}>
      <button onClick={onDec} style={{flex:1,padding:"10px",borderRadius:"10px",border:"none",background:count>0?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.05)",color:count>0?"#ef4444":"rgba(255,255,255,0.3)",fontSize:"18px",fontWeight:"900",cursor:count>0?"pointer":"not-allowed"}}>−</button>
      <button onClick={onInc} style={{flex:1,padding:"10px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#8a5523 0%,#B87333 50%,#D4955A 100%)",color:"white",fontSize:"18px",fontWeight:"900",cursor:"pointer"}}>+</button>
    </div>
    {count>0&&<FacilityFreqSelector value={freq} onChange={onFreqChange}/>}
  </div>);
}

export default function HospitalityForm({ sharedInfo, onBack }) {
  const [step, setStep] = useState(3);
  const [hospType, setHospType]     = useState("");
  const [squareFeet, setSquareFeet] = useState("");

  const [showGuestRoomModal, setShowGuestRoomModal] = useState(false);
  const [guestRoomConfigs, setGuestRoomConfigs]     = useState([]);
  const [dailyTurnover, setDailyTurnover]           = useState("");
  const [modalTemplate, setModalTemplate]           = useState("");
  const [modalBeds, setModalBeds]                   = useState(1);
  const [modalBathrooms, setModalBathrooms]         = useState(1);
  const [modalKitchen, setModalKitchen]             = useState("none");
  const [modalSize, setModalSize]                   = useState("medium");
  const [modalLivingArea, setModalLivingArea]       = useState(false);
  const [modalQuantity, setModalQuantity]           = useState(1);
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
  const [preferredTime, setPreferredTime]             = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showSuccessModal, setShowSuccessModal]       = useState(false);

  const calcGuestPrice=(c)=>{ let p=25; if(c.beds===0)p+=10; else if(c.beds===1)p+=15; else if(c.beds===2)p+=25; else p+=35; const f=Math.floor(c.bathrooms); const h=c.bathrooms%1!==0; p+=(f*15)+(h?8:0); if(c.kitchen==="kitchenette")p+=8; else if(c.kitchen==="full")p+=15; if(c.size==="medium")p+=5; else if(c.size==="large")p+=10; else if(c.size==="xl")p+=15; if(c.livingArea)p+=12; return p; };
  const getRoomTypeLabel=(c)=>{ let l=""; if(c.beds===0)l="Studio"; else if(c.beds===1)l="1-Bed"; else if(c.beds===2)l="2-Bed"; else l=`${c.beds}-Bed`; if(c.livingArea)l+=" Suite"; if(c.kitchen==="kitchenette")l+=" + Kitchenette"; else if(c.kitchen==="full")l+=" + Kitchen"; l+=` (${c.bathrooms} bath${c.bathrooms>1?"s":""})`; return l; };
  const applyTemplate=(t)=>{ setModalTemplate(t); const m={studio:[0,1,"kitchenette","small",false],standard:[2,1,"none","medium",false],deluxe:[2,1,"none","large",false],suite:[1,1.5,"kitchenette","large",true],custom:[1,1,"none","medium",false]}[t]||[1,1,"none","medium",false]; setModalBeds(m[0]);setModalBathrooms(m[1]);setModalKitchen(m[2]);setModalSize(m[3]);setModalLivingArea(m[4]); };
  const saveGuestRoom=()=>{ const c={beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea,quantity:modalQuantity,pricePerClean:calcGuestPrice({beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea})}; if(editingIndex!==null){const u=[...guestRoomConfigs];u[editingIndex]=c;setGuestRoomConfigs(u);setEditingIndex(null);}else{setGuestRoomConfigs([...guestRoomConfigs,c]);} setShowGuestRoomModal(false);setModalTemplate("");setModalBeds(1);setModalBathrooms(1);setModalKitchen("none");setModalSize("medium");setModalLivingArea(false);setModalQuantity(1); };
  const editGuestRoom=(i)=>{ const c=guestRoomConfigs[i];setModalBeds(c.beds);setModalBathrooms(c.bathrooms);setModalKitchen(c.kitchen);setModalSize(c.size);setModalLivingArea(c.livingArea);setModalQuantity(c.quantity);setEditingIndex(i);setShowGuestRoomModal(true); };

  const getFacilityMonthlyCost=(qty,price,freq)=>{ if(!qty||!freq)return 0; return qty*price*(FREQ_VISITS[freq]||0)*(FREQ_MULT[freq]||1.0); };
  const getRateForSqft=(sqft)=>{ const tier=PRICING.baseRatesTiered.hospitality.find(t=>sqft<=t.max); return tier?tier.rate:0.10; };

  const calculateSubtotal=()=>{
    if(!squareFeet)return 0;
    const sqft=parseInt(squareFeet);
    let total=sqft*getRateForSqft(sqft);
    if(guestRoomConfigs.length>0&&dailyTurnover){
      const dt=parseInt(dailyTurnover)||0; const totalQty=guestRoomConfigs.reduce((s,c)=>s+c.quantity,0);
      const totalCost=guestRoomConfigs.reduce((s,c)=>s+(c.quantity*c.pricePerClean),0);
      let monthly=(dt*30*totalCost)/totalQty;
      let vd=0; if(dt>=40)vd=0.15; else if(dt>=30)vd=0.12; else if(dt>=20)vd=0.09; else if(dt>=15)vd=0.07; else if(dt>=10)vd=0.05; else if(dt>=5)vd=0.03;
      total+=monthly*(1-vd);
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
      const dt=parseInt(dailyTurnover)||0; const totalQty=guestRoomConfigs.reduce((s,c)=>s+c.quantity,0);
      const totalCost=guestRoomConfigs.reduce((s,c)=>s+(c.quantity*c.pricePerClean),0);
      if(dt>0){ let monthly=(dt*30*totalCost)/totalQty; let vd=0; if(dt>=40)vd=0.15; else if(dt>=30)vd=0.12; else if(dt>=20)vd=0.09; else if(dt>=15)vd=0.07; else if(dt>=10)vd=0.05; else if(dt>=5)vd=0.03; const disc=monthly*vd; bd.push({label:`Guest Rooms (${dt} rooms/day${vd>0?`, ${Math.round(vd*100)}% vol. discount`:""})`,amount:monthly*(1-vd),originalAmount:vd>0?monthly:null,discountAmount:disc,discountPercent:vd>0?`${Math.round(vd*100)}%`:""}); }
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
    if(guestRoomConfigs.length>0)fd.append("Guest Room Configs",JSON.stringify(guestRoomConfigs));
    fd.append("Daily Turnover",dailyTurnover||"N/A");fd.append("Common Areas",commonAreas);fd.append("Dining Areas",diningAreas);fd.append("Fitness Centers",fitnessCenters);fd.append("Pool/Spas",poolSpas);fd.append("Event Spaces",eventSpaces);fd.append("Laundry Rooms",laundryRooms);fd.append("Lobby/Reception",lobbyReceptions);fd.append("Shared Bathrooms",sharedBathrooms);
    fd.append("Add-ons",Object.keys(addOns).filter(k=>addOns[k]).join(", ")||"None");fd.append("Preferred Days",preferredDays.join(", ")||"Not specified");fd.append("Preferred Time",preferredTime||"Not specified");fd.append("Special Instructions",specialInstructions||"None");fd.append("TOTAL PRICE",`$${calculateSubtotal().toFixed(2)}`);fd.append("_captcha","false");fd.append("_template","table");
    try{const r=await fetch("https://formsubmit.co/ajax/AkCleaningSuCasa@gmail.com",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(Object.fromEntries(fd))});const res=await r.json();if(res.success)setShowSuccessModal(true);else alert("Error. Please try again.");}catch{alert("Error. Please try again.");}
  };
  const resetAll=()=>{setShowSuccessModal(false);setStep(3);setHospType("");setSquareFeet("");setGuestRoomConfigs([]);setDailyTurnover("");setCommonAreas(0);setDiningAreas(0);setFitnessCenters(0);setPoolSpas(0);setEventSpaces(0);setLaundryRooms(0);setLobbyReceptions(0);setSharedBathrooms(0);setCommonAreasFreq("");setDiningAreasFreq("");setFitnessCentersFreq("");setPoolSpasFreq("");setEventSpacesFreq("");setLaundryRoomsFreq("");setLobbyReceptionsFreq("");setSharedBathroomsFreq("");setAddOns({windowCleaning:false,floorWaxing:false,carpetCleaning:false,pressureWashing:false,postConstruction:false,disinfection:false});setPreferredDays([]);setPreferredTime("");setSpecialInstructions("");onBack();};
  const goNext=()=>{window.scrollTo({top:0,behavior:"smooth"});setTimeout(()=>setStep(s=>s+1),100);};
  const goBack=()=>{if(step===3){onBack();return;}window.scrollTo({top:0,behavior:"smooth"});setTimeout(()=>setStep(s=>s-1),100);};
  const btnBackSt={flex:1,padding:"18px",borderRadius:"16px",border:"2px solid rgba(184,115,51,0.3)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"};
  const btnNextSt=(ok)=>({flex:2,padding:"18px",borderRadius:"16px",border:"none",background:ok?"linear-gradient(135deg,#D4955A 0%,#D4955A 100%)":"rgba(255,255,255,0.1)",color:"white",fontSize:"15px",fontWeight:"800",cursor:ok?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"});

  return (
    <div style={PAGE_BG}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');.fade-in-up{animation:fadeInUp 0.5s ease-out forwards;}@keyframes fadeInUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}input::placeholder{color:rgba(255,255,255,0.4);}`}</style>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"30px 20px",display:"grid",gridTemplateColumns:"1fr 420px",gap:"30px",alignItems:"start",position:"relative",zIndex:1}}>
        <div style={{...CARD_BG,borderRadius:"32px",overflow:"hidden",boxShadow:"0 30px 80px rgba(0,0,0,0.5)",border:"1px solid rgba(184,115,51,0.2)"}}>
          {/* Header */}
          <div style={{backgroundColor:"rgba(15,23,30,0.4)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(184,115,51,0.2)",padding:"30px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(circle at 50% 50%, rgba(212,149,90,0.2) 0%, transparent 70%)",pointerEvents:"none"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
                <div style={{fontFamily:"'Oswald', sans-serif",fontSize:"52px",fontWeight:"300",letterSpacing:"8px",lineHeight:"1",color:"white"}}>CLEANING</div>
                <div style={{fontFamily:"'Allura', cursive",fontSize:"56px",color:"#B87333",letterSpacing:"3px",marginTop:"-8px",lineHeight:"1"}}>Su Oficina</div>
              </div>
            </div>
          </div>
          <div style={{height:"6px",background:"rgba(255,255,255,0.1)"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",width:step===3?"75%":"100%",transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",boxShadow:"0 0 15px rgba(184,115,51,0.6)"}}/>
          </div>
          <div style={{padding:"50px 40px"}}>

            {step===3&&(
              <div className="fade-in-up">
                {/* Hospitality Type */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"15px",display:"block",letterSpacing:"1px",textTransform:"uppercase"}}>🏨 Property Type</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
                    {[{value:"hotel",icon:"🏨",label:"Hotel"},{value:"bnb",icon:"🏡",label:"B&B / Inn"},{value:"resort",icon:"🌴",label:"Resort"},{value:"motel",icon:"🛣️",label:"Motel"},{value:"vacation",icon:"🏖️",label:"Vacation Rental"},{value:"extended",icon:"🏢",label:"Extended Stay"},{value:"hostel",icon:"🎒",label:"Hostel"},{value:"event-venue",icon:"🎉",label:"Event Venue"},{value:"other-hosp",icon:"🏠",label:"Other"}].map(t=>(
                      <div key={t.value} onClick={()=>setHospType(t.value)} style={{padding:"16px 10px",borderRadius:"12px",border:hospType===t.value?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:hospType===t.value?"linear-gradient(135deg, rgba(212,149,90,0.2) 0%, rgba(2,132,199,0.2) 100%)":"rgba(255,255,255,0.03)",cursor:"pointer",transition:"all 0.2s ease",textAlign:"center"}}>
                        <div style={{fontSize:"24px",marginBottom:"6px"}}>{t.icon}</div>
                        <div style={{fontSize:"12px",fontWeight:"800",color:hospType===t.value?"white":"#B87333"}}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Square Footage */}
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"20px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}><Building2 size={18} color="#B87333"/>Total Square Footage *</div>
                    <div style={{fontSize:"24px",fontWeight:"900",color:"white"}}>{parseInt(squareFeet||0).toLocaleString()} sqft</div>
                  </label>
                  <input type="range" min="500" max="50000" step="100" value={squareFeet||500} onChange={e=>setSquareFeet(e.target.value)} style={{width:"100%",height:"8px",borderRadius:"4px",background:`linear-gradient(to right, #B87333 0%, #B87333 ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(255,255,255,0.1) ${((parseInt(squareFeet||500)-500)/(50000-500))*100}%, rgba(255,255,255,0.1) 100%)`,outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none",marginBottom:"15px"}}/>
                  <div style={{position:"relative"}}>
                    <input type="number" min="500" max="50000" value={squareFeet||""} onChange={e=>setSquareFeet(e.target.value)} placeholder="Enter square feet..." style={{width:"100%",padding:"18px 55px 18px 20px",borderRadius:"16px",border:"2px solid rgba(184,115,51,0.3)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:"17px",fontWeight:"700",outline:"none",boxSizing:"border-box"}}/>
                    <div style={{position:"absolute",right:"20px",top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.5)",fontSize:"14px",fontWeight:"700",pointerEvents:"none"}}>sqft</div>
                  </div>
                </div>

                {/* Guest Room Builder */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px",marginBottom:"20px"}}>
                  <div style={{gridColumn:"1 / -1",background:"linear-gradient(135deg, rgba(184,115,51,0.12) 0%, rgba(143,170,184,0.12) 100%)",border:"2px dashed rgba(184,115,51,0.4)",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column",gap:"15px"}}>
                    <button onClick={()=>{setEditingIndex(null);setShowGuestRoomModal(true);}} style={{padding:"16px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg, #B87333 0%, #D4955A 100%)",color:"white",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}>🛏️ Configure Guest Rooms</button>
                    {guestRoomConfigs.length>0&&(
                      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                        {guestRoomConfigs.map((c,i)=>(
                          <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:"10px",padding:"12px 15px",display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid rgba(255,255,255,0.1)"}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:"13px",fontWeight:"700",color:"white",marginBottom:"3px"}}>{getRoomTypeLabel(c)} × {c.quantity}</div>
                              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.6)",fontWeight:"600"}}>${c.pricePerClean}/clean × {c.quantity} = ${c.pricePerClean*c.quantity}/clean</div>
                            </div>
                            <div style={{display:"flex",gap:"8px"}}>
                              <button onClick={()=>editGuestRoom(i)} style={{padding:"6px 12px",borderRadius:"6px",border:"none",background:"rgba(184,115,51,0.2)",color:"#D4955A",fontSize:"11px",fontWeight:"700",cursor:"pointer"}}>Edit</button>
                              <button onClick={()=>setGuestRoomConfigs(guestRoomConfigs.filter((_,j)=>j!==i))} style={{padding:"6px 12px",borderRadius:"6px",border:"none",background:"rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"11px",fontWeight:"700",cursor:"pointer"}}>×</button>
                            </div>
                          </div>
                        ))}
                        <div style={{padding:"15px",background:"rgba(143,170,184,0.08)",borderRadius:"10px",border:"1px solid rgba(143,170,184,0.2)"}}>
                          <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"8px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>📊 Average Rooms Cleaned Per Day *</label>
                          <input type="number" value={dailyTurnover} onChange={e=>setDailyTurnover(e.target.value)} placeholder="e.g., 25" min="1" style={{width:"100%",padding:"12px 15px",borderRadius:"10px",border:"2px solid rgba(184,115,51,0.3)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:"14px",fontWeight:"600",outline:"none",boxSizing:"border-box"}}/>
                        </div>
                      </div>
                    )}
                  </div>
                  <RoomCounter icon="🛋️" label="Common Areas"    price="$35/clean"  count={commonAreas}     onDec={()=>setCommonAreas(Math.max(0,commonAreas-1))}         onInc={()=>setCommonAreas(commonAreas+1)}         freq={commonAreasFreq}     onFreqChange={setCommonAreasFreq}/>
                  <RoomCounter icon="🍽️" label="Dining Areas"    price="$50/clean"  count={diningAreas}     onDec={()=>setDiningAreas(Math.max(0,diningAreas-1))}         onInc={()=>setDiningAreas(diningAreas+1)}         freq={diningAreasFreq}     onFreqChange={setDiningAreasFreq}/>
                  <RoomCounter icon="🏋️" label="Fitness Centers" price="$60/clean"  count={fitnessCenters}  onDec={()=>setFitnessCenters(Math.max(0,fitnessCenters-1))}   onInc={()=>setFitnessCenters(fitnessCenters+1)}   freq={fitnessCentersFreq}  onFreqChange={setFitnessCentersFreq}/>
                  <RoomCounter icon="🏊" label="Pool/Spa Areas"  price="$75/clean"  count={poolSpas}        onDec={()=>setPoolSpas(Math.max(0,poolSpas-1))}               onInc={()=>setPoolSpas(poolSpas+1)}               freq={poolSpasFreq}        onFreqChange={setPoolSpasFreq}/>
                  <RoomCounter icon="🎉" label="Event Spaces"    price="$100/clean" count={eventSpaces}     onDec={()=>setEventSpaces(Math.max(0,eventSpaces-1))}         onInc={()=>setEventSpaces(eventSpaces+1)}         freq={eventSpacesFreq}     onFreqChange={setEventSpacesFreq}/>
                  <RoomCounter icon="🧺" label="Laundry Rooms"   price="$40/clean"  count={laundryRooms}    onDec={()=>setLaundryRooms(Math.max(0,laundryRooms-1))}       onInc={()=>setLaundryRooms(laundryRooms+1)}       freq={laundryRoomsFreq}    onFreqChange={setLaundryRoomsFreq}/>
                  <RoomCounter icon="🏨" label="Lobby/Reception" price="$55/clean"  count={lobbyReceptions} onDec={()=>setLobbyReceptions(Math.max(0,lobbyReceptions-1))} onInc={()=>setLobbyReceptions(lobbyReceptions+1)} freq={lobbyReceptionsFreq} onFreqChange={setLobbyReceptionsFreq}/>
                  <RoomCounter icon="🚻" label="Shared Bathrooms" price="$21+/clean" count={sharedBathrooms} onDec={()=>setSharedBathrooms(Math.max(0,sharedBathrooms-1))} onInc={()=>setSharedBathrooms(sharedBathrooms+1)} freq={sharedBathroomsFreq} onFreqChange={setSharedBathroomsFreq}/>
                </div>

                <div style={{display:"flex",gap:"15px",marginTop:"30px"}}>
                  <button onClick={goBack} style={btnBackSt}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!squareFeet} style={btnNextSt(!!squareFeet)}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {step===4&&(
              <div className="fade-in-up">
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}><CheckCircle2 size={18} color="#B87333"/>Additional Services (Optional)</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
                    {[{key:"windowCleaning",label:"Window Cleaning",price:"$150"},{key:"floorWaxing",label:"Floor Waxing/Buffing",price:"$200"},{key:"carpetCleaning",label:"Carpet Deep Clean",price:"$0.35/sqft"},{key:"pressureWashing",label:"Pressure Washing",price:"$0.25/sqft"},{key:"postConstruction",label:"Post-Construction",price:"$0.50/sqft"},{key:"disinfection",label:"Disinfection",price:"$0.15/sqft"}].map(a=>(
                      <div key={a.key} onClick={()=>setAddOns({...addOns,[a.key]:!addOns[a.key]})} style={{padding:"18px 16px",borderRadius:"16px",border:addOns[a.key]?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:addOns[a.key]?"linear-gradient(135deg,#D4955A 0%,#5A7080 100%)":"rgba(255,255,255,0.03)",color:"white",cursor:"pointer",transition:"all 0.3s ease",display:"flex",alignItems:"flex-start",gap:"10px"}}>
                        <div style={{width:"20px",height:"20px",borderRadius:"6px",border:addOns[a.key]?"none":"2px solid rgba(255,255,255,0.3)",background:addOns[a.key]?"linear-gradient(135deg,#10b981 0%,#059669 100%)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}>{addOns[a.key]&&<CheckCircle2 size={14} color="white"/>}</div>
                        <div><div style={{fontSize:"14px",fontWeight:"800",marginBottom:"3px"}}>{a.label}</div><div style={{fontSize:"11px",color:"rgba(255,255,255,0.7)",fontWeight:"700"}}>{a.price}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}><Calendar size={18} color="#B87333"/>Preferred Days (Optional)</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(<div key={d} onClick={()=>setPreferredDays(preferredDays.includes(d)?preferredDays.filter(x=>x!==d):[...preferredDays,d])} style={{padding:"14px 10px",borderRadius:"12px",border:preferredDays.includes(d)?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:preferredDays.includes(d)?"linear-gradient(135deg,#D4955A 0%,#5A7080 100%)":"rgba(255,255,255,0.03)",color:"white",fontSize:"14px",fontWeight:"800",textAlign:"center",cursor:"pointer"}}>{d}</div>))}
                  </div>
                </div>
                <div style={{marginBottom:"30px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"15px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}><Clock size={18} color="#B87333"/>Preferred Time (Optional)</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                    {["Morning (6-10am)","Mid-Day (10am-2pm)","Afternoon (2-6pm)","Evening (6-10pm)","Overnight (10pm-6am)"].map(t=>(<div key={t} onClick={()=>setPreferredTime(t)} style={{padding:"14px 12px",borderRadius:"12px",border:preferredTime===t?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:preferredTime===t?"linear-gradient(135deg,#D4955A 0%,#5A7080 100%)":"rgba(255,255,255,0.03)",color:"white",fontSize:"12px",fontWeight:"800",textAlign:"center",cursor:"pointer"}}>{t}</div>))}
                  </div>
                </div>
                <div style={{marginBottom:"30px"}}>
                  <label style={{fontSize:"14px",fontWeight:"800",color:"#B87333",marginBottom:"15px",display:"block",letterSpacing:"1px",textTransform:"uppercase"}}>Special Instructions (Optional)</label>
                  <textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} placeholder="Any specific requirements..." rows={4} style={{width:"100%",padding:"18px 20px",borderRadius:"16px",border:"2px solid rgba(184,115,51,0.3)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:"14px",fontWeight:"600",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
                </div>
                <div style={{padding:"20px",borderRadius:"16px",background:"rgba(212,149,90,0.1)",border:"1px solid rgba(212,149,90,0.3)",marginBottom:"30px"}}>
                  <p style={{fontSize:"12px",color:"rgba(255,255,255,0.8)",fontWeight:"600",lineHeight:"1.6",margin:0}}>By submitting, you agree to our <a href="https://img1.wsimg.com/blobby/go/a218c663-7c40-48f5-aae1-0c7e30c1037f/downloads/Terms%20and%20Conditions.pdf?ver=1721081910935" target="_blank" rel="noopener noreferrer" style={{color:"#D4955A",textDecoration:"underline",fontWeight:"700"}}>Terms & Conditions</a>. We'll contact you within 24 hours.</p>
                </div>
                <div style={{display:"flex",gap:"15px"}}>
                  <button onClick={goBack} style={btnBackSt}><ChevronLeft size={20}/> Back</button>
                  <button onClick={handleSubmit} style={{flex:2,padding:"18px",borderRadius:"16px",border:"none",background:"linear-gradient(135deg,#10b981 0%,#059669 100%)",color:"white",fontSize:"15px",fontWeight:"800",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>Submit Request <CheckCircle2 size={20}/></button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{position:"sticky",top:"20px",height:"fit-content",maxHeight:"calc(100vh - 40px)"}}>
          <div style={{...CARD_BG,borderRadius:"28px",overflow:"hidden",boxShadow:"0 25px 70px rgba(0,0,0,0.6)",border:"1px solid rgba(184,115,51,0.2)",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"25px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
              <div style={{fontSize:"16px",color:"#B87333",fontWeight:"800",marginBottom:"8px",letterSpacing:"1.5px",textTransform:"uppercase"}}>Price Breakdown</div>
              <div style={{fontSize:"14px",color:"#D4955A",fontWeight:"700",background:"rgba(143,170,184,0.12)",padding:"4px 12px",borderRadius:"6px",display:"inline-block"}}>Monthly Estimate</div>
            </div>
            <div style={{padding:"20px 25px",overflowY:"auto",flex:1}}>
              {getPriceBreakdown().length===0?(<div style={{textAlign:"center",padding:"40px 20px",color:"rgba(255,255,255,0.5)",fontSize:"14px",fontWeight:"600"}}>Complete the form to see pricing</div>):(
                <>
                  {getPriceBreakdown().map((item,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 0",borderBottom:i<getPriceBreakdown().length-1?"1px solid rgba(255,255,255,0.1)":"none"}}>
                    <div style={{color:"rgba(255,255,255,0.8)",fontSize:"14px",fontWeight:"600",flex:1}}>{item.label}{item.discountPercent&&<div style={{display:"inline-block",marginLeft:"8px",padding:"2px 6px",borderRadius:"4px",background:item.isUpcharge?"linear-gradient(135deg,#f59e0b 0%,#d97706 100%)":"linear-gradient(135deg,#10b981 0%,#059669 100%)",fontSize:"10px",fontWeight:"900",color:"white"}}>{item.isUpcharge?`+${item.discountPercent}`:`-${item.discountPercent}`}</div>}</div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"2px"}}>{item.originalAmount&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:"12px",fontWeight:"600",textDecoration:"line-through"}}>${item.originalAmount.toFixed(2)}</div>}<div style={{color:item.discountPercent&&!item.isUpcharge?"#10b981":"white",fontSize:"14px",fontWeight:"800"}}>${item.amount.toFixed(2)}</div></div>
                  </div>))}
                  {totalSavings()>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",marginTop:"10px",borderRadius:"10px",background:"linear-gradient(135deg,rgba(16,185,129,0.15) 0%,rgba(5,150,105,0.15) 100%)",border:"1px solid rgba(16,185,129,0.3)"}}><div style={{color:"#10b981",fontSize:"14px",fontWeight:"800"}}>✓ Total Savings</div><div style={{color:"#10b981",fontSize:"16px",fontWeight:"900"}}>-${totalSavings().toFixed(2)}</div></div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",marginTop:"10px",borderTop:"2px solid rgba(93,235,241,0.3)"}}><div style={{color:"#B87333",fontSize:"14px",fontWeight:"800",textTransform:"uppercase"}}>Subtotal</div><div style={{color:"white",fontSize:"16px",fontWeight:"900"}}>${calculateSubtotal().toFixed(2)}</div></div>
                </>
              )}
            </div>
            <div style={{padding:"12px 20px",background:"rgba(255,255,255,0.1)",borderTop:"1px solid rgba(255,255,255,0.1)"}}><p style={{color:"rgba(255,255,255,0.8)",fontSize:"11px",margin:0,fontWeight:"600",textAlign:"center",fontStyle:"italic"}}>💡 Estimate only. Final prices may vary.</p></div>
            <div style={{padding:"25px",background:"rgba(93,235,241,0.15)",backdropFilter:"blur(10px)",borderTop:"1px solid rgba(93,235,241,0.3)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{color:"white",fontWeight:"900",fontSize:"16px",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>Total</div><div style={{fontSize:"12px",color:"#D4955A",fontWeight:"700",background:"rgba(143,170,184,0.12)",padding:"3px 10px",borderRadius:"6px",display:"inline-block"}}>per month</div></div>
                <div style={{color:"white",fontWeight:"900",fontSize:"36px"}}>${calculateSubtotal().toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Room Modal */}
      {showGuestRoomModal&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",overflowY:"auto"}}>
          <div style={{background:"linear-gradient(135deg,#2E3A47 0%,#1A252F 100%)",borderRadius:"24px",padding:"40px 35px",maxWidth:"700px",width:"100%",maxHeight:"90vh",overflowY:"auto",border:"1px solid rgba(184,115,51,0.3)",boxShadow:"0 30px 80px rgba(0,0,0,0.7)"}}>
            <h2 style={{fontSize:"26px",fontWeight:"900",color:"white",marginBottom:"8px"}}>🛏️ Configure Guest Room</h2>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.6)",marginBottom:"25px",fontWeight:"600"}}>{editingIndex!==null?"Update room configuration":"Add a guest room type"}</p>

            {/* Templates */}
            <div style={{marginBottom:"25px"}}>
              <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"12px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>Quick Templates</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                {[{id:"studio",icon:"🏠",name:"Studio"},{id:"standard",icon:"🛏️",name:"Standard"},{id:"deluxe",icon:"⭐",name:"Deluxe"},{id:"suite",icon:"🏰",name:"Suite"},{id:"custom",icon:"✏️",name:"Custom"}].map(t=>(
                  <button key={t.id} onClick={()=>applyTemplate(t.id)} style={{padding:"14px 10px",borderRadius:"10px",border:modalTemplate===t.id?"2px solid #D4955A":"2px solid rgba(184,115,51,0.2)",background:modalTemplate===t.id?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)",color:"white",cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontSize:"20px",marginBottom:"4px"}}>{t.icon}</div><div style={{fontSize:"12px",fontWeight:"800"}}>{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Beds */}
            <div style={{marginBottom:"20px"}}>
              <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"10px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>🛏️ Beds</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:0,l:"Studio"},{v:1,l:"1 Bed"},{v:2,l:"2 Beds"},{v:3,l:"3+ Beds"}].map(o=>(<button key={o.v} onClick={()=>setModalBeds(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalBeds===o.v?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:modalBeds===o.v?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)",color:"white",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>))}
              </div>
            </div>

            {/* Bathrooms */}
            <div style={{marginBottom:"20px"}}>
              <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"10px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>🚿 Bathrooms</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:1,l:"1 Bath"},{v:1.5,l:"1.5 Bath"},{v:2,l:"2 Bath"},{v:0,l:"Shared"}].map(o=>(<button key={o.v} onClick={()=>setModalBathrooms(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalBathrooms===o.v?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:modalBathrooms===o.v?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)",color:"white",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>))}
              </div>
            </div>

            {/* Kitchen */}
            <div style={{marginBottom:"20px"}}>
              <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"10px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>🍳 Kitchen</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:"none",l:"None"},{v:"kitchenette",l:"Kitchenette"},{v:"full",l:"Full Kitchen"}].map(o=>(<button key={o.v} onClick={()=>setModalKitchen(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalKitchen===o.v?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:modalKitchen===o.v?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)",color:"white",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>))}
              </div>
            </div>

            {/* Size */}
            <div style={{marginBottom:"20px"}}>
              <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"10px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>📐 Room Size</label>
              <div style={{display:"flex",gap:"10px"}}>
                {[{v:"small",l:"Small"},{v:"medium",l:"Medium"},{v:"large",l:"Large"},{v:"xl",l:"XL"}].map(o=>(<button key={o.v} onClick={()=>setModalSize(o.v)} style={{flex:1,padding:"12px",borderRadius:"10px",border:modalSize===o.v?"2px solid #D4955A":"2px solid rgba(255,255,255,0.1)",background:modalSize===o.v?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)",color:"white",fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>{o.l}</button>))}
              </div>
            </div>

            {/* Living Area */}
            <div style={{marginBottom:"20px"}}>
              <label style={{padding:"14px 16px",borderRadius:"10px",border:"2px solid rgba(255,255,255,0.1)",background:modalLivingArea?"rgba(212,149,90,0.2)":"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",transition:"all 0.2s ease"}}>
                <input type="checkbox" checked={modalLivingArea} onChange={e=>setModalLivingArea(e.target.checked)} style={{width:"18px",height:"18px",cursor:"pointer"}}/>
                <div><div style={{color:"white",fontSize:"13px",fontWeight:"800"}}>🛋️ Separate Living Area / Suite</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",fontWeight:"600",marginTop:"2px"}}>Adds seating, sofa, coffee table cleaning</div></div>
              </label>
            </div>

            {/* Quantity */}
            <div style={{marginBottom:"25px"}}>
              <label style={{fontSize:"12px",fontWeight:"700",color:"#B87333",marginBottom:"12px",display:"block",letterSpacing:"0.5px",textTransform:"uppercase"}}>🔢 Quantity of This Room Type</label>
              <div style={{display:"flex",alignItems:"center",gap:"12px",background:"rgba(255,255,255,0.05)",padding:"16px",borderRadius:"12px"}}>
                {[[-10,"rgba(239,68,68,0.2)","#ef4444"],[-1,"rgba(239,68,68,0.2)","#ef4444"]].map(([d,bg,col])=>(<button key={d} onClick={()=>setModalQuantity(Math.max(1,modalQuantity+d))} style={{padding:"10px 16px",borderRadius:"8px",border:"none",background:bg,color:col,fontSize:d===-10?"14px":"16px",fontWeight:"900",cursor:"pointer"}}>{d}</button>))}
                <div style={{flex:1,textAlign:"center",fontSize:"28px",fontWeight:"900",color:"white"}}>{modalQuantity}</div>
                {[[1,"linear-gradient(135deg,#B87333,#D4955A)"],[10,"linear-gradient(135deg,#B87333,#D4955A)"]].map(([d,bg])=>(<button key={d} onClick={()=>setModalQuantity(modalQuantity+d)} style={{padding:"10px 16px",borderRadius:"8px",border:"none",background:bg,color:"white",fontSize:d===1?"16px":"14px",fontWeight:"900",cursor:"pointer"}}>+{d}</button>))}
              </div>
            </div>

            {/* Price preview */}
            <div style={{padding:"15px",borderRadius:"10px",background:"linear-gradient(135deg,rgba(16,185,129,0.12) 0%,rgba(5,150,105,0.12) 100%)",border:"1px solid rgba(16,185,129,0.3)",marginBottom:"25px",textAlign:"center"}}>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,0.7)",fontWeight:"600",marginBottom:"4px"}}>ESTIMATED PRICE PER CLEAN</div>
              <div style={{fontSize:"28px",fontWeight:"900",color:"#10b981"}}>${calcGuestPrice({beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea})}</div>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)",marginTop:"4px"}}>per room × {modalQuantity} rooms = ${calcGuestPrice({beds:modalBeds,bathrooms:modalBathrooms,kitchen:modalKitchen,size:modalSize,livingArea:modalLivingArea})*modalQuantity}/clean</div>
            </div>

            <div style={{display:"flex",gap:"12px"}}>
              <button onClick={()=>{setShowGuestRoomModal(false);setModalTemplate("");setModalBeds(1);setModalBathrooms(1);setModalKitchen("none");setModalSize("medium");setModalLivingArea(false);setModalQuantity(1);setEditingIndex(null);}} style={{flex:1,padding:"16px",borderRadius:"12px",border:"2px solid rgba(255,255,255,0.2)",background:"transparent",color:"white",fontSize:"14px",fontWeight:"800",cursor:"pointer"}}>Cancel</button>
              <button onClick={saveGuestRoom} style={{flex:2,padding:"16px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#B87333,#D4955A)",color:"white",fontSize:"14px",fontWeight:"800",cursor:"pointer"}}>{editingIndex!==null?"Update Room Type":"Add Room Type"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal&&(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px"}}><div style={{background:"linear-gradient(135deg,#2E3A47 0%,#3D4F5C 100%)",borderRadius:"32px",padding:"50px 40px",maxWidth:"500px",width:"100%",textAlign:"center",border:"1px solid rgba(184,115,51,0.3)",boxShadow:"0 30px 80px rgba(0,0,0,0.5)"}}><div style={{width:"80px",height:"80px",borderRadius:"50%",background:"linear-gradient(135deg,#B87333 0%,#D4955A 100%)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 30px"}}><CheckCircle2 size={48} color="white"/></div><h2 style={{fontSize:"32px",fontWeight:"900",color:"white",marginBottom:"15px"}}>Request Submitted!</h2><p style={{fontSize:"16px",color:"rgba(255,255,255,0.9)",fontWeight:"600",lineHeight:"1.6",marginBottom:"30px"}}>Thank you! We'll review your request and contact you within 24 hours.</p><button onClick={resetAll} style={{padding:"18px 40px",borderRadius:"16px",border:"none",background:"linear-gradient(135deg,#B87333 0%,#D4955A 100%)",color:"white",fontSize:"16px",fontWeight:"800",cursor:"pointer",textTransform:"uppercase"}}>Done</button></div></div>)}
    </div>
  );
}
