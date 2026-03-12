import React, { useState, useRef, useEffect } from "react";
import { Building2, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

const GOOGLE_PLACES_API_KEY = "AIzaSyB18lv_Rulnv7jjFrM0PP57bCLO4U4_A_I";

export default function CleaningSuOficinaBooking() {
  const formTopRef = useRef(null);
  
  // Step 1: Contact Info
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  
  // Step 2: Location & Market Segment
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [marketSegment, setMarketSegment] = useState("");
  
  // Step 3: Service Details (varies by market segment)
  const [squareFeet, setSquareFeet] = useState("");
  const [frequency, setFrequency] = useState("");
  
  // Office Buildings
  const [workstations, setWorkstations] = useState(0);
  const [conferenceRooms, setConferenceRooms] = useState(0);
  const [breakRooms, setBreakRooms] = useState(0);
  const [restrooms, setRestrooms] = useState(0);
  
  // Healthcare
  const [examRooms, setExamRooms] = useState(0);
  const [waitingAreas, setWaitingAreas] = useState(0);
  const [procedureRooms, setProcedureRooms] = useState(0);
  
  // Hospitality
  const [guestRooms, setGuestRooms] = useState(0);
  const [commonAreas, setCommonAreas] = useState(0);
  const [diningAreas, setDiningAreas] = useState(0);
  
  // Step 4: Add-ons & Schedule
  const [addOns, setAddOns] = useState({
    windowCleaning: false,
    floorWaxing: false,
    carpetCleaning: false,
    pressureWashing: false,
    postConstruction: false,
    disinfection: false,
  });
  
  const [preferredDays, setPreferredDays] = useState([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Google Places Autocomplete
  useEffect(() => {
    if (!window.google && step === 2) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initAutocomplete();
      };
    } else if (window.google && step === 2) {
      initAutocomplete();
    }
  }, [step]);

  const initAutocomplete = () => {
    const input = document.getElementById("autocomplete-input");
    if (!input || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["address"],
      componentRestrictions: { country: "us" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let street = "";
      let cityName = "";
      let stateName = "";
      let zip = "";

      place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number")) {
          street = component.long_name + " ";
        }
        if (types.includes("route")) {
          street += component.long_name;
        }
        if (types.includes("locality")) {
          cityName = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          stateName = component.short_name;
        }
        if (types.includes("postal_code")) {
          zip = component.long_name;
        }
      });

      setStreetAddress(street);
      setCity(cityName);
      setState(stateName);
      setZipCode(zip);
    });
  };

  // Pricing Structure for Commercial Cleaning (Anchorage Market)
  const PRICING = {
    // Base rates per square foot (monthly contract) - TIERED BY SIZE
    baseRatesTiered: {
      office: [
        { max: 2000, rate: 0.15 },      // 0-2,000 sqft: $0.15/sqft
        { max: 3000, rate: 0.13 },      // 2,001-3,000 sqft: $0.13/sqft
        { max: 5000, rate: 0.12 },      // 3,001-5,000 sqft: $0.12/sqft
        { max: 10000, rate: 0.10 },     // 5,001-10,000 sqft: $0.10/sqft
        { max: 20000, rate: 0.09 },     // 10,001-20,000 sqft: $0.09/sqft
        { max: 50000, rate: 0.08 },     // 20,001-50,000 sqft: $0.08/sqft
        { max: Infinity, rate: 0.07 },  // 50,001+ sqft: $0.07/sqft
      ],
      healthcare: [
        { max: 2000, rate: 0.22 },
        { max: 3000, rate: 0.20 },
        { max: 5000, rate: 0.18 },
        { max: 10000, rate: 0.16 },
        { max: 20000, rate: 0.14 },
        { max: 50000, rate: 0.12 },
        { max: Infinity, rate: 0.11 },
      ],
      hospitality: [
        { max: 2000, rate: 0.18 },
        { max: 3000, rate: 0.16 },
        { max: 5000, rate: 0.15 },
        { max: 10000, rate: 0.13 },
        { max: 20000, rate: 0.12 },
        { max: 50000, rate: 0.11 },
        { max: Infinity, rate: 0.10 },
      ],
      retail: [
        { max: 2000, rate: 0.13 },
        { max: 3000, rate: 0.11 },
        { max: 5000, rate: 0.10 },
        { max: 10000, rate: 0.09 },
        { max: 20000, rate: 0.08 },
        { max: 50000, rate: 0.07 },
        { max: Infinity, rate: 0.06 },
      ],
      industrial: [
        { max: 2000, rate: 0.10 },
        { max: 3000, rate: 0.09 },
        { max: 5000, rate: 0.08 },
        { max: 10000, rate: 0.07 },
        { max: 20000, rate: 0.06 },
        { max: 50000, rate: 0.05 },
        { max: Infinity, rate: 0.04 },
      ],
    },
    
    // Frequency discounts (based on cleanings per week)
    frequencyDiscounts: {
      "daily": 0.20,           // 20% discount for daily cleaning
      "5x-week": 0.15,         // 15% discount for 5x/week
      "3x-week": 0.10,         // 10% discount for 3x/week
      "2x-week": 0.05,         // 5% discount for 2x/week
      "weekly": 0,             // No discount for weekly
      "bi-weekly": -0.10,      // 10% upcharge for bi-weekly (less frequent)
    },
    
    // Room/Area pricing
    rooms: {
      workstation: 8,          // $8 per workstation
      conferenceRoom: 25,      // $25 per conference room
      breakRoom: 30,           // $30 per break room
      restroom: 35,            // $35 per restroom
      examRoom: 40,            // $40 per exam room (medical grade cleaning)
      waitingArea: 30,         // $30 per waiting area
      procedureRoom: 60,       // $60 per procedure room (surgical grade)
      guestRoom: 45,           // $45 per guest room
      commonArea: 35,          // $35 per common area
      diningArea: 50,          // $50 per dining area
    },
    
    // Add-on services (per service, per visit)
    addOns: {
      windowCleaning: 150,     // $150 per visit
      floorWaxing: 200,        // $200 per visit
      carpetCleaning: 0.35,    // $0.35 per sqft
      pressureWashing: 0.25,   // $0.25 per sqft
      postConstruction: 0.50,  // $0.50 per sqft
      disinfection: 0.15,      // $0.15 per sqft (electrostatic)
    },
    
    // Minimum charges
    minimums: {
      office: 299,
      healthcare: 399,
      hospitality: 349,
      retail: 249,
      industrial: 199,
    }
  };

  // Get the per-sqft rate based on size tier
  const getRateForSquareFeet = (sqft, segment) => {
    if (!segment || !sqft) return 0;
    const tiers = PRICING.baseRatesTiered[segment];
    if (!tiers) return 0;
    
    const tier = tiers.find(t => sqft <= t.max);
    return tier ? tier.rate : tiers[tiers.length - 1].rate;
  };

  // Calculate pricing
  const calculateSubtotal = () => {
    if (!marketSegment || !squareFeet || !frequency) return 0;
    
    let total = 0;
    const sqft = parseInt(squareFeet);
    
    // Base cleaning cost using tiered pricing
    const baseRate = getRateForSquareFeet(sqft, marketSegment);
    total += sqft * baseRate;
    
    // Room/Area charges based on market segment
    if (marketSegment === "office") {
      total += workstations * PRICING.rooms.workstation;
      total += conferenceRooms * PRICING.rooms.conferenceRoom;
      total += breakRooms * PRICING.rooms.breakRoom;
      total += restrooms * PRICING.rooms.restroom;
    } else if (marketSegment === "healthcare") {
      total += examRooms * PRICING.rooms.examRoom;
      total += waitingAreas * PRICING.rooms.waitingArea;
      total += procedureRooms * PRICING.rooms.procedureRoom;
      total += restrooms * PRICING.rooms.restroom;
    } else if (marketSegment === "hospitality") {
      total += guestRooms * PRICING.rooms.guestRoom;
      total += commonAreas * PRICING.rooms.commonArea;
      total += diningAreas * PRICING.rooms.diningArea;
      total += restrooms * PRICING.rooms.restroom;
    }
    
    // Add-ons (one-time per visit costs)
    if (addOns.windowCleaning) total += PRICING.addOns.windowCleaning;
    if (addOns.floorWaxing) total += PRICING.addOns.floorWaxing;
    if (addOns.carpetCleaning) total += sqft * PRICING.addOns.carpetCleaning;
    if (addOns.pressureWashing) total += sqft * PRICING.addOns.pressureWashing;
    if (addOns.postConstruction) total += sqft * PRICING.addOns.postConstruction;
    if (addOns.disinfection) total += sqft * PRICING.addOns.disinfection;
    
    // Apply minimum
    const minimum = PRICING.minimums[marketSegment] || 199;
    return Math.max(total, minimum);
  };

  const getFrequencyDiscount = () => {
    const subtotal = calculateSubtotal();
    const discountRate = PRICING.frequencyDiscounts[frequency] || 0;
    return subtotal * Math.abs(discountRate);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountRate = PRICING.frequencyDiscounts[frequency] || 0;
    
    if (discountRate >= 0) {
      // It's a discount
      return subtotal * (1 - discountRate);
    } else {
      // It's an upcharge
      return subtotal * (1 + Math.abs(discountRate));
    }
  };

  const getPriceBreakdown = () => {
    const breakdown = [];
    if (!marketSegment || !squareFeet) return breakdown;
    
    const sqft = parseInt(squareFeet);
    const baseRate = getRateForSquareFeet(sqft, marketSegment);
    
    breakdown.push({
      label: `Base Cleaning (${sqft.toLocaleString()} sqft @ $${baseRate.toFixed(2)}/sqft)`,
      amount: sqft * baseRate
    });
    
    // Room charges
    if (marketSegment === "office") {
      if (workstations > 0) breakdown.push({ label: `Workstations (${workstations})`, amount: workstations * PRICING.rooms.workstation });
      if (conferenceRooms > 0) breakdown.push({ label: `Conference Rooms (${conferenceRooms})`, amount: conferenceRooms * PRICING.rooms.conferenceRoom });
      if (breakRooms > 0) breakdown.push({ label: `Break Rooms (${breakRooms})`, amount: breakRooms * PRICING.rooms.breakRoom });
      if (restrooms > 0) breakdown.push({ label: `Restrooms (${restrooms})`, amount: restrooms * PRICING.rooms.restroom });
    } else if (marketSegment === "healthcare") {
      if (examRooms > 0) breakdown.push({ label: `Exam Rooms (${examRooms})`, amount: examRooms * PRICING.rooms.examRoom });
      if (waitingAreas > 0) breakdown.push({ label: `Waiting Areas (${waitingAreas})`, amount: waitingAreas * PRICING.rooms.waitingArea });
      if (procedureRooms > 0) breakdown.push({ label: `Procedure Rooms (${procedureRooms})`, amount: procedureRooms * PRICING.rooms.procedureRoom });
      if (restrooms > 0) breakdown.push({ label: `Restrooms (${restrooms})`, amount: restrooms * PRICING.rooms.restroom });
    } else if (marketSegment === "hospitality") {
      if (guestRooms > 0) breakdown.push({ label: `Guest Rooms (${guestRooms})`, amount: guestRooms * PRICING.rooms.guestRoom });
      if (commonAreas > 0) breakdown.push({ label: `Common Areas (${commonAreas})`, amount: commonAreas * PRICING.rooms.commonArea });
      if (diningAreas > 0) breakdown.push({ label: `Dining Areas (${diningAreas})`, amount: diningAreas * PRICING.rooms.diningArea });
      if (restrooms > 0) breakdown.push({ label: `Restrooms (${restrooms})`, amount: restrooms * PRICING.rooms.restroom });
    }
    
    // Add-ons
    if (addOns.windowCleaning) breakdown.push({ label: "Window Cleaning", amount: PRICING.addOns.windowCleaning });
    if (addOns.floorWaxing) breakdown.push({ label: "Floor Waxing/Buffing", amount: PRICING.addOns.floorWaxing });
    if (addOns.carpetCleaning) breakdown.push({ label: "Carpet Deep Clean", amount: sqft * PRICING.addOns.carpetCleaning });
    if (addOns.pressureWashing) breakdown.push({ label: "Pressure Washing", amount: sqft * PRICING.addOns.pressureWashing });
    if (addOns.postConstruction) breakdown.push({ label: "Post-Construction Cleanup", amount: sqft * PRICING.addOns.postConstruction });
    if (addOns.disinfection) breakdown.push({ label: "Electrostatic Disinfection", amount: sqft * PRICING.addOns.disinfection });
    
    return breakdown;
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setStep(step + 1), 100);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setStep(step - 1), 100);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    
    // Contact Info
    formData.append('First Name', firstName);
    formData.append('Last Name', lastName);
    formData.append('Email', email);
    formData.append('Phone', phone);
    formData.append('Business Name', businessName || 'N/A');
    
    // Location
    formData.append('Address', streetAddress);
    formData.append('City', city);
    formData.append('State', state);
    formData.append('ZIP', zipCode);
    
    // Service Details
    formData.append('Market Segment', marketSegment);
    formData.append('Square Feet', squareFeet);
    formData.append('Frequency', frequency);
    
    // Market-specific details
    if (marketSegment === 'office') {
      formData.append('Workstations', workstations);
      formData.append('Conference Rooms', conferenceRooms);
      formData.append('Break Rooms', breakRooms);
      formData.append('Restrooms', restrooms);
    } else if (marketSegment === 'healthcare') {
      formData.append('Exam Rooms', examRooms);
      formData.append('Waiting Areas', waitingAreas);
      formData.append('Procedure Rooms', procedureRooms);
      formData.append('Restrooms', restrooms);
    } else if (marketSegment === 'hospitality') {
      formData.append('Guest Rooms', guestRooms);
      formData.append('Common Areas', commonAreas);
      formData.append('Dining Areas', diningAreas);
      formData.append('Restrooms', restrooms);
    }
    
    // Add-ons
    formData.append('Add-ons', Object.keys(addOns).filter(k => addOns[k]).join(', ') || 'None');
    
    // Schedule
    formData.append('Preferred Days', preferredDays.join(', ') || 'Not specified');
    formData.append('Preferred Time', preferredTime || 'Not specified');
    formData.append('Special Instructions', specialInstructions || 'None');
    
    // Pricing
    formData.append('Subtotal', `$${calculateSubtotal().toFixed(2)}`);
    const discountRate = PRICING.frequencyDiscounts[frequency] || 0;
    if (discountRate >= 0) {
      formData.append('Discount', `-$${getFrequencyDiscount().toFixed(2)}`);
    } else {
      formData.append('Upcharge', `+$${getFrequencyDiscount().toFixed(2)}`);
    }
    formData.append('TOTAL PRICE', `$${calculateTotal().toFixed(2)}`);

    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/AkCleaningSuCasa@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      const result = await response.json();
      
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        alert('There was an error submitting your request. Please try again or call us directly.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your request. Please try again or call us directly.');
    }
  };

  return (
    <div
    ref={formTopRef}
    style={{
        minHeight: "100vh",
        backgroundColor: "#020c1f",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
          radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
          radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
          radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
          radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
  >
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');

.fade-in-up {
animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
from {
  opacity: 0;
  transform: translateY(20px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

.service-card {
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
cursor: pointer;
}
.service-card:hover {
transform: translateY(-4px) scale(1.02);
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
.service-card.selected {
background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
border: 2px solid #0ea5e9;
box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.counter-btn {
transition: all 0.2s ease;
}
.counter-btn:active {
transform: scale(0.95);
}

/* Mobile Styles */
@media (max-width: 768px) {
.satisfaction-badge {
  display: none !important;
}

.mobile-price-sticky {
  display: block !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1000 !important;
  width: 100vw !important;
}

.mobile-price-sticky > div {
  max-height: 37vh !important;
}

.mobile-price-sticky .price-breakdown-items {
  max-height: 130px !important;
  overflow-y: auto !important;
}

.mobile-responsive-grid {
  grid-template-columns: 1fr !important;
  padding-bottom: 320px !important;
}

.market-segment-grid {
  grid-template-columns: 1fr !important;
  gap: 12px !important;
}

.sqft-grid {
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
}

.frequency-grid {
  grid-template-columns: 1fr !important;
  gap: 10px !important;
}

.addons-grid {
  grid-template-columns: 1fr !important;
  gap: 12px !important;
}

.days-grid {
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
}

.time-grid {
  grid-template-columns: 1fr !important;
  gap: 10px !important;
}

.button-row {
  flex-direction: column !important;
}

.button-row button {
  width: 100% !important;
}
}

/* Desktop - hide mobile price */
@media (min-width: 769px) {
.mobile-price-sticky {
  display: none !important;
}

.mobile-responsive-grid {
  max-width: 100% !important;
  padding-left: 20px !important;
  padding-right: 20px !important;
}
}

@media (min-width: 1440px) {
.mobile-responsive-grid {
  max-width: 1400px !important;
  margin: 0 auto !important;
}
}

/* Glow text effect for title */
.glow-text {
color: white;
text-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.4),
  0 0 60px rgba(6, 182, 212, 0.2);
}

.hero-orb {
position: absolute;
border-radius: 50%;
pointer-events: none;
z-index: 0;
}

.hero-orb-1 {
width: 600px;
height: 600px;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: radial-gradient(circle, rgba(5,53,116,0.18) 0%, transparent 70%);
animation: porb 7s ease-in-out infinite;
}

.hero-orb-2 {
width: 320px;
height: 320px;
top: 8%;
right: 5%;
background: radial-gradient(circle, rgba(5,53,116,0.14) 0%, transparent 70%);
animation: porb2 9s ease-in-out infinite reverse;
}

.hero-orb-3 {
width: 220px;
height: 220px;
bottom: 12%;
left: 5%;
background: radial-gradient(circle, rgba(93,235,241,0.09) 0%, transparent 70%);
animation: porb2 6s ease-in-out infinite;
}

@keyframes porb {
0%, 100% {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}
50% {
  transform: translate(-50%, -50%) scale(1.12);
  opacity: 0.7;
}
}

@keyframes porb2 {
0%, 100% {
  transform: scale(1);
  opacity: 1;
}
50% {
  transform: scale(1.18);
  opacity: 0.6;
}
}

.hero-rings {
position: absolute;
inset: 0;
pointer-events: none;
overflow: hidden;
z-index: 0;
}

.hero-dots {
position: absolute;
inset: 0;
pointer-events: none;
z-index: 0;
}

.dot-p {
position: absolute;
border-radius: 50%;
background: #7dd3fc;
opacity: 0.2;
animation: pdrift linear infinite;
}

@keyframes pdrift {
0% {
  transform: translateY(0) rotate(0deg);
  opacity: 0;
}
10% {
  opacity: 0.22;
}
90% {
  opacity: 0.12;
}
100% {
  transform: translateY(-110px) rotate(360deg);
  opacity: 0;
}
}
`}</style>

{/* Animated Background Elements - Fixed Container */}
<div style={{
position: "fixed",
top: 0,
left: 0,
right: 0,
bottom: 0,
overflow: "hidden",
pointerEvents: "none",
zIndex: 0
}}>
<div className="hero-orb hero-orb-1"></div>
<div className="hero-orb hero-orb-2"></div>
<div className="hero-orb hero-orb-3"></div>

<div className="hero-rings">
<svg width="520" height="520" style={{position:"absolute",top:"-90px",left:"30%",opacity:0.45}} viewBox="0 0 520 520">
  <circle cx="260" cy="260" r="220" fill="none" stroke="#053574" strokeWidth="1"/>
  <circle cx="260" cy="260" r="175" fill="none" stroke="#053574" strokeWidth="0.6"/>
  <circle cx="260" cy="260" r="130" fill="none" stroke="#053574" strokeWidth="0.6"/>
</svg>
<svg width="280" height="280" style={{position:"absolute",bottom:"-50px",right:"5%",opacity:0.35}} viewBox="0 0 280 280">
  <circle cx="140" cy="140" r="115" fill="none" stroke="#053574" strokeWidth="1"/>
  <circle cx="140" cy="140" r="75" fill="none" stroke="#053574" strokeWidth="0.6"/>
</svg>
</div>

<div className="hero-dots">
<div className="dot-p" style={{width:"4px",height:"4px",left:"22%",bottom:"12%",animationDuration:"7s",animationDelay:"0s"}}></div>
<div className="dot-p" style={{width:"3px",height:"3px",left:"48%",bottom:"18%",animationDuration:"9s",animationDelay:"1.5s"}}></div>
<div className="dot-p" style={{width:"5px",height:"5px",left:"72%",bottom:"9%",animationDuration:"8s",animationDelay:"0.7s"}}></div>
<div className="dot-p" style={{width:"3px",height:"3px",left:"33%",bottom:"22%",animationDuration:"10s",animationDelay:"2s"}}></div>
<div className="dot-p" style={{width:"4px",height:"4px",left:"82%",bottom:"28%",animationDuration:"7.5s",animationDelay:"3s"}}></div>
</div>
</div>

<div
className="mobile-responsive-grid"
style={{
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "30px 20px",
  display: "grid",
  gridTemplateColumns: step === 1 ? "1fr" : "1fr 380px",
  gap: "30px",
  alignItems: "start",
  position: "relative",
  zIndex: 1,
}}
>
{/* Main Form */}
<div
className="form-card-animated"
style={{
  backgroundColor: "#020c1f",
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
    radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
    radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
    radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
    radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
  `,
  backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
  borderRadius: "32px",
  overflow: "hidden",
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(93, 235, 241, 0.2)",
  position: "relative",
}}
>
{/* Header with Custom Animated Title */}
<div
style={{
  backgroundColor: "rgba(2, 12, 31, 0.4)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(93, 235, 241, 0.2)",
  padding: step === 1 ? "50px 30px" : "30px",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
}}
>
<div
style={{
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
  "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 70%)",
  pointerEvents: "none",
}}
/>
<div style={{ position: "relative", zIndex: 1 }}>
{/* Custom Title - Logo Style */}
<div
style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
}}
>
{/* CLEANING - Thin modern all caps */}
<div
className="glow-text"
style={{
  fontFamily: "'Oswald', sans-serif",
  fontSize: "52px",
  fontWeight: "300",
  letterSpacing: "8px",
  lineHeight: "1",
}}
>
CLEANING
</div>
{/* Su Oficina - Elegant handwritten cursive */}
<div
style={{
  fontFamily: "'Allura', cursive",
  fontSize: "56px",
  color: "#7dd3fc",
  letterSpacing: "3px",
  marginTop: "-8px",
  lineHeight: "1",
}}
>
Su Oficina
</div>
</div>
{step === 1 && (
  <>
  <div
  style={{
    marginTop: "20px",
    height: "3px",
    width: "80px",
    background:
    "linear-gradient(90deg, transparent, #06b6d4, transparent)",
    margin: "20px auto 15px",
  }}
/>
<p
style={{
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "16px",
  margin: 0,
  fontWeight: "500",
  letterSpacing: "1px",
  textTransform: "uppercase",
}}
>
Professional Commercial Cleaning
</p>
</>
)}
</div>
</div>
{/* Progress Bar */}
<div
style={{
  height: "6px",
  background: "rgba(255, 255, 255, 0.1)",
  position: "relative",
}}
>
<div
style={{
  height: "100%",
  background: "linear-gradient(90deg, #06b6d4 0%, #0ea5e9 100%)",
  width: step === 1 ? "25%" : step === 2 ? "50%" : step === 3 ? "75%" : "100%",
  transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 0 15px rgba(6, 182, 212, 0.6)",
}}
/>
</div>
<div style={{ padding: "50px 40px" }}>

{/* STEP 1: CONTACT INFO */}
{step === 1 && (
  <div className="fade-in-up">
    <div style={{ textAlign: "center", marginBottom: "50px" }}>
      <div
        style={{
          width: "110px",
          height: "110px",
          background:
          "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 30px",
          boxShadow: "0 20px 50px rgba(6, 182, 212, 0.4)",
          border: "4px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div style={{
          fontSize: "55px",
        }}>
          💼
        </div>
      </div>
      <h2
        style={{
          fontSize: "36px",
          fontWeight: "900",
          color: "white",
          margin: "0 0 20px 0",
          letterSpacing: "-1px",
          textTransform: "uppercase",
        }}
      >
        Let's Get Started!
      </h2>
      <p
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "18px",
          lineHeight: "1.6",
          fontWeight: "500",
        }}
      >
        Professional cleaning for your business
      </p>
    </div>
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      {/* Name Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "800",
              color: "#06b6d4",
              marginBottom: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            First Name
          </label>
          <input
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{
              width: "100%",
              padding: "20px 24px",
              fontSize: "17px",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              background: "rgba(255, 255, 255, 0.95)",
              fontWeight: "500",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "800",
              color: "#06b6d4",
              marginBottom: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{
              width: "100%",
              padding: "20px 24px",
              fontSize: "17px",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              background: "rgba(255, 255, 255, 0.95)",
              fontWeight: "500",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Phone Field */}
      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="(907) 555-0123"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "20px 24px",
            fontSize: "17px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            background: "rgba(255, 255, 255, 0.95)",
            fontWeight: "500",
            outline: "none",
          }}
        />
      </div>

      {/* Email Field */}
      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Email Address
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "20px 24px",
            fontSize: "17px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            background: "rgba(255, 255, 255, 0.95)",
            fontWeight: "500",
            outline: "none",
          }}
        />
      </div>

      {/* Business Name (Optional) */}
      <div style={{ marginBottom: "35px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Business Name <span style={{ color: "rgba(6, 182, 212, 0.5)", fontSize: "11px", marginLeft: "5px" }}>(Optional)</span>
        </label>
        <input
          type="text"
          placeholder="Your Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={{
            width: "100%",
            padding: "20px 24px",
            fontSize: "17px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            background: "rgba(255, 255, 255, 0.95)",
            fontWeight: "500",
            outline: "none",
          }}
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={handleNext}
        disabled={!firstName || !lastName || !email || !phone}
        style={{
          width: "100%",
          padding: "22px 40px",
          fontSize: "16px",
          fontWeight: "900",
          border: "none",
          borderRadius: "16px",
          background: firstName && lastName && email && phone
            ? "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)"
            : "rgba(255, 255, 255, 0.2)",
          color: "white",
          cursor: firstName && lastName && email && phone ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
          letterSpacing: "2px",
          textTransform: "uppercase",
          boxShadow: firstName && lastName && email && phone
            ? "0 10px 30px rgba(6, 182, 212, 0.3)"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        Continue
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
)}

{/* STEP 2: LOCATION & MARKET SEGMENT */}
{step === 2 && (
  <div className="fade-in-up">
    {/* Address Autocomplete */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <MapPin size={18} color="#06b6d4" />
        Business Address *
      </label>
      <input
        id="autocomplete-input"
        type="text"
        placeholder="Start typing your street address..."
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
        style={{
          width: "100%",
          padding: "18px 20px",
          borderRadius: "16px",
          border: "2px solid rgba(93, 235, 241, 0.3)",
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          fontSize: "15px",
          fontWeight: "600",
          outline: "none",
          transition: "all 0.3s ease",
          marginBottom: "10px",
        }}
      />
      <p style={{
        fontSize: "12px",
        color: "rgba(255, 255, 255, 0.5)",
        fontWeight: "600",
        marginTop: "8px",
      }}>
        📍 Start typing street address for suggestions
      </p>
    </div>

    {/* City, State, ZIP */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "15px", marginBottom: "35px" }}>
      <div>
        <label style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#06b6d4",
          marginBottom: "8px",
          display: "block",
          letterSpacing: "0.5px",
        }}>
          CITY
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: "14px",
            border: "2px solid rgba(93, 235, 241, 0.3)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            outline: "none",
          }}
        />
      </div>
      <div>
        <label style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#06b6d4",
          marginBottom: "8px",
          display: "block",
          letterSpacing: "0.5px",
        }}>
          STATE
        </label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          maxLength={2}
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: "14px",
            border: "2px solid rgba(93, 235, 241, 0.3)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            outline: "none",
            textTransform: "uppercase",
          }}
        />
      </div>
      <div>
        <label style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#06b6d4",
          marginBottom: "8px",
          display: "block",
          letterSpacing: "0.5px",
        }}>
          ZIP
        </label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          maxLength={5}
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: "14px",
            border: "2px solid rgba(93, 235, 241, 0.3)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            outline: "none",
          }}
        />
      </div>
    </div>

    {/* Market Segment */}
    <div style={{ marginBottom: "35px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Building2 size={18} color="#06b6d4" />
        Business Type *
      </label>
      <div className="market-segment-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
      }}>
        {[
          { value: "office", label: "Office Building", icon: "🏢", desc: "Corporate, Law, Real Estate" },
          { value: "healthcare", label: "Healthcare", icon: "🏥", desc: "Dental, Medical, Therapy" },
          { value: "hospitality", label: "Hospitality", icon: "🏨", desc: "Hotels, B&B, Lodging" },
          { value: "retail", label: "Retail", icon: "🛍️", desc: "Shops, Stores, Boutiques" },
          { value: "industrial", label: "Industrial", icon: "🏭", desc: "Warehouse, Manufacturing" },
        ].map((segment) => (
          <div
            key={segment.value}
            className={`service-card ${marketSegment === segment.value ? "selected" : ""}`}
            onClick={() => setMarketSegment(segment.value)}
            style={{
              padding: "25px 20px",
              border: marketSegment === segment.value
                ? "2px solid #0ea5e9"
                : "2px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              background: marketSegment === segment.value
                ? "linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.2) 100%)"
                : "rgba(255, 255, 255, 0.03)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>
              {segment.icon}
            </div>
            <div style={{
              fontSize: "15px",
              fontWeight: "800",
              color: marketSegment === segment.value ? "white" : "#06b6d4",
              marginBottom: "5px",
              letterSpacing: "0.5px",
            }}>
              {segment.label}
            </div>
            <div style={{
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: "600",
            }}>
              {segment.desc}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Navigation Buttons */}
    <div className="button-row" style={{ display: "flex", gap: "15px" }}>
      <button
        onClick={handleBack}
        style={{
          flex: 1,
          padding: "18px",
          borderRadius: "16px",
          border: "2px solid rgba(93, 235, 241, 0.3)",
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.5px",
        }}
      >
        <ChevronLeft size={20} />
        Back
      </button>
      <button
        onClick={handleNext}
        disabled={!streetAddress || !city || !state || !zipCode || !marketSegment}
        style={{
          flex: 2,
          padding: "18px",
          borderRadius: "16px",
          border: "none",
          background: (streetAddress && city && state && zipCode && marketSegment)
            ? "linear-gradient(135deg, #5debf1 0%, #0ea5e9 100%)"
            : "rgba(255, 255, 255, 0.1)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: (streetAddress && city && state && zipCode && marketSegment) ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.5px",
        }}
      >
        Continue
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
)}

{/* STEP 3: SERVICE DETAILS */}
{step === 3 && (
  <div className="fade-in-up">
    {/* Square Footage */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "20px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Building2 size={18} color="#06b6d4" />
          Total Square Footage *
        </div>
        <div style={{
          fontSize: "24px",
          fontWeight: "900",
          color: "white",
        }}>
          {parseInt(squareFeet || 0).toLocaleString()} sqft
        </div>
      </label>

      {/* Rate Display */}
      {squareFeet && marketSegment && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: "600",
            marginBottom: "4px",
          }}>
            Current Rate
          </div>
          <div style={{
            fontSize: "28px",
            fontWeight: "900",
            color: "#06b6d4",
          }}>
            ${getRateForSquareFeet(parseInt(squareFeet), marketSegment).toFixed(2)}/sqft
          </div>
        </div>
      )}

      {/* Slider */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="range"
          min="500"
          max="50000"
          step="100"
          value={squareFeet || 500}
          onChange={(e) => setSquareFeet(e.target.value)}
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((parseInt(squareFeet || 500) - 500) / (50000 - 500)) * 100}%, rgba(255, 255, 255, 0.1) ${((parseInt(squareFeet || 500) - 500) / (50000 - 500)) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
            outline: "none",
            cursor: "pointer",
            WebkitAppearance: "none",
            appearance: "none",
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.5);
          }
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.5);
          }
        `}</style>
      </div>

      {/* Manual Input */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}>
        <div style={{
          flex: 1,
          position: "relative",
        }}>
          <input
            type="number"
            min="500"
            max="50000"
            value={squareFeet || ''}
            onChange={(e) => {
              const val = Math.max(500, Math.min(50000, parseInt(e.target.value) || 0));
              setSquareFeet(val.toString());
            }}
            placeholder="Enter square feet..."
            style={{
              width: "100%",
              padding: "18px 20px",
              paddingRight: "55px",
              borderRadius: "16px",
              border: "2px solid rgba(93, 235, 241, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "white",
              fontSize: "17px",
              fontWeight: "700",
              outline: "none",
              transition: "all 0.3s ease",
            }}
          />
          <div style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "14px",
            fontWeight: "700",
            pointerEvents: "none",
          }}>
            sqft
          </div>
        </div>
      </div>

      {/* Tier Guide */}
      <div style={{
        marginTop: "20px",
        padding: "15px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}>
        <div style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#06b6d4",
          marginBottom: "10px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          💡 Pricing Tiers {marketSegment && `(${marketSegment.charAt(0).toUpperCase() + marketSegment.slice(1)})`}
        </div>
        {marketSegment && PRICING.baseRatesTiered[marketSegment] && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: "600",
          }}>
            {PRICING.baseRatesTiered[marketSegment].filter(tier => tier.max !== Infinity).map((tier, idx, arr) => {
              const prevMax = idx === 0 ? 0 : arr[idx - 1].max;
              return (
                <div key={idx} style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: parseInt(squareFeet || 0) > prevMax && parseInt(squareFeet || 0) <= tier.max
                    ? "rgba(6, 182, 212, 0.15)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: parseInt(squareFeet || 0) > prevMax && parseInt(squareFeet || 0) <= tier.max
                    ? "1px solid rgba(6, 182, 212, 0.3)"
                    : "1px solid transparent",
                }}>
                  {prevMax + 1}-{tier.max.toLocaleString()}: <span style={{ color: "#06b6d4", fontWeight: "800" }}>${tier.rate.toFixed(2)}/sqft</span>
                </div>
              );
            })}
            <div style={{
              padding: "8px",
              borderRadius: "8px",
              background: parseInt(squareFeet || 0) > PRICING.baseRatesTiered[marketSegment][PRICING.baseRatesTiered[marketSegment].length - 2].max
                ? "rgba(6, 182, 212, 0.15)"
                : "rgba(255, 255, 255, 0.02)",
              border: parseInt(squareFeet || 0) > PRICING.baseRatesTiered[marketSegment][PRICING.baseRatesTiered[marketSegment].length - 2].max
                ? "1px solid rgba(6, 182, 212, 0.3)"
                : "1px solid transparent",
            }}>
              {(PRICING.baseRatesTiered[marketSegment][PRICING.baseRatesTiered[marketSegment].length - 2].max + 1).toLocaleString()}+: <span style={{ color: "#06b6d4", fontWeight: "800" }}>${PRICING.baseRatesTiered[marketSegment][PRICING.baseRatesTiered[marketSegment].length - 1].rate.toFixed(2)}/sqft</span>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Cleaning Frequency */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Calendar size={18} color="#06b6d4" />
        Cleaning Frequency *
      </label>
      <div className="frequency-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
      }}>
        {[
          { value: "daily", label: "Daily", badge: "20% OFF" },
          { value: "5x-week", label: "5x Per Week", badge: "15% OFF" },
          { value: "3x-week", label: "3x Per Week", badge: "10% OFF" },
          { value: "2x-week", label: "2x Per Week", badge: "5% OFF" },
          { value: "weekly", label: "Weekly", badge: null },
          { value: "bi-weekly", label: "Bi-Weekly", badge: "+10%" },
        ].map((freq) => (
          <div
            key={freq.value}
            onClick={() => setFrequency(freq.value)}
            style={{
              padding: "18px 16px",
              borderRadius: "16px",
              border: frequency === freq.value
                ? "2px solid #0ea5e9"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: frequency === freq.value
                ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                : "rgba(255, 255, 255, 0.03)",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            <div style={{
              fontSize: "14px",
              fontWeight: "800",
              marginBottom: freq.badge ? "4px" : "0",
              letterSpacing: "0.5px",
            }}>
              {freq.label}
            </div>
            {freq.badge && (
              <div style={{
                display: "inline-block",
                padding: "3px 8px",
                borderRadius: "8px",
                background: freq.badge.includes("OFF")
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "0.5px",
              }}>
                {freq.badge}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Market Segment Specific Details */}
    {marketSegment === "office" && (
      <div style={{ marginBottom: "30px" }}>
        <label style={{
          fontSize: "13px",
          fontWeight: "800",
          color: "#06b6d4",
          marginBottom: "15px",
          display: "block",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          📋 Office Details
        </label>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}>
          {/* Workstations */}
          <div style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#06b6d4",
                  marginBottom: "2px",
                }}>
                  💼 Workstations
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $8 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {workstations}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setWorkstations(Math.max(0, workstations - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: workstations > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: workstations > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: workstations > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setWorkstations(workstations + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Conference Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#06b6d4",
                  marginBottom: "2px",
                }}>
                  🗂️ Conference
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $25 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {conferenceRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setConferenceRooms(Math.max(0, conferenceRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: conferenceRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: conferenceRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: conferenceRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setConferenceRooms(conferenceRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Break Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#06b6d4",
                  marginBottom: "2px",
                }}>
                  ☕ Break Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $30 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {breakRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setBreakRooms(Math.max(0, breakRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: breakRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: breakRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: breakRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setBreakRooms(breakRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Restrooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#06b6d4",
                  marginBottom: "2px",
                }}>
                  🚻 Restrooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $35 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {restrooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setRestrooms(Math.max(0, restrooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: restrooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: restrooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: restrooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setRestrooms(restrooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {marketSegment === "healthcare" && (
      <>
        <div style={{ marginBottom: "25px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Exam Rooms
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setExamRooms(Math.max(0, examRooms - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {examRooms}
            </div>
            <button
              className="counter-btn"
              onClick={() => setExamRooms(examRooms + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Waiting Areas
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setWaitingAreas(Math.max(0, waitingAreas - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {waitingAreas}
            </div>
            <button
              className="counter-btn"
              onClick={() => setWaitingAreas(waitingAreas + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Procedure Rooms
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setProcedureRooms(Math.max(0, procedureRooms - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {procedureRooms}
            </div>
            <button
              className="counter-btn"
              onClick={() => setProcedureRooms(procedureRooms + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Restrooms
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setRestrooms(Math.max(0, restrooms - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {restrooms}
            </div>
            <button
              className="counter-btn"
              onClick={() => setRestrooms(restrooms + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
      </>
    )}

    {marketSegment === "hospitality" && (
      <>
        <div style={{ marginBottom: "25px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Guest Rooms
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setGuestRooms(Math.max(0, guestRooms - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {guestRooms}
            </div>
            <button
              className="counter-btn"
              onClick={() => setGuestRooms(guestRooms + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Common Areas / Lobbies
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setCommonAreas(Math.max(0, commonAreas - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {commonAreas}
            </div>
            <button
              className="counter-btn"
              onClick={() => setCommonAreas(commonAreas + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Dining Areas
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setDiningAreas(Math.max(0, diningAreas - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {diningAreas}
            </div>
            <button
              className="counter-btn"
              onClick={() => setDiningAreas(diningAreas + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{
            fontSize: "13px",
            fontWeight: "800",
            color: "#06b6d4",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Restrooms
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="counter-btn"
              onClick={() => setRestrooms(Math.max(0, restrooms - 1))}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <div style={{
              flex: 1,
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "900",
              color: "white",
            }}>
              {restrooms}
            </div>
            <button
              className="counter-btn"
              onClick={() => setRestrooms(restrooms + 1)}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(93, 235, 241, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "20px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
      </>
    )}

    {/* Navigation Buttons */}
    <div className="button-row" style={{ display: "flex", gap: "15px" }}>
      <button
        onClick={handleBack}
        style={{
          flex: 1,
          padding: "18px",
          borderRadius: "16px",
          border: "2px solid rgba(93, 235, 241, 0.3)",
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.5px",
        }}
      >
        <ChevronLeft size={20} />
        Back
      </button>
      <button
        onClick={handleNext}
        disabled={!squareFeet || !frequency}
        style={{
          flex: 2,
          padding: "18px",
          borderRadius: "16px",
          border: "none",
          background: (squareFeet && frequency)
            ? "linear-gradient(135deg, #5debf1 0%, #0ea5e9 100%)"
            : "rgba(255, 255, 255, 0.1)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: (squareFeet && frequency) ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.5px",
        }}
      >
        Continue
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
)}

{/* STEP 4: ADD-ONS & SCHEDULE */}
{step === 4 && (
  <div className="fade-in-up">
    {/* Add-on Services */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <CheckCircle2 size={18} color="#06b6d4" />
        Additional Services (Optional)
      </label>
      <div className="addons-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
      }}>
        {[
          { key: "windowCleaning", label: "Window Cleaning", price: "$150" },
          { key: "floorWaxing", label: "Floor Waxing/Buffing", price: "$200" },
          { key: "carpetCleaning", label: "Carpet Deep Clean", price: "$0.35/sqft" },
          { key: "pressureWashing", label: "Pressure Washing", price: "$0.25/sqft" },
          { key: "postConstruction", label: "Post-Construction", price: "$0.50/sqft" },
          { key: "disinfection", label: "Disinfection", price: "$0.15/sqft" },
        ].map((addon) => (
          <div
            key={addon.key}
            onClick={() => setAddOns({ ...addOns, [addon.key]: !addOns[addon.key] })}
            style={{
              padding: "18px 16px",
              borderRadius: "16px",
              border: addOns[addon.key]
                ? "2px solid #0ea5e9"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: addOns[addon.key]
                ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                : "rgba(255, 255, 255, 0.03)",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              border: addOns[addon.key] ? "none" : "2px solid rgba(255, 255, 255, 0.3)",
              background: addOns[addon.key]
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px",
            }}>
              {addOns[addon.key] && <CheckCircle2 size={14} color="white" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "3px",
                letterSpacing: "0.3px",
              }}>
                {addon.label}
              </div>
              <div style={{
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: "700",
              }}>
                {addon.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Preferred Days */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Calendar size={18} color="#06b6d4" />
        Preferred Days (Optional)
      </label>
      <div className="days-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "10px",
      }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            onClick={() => {
              if (preferredDays.includes(day)) {
                setPreferredDays(preferredDays.filter(d => d !== day));
              } else {
                setPreferredDays([...preferredDays, day]);
              }
            }}
            style={{
              padding: "14px 10px",
              borderRadius: "12px",
              border: preferredDays.includes(day)
                ? "2px solid #0ea5e9"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: preferredDays.includes(day)
                ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                : "rgba(255, 255, 255, 0.03)",
              color: "white",
              fontSize: "13px",
              fontWeight: "800",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>

    {/* Preferred Time */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Clock size={18} color="#06b6d4" />
        Preferred Time (Optional)
      </label>
      <div className="time-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
      }}>
        {["Morning (6-10am)", "Mid-Day (10am-2pm)", "Afternoon (2-6pm)", "Evening (6-10pm)", "Overnight (10pm-6am)"].map((time) => (
          <div
            key={time}
            onClick={() => setPreferredTime(time)}
            style={{
              padding: "14px 12px",
              borderRadius: "12px",
              border: preferredTime === time
                ? "2px solid #0ea5e9"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: preferredTime === time
                ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                : "rgba(255, 255, 255, 0.03)",
              color: "white",
              fontSize: "12px",
              fontWeight: "800",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {time}
          </div>
        ))}
      </div>
    </div>

    {/* Special Instructions */}
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        Special Instructions (Optional)
      </label>
      <textarea
        value={specialInstructions}
        onChange={(e) => setSpecialInstructions(e.target.value)}
        placeholder="Any specific requirements, access instructions, or special requests..."
        rows={4}
        style={{
          width: "100%",
          padding: "18px 20px",
          borderRadius: "16px",
          border: "2px solid rgba(93, 235, 241, 0.3)",
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          fontSize: "14px",
          fontWeight: "600",
          outline: "none",
          resize: "vertical",
          fontFamily: "inherit",
        }}
      />
    </div>

    {/* Terms Agreement */}
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(14, 165, 233, 0.1)",
      border: "1px solid rgba(14, 165, 233, 0.3)",
      marginBottom: "30px",
    }}>
      <p style={{
        fontSize: "12px",
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "600",
        lineHeight: "1.6",
        margin: 0,
      }}>
        By submitting this request, you agree to our{" "}
        <a
          href="https://img1.wsimg.com/blobby/go/a218c663-7c40-48f5-aae1-0c7e30c1037f/downloads/Terms%20and%20Conditions.pdf?ver=1721081910935"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#5debf1",
            textDecoration: "underline",
            fontWeight: "700",
          }}
        >
          Terms & Conditions
        </a>
        . Our team will review your request and contact you within 24 hours to confirm details and schedule service.
      </p>
    </div>

    {/* Navigation Buttons */}
    <div className="button-row" style={{ display: "flex", gap: "15px" }}>
      <button
        onClick={handleBack}
        style={{
          flex: 1,
          padding: "18px",
          borderRadius: "16px",
          border: "2px solid rgba(93, 235, 241, 0.3)",
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.5px",
        }}
      >
        <ChevronLeft size={20} />
        Back
      </button>
      <button
        onClick={handleSubmit}
        style={{
          flex: 2,
          padding: "18px",
          borderRadius: "16px",
          border: "none",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          fontSize: "15px",
          fontWeight: "800",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          letterSpacing: "0.5px",
        }}
      >
        Submit Request
        <CheckCircle2 size={20} />
      </button>
    </div>
  </div>
)}

</div>
</div>

{/* Price Sidebar - Desktop Only */}
{(step === 2 || step === 3 || step === 4) && (
  <div
    className="fade-in-up"
    style={{
      position: "sticky",
      top: "20px",
      height: "fit-content",
      maxHeight: "calc(100vh - 40px)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{
      backgroundColor: "#020c1f",
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
        radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
        radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
        radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
        radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
      border: "1px solid rgba(93, 235, 241, 0.2)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "100%",
    }}>
      {/* Header */}
      <div style={{
        padding: "25px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <div style={{
          fontSize: "16px",
          color: "#06b6d4",
          fontWeight: "800",
          marginBottom: "8px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>
          Price Breakdown
        </div>
        <div style={{
          fontSize: "13px",
          color: "#0ea5e9",
          fontWeight: "700",
          letterSpacing: "0.5px",
          background: "rgba(6, 182, 212, 0.12)",
          padding: "4px 12px",
          borderRadius: "6px",
          display: "inline-block",
        }}>
          Monthly Estimate
        </div>
      </div>

      {/* Price Breakdown */}
      <div style={{
        padding: "20px 25px",
        overflowY: "auto",
        flex: 1,
      }}>
        {getPriceBreakdown().length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "13px",
            fontWeight: "600",
          }}>
            Complete the form to see pricing
          </div>
        ) : (
          <>
            {getPriceBreakdown().map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: index < getPriceBreakdown().length - 1
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
                }}
              >
                <div style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "13px",
                  fontWeight: "600",
                }}>
                  {item.label}
                </div>
                <div style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "800",
                }}>
                  ${item.amount.toFixed(2)}
                </div>
              </div>
            ))}

            {/* Subtotal */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
              marginTop: "10px",
              borderTop: "2px solid rgba(93, 235, 241, 0.3)",
            }}>
              <div style={{
                color: "#06b6d4",
                fontSize: "14px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Subtotal
              </div>
              <div style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "900",
              }}>
                ${calculateSubtotal().toFixed(2)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Frequency Discount/Upcharge */}
      {frequency && getFrequencyDiscount() > 0 && (
        <div style={{
          padding: "15px 25px",
          background: PRICING.frequencyDiscounts[frequency] >= 0
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{
              color: "white",
              fontSize: "13px",
              fontWeight: "800",
              textTransform: "uppercase",
            }}>
              {PRICING.frequencyDiscounts[frequency] >= 0 ? "Discount" : "Upcharge"}
            </div>
            <div style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "900",
            }}>
              {PRICING.frequencyDiscounts[frequency] >= 0 ? "-" : "+"}${getFrequencyDiscount().toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Price Disclaimer */}
      <div style={{
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.1)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <p style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "11px",
          margin: 0,
          fontWeight: "600",
          lineHeight: "1.4",
          textAlign: "center",
          fontStyle: "italic",
        }}>
          💡 Estimate based on monthly contract. Final prices may vary based on property condition and requirements.
        </p>
      </div>

      {/* Total */}
      <div style={{
        padding: "25px",
        background: "rgba(93, 235, 241, 0.15)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(93, 235, 241, 0.3)",
        boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.2)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
            <div style={{
              color: "white",
              fontWeight: "900",
              fontSize: "14px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Total
            </div>
            <div style={{
              fontSize: "13px",
              color: "#0ea5e9",
              fontWeight: "700",
              background: "rgba(6, 182, 212, 0.12)",
              padding: "3px 10px",
              borderRadius: "6px",
            }}>
              per month
            </div>
          </div>
          <div style={{
            color: "white",
            fontWeight: "900",
            fontSize: "36px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}>
            ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>
    </div>

    {/* 100% Satisfaction Badge */}
    <div
      className="satisfaction-badge"
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div style={{
        fontSize: "32px",
        marginBottom: "8px",
      }}>
        ✓
      </div>
      <div style={{
        color: "white",
        fontSize: "16px",
        fontWeight: "900",
        letterSpacing: "1px",
        lineHeight: "1.3",
      }}>
        100% SATISFACTION
        <br />
        GUARANTEED
      </div>
    </div>
  </div>
)}
</div>

{/* MOBILE-ONLY PRICE DISPLAY - STICKY AT BOTTOM */}
{(step === 2 || step === 3 || step === 4) && (
  <div className="mobile-price-sticky">
    <div style={{
      backgroundColor: "#020c1f",
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
        radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
        radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
        radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
        radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
      borderRadius: "20px 20px 0 0",
      overflow: "hidden",
      boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.6)",
      border: "1px solid rgba(93, 235, 241, 0.2)",
      borderBottom: "none",
      maxHeight: "65vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* TOTAL SECTION - FIRST */}
      <div style={{
        padding: "20px 25px",
        background: "rgba(93, 235, 241, 0.15)",
        borderBottom: "1px solid rgba(93, 235, 241, 0.3)",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
            <div style={{
              color: "white",
              fontWeight: "900",
              fontSize: "16px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}>
              Total
            </div>
            <div style={{
              fontSize: "12px",
              color: "#0ea5e9",
              fontWeight: "700",
              background: "rgba(6, 182, 212, 0.12)",
              padding: "3px 10px",
              borderRadius: "6px",
              display: "inline-block",
            }}>
              per month
            </div>
          </div>
          <div style={{
            color: "white",
            fontWeight: "900",
            fontSize: "32px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}>
            ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>

      {/* DISCOUNT/UPCHARGE (if applicable) */}
      {frequency && getFrequencyDiscount() > 0 && (
        <div style={{
          padding: "12px 25px",
          background: PRICING.frequencyDiscounts[frequency] >= 0
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ color: "white", fontWeight: "800", fontSize: "14px" }}>
              {PRICING.frequencyDiscounts[frequency] >= 0 ? "DISCOUNT" : "UPCHARGE"}
            </div>
            <div style={{ color: "white", fontWeight: "900", fontSize: "14px" }}>
              {PRICING.frequencyDiscounts[frequency] >= 0 ? "-" : "+"}${getFrequencyDiscount().toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* SUBTOTAL */}
      {getPriceBreakdown().length > 0 && (
        <div style={{
          padding: "12px 25px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{
              color: "#06b6d4",
              fontWeight: "800",
              fontSize: "14px",
              textTransform: "uppercase",
            }}>
              Subtotal
            </div>
            <div style={{ color: "white", fontWeight: "900", fontSize: "14px" }}>
              ${calculateSubtotal().toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Price Disclaimer */}
      <div style={{
        padding: "10px 20px",
        background: "rgba(255, 255, 255, 0.1)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <p style={{
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: "10px",
          margin: 0,
          fontWeight: "600",
          lineHeight: "1.3",
          textAlign: "center",
          fontStyle: "italic",
        }}>
          💡 Estimate only. Final price may vary.
        </p>
      </div>

      {/* LINE ITEMS - SCROLLABLE */}
      <div 
        className="price-breakdown-items"
        style={{
        padding: "15px 25px",
        overflowY: "auto",
        maxHeight: "200px",
      }}>
        {getPriceBreakdown().length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "20px",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "13px",
            fontWeight: "600",
          }}>
            Select services to see pricing
          </div>
        ) : (
          getPriceBreakdown().map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: index < getPriceBreakdown().length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                fontSize: "13px",
              }}
            >
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "600",
              }}>
                {item.label}
              </div>
              <div style={{ color: "white", fontWeight: "800" }}>
                ${item.amount.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}

{/* Success Modal */}
{showSuccessModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  }}>
    <div style={{
      background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
      borderRadius: "32px",
      padding: "50px 40px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      border: "1px solid rgba(93, 235, 241, 0.3)",
      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
    }}>
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 30px",
      }}>
        <CheckCircle2 size={48} color="white" />
      </div>
      
      <h2 style={{
        fontSize: "32px",
        fontWeight: "900",
        color: "white",
        marginBottom: "15px",
        letterSpacing: "-0.5px",
      }}>
        Request Submitted!
      </h2>
      
      <p style={{
        fontSize: "16px",
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "600",
        lineHeight: "1.6",
        marginBottom: "30px",
      }}>
        Thank you for choosing Cleaning Su Oficina! Our team will review your request and contact you within 24 hours to confirm details and schedule your service.
      </p>
      
      <button
        onClick={() => {
          setShowSuccessModal(false);
          setStep(1);
          // Reset all form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setBusinessName("");
          setStreetAddress("");
          setCity("");
          setState("");
          setZipCode("");
          setMarketSegment("");
          setSquareFeet("");
          setFrequency("");
          setWorkstations(0);
          setConferenceRooms(0);
          setBreakRooms(0);
          setRestrooms(0);
          setExamRooms(0);
          setWaitingAreas(0);
          setProcedureRooms(0);
          setGuestRooms(0);
          setCommonAreas(0);
          setDiningAreas(0);
          setAddOns({
            windowCleaning: false,
            floorWaxing: false,
            carpetCleaning: false,
            pressureWashing: false,
            postConstruction: false,
            disinfection: false,
          });
          setPreferredDays([]);
          setPreferredTime("");
          setSpecialInstructions("");
        }}
        style={{
          padding: "18px 40px",
          borderRadius: "16px",
          border: "none",
          background: "linear-gradient(135deg, #5debf1 0%, #0ea5e9 100%)",
          color: "white",
          fontSize: "16px",
          fontWeight: "800",
          cursor: "pointer",
          transition: "all 0.3s ease",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        Done
      </button>
    </div>
  </div>
)}

</div>
);
}
