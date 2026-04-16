import React, { useState, useEffect, useRef } from "react";
import { Building2, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import OfficeForm from "./OfficeForm";
import HospitalityForm from "./HospitalityForm";
import OtherForm from "./OtherForm";

const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || "";

export default function CleaningSuOficinaBooking() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [businessName, setBusinessName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [suiteUnit, setSuiteUnit]         = useState("");
  const [city, setCity]                   = useState("");
  const [stateName, setStateName]         = useState("");
  const [zipCode, setZipCode]             = useState("");
  const [category, setCategory]           = useState("");
  const autocompleteInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (step !== 2) return;
    const input = autocompleteInputRef.current;
    if (!input) return;
    const init = () => {
      try {
        if (!window.google?.maps?.places || autocompleteRef.current) return;
        const ac = new window.google.maps.places.Autocomplete(input, {
          types: ["address"], componentRestrictions: { country: "us" },
        });
        autocompleteRef.current = ac;
        ac.addListener("place_changed", () => {
          try {
            const place = ac.getPlace();
            if (!place.address_components) return;
            let street = "", cityV = "", stateV = "", zip = "";
            place.address_components.forEach(c => {
              if (c.types.includes("street_number"))              street = c.long_name + " ";
              if (c.types.includes("route"))                      street += c.long_name;
              if (c.types.includes("locality"))                   cityV = c.long_name;
              if (c.types.includes("administrative_area_level_1")) stateV = c.short_name;
              if (c.types.includes("postal_code"))                zip = c.long_name;
            });
            setStreetAddress(street); setCity(cityV); setStateName(stateV); setZipCode(zip);
            input.value = street;
          } catch (e) { console.warn("Places autocomplete error:", e); }
        });
      } catch (e) { console.warn("Google Places init failed:", e); }
    };
    if (!window.google) {
      if (document.querySelector('script[src*="maps.googleapis.com"]')) return;
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      s.async = true; s.defer = true;
      s.onload = init;
      s.onerror = () => console.warn("Google Maps script failed to load");
      document.head.appendChild(s);
    } else { init(); }
  }, [step]);

  const sharedInfo = { firstName, lastName, email, phone, businessName, streetAddress, suiteUnit, city, state: stateName, zipCode };
  const goNext  = () => { window.scrollTo({ top:0, behavior:"smooth" }); setTimeout(() => setStep(s => s+1), 100); };
  const goBack  = () => { window.scrollTo({ top:0, behavior:"smooth" }); setTimeout(() => setStep(s => s-1), 100); };
  const goStep2 = () => { window.scrollTo({ top:0, behavior:"smooth" }); setTimeout(() => setStep(2), 100); };

  const step1Valid = firstName && lastName && email && phone;
  const step2Valid = streetAddress && city && stateName && zipCode && category;

  const pageBg = {
    minHeight: "100vh", backgroundColor: "#F2EFE8",
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(180,190,200,0.5) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(200,210,220,0.4) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(212,160,23,0.08) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(180,190,200,0.35) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(100,110,120,0.08) 0%, transparent 100%)`,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
    padding: "20px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };
  const cardStyle = {
    backgroundColor: "#FFFFFF",
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(180,190,200,0.25) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(200,210,220,0.2) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(212,160,23,0.05) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(180,190,200,0.18) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(100,110,120,0.05) 0%, transparent 100%)`,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
    borderRadius: "24px", overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
    border: "1px solid rgba(212,160,23,0.2)",
  };
  const inputSt = {
    width: "100%", padding: "16px 18px", borderRadius: "14px",
    border: "2px solid rgba(212,160,23,0.35)", background: "#F8F9FA",
    color: "#4A3728", fontSize: "16px", fontWeight: "600", outline: "none",
    transition: "all 0.3s ease", boxSizing: "border-box",
  };
  const labelSt = {
    fontSize: "12px", fontWeight: "700", color: "#A07B15",
    marginBottom: "8px", display: "block", letterSpacing: "0.5px", textTransform: "uppercase",
  };
  const btnBackSt = {
    flex: 1, padding: "16px 18px", borderRadius: "14px",
    border: "2px solid rgba(212,160,23,0.3)", background: "white",
    color: "#A07B15", fontSize: "15px", fontWeight: "800",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  };
  const btnNextSt = (ok) => ({
    flex: 2, padding: "16px 18px", borderRadius: "14px",
    border: ok ? "2px solid rgba(212,160,23,0.6)" : "2px solid rgba(212,160,23,0.2)",
    background: ok ? "linear-gradient(160deg, #E8E0C8 0%, #5A5248 60%, #3E3830 100%)" : "rgba(255,255,255,0.4)",
    color: ok ? "#F5E8C0" : "#B8A060",
    fontSize: "15px", fontWeight: "800", cursor: ok ? "pointer" : "not-allowed",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    transition: "all 0.25s ease", width: "100%",
  });

  if (step === 3) {
    if (category === "office")      return <OfficeForm      sharedInfo={sharedInfo} onBack={goStep2} />;
    if (category === "hospitality") return <HospitalityForm sharedInfo={sharedInfo} onBack={goStep2} />;
    if (category === "other")       return <OtherForm       sharedInfo={sharedInfo} onBack={goStep2} />;
  }

  return (
    <div style={pageBg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatUp { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-22px);opacity:1} }
        input, textarea, select { font-size: 16px !important; touch-action: manipulation; }
        input::placeholder, textarea::placeholder { color: rgba(100,100,100,0.5); }
        button { touch-action: manipulation; }
        .app-continue-btn:not(:disabled):hover { background: linear-gradient(160deg, #EDE5CE 0%, #4E4840 60%, #3E3830 100%) !important; color: #F5E8C0 !important; box-shadow: 0 4px 16px rgba(180,160,120,0.3) !important; border-color: rgba(212,160,23,0.6) !important; transform: translateY(-1px); }
        .app-continue-btn:not(:disabled):active { background: linear-gradient(160deg, #DDD5B8 0%, #3E3830 60%, #2C2416 100%) !important; color: #F5E8C0 !important; transform: scale(0.98); }
        @media (max-width: 600px) {
          .app-outer-wrap { padding: 12px !important; }
          .app-header-pad { padding: 28px 16px !important; }
          .app-cleaning-title { font-size: 38px !important; letter-spacing: 5px !important; }
          .app-suoficina-title { font-size: 42px !important; }
          .app-form-body { padding: 24px 16px !important; }
          .app-name-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .app-city-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .app-category-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .app-category-card { padding: 14px 16px !important; flex-direction: row !important; text-align: left !important; align-items: center !important; gap: 14px !important; }
          .app-cat-icon { font-size: 28px !important; margin-bottom: 0 !important; flex-shrink: 0; }
          .app-cat-label { font-size: 15px !important; margin-bottom: 2px !important; }
          .app-cat-desc { font-size: 11px !important; }
          .app-hero-icon { width: 75px !important; height: 75px !important; margin-bottom: 20px !important; }
          .app-hero-icon span { font-size: 40px !important; }
          .app-hero-h2 { font-size: 24px !important; margin: 0 0 12px !important; }
          .app-hero-p { font-size: 15px !important; }
          .app-input-large { font-size: 15px !important; padding: 14px 16px !important; }
          .app-btn-row { gap: 10px !important; }
        }
      `}</style>

      {/* Animated background */}
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",filter:"blur(90px)",background:"rgba(240,192,64,0.25)",top:"-120px",left:"-120px"}}/>
        <div style={{position:"absolute",width:"380px",height:"380px",borderRadius:"50%",filter:"blur(80px)",background:"rgba(212,160,23,0.15)",bottom:"-80px",right:"-80px"}}/>
        <div style={{position:"absolute",width:"220px",height:"220px",borderRadius:"50%",filter:"blur(60px)",background:"rgba(240,192,64,0.2)",top:"35%",left:"65%"}}/>
        <svg width="560" height="560" style={{position:"absolute",top:"-100px",left:"28%",opacity:0.8}} viewBox="0 0 560 560">
          <circle cx="280" cy="280" r="240" fill="none" stroke="rgba(240,192,64,0.7)" strokeWidth="1.8"/>
          <circle cx="280" cy="280" r="190" fill="none" stroke="rgba(212,160,23,0.4)" strokeWidth="1.2"/>
          <circle cx="280" cy="280" r="140" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.2"/>
          <circle cx="280" cy="280" r="90"  fill="none" stroke="rgba(212,160,23,0.3)" strokeWidth="0.8"/>
        </svg>
        <svg width="300" height="300" style={{position:"absolute",bottom:"-60px",right:"4%",opacity:0.7}} viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="125" fill="none" stroke="rgba(212,160,23,0.55)" strokeWidth="1.8"/>
          <circle cx="150" cy="150" r="80"  fill="none" stroke="rgba(240,192,64,0.5)"  strokeWidth="1.2"/>
        </svg>
        {[{w:"7px",l:"22%",b:"12%",dur:"7s",del:"0s"},{w:"5px",l:"48%",b:"18%",dur:"9s",del:"1.5s"},{w:"8px",l:"72%",b:"9%",dur:"8s",del:"0.7s"},{w:"6px",l:"33%",b:"22%",dur:"10s",del:"2s"},{w:"6px",l:"82%",b:"28%",dur:"7.5s",del:"3s"}].map((d,i)=>(
          <div key={i} style={{position:"absolute",width:d.w,height:d.w,borderRadius:"50%",background:"rgba(212,160,23,0.5)",left:d.l,bottom:d.b,animation:`floatUp ${d.dur} ${d.del} infinite ease-in-out`,boxShadow:`0 0 ${parseInt(d.w)*3}px rgba(240,192,64,0.6)`}}/>
        ))}
      </div>

      <div className="app-outer-wrap" style={{maxWidth:"900px",margin:"0 auto",padding:"30px 20px",position:"relative",zIndex:1}}>
        <div style={cardStyle}>

          {/* Header */}
          <div className="app-header-pad" style={{background:"linear-gradient(160deg, #3E3830 0%, #4E4840 50%, #3E3830 100%)",borderBottom:"1px solid rgba(212,160,23,0.3)",padding:step===1?"50px 30px":"30px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <svg width="220" height="220" style={{position:"absolute",top:"-60px",left:"-40px",opacity:0.25,pointerEvents:"none"}} viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(240,192,64,0.8)" strokeWidth="1.2"/>
              <circle cx="110" cy="110" r="70"  fill="none" stroke="rgba(255,240,160,0.5)" strokeWidth="0.8"/>
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
                <div className="app-cleaning-title" style={{fontFamily:"'Oswald', sans-serif",fontSize:step===1?"52px":"42px",fontWeight:"300",letterSpacing:"8px",color:"white",textShadow:"0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(240,192,64,0.3)"}}>CLEANING</div>
                <div className="app-suoficina-title" style={{fontFamily:"'Allura', cursive",fontSize:step===1?"56px":"46px",letterSpacing:"3px",marginTop:"-8px",fontWeight:"400",background:"linear-gradient(180deg, #FFF0A0 0%, #F0C040 25%, #C8900A 50%, #F0C040 75%, #FFF0A0 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Su Oficina</div>
              </div>
              {step===1&&(
                <>
                  <div style={{height:"2px",width:"80px",background:"linear-gradient(90deg,transparent,#F0C040,transparent)",margin:"20px auto 14px",boxShadow:"0 0 10px rgba(240,192,64,0.5)"}}/>
                  <p style={{color:"rgba(240,192,64,0.7)",fontSize:"13px",margin:0,fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>Professional Commercial Cleaning</p>
                </>
              )}
              {step===2&&(
                <>
                  <div style={{height:"2px",width:"80px",background:"linear-gradient(90deg,transparent,#F0C040,transparent)",margin:"14px auto 10px",boxShadow:"0 0 10px rgba(240,192,64,0.5)"}}/>
                  <div style={{color:"rgba(240,192,64,0.7)",fontSize:"13px",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>📍 Service Location & Business Type</div>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{height:"6px",background:"rgba(212,160,23,0.15)"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#A07B15,#D4A017,#F0C040)",width:step===1?"50%":"100%",transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",boxShadow:"0 0 15px rgba(212,160,23,0.6)"}}/>
          </div>

          <div className="app-form-body" style={{padding:"50px 40px"}}>

            {/* STEP 1 */}
            {step===1&&(
              <div className="fade-in-up">
                <div style={{textAlign:"center",marginBottom:"40px"}}>
                  <div className="app-hero-icon" style={{width:"100px",height:"100px",background:"linear-gradient(135deg,#A07B15,#D4A017,#F0C040)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 20px 50px rgba(212,160,23,0.25)",border:"4px solid rgba(255,255,255,0.9)"}}>
                    <span style={{fontSize:"50px"}}>💼</span>
                  </div>
                  <h2 className="app-hero-h2" style={{fontSize:"32px",fontWeight:"900",color:"#4A3728",margin:"0 0 16px",letterSpacing:"-0.5px",textTransform:"uppercase"}}>Let's Get Started!</h2>
                  <p className="app-hero-p" style={{color:"#666",fontSize:"17px",lineHeight:"1.6",fontWeight:"500"}}>Professional cleaning for your business</p>
                </div>

                <div style={{maxWidth:"520px",margin:"0 auto"}}>
                  <div className="app-name-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"18px",marginBottom:"20px"}}>
                    {[["First Name","John",firstName,setFirstName],["Last Name","Smith",lastName,setLastName]].map(([lbl,ph,val,set])=>(
                      <div key={lbl}>
                        <label style={{display:"block",fontSize:"12px",fontWeight:"800",color:"#A07B15",marginBottom:"10px",letterSpacing:"1px",textTransform:"uppercase"}}>{lbl}</label>
                        <input className="app-input-large" type="text" placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{...inputSt,fontSize:"16px",padding:"16px 18px"}}/>
                      </div>
                    ))}
                  </div>
                  {[["Email Address","email","john@company.com",email,setEmail],["Phone Number","tel","(907) 555-1234",phone,setPhone]].map(([lbl,type,ph,val,set])=>(
                    <div key={lbl} style={{marginBottom:"20px"}}>
                      <label style={{display:"block",fontSize:"12px",fontWeight:"800",color:"#A07B15",marginBottom:"10px",letterSpacing:"1px",textTransform:"uppercase"}}>{lbl}</label>
                      <input className="app-input-large" type={type} placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{...inputSt,fontSize:"16px",padding:"16px 18px"}}/>
                    </div>
                  ))}
                  <div style={{marginBottom:"32px"}}>
                    <label style={{display:"block",fontSize:"12px",fontWeight:"800",color:"#A07B15",marginBottom:"10px",letterSpacing:"1px",textTransform:"uppercase"}}>
                      Business Name <span style={{color:"#999",fontSize:"11px",textTransform:"none",fontWeight:"600"}}>(optional)</span>
                    </label>
                    <input className="app-input-large" type="text" placeholder="Acme Corp" value={businessName} onChange={e=>setBusinessName(e.target.value)} style={{...inputSt,fontSize:"16px",padding:"16px 18px"}}/>
                  </div>
                  <button onClick={goNext} disabled={!step1Valid} className="app-continue-btn" style={btnNextSt(step1Valid)}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step===2&&(
              <div className="fade-in-up">
                <div style={{marginBottom:"28px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"13px",fontWeight:"800",color:"#A07B15",marginBottom:"12px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <MapPin size={16} color="#A07B15"/> Business Address *
                  </label>
                  <input id="autocomplete-input" ref={autocompleteInputRef} type="text" placeholder="Start typing your street address..." defaultValue={streetAddress} onChange={e=>setStreetAddress(e.target.value)} onBlur={e=>setStreetAddress(e.target.value)} style={{...inputSt,marginBottom:"8px"}}/>
                  <p style={{fontSize:"12px",color:"#A07B15",fontWeight:"600",margin:"4px 0 12px"}}>📍 Start typing for address suggestions</p>
                  <label style={labelSt}>Apt. / Suite / Unit <span style={{color:"#999",fontWeight:"600",textTransform:"none",fontSize:"11px"}}>(optional)</span></label>
                  <input type="text" placeholder="e.g. Suite 200, Unit 4B..." value={suiteUnit} onChange={e=>setSuiteUnit(e.target.value)} style={inputSt}/>
                </div>

                <div className="app-city-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:"12px",marginBottom:"28px"}}>
                  {[["City","",city,setCity,{}],["State","",stateName,setStateName,{maxLength:2}],["ZIP","",zipCode,setZipCode,{maxLength:5}]].map(([lbl,,val,set,extra])=>(
                    <div key={lbl}>
                      <label style={labelSt}>{lbl}</label>
                      <input type="text" value={val} onChange={e=>set(e.target.value)} style={{...inputSt,...(lbl==="State"?{textTransform:"uppercase"}:{})}} maxLength={extra.maxLength}/>
                    </div>
                  ))}
                </div>

                <div style={{marginBottom:"28px"}}>
                  <label style={{display:"flex",alignItems:"center",fontSize:"13px",fontWeight:"800",color:"#A07B15",marginBottom:"12px",gap:"8px",letterSpacing:"1px",textTransform:"uppercase"}}>
                    <Building2 size={16} color="#A07B15"/> What type of business? *
                  </label>
                  <div className="app-category-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
                    {[
                      {value:"office",      icon:"🏢",label:"Office",      desc:"Corporate, Law, Real Estate, Co-working"},
                      {value:"hospitality", icon:"🏨",label:"Hospitality", desc:"Hotels, B&B, Lodging, Resorts"},
                      {value:"other",       icon:"🏥",label:"Other",       desc:"Healthcare, Retail, Industrial"},
                    ].map(cat=>(
                      <div key={cat.value} className="app-category-card" onClick={()=>setCategory(cat.value)} style={{padding:"22px 14px",borderRadius:"18px",cursor:"pointer",transition:"all 0.3s ease",textAlign:"center",
                        border:category===cat.value?"2px solid #0891B2":"2px solid rgba(212,160,23,0.2)",
                        background:category===cat.value?"linear-gradient(135deg,rgba(8,145,178,0.12),rgba(6,182,212,0.06))":"rgba(255,255,255,0.7)",
                        boxShadow:category===cat.value?"0 0 18px rgba(6,182,212,0.3)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                        <div className="app-cat-icon" style={{fontSize:"32px",marginBottom:"8px"}}>{cat.icon}</div>
                        <div className="app-cat-label" style={{fontSize:"14px",fontWeight:"800",color:category===cat.value?"#0891B2":"#4A3728",marginBottom:"4px"}}>{cat.label}</div>
                        <div className="app-cat-desc" style={{fontSize:"11px",color:"#888",fontWeight:"600",lineHeight:"1.3"}}>{cat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="app-btn-row" style={{display:"flex",gap:"12px"}}>
                  <button onClick={goBack} style={btnBackSt}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!step2Valid} className="app-continue-btn" style={btnNextSt(step2Valid)}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
