import React, { useState, useEffect } from "react";
import { Building2, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import OfficeForm from "./OfficeForm";
import HospitalityForm from "./HospitalityForm";
import OtherForm from "./OtherForm";

const GOOGLE_PLACES_API_KEY = "AIzaSyB18lv_Rulnv7jjFrM0PP57bCLO4U4_A_I";

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

  useEffect(() => {
    if (step !== 2) return;
    const init = () => {
      const input = document.getElementById("autocomplete-input");
      if (!input || !window.google) return;
      const ac = new window.google.maps.places.Autocomplete(input, {
        types: ["address"], componentRestrictions: { country: "us" },
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place.address_components) return;
        let street = "", cityV = "", stateV = "", zip = "";
        place.address_components.forEach(c => {
          if (c.types.includes("street_number"))             street = c.long_name + " ";
          if (c.types.includes("route"))                     street += c.long_name;
          if (c.types.includes("locality"))                  cityV = c.long_name;
          if (c.types.includes("administrative_area_level_1")) stateV = c.short_name;
          if (c.types.includes("postal_code"))               zip = c.long_name;
        });
        setStreetAddress(street); setCity(cityV); setStateName(stateV); setZipCode(zip);
      });
    };
    if (!window.google) {
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      s.async = true; s.defer = true;
      s.onload = init;
      document.head.appendChild(s);
    } else { init(); }
  }, [step]);

  const sharedInfo = { firstName, lastName, email, phone, businessName, streetAddress, suiteUnit, city, state: stateName, zipCode };
  const goNext = () => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => setStep(s => s + 1), 100); };
  const goBack = () => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => setStep(s => s - 1), 100); };
  const goStep2 = () => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => setStep(2), 100); };

  const step1Valid = firstName && lastName && email && phone;
  const step2Valid = streetAddress && city && stateName && zipCode && category;

  const pageBg = {
    minHeight: "100vh", backgroundColor: "#0F171E",
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)`,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
    padding: "20px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };
  const cardStyle = {
    backgroundColor: "#0F171E",
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)`,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
    borderRadius: "32px", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    border: "1px solid rgba(184,115,51,0.2)",
  };
  const inputSt = {
    width: "100%", padding: "18px 20px", borderRadius: "16px",
    border: "2px solid rgba(184,115,51,0.3)", background: "rgba(255,255,255,0.05)",
    color: "white", fontSize: "15px", fontWeight: "600", outline: "none",
    transition: "all 0.3s ease", boxSizing: "border-box",
  };
  const labelSt = { fontSize: "12px", fontWeight: "700", color: "#B87333", marginBottom: "8px", display: "block", letterSpacing: "0.5px", textTransform: "uppercase" };
  const btnBackSt = {
    flex: 1, padding: "18px", borderRadius: "16px", border: "2px solid rgba(184,115,51,0.3)",
    background: "rgba(255,255,255,0.05)", color: "white", fontSize: "15px", fontWeight: "800",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  };
  const btnNextSt = (ok) => ({
    flex: 2, padding: "18px", borderRadius: "16px", border: "none",
    background: ok ? "linear-gradient(135deg, #D4955A 0%, #D4955A 100%)" : "rgba(255,255,255,0.1)",
    color: "white", fontSize: "15px", fontWeight: "800", cursor: ok ? "pointer" : "not-allowed",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
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
        .hero-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .hero-orb-1 { width:400px; height:400px; background:rgba(46,58,71,0.6); top:-100px; left:-100px; }
        .hero-orb-2 { width:300px; height:300px; background:rgba(61,79,92,0.5); bottom:-80px; right:-80px; }
        .hero-orb-3 { width:200px; height:200px; background:rgba(184,115,51,0.08); top:40%; left:60%; }
        input::placeholder { color:rgba(255,255,255,0.4); }
      `}</style>

      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
        <div className="hero-orb hero-orb-1"/><div className="hero-orb hero-orb-2"/><div className="hero-orb hero-orb-3"/>
      </div>

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"30px 20px", position:"relative", zIndex:1 }}>
        <div style={cardStyle}>

          {/* Header */}
          <div style={{ backgroundColor:"rgba(15,23,30,0.4)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(184,115,51,0.2)", padding: step===1 ? "50px 30px" : "30px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:"radial-gradient(circle at 50% 50%, rgba(212,149,90,0.2) 0%, transparent 70%)", pointerEvents:"none" }}/>
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
                <div style={{ fontFamily:"'Oswald', sans-serif", fontSize:"52px", fontWeight:"300", letterSpacing:"8px", lineHeight:"1", color:"white" }}>CLEANING</div>
                <div style={{ fontFamily:"'Allura', cursive", fontSize:"56px", color:"#B87333", letterSpacing:"3px", marginTop:"-8px", lineHeight:"1" }}>Su Oficina</div>
              </div>
              {step === 1 && (
                <>
                  <div style={{ height:"3px", width:"80px", background:"linear-gradient(90deg, transparent, #B87333, transparent)", margin:"20px auto 15px" }}/>
                  <p style={{ color:"rgba(255,255,255,0.9)", fontSize:"16px", margin:0, fontWeight:"500", letterSpacing:"1px", textTransform:"uppercase" }}>Professional Commercial Cleaning</p>
                </>
              )}
            </div>
          </div>

          {/* Progress */}
          <div style={{ height:"6px", background:"rgba(255,255,255,0.1)" }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg, #8a5523 0%, #B87333 50%, #D4955A 100%)", width: step===1 ? "50%" : "100%", transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 0 15px rgba(184,115,51,0.6)" }}/>
          </div>

          <div style={{ padding:"50px 40px" }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="fade-in-up">
                <div style={{ textAlign:"center", marginBottom:"50px" }}>
                  <div style={{ width:"110px", height:"110px", background:"linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 30px", boxShadow:"0 20px 50px rgba(184,115,51,0.4)", border:"4px solid rgba(255,255,255,0.2)" }}>
                    <div style={{ fontSize:"55px" }}>💼</div>
                  </div>
                  <h2 style={{ fontSize:"36px", fontWeight:"900", color:"white", margin:"0 0 20px", letterSpacing:"-1px", textTransform:"uppercase" }}>Let's Get Started!</h2>
                  <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"18px", lineHeight:"1.6", fontWeight:"500" }}>Professional cleaning for your business</p>
                </div>

                <div style={{ maxWidth:"500px", margin:"0 auto" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"25px" }}>
                    {[["First Name","John",firstName,setFirstName],["Last Name","Smith",lastName,setLastName]].map(([lbl,ph,val,set]) => (
                      <div key={lbl}>
                        <label style={{ display:"block", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"12px", letterSpacing:"1.5px", textTransform:"uppercase" }}>{lbl}</label>
                        <input type="text" placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", padding:"20px 24px", fontSize:"17px", border:"2px solid rgba(255,255,255,0.2)", borderRadius:"16px", boxSizing:"border-box", background:"rgba(255,255,255,0.95)", fontWeight:"500", outline:"none" }}/>
                      </div>
                    ))}
                  </div>
                  {[["Email Address","email","john@company.com",email,setEmail],["Phone Number","tel","(907) 555-1234",phone,setPhone]].map(([lbl,type,ph,val,set]) => (
                    <div key={lbl} style={{ marginBottom:"25px" }}>
                      <label style={{ display:"block", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"12px", letterSpacing:"1.5px", textTransform:"uppercase" }}>{lbl}</label>
                      <input type={type} placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{ width:"100%", padding:"20px 24px", fontSize:"17px", border:"2px solid rgba(255,255,255,0.2)", borderRadius:"16px", boxSizing:"border-box", background:"rgba(255,255,255,0.95)", fontWeight:"500", outline:"none" }}/>
                    </div>
                  ))}
                  <div style={{ marginBottom:"40px" }}>
                    <label style={{ display:"block", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"12px", letterSpacing:"1.5px", textTransform:"uppercase" }}>
                      Business Name <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", textTransform:"none", fontWeight:"600" }}>(optional)</span>
                    </label>
                    <input type="text" placeholder="Acme Corp" value={businessName} onChange={e=>setBusinessName(e.target.value)} style={{ width:"100%", padding:"20px 24px", fontSize:"17px", border:"2px solid rgba(255,255,255,0.2)", borderRadius:"16px", boxSizing:"border-box", background:"rgba(255,255,255,0.95)", fontWeight:"500", outline:"none" }}/>
                  </div>
                  <button onClick={goNext} disabled={!step1Valid} style={btnNextSt(step1Valid)}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="fade-in-up">
                {/* Address */}
                <div style={{ marginBottom:"35px" }}>
                  <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
                    <MapPin size={18} color="#B87333"/> Business Address *
                  </label>
                  <input id="autocomplete-input" type="text" placeholder="Start typing your street address..." value={streetAddress} onChange={e=>setStreetAddress(e.target.value)} style={{ ...inputSt, marginBottom:"10px" }}/>
                  <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", fontWeight:"600", marginTop:"4px" }}>📍 Start typing for address suggestions</p>
                  <div style={{ marginTop:"14px" }}>
                    <label style={labelSt}>Apt. / Suite / Unit <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:"600", textTransform:"none", fontSize:"11px" }}>(optional)</span></label>
                    <input type="text" placeholder="e.g. Suite 200, Unit 4B, Floor 3..." value={suiteUnit} onChange={e=>setSuiteUnit(e.target.value)} style={inputSt}/>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"15px", marginBottom:"35px" }}>
                  {[["City","",city,setCity,{}],["State","",stateName,setStateName,{maxLength:2,style:{textTransform:"uppercase"}}],["ZIP","",zipCode,setZipCode,{maxLength:5}]].map(([lbl,,val,set,extra]) => (
                    <div key={lbl}>
                      <label style={labelSt}>{lbl}</label>
                      <input type="text" value={val} onChange={e=>set(e.target.value)} style={{ ...inputSt, ...(extra.style||{}) }} maxLength={extra.maxLength}/>
                    </div>
                  ))}
                </div>

                {/* Category */}
                <div style={{ marginBottom:"35px" }}>
                  <label style={{ display:"flex", alignItems:"center", fontSize:"14px", fontWeight:"800", color:"#B87333", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
                    <Building2 size={18} color="#B87333"/> What type of business? *
                  </label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"15px" }}>
                    {[
                      { value:"office",      icon:"🏢", label:"Office",      desc:"Corporate, Law, Real Estate, Co-working & more" },
                      { value:"hospitality", icon:"🏨", label:"Hospitality", desc:"Hotels, B&B, Lodging, Resorts & more" },
                      { value:"other",       icon:"🏥", label:"Other",       desc:"Healthcare, Retail, Industrial" },
                    ].map(cat => (
                      <div key={cat.value} onClick={()=>setCategory(cat.value)} style={{ padding:"25px 15px", border: category===cat.value ? "2px solid #D4955A" : "2px solid rgba(255,255,255,0.1)", borderRadius:"20px", background: category===cat.value ? "linear-gradient(135deg, rgba(212,149,90,0.2) 0%, rgba(2,132,199,0.2) 100%)" : "rgba(255,255,255,0.03)", cursor:"pointer", transition:"all 0.3s ease", textAlign:"center" }}>
                        <div style={{ fontSize:"36px", marginBottom:"10px" }}>{cat.icon}</div>
                        <div style={{ fontSize:"15px", fontWeight:"800", color: category===cat.value ? "white" : "#B87333", marginBottom:"5px", letterSpacing:"0.5px" }}>{cat.label}</div>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:"600" }}>{cat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", gap:"15px" }}>
                  <button onClick={goBack} style={btnBackSt}><ChevronLeft size={20}/> Back</button>
                  <button onClick={goNext} disabled={!step2Valid} style={btnNextSt(step2Valid)}>Continue <ChevronRight size={20}/></button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
