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
  const [conferenceRooms, setConferenceRooms] = useState(0);
  const [breakRooms, setBreakRooms] = useState(0);
  const [restrooms, setRestrooms] = useState(0);
  const [receptions, setReceptions] = useState(0);
  const [serverRooms, setServerRooms] = useState(0);
  const [storageRooms, setStorageRooms] = useState(0);
  
  // Office - Workspace Builder
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceConfigs, setWorkspaceConfigs] = useState([]); // Array of workspace configurations
  
  // Office - Workspace Modal builder state
  const [wsTemplate, setWsTemplate] = useState("");
  const [wsPrivacy, setWsPrivacy] = useState("open");
  const [wsSize, setWsSize] = useState("medium");
  const [wsComplexity, setWsComplexity] = useState("standard");
  const [wsFlooring, setWsFlooring] = useState("hard");
  const [wsFeatures, setWsFeatures] = useState({
    food: false,
    equipment: false,
    highTraffic: false,
    trash: false,
  });
  const [wsQuantity, setWsQuantity] = useState(1);
  const [wsDailyCount, setWsDailyCount] = useState(1); // How many of this type cleaned per day
  const [wsEditingIndex, setWsEditingIndex] = useState(null);
  
  // Office - Individual facility frequencies
  const [conferenceRoomsFreq, setConferenceRoomsFreq] = useState("");
  const [breakRoomsFreq, setBreakRoomsFreq] = useState("");
  const [restroomsFreq, setRestroomsFreq] = useState("");
  const [receptionsFreq, setReceptionsFreq] = useState("");
  const [serverRoomsFreq, setServerRoomsFreq] = useState("");
  const [storageRoomsFreq, setStorageRoomsFreq] = useState("");
  
  // Healthcare
  const [examRooms, setExamRooms] = useState(0);
  const [waitingAreas, setWaitingAreas] = useState(0);
  const [procedureRooms, setProcedureRooms] = useState(0);
  const [laboratories, setLaboratories] = useState(0);
  const [sterilizationRooms, setSterilizationRooms] = useState(0);
  const [nurseStations, setNurseStations] = useState(0);
  const [consultRooms, setConsultRooms] = useState(0);
  
  // Hospitality
  const [guestRooms, setGuestRooms] = useState(0);
  const [commonAreas, setCommonAreas] = useState(0);
  const [diningAreas, setDiningAreas] = useState(0);
  const [fitnessCenters, setFitnessCenters] = useState(0);
  const [poolSpas, setPoolSpas] = useState(0);
  const [eventSpaces, setEventSpaces] = useState(0);
  const [laundryRooms, setLaundryRooms] = useState(0);
  const [lobbyReceptions, setLobbyReceptions] = useState(0);
  
  // Hospitality - Guest Room Builder
  const [showGuestRoomModal, setShowGuestRoomModal] = useState(false);
  const [guestRoomConfigs, setGuestRoomConfigs] = useState([]); // Array of room configurations
  const [dailyTurnover, setDailyTurnover] = useState(""); // How many rooms cleaned per day
  
  // Modal builder state
  const [modalTemplate, setModalTemplate] = useState("");
  const [modalBeds, setModalBeds] = useState(1);
  const [modalBathrooms, setModalBathrooms] = useState(1);
  const [modalKitchen, setModalKitchen] = useState("none");
  const [modalSize, setModalSize] = useState("medium");
  const [modalLivingArea, setModalLivingArea] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null); // For editing existing configs
  
  // Hospitality - Individual facility frequencies
  const [commonAreasFreq, setCommonAreasFreq] = useState("");
  const [diningAreasFreq, setDiningAreasFreq] = useState("");
  const [fitnessCentersFreq, setFitnessCentersFreq] = useState("");
  const [poolSpasFreq, setPoolSpasFreq] = useState("");
  const [eventSpacesFreq, setEventSpacesFreq] = useState("");
  const [laundryRoomsFreq, setLaundryRoomsFreq] = useState("");
  const [lobbyReceptionsFreq, setLobbyReceptionsFreq] = useState("");
  const [sharedBathrooms, setSharedBathrooms] = useState(0);
  const [sharedBathroomsFreq, setSharedBathroomsFreq] = useState("");
  
  // Retail
  const [fittingRooms, setFittingRooms] = useState(0);
  const [showroomDisplays, setShowroomDisplays] = useState(0);
  const [stockrooms, setStockrooms] = useState(0);
  const [customerRestrooms, setCustomerRestrooms] = useState(0);
  const [posCheckouts, setPosCheckouts] = useState(0);
  
  // Industrial
  const [loadingDocks, setLoadingDocks] = useState(0);
  const [equipmentAreas, setEquipmentAreas] = useState(0);
  const [industrialBreakRooms, setIndustrialBreakRooms] = useState(0);
  const [industrialRestrooms, setIndustrialRestrooms] = useState(0);
  const [officeAreas, setOfficeAreas] = useState(0);
  
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
    // Base rates per square foot (2x/WEEK = 8 cleanings/month) - TIERED BY SIZE
    // These rates represent monthly cost for 2x per week service
    baseRatesTiered: {
      office: [
        { max: 2500, rate: 0.44 },      // 0-2,500 sqft: $0.44/sqft (2x/week base)
        { max: 3500, rate: 0.43 },      // 2,501-3,500 sqft: $0.43/sqft
        { max: 5000, rate: 0.41 },      // 3,501-5,000 sqft: $0.41/sqft
        { max: 7500, rate: 0.39 },      // 5,001-7,500 sqft: $0.39/sqft
        { max: 10000, rate: 0.36 },     // 7,501-10,000 sqft: $0.36/sqft
        { max: 15000, rate: 0.32 },     // 10,001-15,000 sqft: $0.32/sqft
        { max: 20000, rate: 0.30 },     // 15,001-20,000 sqft: $0.30/sqft
        { max: 30000, rate: 0.27 },     // 20,001-30,000 sqft: $0.27/sqft
        { max: 50000, rate: 0.25 },     // 30,001-50,000 sqft: $0.25/sqft
        { max: Infinity, rate: 0.22 },  // 50,001+ sqft: $0.22/sqft
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
    
    // Frequency multipliers (BASE = 2x/Week = 8 cleanings per month)
    // Multiplier applied to monthly base rate
    frequencyMultipliers: {
      "monthly": 0.15,         // 1 cleaning/month
      "every-3-weeks": 0.21,   // ~1.3 cleanings/month
      "bi-weekly": 0.28,       // 2 cleanings/month
      "weekly": 0.50,          // 4 cleanings/month (50% of 2x/week)
      "2x-week": 1.0,          // 8 cleanings/month (BASE RATE)
      "3x-week": 1.42,         // 12 cleanings/month (5% discount per clean)
      "4x-week": 1.93,         // 17 cleanings/month (9% discount per clean)
      "daily": 2.39,           // 22 cleanings/month (13% discount per clean)
    },
    
    // Legacy frequency discounts for other segments (keeping for backward compatibility)
    frequencyDiscounts: {
      "daily": 0.20,           // 20% discount for daily cleaning
      "4x-week": 0.15,         // 15% discount for 4x/week
      "3x-week": 0.10,         // 10% discount for 3x/week
      "2x-week": 0.05,         // 5% discount for 2x/week
      "weekly": 0,             // No discount for weekly
      "bi-weekly": -0.10,      // 10% upcharge for bi-weekly (less frequent)
    },
    
    // Room/Area pricing
    rooms: {
      // OFFICE BUILDINGS
      workstation: 8,          // $8 per workstation/desk
      conferenceRoom: 25,      // $25 per conference room
      breakRoom: 30,           // $30 per break room/kitchen
      restroom: 35,            // $35 per restroom
      reception: 40,           // $40 per reception/lobby area
      serverRoom: 50,          // $50 per IT/server room (dust-free cleaning)
      storageRoom: 20,         // $20 per storage/file room
      privateOffice: 30,       // $30 per private/executive office
      
      // HEALTHCARE
      examRoom: 40,            // $40 per exam room (medical grade cleaning)
      waitingArea: 30,         // $30 per waiting area
      procedureRoom: 60,       // $60 per procedure room (surgical grade)
      laboratory: 75,          // $75 per lab (sterile cleaning requirements)
      sterilizationRoom: 65,   // $65 per sterilization room
      nurseStation: 35,        // $35 per nurse station
      consultRoom: 35,         // $35 per consultation room
      
      // HOSPITALITY
      guestRoom: 45,           // $45 per guest room
      commonArea: 35,          // $35 per common area
      diningArea: 50,          // $50 per dining area/restaurant
      fitnessCenter: 60,       // $60 per fitness center
      poolSpa: 75,             // $75 per pool/spa area
      eventSpace: 100,         // $100 per event/banquet space
      laundryRoom: 40,         // $40 per commercial laundry room
      lobbyReception: 55,      // $55 per hotel lobby/reception
      
      // RETAIL
      fittingRoom: 18,         // $18 per fitting/dressing room
      showroomDisplay: 30,     // $30 per showroom/display area
      stockroom: 25,           // $25 per stockroom/back area
      customerRestroom: 35,    // $35 per customer restroom
      posCheckout: 20,         // $20 per POS/checkout area
      
      // INDUSTRIAL
      loadingDock: 50,         // $50 per loading dock
      equipmentArea: 40,       // $40 per equipment/maintenance area
      warehouseZone: 0.06,     // $0.06 per sqft for warehouse zones
      industrialBreakRoom: 30, // $30 per employee break room
      industrialRestroom: 35,  // $35 per restroom
      officeArea: 25,          // $25 per admin/office area
    },
    
    // Office Specialty Room Add-Ons (Monthly fees beyond base sqft rate)
    officeSpecialtyRooms: {
      conferenceRoomSmall: 80,      // Conference room <10 people (weekly deep clean)
      conferenceRoomMedium: 120,    // Conference room 10-20 people
      conferenceRoomLarge: 180,     // Conference room 20+ people
      breakRoomBasic: 100,          // Basic break room (microwave, sink, fridge) - 3x/week
      fullKitchen: 200,             // Full commercial kitchen (daily service)
      restroomDeepSanitize: 50,     // Per restroom (daily disinfection protocol)
      serverRoom: 75,               // Server/IT room (monthly service)
      lobbyReception: 150,          // Lobby/reception premium (daily high-traffic)
      storageArchive: 40,           // Storage/archive room (monthly/quarterly)
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

  // Guest Room Builder Functions
  const calculateGuestRoomPrice = (config) => {
    let basePrice = 25; // Starting base
    
    // Bed pricing
    if (config.beds === 0) basePrice += 10; // Studio
    else if (config.beds === 1) basePrice += 15;
    else if (config.beds === 2) basePrice += 25;
    else basePrice += 35; // 3+ beds
    
    // Bathroom pricing - $8 per half bath, $15 per full bath
    if (config.bathrooms === 0) {
      basePrice += 0; // No bathroom (shared/public)
    } else {
      const fullBaths = Math.floor(config.bathrooms);
      const hasHalfBath = config.bathrooms % 1 !== 0;
      basePrice += (fullBaths * 15) + (hasHalfBath ? 8 : 0);
    }
    
    // Kitchen pricing
    if (config.kitchen === "kitchenette") basePrice += 8;
    else if (config.kitchen === "full") basePrice += 15;
    
    // Size pricing
    if (config.size === "small") basePrice += 0;
    else if (config.size === "medium") basePrice += 5;
    else if (config.size === "large") basePrice += 10;
    else basePrice += 15; // XL
    
    // Living area pricing
    if (config.livingArea) basePrice += 12;
    
    return basePrice;
  };

  const getRoomTypeLabel = (config) => {
    let label = "";
    
    if (config.beds === 0) label = "Studio";
    else if (config.beds === 1) label = "1-Bed";
    else if (config.beds === 2) label = "2-Bed";
    else label = `${config.beds}-Bed`;
    
    if (config.livingArea) label += " Suite";
    
    if (config.kitchen === "kitchenette") label += " + Kitchenette";
    else if (config.kitchen === "full") label += " + Kitchen";
    
    label += ` (${config.bathrooms} bath${config.bathrooms > 1 ? 's' : ''})`;
    
    return label;
  };

  const applyTemplate = (template) => {
    setModalTemplate(template);
    
    switch(template) {
      case "studio":
        setModalBeds(0);
        setModalBathrooms(1);
        setModalKitchen("kitchenette");
        setModalSize("small");
        setModalLivingArea(false);
        break;
      case "standard":
        setModalBeds(2);
        setModalBathrooms(1);
        setModalKitchen("none");
        setModalSize("medium");
        setModalLivingArea(false);
        break;
      case "deluxe":
        setModalBeds(2);
        setModalBathrooms(1);
        setModalKitchen("none");
        setModalSize("large");
        setModalLivingArea(false);
        break;
      case "suite":
        setModalBeds(1);
        setModalBathrooms(1.5);
        setModalKitchen("kitchenette");
        setModalSize("large");
        setModalLivingArea(true);
        break;
      case "custom":
        setModalBeds(1);
        setModalBathrooms(1);
        setModalKitchen("none");
        setModalSize("medium");
        setModalLivingArea(false);
        break;
      default:
        break;
    }
  };

  const saveGuestRoomConfig = () => {
    const config = {
      beds: modalBeds,
      bathrooms: modalBathrooms,
      kitchen: modalKitchen,
      size: modalSize,
      livingArea: modalLivingArea,
      quantity: modalQuantity,
      pricePerClean: calculateGuestRoomPrice({
        beds: modalBeds,
        bathrooms: modalBathrooms,
        kitchen: modalKitchen,
        size: modalSize,
        livingArea: modalLivingArea
      })
    };
    
    if (editingIndex !== null) {
      // Update existing config
      const updated = [...guestRoomConfigs];
      updated[editingIndex] = config;
      setGuestRoomConfigs(updated);
      setEditingIndex(null);
    } else {
      // Add new config
      setGuestRoomConfigs([...guestRoomConfigs, config]);
    }
    
    // Reset modal
    setShowGuestRoomModal(false);
    setModalTemplate("");
    setModalBeds(1);
    setModalBathrooms(1);
    setModalKitchen("none");
    setModalSize("medium");
    setModalLivingArea(false);
    setModalQuantity(1);
  };

  const deleteGuestRoomConfig = (index) => {
    setGuestRoomConfigs(guestRoomConfigs.filter((_, i) => i !== index));
  };

  const editGuestRoomConfig = (index) => {
    const config = guestRoomConfigs[index];
    setModalBeds(config.beds);
    setModalBathrooms(config.bathrooms);
    setModalKitchen(config.kitchen);
    setModalSize(config.size);
    setModalLivingArea(config.livingArea);
    setModalQuantity(config.quantity);
    setEditingIndex(index);
    setShowGuestRoomModal(true);
  };

  // Workspace Builder Functions (Office)
  const calculateWorkspacePrice = (config) => {
    let basePrice = 8; // Starting base
    
    // Privacy pricing
    if (config.privacy === "open") basePrice += 0;
    else if (config.privacy === "partial") basePrice += 3; // Cubicle
    else if (config.privacy === "private") basePrice += 5; // Office
    
    // Size pricing
    if (config.size === "small") basePrice += 0;
    else if (config.size === "medium") basePrice += 2;
    else if (config.size === "large") basePrice += 4;
    else if (config.size === "xl") basePrice += 6;
    
    // Complexity pricing
    if (config.complexity === "light") basePrice -= 2; // Clean desk policy
    else if (config.complexity === "standard") basePrice += 0;
    else if (config.complexity === "heavy") basePrice += 4; // Cluttered
    
    // Flooring pricing
    if (config.flooring === "hard") basePrice += 0;
    else if (config.flooring === "carpet") basePrice += 3;
    else if (config.flooring === "industrial") basePrice += 2;
    
    // Features pricing
    if (config.features.food) basePrice += 2;
    if (config.features.equipment) basePrice += 3;
    if (config.features.highTraffic) basePrice += 2;
    if (config.features.trash) basePrice += 1;
    
    return basePrice;
  };

  const getWorkspaceLabel = (config) => {
    let label = "";
    
    // Privacy type
    if (config.privacy === "open") label = "Open Desk";
    else if (config.privacy === "partial") label = "Cubicle";
    else if (config.privacy === "private") label = "Private Office";
    
    // Size
    label += ` (${config.size.charAt(0).toUpperCase() + config.size.slice(1)}`;
    
    // Complexity
    if (config.complexity !== "standard") {
      label += `, ${config.complexity}`;
    }
    
    // Flooring
    if (config.flooring === "carpet") label += ", Carpet";
    else if (config.flooring === "industrial") label += ", Industrial";
    
    label += ")";
    
    return label;
  };

  const applyWorkspaceTemplate = (template) => {
    setWsTemplate(template);
    
    switch(template) {
      case "executive":
        setWsPrivacy("private");
        setWsSize("large");
        setWsComplexity("standard");
        setWsFlooring("carpet");
        setWsFeatures({ food: false, equipment: false, highTraffic: false, trash: false });
        break;
      case "manager":
        setWsPrivacy("private");
        setWsSize("medium");
        setWsComplexity("standard");
        setWsFlooring("carpet");
        setWsFeatures({ food: false, equipment: false, highTraffic: false, trash: false });
        break;
      case "cubicle":
        setWsPrivacy("partial");
        setWsSize("small"); // Cubicles are standardized, size won't show in UI
        setWsComplexity("standard");
        setWsFlooring("carpet");
        setWsFeatures({ food: false, equipment: false, highTraffic: false, trash: false });
        break;
      case "open-desk":
        setWsPrivacy("open");
        setWsSize("small"); // Open desks are standardized, size won't show in UI
        setWsComplexity("light");
        setWsFlooring("hard");
        setWsFeatures({ food: false, equipment: false, highTraffic: false, trash: false });
        break;
      case "creative":
        setWsPrivacy("open");
        setWsSize("medium");
        setWsComplexity("standard");
        setWsFlooring("hard");
        setWsFeatures({ food: true, equipment: false, highTraffic: true, trash: false });
        break;
      case "custom":
        setWsPrivacy("open");
        setWsSize("medium");
        setWsComplexity("standard");
        setWsFlooring("hard");
        setWsFeatures({ food: false, equipment: false, highTraffic: false, trash: false });
        break;
      default:
        break;
    }
  };

  const saveWorkspaceConfig = () => {
    const config = {
      privacy: wsPrivacy,
      size: wsSize,
      complexity: wsComplexity,
      flooring: wsFlooring,
      features: { ...wsFeatures },
      quantity: wsQuantity,
      dailyCount: wsDailyCount,
      pricePerClean: calculateWorkspacePrice({
        privacy: wsPrivacy,
        size: wsSize,
        complexity: wsComplexity,
        flooring: wsFlooring,
        features: wsFeatures
      })
    };
    
    if (wsEditingIndex !== null) {
      // Update existing config
      const updated = [...workspaceConfigs];
      updated[wsEditingIndex] = config;
      setWorkspaceConfigs(updated);
      setWsEditingIndex(null);
    } else {
      // Add new config
      setWorkspaceConfigs([...workspaceConfigs, config]);
    }
    
    // Reset modal
    setShowWorkspaceModal(false);
    setWsTemplate("");
    setWsPrivacy("open");
    setWsSize("medium");
    setWsComplexity("standard");
    setWsFlooring("hard");
    setWsFeatures({ food: false, equipment: false, highTraffic: false, trash: false });
    setWsQuantity(1);
    setWsDailyCount(1);
  };

  const deleteWorkspaceConfig = (index) => {
    setWorkspaceConfigs(workspaceConfigs.filter((_, i) => i !== index));
  };

  const editWorkspaceConfig = (index) => {
    const config = workspaceConfigs[index];
    setWsTemplate("custom"); // Set template so customization options show
    setWsPrivacy(config.privacy);
    setWsSize(config.size);
    setWsComplexity(config.complexity);
    setWsFlooring(config.flooring);
    setWsFeatures({ ...config.features });
    setWsQuantity(config.quantity);
    setWsDailyCount(config.dailyCount || 1);
    setWsEditingIndex(index);
    setShowWorkspaceModal(true);
  };

  // Calculate monthly cost for a facility based on its frequency
  const getFacilityMonthlyCost = (quantity, pricePerClean, frequency) => {
    if (!quantity || !frequency) return 0;
    
    // Visits per month - consistent with main office pricing
    const visitsPerMonth = {
      "daily": 22,        // 22 visits per month
      "4x-week": 17,      // 17 visits per month
      "3x-week": 12,      // 12 visits per month
      "2x-week": 8,       // 8 visits per month (BASE)
      "weekly": 4,        // 4 visits per month
      "bi-weekly": 2,     // 2 visits per month
      "monthly": 1,       // 1 visit per month
    };
    
    // Frequency multipliers - 2x/week is BASE (1.0x)
    // More frequent = discount per visit, Less frequent = premium per visit
    const frequencyMultipliers = {
      "daily": 0.82,       // 18% discount per visit
      "4x-week": 0.86,     // 14% discount per visit
      "3x-week": 0.90,     // 10% discount per visit
      "2x-week": 1.0,      // BASE RATE (no discount/premium)
      "weekly": 1.05,      // 5% premium per visit
      "bi-weekly": 1.12,   // 12% premium per visit
      "monthly": 1.20,     // 20% premium per visit
    };
    
    const visits = visitsPerMonth[frequency] || 0;
    const multiplier = frequencyMultipliers[frequency] || 1.0;
    
    // Calculate: quantity × price per visit × visits per month × frequency multiplier
    return quantity * pricePerClean * visits * multiplier;
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
    if (!marketSegment || !squareFeet) return 0;
    
    // For office and hospitality, frequency is per-facility (not global)
    // For other segments, require frequency
    if (marketSegment !== "hospitality" && marketSegment !== "office" && !frequency) return 0;
    
    let total = 0;
    const sqft = parseInt(squareFeet);
    
    // Base cleaning cost using tiered pricing
    const baseRate = getRateForSquareFeet(sqft, marketSegment);
    let baseCost = sqft * baseRate;
    
    // Apply frequency multiplier for office segment (base rate assumes weekly)
    if (marketSegment === "office" && frequency) {
      const frequencyMultiplier = PRICING.frequencyMultipliers[frequency] || 1.0;
      baseCost = baseCost * frequencyMultiplier;
    }
    
    total += baseCost;
    
    // Room/Area charges based on market segment
    if (marketSegment === "office") {
      // Workspace configurations are for SERVICE DOCUMENTATION only (not priced separately)
      // Base sqft rate already covers workspace cleaning
      
      // Specialty room add-ons (monthly fees beyond base rate)
      // These are charged separately because they require extra attention beyond standard cleaning
      total += getFacilityMonthlyCost(conferenceRooms, 45, conferenceRoomsFreq);
      total += getFacilityMonthlyCost(breakRooms, 35, breakRoomsFreq);
      total += getFacilityMonthlyCost(restrooms, 25, restroomsFreq);
      total += getFacilityMonthlyCost(receptions, 40, receptionsFreq);
      total += getFacilityMonthlyCost(serverRooms, 30, serverRoomsFreq);
      total += getFacilityMonthlyCost(storageRooms, 20, storageRoomsFreq);
    } else if (marketSegment === "healthcare") {
      total += examRooms * PRICING.rooms.examRoom;
      total += waitingAreas * PRICING.rooms.waitingArea;
      total += procedureRooms * PRICING.rooms.procedureRoom;
      total += restrooms * PRICING.rooms.restroom;
    } else if (marketSegment === "hospitality") {
      // Guest room configurations with daily turnover + volume discount
      if (guestRoomConfigs.length > 0 && dailyTurnover) {
        const dailyTurnoverNum = parseInt(dailyTurnover) || 0;
        const totalRoomQuantity = guestRoomConfigs.reduce((sum, c) => sum + c.quantity, 0);
        const totalGuestRoomCost = guestRoomConfigs.reduce((sum, config) => {
          return sum + (config.quantity * config.pricePerClean);
        }, 0);
        
        // Base monthly cost
        let monthlyGuestRoomCost = (dailyTurnoverNum * 30 * totalGuestRoomCost) / totalRoomQuantity;
        
        // Apply volume discount based on daily turnover
        let volumeDiscount = 0;
        if (dailyTurnoverNum >= 40) volumeDiscount = 0.15;      // 15% off for 40+ rooms/day
        else if (dailyTurnoverNum >= 30) volumeDiscount = 0.12; // 12% off for 30-39 rooms/day
        else if (dailyTurnoverNum >= 20) volumeDiscount = 0.09; // 9% off for 20-29 rooms/day
        else if (dailyTurnoverNum >= 15) volumeDiscount = 0.07; // 7% off for 15-19 rooms/day
        else if (dailyTurnoverNum >= 10) volumeDiscount = 0.05; // 5% off for 10-14 rooms/day
        else if (dailyTurnoverNum >= 5) volumeDiscount = 0.03;  // 3% off for 5-9 rooms/day
        
        monthlyGuestRoomCost = monthlyGuestRoomCost * (1 - volumeDiscount);
        total += monthlyGuestRoomCost;
      }
      
      // Other hospitality areas (each with individual frequency)
      total += getFacilityMonthlyCost(commonAreas, 35, commonAreasFreq);
      total += getFacilityMonthlyCost(diningAreas, 50, diningAreasFreq);
      total += getFacilityMonthlyCost(fitnessCenters, 60, fitnessCentersFreq);
      total += getFacilityMonthlyCost(poolSpas, 75, poolSpasFreq);
      total += getFacilityMonthlyCost(eventSpaces, 100, eventSpacesFreq);
      total += getFacilityMonthlyCost(laundryRooms, 40, laundryRoomsFreq);
      total += getFacilityMonthlyCost(lobbyReceptions, 55, lobbyReceptionsFreq);
      
      // Shared bathrooms - calculate price based on half vs full bathrooms
      if (sharedBathrooms > 0 && sharedBathroomsFreq) {
        const fullBaths = Math.floor(sharedBathrooms);
        const hasHalfBath = sharedBathrooms % 1 !== 0;
        const pricePerClean = (fullBaths * 21) + (hasHalfBath ? 14 : 0);
        total += getFacilityMonthlyCost(1, pricePerClean, sharedBathroomsFreq);
      }
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
    // For hospitality, discounts are already applied per-facility in getFacilityMonthlyCost
    // So we calculate the discount by comparing with and without frequency multipliers
    if (marketSegment === "hospitality") {
      let totalWithoutDiscount = 0;
      let totalWithDiscount = 0;
      
      const facilities = [
        { qty: commonAreas, price: 35, freq: commonAreasFreq },
        { qty: diningAreas, price: 50, freq: diningAreasFreq },
        { qty: fitnessCenters, price: 60, freq: fitnessCentersFreq },
        { qty: poolSpas, price: 75, freq: poolSpasFreq },
        { qty: eventSpaces, price: 100, freq: eventSpacesFreq },
        { qty: laundryRooms, price: 40, freq: laundryRoomsFreq },
        { qty: lobbyReceptions, price: 55, freq: lobbyReceptionsFreq },
      ];
      
      const visitsPerMonth = {
        "daily": 22,       // Daily = 22 visits
        "4x-week": 17,     // 4x per week = 17 visits
        "3x-week": 12,     // 3x per week = 12 visits
        "2x-week": 8,      // 2x per week = 8 visits
        "weekly": 4,       // Weekly = 4 visits
        "bi-weekly": 2,    // Bi-weekly = 2 visits
      };
      
      const discountRates = {
        "daily": -0.18,    // 18% discount
        "4x-week": -0.14,  // 14% discount
        "3x-week": -0.10,  // 10% discount
        "2x-week": -0.05,  // 5% discount
        "weekly": 0,       // No discount
        "bi-weekly": 0.10, // 10% upcharge
      };
      
      facilities.forEach(({ qty, price, freq }) => {
        if (qty > 0 && freq) {
          const visits = visitsPerMonth[freq] || 0;
          const baseCost = qty * price * visits;
          totalWithoutDiscount += baseCost;
          
          const discountRate = discountRates[freq] || 0;
          if (discountRate >= 0) {
            totalWithDiscount += baseCost * (1 + discountRate);
          } else {
            totalWithDiscount += baseCost * (1 + discountRate);
          }
        }
      });
      
      return totalWithoutDiscount - totalWithDiscount;
    }
    
    // For other segments, use the regular frequency discount
    const subtotal = calculateSubtotal();
    const discountRate = PRICING.frequencyDiscounts[frequency] || 0;
    return subtotal * Math.abs(discountRate);
  };

  const calculateTotal = () => {
    // For hospitality and office, the total is just the subtotal (discounts already applied)
    if (marketSegment === "hospitality" || marketSegment === "office") {
      return calculateSubtotal();
    }
    
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
    const baseSqftCost = sqft * baseRate;
    
    // Apply frequency multiplier for office (base assumes weekly)
    if (marketSegment === "office" && frequency) {
      const frequencyMultiplier = PRICING.frequencyMultipliers[frequency] || 1.0;
      const adjustedCost = baseSqftCost * frequencyMultiplier;
      
      // Frequency labels for display
      const frequencyLabels = {
        "monthly": "Monthly (1x)",
        "every-3-weeks": "Every 3 Weeks",
        "bi-weekly": "Bi-weekly (2x)",
        "weekly": "Weekly (4x)",
        "2x-week": "2x/Week (8x)",
        "3x-week": "3x/Week (12x)",
        "4x-week": "4x/Week (17x)",
        "daily": "Daily (22x)"
      };
      
      breakdown.push({
        label: `Base Cleaning (${sqft.toLocaleString()} sqft - ${frequencyLabels[frequency] || frequency})`,
        amount: adjustedCost,
        originalAmount: frequencyMultiplier !== 1.0 ? baseSqftCost : null,
        discountPercent: frequencyMultiplier !== 1.0 ? `${frequencyMultiplier}x` : "",
        note: frequencyMultiplier < 1.0 ? "Lower frequency" : frequencyMultiplier > 1.0 ? "Volume discount" : ""
      });
    } else {
      breakdown.push({
        label: `Base Cleaning (${sqft.toLocaleString()} sqft)`,
        amount: baseSqftCost
      });
    }
    
    // Room charges
    if (marketSegment === "office") {
      // Workspace configurations are for documentation only (included in base sqft rate)
      // Show workspace summary if configured
      if (workspaceConfigs.length > 0) {
        const totalWorkspaces = workspaceConfigs.reduce((sum, config) => sum + config.quantity, 0);
        breakdown.push({
          label: `📋 Service Scope: ${totalWorkspaces} workspaces configured (included in base rate)`,
          amount: 0,
          isInfo: true
        });
      }
      
      // Individual facilities with their frequencies
      const frequencyMultipliers = {
        "daily": 0.82,       // 18% discount per visit
        "4x-week": 0.86,     // 14% discount per visit
        "3x-week": 0.90,     // 10% discount per visit
        "2x-week": 1.0,      // BASE RATE (no discount/premium)
        "weekly": 1.05,      // 5% premium per visit
        "bi-weekly": 1.12,   // 12% premium per visit
        "monthly": 1.20,     // 20% premium per visit
      };
      
      const discountLabels = {
        "daily": "18%",
        "4x-week": "14%",
        "3x-week": "10%",
        "2x-week": "",
        "weekly": "5%",
        "bi-weekly": "12%",
        "monthly": "20%",
      };
      
      const visitsPerMonth = {
        "daily": 22,
        "4x-week": 17,
        "3x-week": 12,
        "2x-week": 8,
        "weekly": 4,
        "bi-weekly": 2,
        "monthly": 1,
      };
      
      if (conferenceRooms > 0 && conferenceRoomsFreq) {
        const visits = visitsPerMonth[conferenceRoomsFreq];
        const multiplier = frequencyMultipliers[conferenceRoomsFreq];
        const basePerVisit = 45;
        const baseCost = conferenceRooms * basePerVisit * visits; // Base cost without multiplier
        const cost = conferenceRooms * basePerVisit * visits * multiplier; // Actual cost with multiplier
        const hasDiscount = multiplier < 1.0;
        const isPremium = multiplier > 1.0;
        
        breakdown.push({ 
          label: `Conference Rooms (${conferenceRoomsFreq})`, 
          amount: cost,
          originalAmount: (hasDiscount || isPremium) ? baseCost : null,
          discountPercent: discountLabels[conferenceRoomsFreq],
          discountAmount: hasDiscount ? (baseCost - cost) : 0,
          isUpcharge: isPremium
        });
      }
      if (breakRooms > 0 && breakRoomsFreq) {
        const visits = visitsPerMonth[breakRoomsFreq];
        const multiplier = frequencyMultipliers[breakRoomsFreq];
        const basePerVisit = 35;
        const baseCost = breakRooms * basePerVisit * visits;
        const cost = breakRooms * basePerVisit * visits * multiplier;
        const hasDiscount = multiplier < 1.0;
        const isPremium = multiplier > 1.0;
        
        breakdown.push({ 
          label: `Break Rooms (${breakRoomsFreq})`, 
          amount: cost,
          originalAmount: (hasDiscount || isPremium) ? baseCost : null,
          discountPercent: discountLabels[breakRoomsFreq],
          discountAmount: hasDiscount ? (baseCost - cost) : 0,
          isUpcharge: isPremium
        });
      }
      if (restrooms > 0 && restroomsFreq) {
        const visits = visitsPerMonth[restroomsFreq];
        const multiplier = frequencyMultipliers[restroomsFreq];
        const basePerVisit = 25;
        const baseCost = restrooms * basePerVisit * visits;
        const cost = restrooms * basePerVisit * visits * multiplier;
        const hasDiscount = multiplier < 1.0;
        const isPremium = multiplier > 1.0;
        
        breakdown.push({ 
          label: `Restrooms (${restroomsFreq})`, 
          amount: cost,
          originalAmount: (hasDiscount || isPremium) ? baseCost : null,
          discountPercent: discountLabels[restroomsFreq],
          discountAmount: hasDiscount ? (baseCost - cost) : 0,
          isUpcharge: isPremium
        });
      }
      if (receptions > 0 && receptionsFreq) {
        const visits = visitsPerMonth[receptionsFreq];
        const multiplier = frequencyMultipliers[receptionsFreq];
        const basePerVisit = 40;
        const baseCost = receptions * basePerVisit * visits;
        const cost = receptions * basePerVisit * visits * multiplier;
        const hasDiscount = multiplier < 1.0;
        const isPremium = multiplier > 1.0;
        
        breakdown.push({ 
          label: `Lobby/Reception (${receptionsFreq})`, 
          amount: cost,
          originalAmount: (hasDiscount || isPremium) ? baseCost : null,
          discountPercent: discountLabels[receptionsFreq],
          discountAmount: hasDiscount ? (baseCost - cost) : 0,
          isUpcharge: isPremium
        });
      }
      if (serverRooms > 0 && serverRoomsFreq) {
        const visits = visitsPerMonth[serverRoomsFreq];
        const multiplier = frequencyMultipliers[serverRoomsFreq];
        const basePerVisit = 30;
        const baseCost = serverRooms * basePerVisit * visits;
        const cost = serverRooms * basePerVisit * visits * multiplier;
        const hasDiscount = multiplier < 1.0;
        const isPremium = multiplier > 1.0;
        
        breakdown.push({ 
          label: `Server/IT Rooms (${serverRoomsFreq})`, 
          amount: cost,
          originalAmount: (hasDiscount || isPremium) ? baseCost : null,
          discountPercent: discountLabels[serverRoomsFreq],
          discountAmount: hasDiscount ? (baseCost - cost) : 0,
          isUpcharge: isPremium
        });
      }
      if (storageRooms > 0 && storageRoomsFreq) {
        const visits = visitsPerMonth[storageRoomsFreq];
        const multiplier = frequencyMultipliers[storageRoomsFreq];
        const basePerVisit = 20;
        const baseCost = storageRooms * basePerVisit * visits;
        const cost = storageRooms * basePerVisit * visits * multiplier;
        const hasDiscount = multiplier < 1.0;
        const isPremium = multiplier > 1.0;
        
        breakdown.push({ 
          label: `Storage/Archive (${storageRoomsFreq})`, 
          amount: cost,
          originalAmount: (hasDiscount || isPremium) ? baseCost : null,
          discountPercent: discountLabels[storageRoomsFreq],
          discountAmount: hasDiscount ? (baseCost - cost) : 0,
          isUpcharge: isPremium
        });
      }
    } else if (marketSegment === "healthcare") {
      if (examRooms > 0) breakdown.push({ label: `Exam Rooms (${examRooms})`, amount: examRooms * PRICING.rooms.examRoom });
      if (waitingAreas > 0) breakdown.push({ label: `Waiting Areas (${waitingAreas})`, amount: waitingAreas * PRICING.rooms.waitingArea });
      if (procedureRooms > 0) breakdown.push({ label: `Procedure Rooms (${procedureRooms})`, amount: procedureRooms * PRICING.rooms.procedureRoom });
      if (restrooms > 0) breakdown.push({ label: `Restrooms (${restrooms})`, amount: restrooms * PRICING.rooms.restroom });
    } else if (marketSegment === "hospitality") {
      // Guest rooms with daily turnover + volume discount
      if (guestRoomConfigs.length > 0 && dailyTurnover) {
        const dailyTurnoverNum = parseInt(dailyTurnover) || 0;
        const totalRoomQuantity = guestRoomConfigs.reduce((sum, c) => sum + c.quantity, 0);
        const totalGuestRoomCost = guestRoomConfigs.reduce((sum, config) => {
          return sum + (config.quantity * config.pricePerClean);
        }, 0);
        
        // Calculate base monthly cost
        const baseMonthlyGuestRooms = (dailyTurnoverNum * 30 * totalGuestRoomCost) / totalRoomQuantity;
        
        // Apply volume discount
        let volumeDiscount = 0;
        let discountPercent = "";
        if (dailyTurnoverNum >= 40) {
          volumeDiscount = 0.15;
          discountPercent = "15%";
        } else if (dailyTurnoverNum >= 30) {
          volumeDiscount = 0.12;
          discountPercent = "12%";
        } else if (dailyTurnoverNum >= 20) {
          volumeDiscount = 0.09;
          discountPercent = "9%";
        } else if (dailyTurnoverNum >= 15) {
          volumeDiscount = 0.07;
          discountPercent = "7%";
        } else if (dailyTurnoverNum >= 10) {
          volumeDiscount = 0.05;
          discountPercent = "5%";
        } else if (dailyTurnoverNum >= 5) {
          volumeDiscount = 0.03;
          discountPercent = "3%";
        }
        
        const discountedMonthlyGuestRooms = baseMonthlyGuestRooms * (1 - volumeDiscount);
        const discountAmount = baseMonthlyGuestRooms - discountedMonthlyGuestRooms;
        
        breakdown.push({ 
          label: `Guest Rooms (${dailyTurnoverNum}/day × 30 days)`, 
          amount: discountedMonthlyGuestRooms,
          originalAmount: volumeDiscount > 0 ? baseMonthlyGuestRooms : null,
          discountPercent: discountPercent,
          discountAmount: discountAmount
        });
      }
      
      // Individual facilities with their frequencies
      const discountRates = {
        "daily": { rate: -0.20, label: "20%" },
        "5x-week": { rate: -0.15, label: "15%" },
        "3x-week": { rate: -0.10, label: "10%" },
        "2x-week": { rate: -0.05, label: "5%" },
        "weekly": { rate: 0, label: "" },
        "bi-weekly": { rate: 0.10, label: "10%" },
      };
      
      const visitsPerMonth = {
        "daily": 30,
        "5x-week": 22,
        "3x-week": 13,
        "2x-week": 8,
        "weekly": 4,
        "bi-weekly": 2,
      };
      
      if (commonAreas > 0 && commonAreasFreq) {
        const visits = visitsPerMonth[commonAreasFreq];
        const baseCost = commonAreas * 35 * visits;
        const cost = getFacilityMonthlyCost(commonAreas, 35, commonAreasFreq);
        const discountInfo = discountRates[commonAreasFreq];
        breakdown.push({ 
          label: `Common Areas (${commonAreasFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (diningAreas > 0 && diningAreasFreq) {
        const visits = visitsPerMonth[diningAreasFreq];
        const baseCost = diningAreas * 50 * visits;
        const cost = getFacilityMonthlyCost(diningAreas, 50, diningAreasFreq);
        const discountInfo = discountRates[diningAreasFreq];
        breakdown.push({ 
          label: `Dining Areas (${diningAreasFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (fitnessCenters > 0 && fitnessCentersFreq) {
        const visits = visitsPerMonth[fitnessCentersFreq];
        const baseCost = fitnessCenters * 60 * visits;
        const cost = getFacilityMonthlyCost(fitnessCenters, 60, fitnessCentersFreq);
        const discountInfo = discountRates[fitnessCentersFreq];
        breakdown.push({ 
          label: `Fitness Centers (${fitnessCentersFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (poolSpas > 0 && poolSpasFreq) {
        const visits = visitsPerMonth[poolSpasFreq];
        const baseCost = poolSpas * 75 * visits;
        const cost = getFacilityMonthlyCost(poolSpas, 75, poolSpasFreq);
        const discountInfo = discountRates[poolSpasFreq];
        breakdown.push({ 
          label: `Pool/Spa Areas (${poolSpasFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (eventSpaces > 0 && eventSpacesFreq) {
        const visits = visitsPerMonth[eventSpacesFreq];
        const baseCost = eventSpaces * 100 * visits;
        const cost = getFacilityMonthlyCost(eventSpaces, 100, eventSpacesFreq);
        const discountInfo = discountRates[eventSpacesFreq];
        breakdown.push({ 
          label: `Event Spaces (${eventSpacesFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (laundryRooms > 0 && laundryRoomsFreq) {
        const visits = visitsPerMonth[laundryRoomsFreq];
        const baseCost = laundryRooms * 40 * visits;
        const cost = getFacilityMonthlyCost(laundryRooms, 40, laundryRoomsFreq);
        const discountInfo = discountRates[laundryRoomsFreq];
        breakdown.push({ 
          label: `Laundry Rooms (${laundryRoomsFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (lobbyReceptions > 0 && lobbyReceptionsFreq) {
        const visits = visitsPerMonth[lobbyReceptionsFreq];
        const baseCost = lobbyReceptions * 55 * visits;
        const cost = getFacilityMonthlyCost(lobbyReceptions, 55, lobbyReceptionsFreq);
        const discountInfo = discountRates[lobbyReceptionsFreq];
        breakdown.push({ 
          label: `Lobby/Reception (${lobbyReceptionsFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
      if (sharedBathrooms > 0 && sharedBathroomsFreq) {
        const fullBaths = Math.floor(sharedBathrooms);
        const hasHalfBath = sharedBathrooms % 1 !== 0;
        const pricePerClean = (fullBaths * 21) + (hasHalfBath ? 14 : 0);
        const visits = visitsPerMonth[sharedBathroomsFreq];
        const baseCost = pricePerClean * visits;
        const cost = getFacilityMonthlyCost(1, pricePerClean, sharedBathroomsFreq);
        const discountInfo = discountRates[sharedBathroomsFreq];
        const bathroomLabel = sharedBathrooms % 1 === 0 
          ? `${sharedBathrooms} Full` 
          : `${Math.floor(sharedBathrooms)} Full + Half`;
        breakdown.push({ 
          label: `Shared/Public Bathrooms (${bathroomLabel}, ${sharedBathroomsFreq})`, 
          amount: cost,
          originalAmount: discountInfo.rate !== 0 ? baseCost : null,
          discountPercent: discountInfo.label,
          discountAmount: baseCost - cost,
          isUpcharge: discountInfo.rate > 0
        });
      }
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
      // Workspace configurations (includes per-config daily counts)
      if (workspaceConfigs.length > 0) {
        formData.append('Workspace Configurations', JSON.stringify(workspaceConfigs));
      }
      formData.append('Conference Rooms', conferenceRooms);
      formData.append('Break Rooms', breakRooms);
      formData.append('Restrooms', restrooms);
      formData.append('Reception/Lobby', receptions);
      formData.append('Server/IT Rooms', serverRooms);
      formData.append('Storage/Archive', storageRooms);
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
background: linear-gradient(135deg, #B87333 0%, #D4955A 100%);
border: 2px solid #D4955A;
box-shadow: 0 10px 30px rgba(212, 149, 90, 0.3);
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
text-shadow: 0 0 20px rgba(184, 115, 51, 0.6), 0 0 40px rgba(184, 115, 51, 0.4),
  0 0 60px rgba(184, 115, 51, 0.2);
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
background: radial-gradient(circle, rgba(46,58,71,0.18) 0%, transparent 70%);
animation: porb 7s ease-in-out infinite;
}

.hero-orb-2 {
width: 320px;
height: 320px;
top: 8%;
right: 5%;
background: radial-gradient(circle, rgba(46,58,71,0.14) 0%, transparent 70%);
animation: porb2 9s ease-in-out infinite reverse;
}

.hero-orb-3 {
width: 220px;
height: 220px;
bottom: 12%;
left: 5%;
background: radial-gradient(circle, rgba(143,170,184,0.09) 0%, transparent 70%);
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
background: #D4955A;
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
  <circle cx="260" cy="260" r="220" fill="none" stroke="#2E3A47" strokeWidth="1"/>
  <circle cx="260" cy="260" r="175" fill="none" stroke="#2E3A47" strokeWidth="0.6"/>
  <circle cx="260" cy="260" r="130" fill="none" stroke="#2E3A47" strokeWidth="0.6"/>
</svg>
<svg width="280" height="280" style={{position:"absolute",bottom:"-50px",right:"5%",opacity:0.35}} viewBox="0 0 280 280">
  <circle cx="140" cy="140" r="115" fill="none" stroke="#2E3A47" strokeWidth="1"/>
  <circle cx="140" cy="140" r="75" fill="none" stroke="#2E3A47" strokeWidth="0.6"/>
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
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(184, 115, 51, 0.2)",
  position: "relative",
}}
>
{/* Header with Custom Animated Title */}
<div
style={{
  backgroundColor: "rgba(15, 23, 30, 0.4)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(184, 115, 51, 0.2)",
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
  "radial-gradient(circle at 50% 50%, rgba(212, 149, 90, 0.2) 0%, transparent 70%)",
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
  color: "#B87333",
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
    "linear-gradient(90deg, transparent, #B87333, transparent)",
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
  background: "linear-gradient(90deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
  width: step === 1 ? "25%" : step === 2 ? "50%" : step === 3 ? "75%" : "100%",
  transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 0 15px rgba(184, 115, 51, 0.6)",
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
          "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 30px",
          boxShadow: "0 20px 50px rgba(184, 115, 51, 0.4)",
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
              fontSize: "14px",
              fontWeight: "800",
              color: "#B87333",
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
              fontSize: "14px",
              fontWeight: "800",
              color: "#B87333",
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
            fontSize: "14px",
            fontWeight: "800",
            color: "#B87333",
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
            fontSize: "14px",
            fontWeight: "800",
            color: "#B87333",
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
            fontSize: "14px",
            fontWeight: "800",
            color: "#B87333",
            marginBottom: "12px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Business Name <span style={{ color: "rgba(143, 170, 184, 0.5)", fontSize: "11px", marginLeft: "5px" }}>(Optional)</span>
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
            ? "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)"
            : "rgba(255, 255, 255, 0.2)",
          color: "white",
          cursor: firstName && lastName && email && phone ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
          letterSpacing: "2px",
          textTransform: "uppercase",
          boxShadow: firstName && lastName && email && phone
            ? "0 10px 30px rgba(143, 170, 184, 0.3)"
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <MapPin size={18} color="#B87333" />
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
          border: "2px solid rgba(184, 115, 51, 0.3)",
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
          color: "#B87333",
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
            border: "2px solid rgba(184, 115, 51, 0.3)",
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
          color: "#B87333",
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
            border: "2px solid rgba(184, 115, 51, 0.3)",
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
          color: "#B87333",
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
            border: "2px solid rgba(184, 115, 51, 0.3)",
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Building2 size={18} color="#B87333" />
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
                ? "2px solid #D4955A"
                : "2px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              background: marketSegment === segment.value
                ? "linear-gradient(135deg, rgba(212, 149, 90, 0.2) 0%, rgba(2, 132, 199, 0.2) 100%)"
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
              color: marketSegment === segment.value ? "white" : "#B87333",
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
          border: "2px solid rgba(184, 115, 51, 0.3)",
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
            ? "linear-gradient(135deg, #D4955A 0%, #D4955A 100%)"
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "20px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Building2 size={18} color="#B87333" />
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

      {/* Running Total Display - ALWAYS VISIBLE */}
      <div style={{
        padding: "12px 16px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(143, 170, 184, 0.2) 0%, rgba(212, 149, 90, 0.2) 100%)",
        border: "1px solid rgba(143, 170, 184, 0.3)",
        marginBottom: "20px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: "600",
          marginBottom: "4px",
        }}>
          Base Monthly Cost
        </div>
        
        {(() => {
          const baseCost = squareFeet && marketSegment 
            ? parseInt(squareFeet) * getRateForSquareFeet(parseInt(squareFeet), marketSegment)
            : 0;
          
          // Check if office segment and frequency is selected
          if (marketSegment === "office" && frequency && squareFeet) {
            const frequencyMultiplier = PRICING.frequencyMultipliers[frequency] || 1.0;
            const adjustedCost = baseCost * frequencyMultiplier;
            const hasDiscount = frequencyMultiplier !== 1.0;
            
            const frequencyLabels = {
              "monthly": "Monthly",
              "every-3-weeks": "Every 3 Weeks",
              "bi-weekly": "Bi-weekly",
              "weekly": "Weekly",
              "2x-week": "2x/Week",
              "3x-week": "3x/Week",
              "4x-week": "4x/Week",
              "daily": "Daily"
            };
            
            return (
              <>
                {hasDiscount && (
                  <div style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "rgba(255, 255, 255, 0.4)",
                    textDecoration: "line-through",
                    marginBottom: "4px",
                  }}>
                    ${baseCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                <div style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: hasDiscount ? "#10b981" : "#B87333",
                }}>
                  ${adjustedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{
                  fontSize: "13px",
                  color: hasDiscount ? "#10b981" : "#B87333",
                  marginTop: "6px",
                  fontWeight: "800",
                  letterSpacing: "0.3px",
                }}>
                  {frequencyLabels[frequency]} • Monthly Total
                </div>
              </>
            );
          } else {
            // Show base cost or $0.00 if not set
            return (
              <>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "#B87333",
                }}>
                  ${baseCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginTop: "6px",
                  fontWeight: "700",
                  background: "rgba(184, 115, 51, 0.2)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  display: "inline-block",
                }}>
                  {marketSegment === "office" ? "2x/week service base rate (select frequency below)" : "Before frequency adjustments"}
                </div>
              </>
            );
          }
        })()}
      </div>

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
            background: `linear-gradient(to right, #B87333 0%, #B87333 ${((parseInt(squareFeet || 500) - 500) / (50000 - 500)) * 100}%, rgba(255, 255, 255, 0.1) ${((parseInt(squareFeet || 500) - 500) / (50000 - 500)) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
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
            background: linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(143, 170, 184, 0.5);
          }
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(143, 170, 184, 0.5);
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
            onChange={(e) => setSquareFeet(e.target.value)}
            onBlur={(e) => {
              // Only validate on blur (when user leaves the field)
              const val = parseInt(e.target.value) || 0;
              if (val < 500) setSquareFeet('500');
              else if (val > 50000) setSquareFeet('50000');
            }}
            placeholder="Enter square feet..."
            style={{
              width: "100%",
              padding: "18px 20px",
              paddingRight: "55px",
              borderRadius: "16px",
              border: "2px solid rgba(184, 115, 51, 0.3)",
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

    </div>

    {/* Cleaning Frequency - NOT for hospitality or office (they have individual facility frequencies) */}
    {marketSegment !== "hospitality" && marketSegment !== "office" && (
    <div style={{ marginBottom: "30px" }}>
      <label style={{
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Calendar size={18} color="#B87333" />
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
                ? "2px solid #D4955A"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: frequency === freq.value
                ? "linear-gradient(135deg, #D4955A 0%, #5A7080 100%)"
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
    )}

    {/* Market Segment Specific Details */}
    {marketSegment === "office" && (
      <div style={{ marginBottom: "30px" }}>
        <label style={{
          fontSize: "14px",
          fontWeight: "800",
          color: "#B87333",
          marginBottom: "15px",
          display: "block",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          📋 Office Details
        </label>
        
        {/* Cleaning Frequency Selector */}
        <div style={{
          marginBottom: "20px",
          background: "linear-gradient(135deg, rgba(184, 115, 51, 0.08) 0%, rgba(143, 170, 184, 0.08) 100%)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(184, 115, 51, 0.2)",
        }}>
          <label style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#B87333",
            marginBottom: "12px",
            display: "block",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            📅 Cleaning Frequency *
          </label>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", alignItems: "start" }}>
            {/* Frequency Dropdown - Compact */}
            <div>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "2px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <option value="" style={{ background: "#1A252F", color: "white", padding: "8px" }}>Select...</option>
                <option value="monthly" style={{ background: "#1A252F", color: "white", padding: "8px" }}>Monthly (1x Monthly)</option>
                <option value="every-3-weeks" style={{ background: "#1A252F", color: "white", padding: "8px" }}>Every 3 Weeks (1-2x Monthly)</option>
                <option value="bi-weekly" style={{ background: "#1A252F", color: "white", padding: "8px" }}>Bi-weekly (2x Monthly)</option>
                <option value="weekly" style={{ background: "#1A252F", color: "white", padding: "8px" }}>Weekly (4x Monthly)</option>
                <option value="2x-week" style={{ background: "#1A252F", color: "white", padding: "8px" }}>2x per Week (8x Monthly)</option>
                <option value="3x-week" style={{ background: "#1A252F", color: "white", padding: "8px" }}>3x per Week (12x Monthly)</option>
                <option value="4x-week" style={{ background: "#1A252F", color: "white", padding: "8px" }}>4x per Week (17x Monthly)</option>
                <option value="daily" style={{ background: "#1A252F", color: "white", padding: "8px" }}>Daily (22x Monthly)</option>
              </select>
            </div>
            
            {/* Price Per Visit Display - Takes More Space */}
            {squareFeet && frequency ? (
              <div style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%)",
                border: "2px solid rgba(16, 185, 129, 0.25)",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
              }}>
                {(() => {
                  const baseCost = parseInt(squareFeet) * getRateForSquareFeet(parseInt(squareFeet), marketSegment);
                  const frequencyMultiplier = PRICING.frequencyMultipliers[frequency] || 1.0;
                  const monthlyCost = baseCost * frequencyMultiplier;
                  
                  const visitsPerMonth = {
                    "monthly": 1,
                    "every-3-weeks": 1.3,
                    "bi-weekly": 2,
                    "weekly": 4,
                    "2x-week": 8,
                    "3x-week": 12,
                    "4x-week": 17,
                    "daily": 22
                  };
                  
                  const visits = visitsPerMonth[frequency];
                  const pricePerVisit = monthlyCost / visits;
                  const basePerVisit = baseCost / 8; // Base is 2x/week = 8 visits
                  const hasDiscount = pricePerVisit < basePerVisit;
                  const isPremium = pricePerVisit > basePerVisit;
                  
                  return (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* Left side - Price */}
                      <div>
                        <div style={{
                          fontSize: "11px",
                          color: "rgba(255, 255, 255, 0.6)",
                          fontWeight: "700",
                          marginBottom: "6px",
                          letterSpacing: "0.5px",
                        }}>
                          PRICE PER VISIT
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          {(hasDiscount || isPremium) && (
                            <div style={{
                              fontSize: "16px",
                              color: "rgba(255, 255, 255, 0.35)",
                              textDecoration: "line-through",
                              fontWeight: "600",
                            }}>
                              ${basePerVisit.toFixed(2)}
                            </div>
                          )}
                          <div style={{
                            fontSize: "28px",
                            fontWeight: "900",
                            color: hasDiscount ? "#10b981" : isPremium ? "#f59e0b" : "#B87333",
                            lineHeight: "1",
                          }}>
                            ${pricePerVisit.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side - Savings/Premium badge */}
                      {hasDiscount && (
                        <div style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                        }}>
                          <div style={{
                            fontSize: "10px",
                            color: "rgba(255, 255, 255, 0.9)",
                            fontWeight: "600",
                            marginBottom: "2px",
                            letterSpacing: "0.3px",
                          }}>
                            YOU SAVE
                          </div>
                          <div style={{
                            fontSize: "18px",
                            color: "white",
                            fontWeight: "900",
                            lineHeight: "1",
                          }}>
                            {Math.round(((basePerVisit - pricePerVisit) / basePerVisit) * 100)}%
                          </div>
                        </div>
                      )}
                      
                      {isPremium && (
                        <div style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                          boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
                        }}>
                          <div style={{
                            fontSize: "10px",
                            color: "rgba(255, 255, 255, 0.9)",
                            fontWeight: "600",
                            marginBottom: "2px",
                            letterSpacing: "0.3px",
                          }}>
                            PREMIUM
                          </div>
                          <div style={{
                            fontSize: "18px",
                            color: "white",
                            fontWeight: "900",
                            lineHeight: "1",
                          }}>
                            +{Math.round(((pricePerVisit - basePerVisit) / basePerVisit) * 100)}%
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "2px dashed rgba(255, 255, 255, 0.1)",
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "13px",
                fontStyle: "italic",
              }}>
                Select frequency to see price per visit
              </div>
            )}
          </div>
          
          <div style={{
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "12px",
            fontStyle: "italic",
          }}>
            Base rates assume 2x per week cleaning. More frequent service receives volume discounts.
          </div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}>
          {/* Workspaces - Configure Button */}
          <div style={{
            gridColumn: "1 / -1", // Full width
            background: "linear-gradient(135deg, rgba(184, 115, 51, 0.12) 0%, rgba(143, 170, 184, 0.12) 100%)",
            border: "2px dashed rgba(184, 115, 51, 0.4)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}>
            <button
              onClick={() => {
                setWsEditingIndex(null);
                setShowWorkspaceModal(true);
              }}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #B87333 0%, #D4955A 100%)",
                color: "white",
                fontSize: "15px",
                fontWeight: "800",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              💼 Configure Workspaces
            </button>
            
            {/* List of configured workspace types */}
            {workspaceConfigs.length > 0 && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                {workspaceConfigs.map((config, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                      padding: "12px 15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "3px",
                      }}>
                        {getWorkspaceLabel(config)} × {config.quantity}
                      </div>
                      <div style={{
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: "600",
                      }}>
                        ${config.pricePerClean}/clean • {config.dailyCount || 0} cleaned/day
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => editWorkspaceConfig(index)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(184, 115, 51, 0.2)",
                          color: "#D4955A",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteWorkspaceConfig(index)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conference Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🗂️ Conference Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $45/clean
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
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {conferenceRooms > 0 && (
              <select
                value={conferenceRoomsFreq}
                onChange={(e) => setConferenceRoomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: conferenceRoomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
                <option value="monthly" style={{ background: "#2E3A47", color: "white" }}>Monthly (1/mo) +20%</option>
              </select>
            )}
          </div>

          {/* Break Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  ☕ Break Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $35/clean
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
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {breakRooms > 0 && (
              <select
                value={breakRoomsFreq}
                onChange={(e) => setBreakRoomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: breakRoomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
                <option value="monthly" style={{ background: "#2E3A47", color: "white" }}>Monthly (1/mo) +20%</option>
              </select>
            )}
          </div>

          {/* Restrooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🚻 Restrooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $25/clean
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
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {restrooms > 0 && (
              <select
                value={restroomsFreq}
                onChange={(e) => setRestroomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: restroomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
                <option value="monthly" style={{ background: "#2E3A47", color: "white" }}>Monthly (1/mo) +20%</option>
              </select>
            )}
          </div>

          {/* Reception/Lobby */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🏛️ Reception/Lobby
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $40/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {receptions}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setReceptions(Math.max(0, receptions - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: receptions > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: receptions > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: receptions > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setReceptions(receptions + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {receptions > 0 && (
              <select
                value={receptionsFreq}
                onChange={(e) => setReceptionsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: receptionsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
                <option value="monthly" style={{ background: "#2E3A47", color: "white" }}>Monthly (1/mo) +20%</option>
              </select>
            )}
          </div>

          {/* Server Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🖥️ Server/IT Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $30/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {serverRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setServerRooms(Math.max(0, serverRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: serverRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: serverRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: serverRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setServerRooms(serverRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {serverRooms > 0 && (
              <select
                value={serverRoomsFreq}
                onChange={(e) => setServerRoomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: serverRoomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
                <option value="monthly" style={{ background: "#2E3A47", color: "white" }}>Monthly (1/mo) +20%</option>
              </select>
            )}
          </div>

          {/* Storage Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  📦 Storage/Archive
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $20/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {storageRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setStorageRooms(Math.max(0, storageRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: storageRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: storageRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: storageRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setStorageRooms(storageRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {storageRooms > 0 && (
              <select
                value={storageRoomsFreq}
                onChange={(e) => setStorageRoomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: storageRoomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
                <option value="monthly" style={{ background: "#2E3A47", color: "white" }}>Monthly (1/mo) +20%</option>
              </select>
            )}
          </div>
        </div>
      </div>
    )}


    {/* Healthcare */}
    {marketSegment === "healthcare" && (
      <div style={{ marginBottom: "30px" }}>
        <label style={{
          fontSize: "13px",
          fontWeight: "800",
          color: "#B87333",
          marginBottom: "15px",
          display: "block",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          🏥 Healthcare Details
        </label>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}>
          {/* Exam Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🩺 Exam Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $40 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {examRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setExamRooms(Math.max(0, examRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: examRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: examRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: examRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setExamRooms(examRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Waiting Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🪑 Waiting Areas
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
                {waitingAreas}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setWaitingAreas(Math.max(0, waitingAreas - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: waitingAreas > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: waitingAreas > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: waitingAreas > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setWaitingAreas(waitingAreas + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Procedure Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  ⚕️ Procedure Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $60 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {procedureRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setProcedureRooms(Math.max(0, procedureRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: procedureRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: procedureRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: procedureRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setProcedureRooms(procedureRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Laboratories - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🧪 Laboratories
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $75 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {laboratories}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setLaboratories(Math.max(0, laboratories - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: laboratories > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: laboratories > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: laboratories > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setLaboratories(laboratories + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Sterilization Rooms - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🧼 Sterilization
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $65 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {sterilizationRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setSterilizationRooms(Math.max(0, sterilizationRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: sterilizationRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: sterilizationRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: sterilizationRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setSterilizationRooms(sterilizationRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Nurse Stations - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  👩‍⚕️ Nurse Stations
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
                {nurseStations}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setNurseStations(Math.max(0, nurseStations - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: nurseStations > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: nurseStations > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: nurseStations > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setNurseStations(nurseStations + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Consultation Rooms - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  💬 Consult Rooms
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
                {consultRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setConsultRooms(Math.max(0, consultRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: consultRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: consultRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: consultRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setConsultRooms(consultRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

    {marketSegment === "hospitality" && (
      <div style={{ marginBottom: "30px" }}>
        <label style={{
          fontSize: "13px",
          fontWeight: "800",
          color: "#B87333",
          marginBottom: "15px",
          display: "block",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          🏨 Hospitality Details
        </label>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}>
          {/* Guest Rooms - Configure Button */}
          <div style={{
            gridColumn: "1 / -1", // Full width
            background: "linear-gradient(135deg, rgba(184, 115, 51, 0.12) 0%, rgba(143, 170, 184, 0.12) 100%)",
            border: "2px dashed rgba(184, 115, 51, 0.4)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}>
            <button
              onClick={() => {
                setEditingIndex(null);
                setShowGuestRoomModal(true);
              }}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #B87333 0%, #D4955A 100%)",
                color: "white",
                fontSize: "15px",
                fontWeight: "800",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              🛏️ Configure Guest Rooms
            </button>
            
            {/* List of configured room types */}
            {guestRoomConfigs.length > 0 && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                {guestRoomConfigs.map((config, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                      padding: "12px 15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "3px",
                      }}>
                        {getRoomTypeLabel(config)} × {config.quantity}
                      </div>
                      <div style={{
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: "600",
                      }}>
                        ${config.pricePerClean}/clean × {config.quantity} = ${config.pricePerClean * config.quantity}/clean
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => editGuestRoomConfig(index)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(184, 115, 51, 0.2)",
                          color: "#D4955A",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGuestRoomConfig(index)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Daily Turnover Input - Only show if guest rooms configured */}
            {guestRoomConfigs.length > 0 && (
              <div style={{
                marginTop: "5px",
                padding: "15px",
                background: "rgba(143, 170, 184, 0.08)",
                borderRadius: "10px",
                border: "1px solid rgba(143, 170, 184, 0.2)",
              }}>
                <label style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#B87333",
                  marginBottom: "8px",
                  display: "block",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  📊 Average Rooms Cleaned Per Day *
                </label>
                <input
                  type="number"
                  value={dailyTurnover}
                  onChange={(e) => setDailyTurnover(e.target.value)}
                  placeholder="e.g., 25"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "2px solid rgba(184, 115, 51, 0.3)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    outline: "none",
                  }}
                />
                <div style={{
                  fontSize: "10px",
                  color: "rgba(255, 255, 255, 0.5)",
                  marginTop: "6px",
                  fontStyle: "italic",
                }}>
                  How many rooms are typically cleaned/turned over each day?
                </div>
              </div>
            )}
          </div>

          {/* Common Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🛋️ Common Areas
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $35/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {commonAreas}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setCommonAreas(Math.max(0, commonAreas - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: commonAreas > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: commonAreas > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: commonAreas > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setCommonAreas(commonAreas + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {commonAreas > 0 && (
              <select
                value={commonAreasFreq}
                onChange={(e) => setCommonAreasFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: commonAreasFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Dining Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🍽️ Dining Areas
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $50/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {diningAreas}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setDiningAreas(Math.max(0, diningAreas - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: diningAreas > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: diningAreas > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: diningAreas > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setDiningAreas(diningAreas + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {diningAreas > 0 && (
              <select
                value={diningAreasFreq}
                onChange={(e) => setDiningAreasFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: diningAreasFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Fitness Centers - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  💪 Fitness Centers
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $60/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {fitnessCenters}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setFitnessCenters(Math.max(0, fitnessCenters - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: fitnessCenters > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: fitnessCenters > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: fitnessCenters > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setFitnessCenters(fitnessCenters + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {fitnessCenters > 0 && (
              <select
                value={fitnessCentersFreq}
                onChange={(e) => setFitnessCentersFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: fitnessCentersFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Pool/Spa Areas - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🏊 Pool/Spa Areas
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $75/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {poolSpas}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setPoolSpas(Math.max(0, poolSpas - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: poolSpas > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: poolSpas > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: poolSpas > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setPoolSpas(poolSpas + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {poolSpas > 0 && (
              <select
                value={poolSpasFreq}
                onChange={(e) => setPoolSpasFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: poolSpasFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Event/Banquet Spaces - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🎉 Event Spaces
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $100/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {eventSpaces}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setEventSpaces(Math.max(0, eventSpaces - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: eventSpaces > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: eventSpaces > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: eventSpaces > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setEventSpaces(eventSpaces + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {eventSpaces > 0 && (
              <select
                value={eventSpacesFreq}
                onChange={(e) => setEventSpacesFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: eventSpacesFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Laundry Rooms - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🧺 Laundry Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $40/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {laundryRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setLaundryRooms(Math.max(0, laundryRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: laundryRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: laundryRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: laundryRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setLaundryRooms(laundryRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {laundryRooms > 0 && (
              <select
                value={laundryRoomsFreq}
                onChange={(e) => setLaundryRoomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: laundryRoomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Lobby/Reception - NEW */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🏨 Lobby/Reception
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $55/clean
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {lobbyReceptions}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setLobbyReceptions(Math.max(0, lobbyReceptions - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: lobbyReceptions > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: lobbyReceptions > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: lobbyReceptions > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setLobbyReceptions(lobbyReceptions + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            {/* Frequency Selector */}
            {lobbyReceptions > 0 && (
              <select
                value={lobbyReceptionsFreq}
                onChange={(e) => setLobbyReceptionsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: lobbyReceptionsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>

          {/* Shared/Public Bathrooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🚻 Shared/Public Bathrooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  {sharedBathrooms === 0 ? "$14 half / $21 full" : 
                   sharedBathrooms % 1 === 0 ? `$21 each (full)` : 
                   `$${(Math.floor(sharedBathrooms) * 21 + 14).toFixed(0)} total`}
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "60px",
                textAlign: "right",
              }}>
                {sharedBathrooms === 0 ? "0" : sharedBathrooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setSharedBathrooms(Math.max(0, sharedBathrooms - 0.5))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: sharedBathrooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: sharedBathrooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: sharedBathrooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                -0.5
              </button>
              <button
                onClick={() => setSharedBathrooms(sharedBathrooms + 0.5)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                +0.5
              </button>
            </div>
            {/* Frequency Selector */}
            {sharedBathrooms > 0 && (
              <select
                value={sharedBathroomsFreq}
                onChange={(e) => setSharedBathroomsFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: sharedBathroomsFreq ? "white" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#2E3A47", color: "rgba(255,255,255,0.5)" }}>Select Frequency</option>
                <option value="daily" style={{ background: "#2E3A47", color: "white" }}>Daily (22/mo) - 18% OFF</option>
                <option value="4x-week" style={{ background: "#2E3A47", color: "white" }}>4x/Week (17/mo) - 14% OFF</option>
                <option value="3x-week" style={{ background: "#2E3A47", color: "white" }}>3x/Week (12/mo) - 10% OFF</option>
                <option value="2x-week" style={{ background: "#2E3A47", color: "white" }}>2x/Week (8/mo) - BASE</option>
                <option value="weekly" style={{ background: "#2E3A47", color: "white" }}>Weekly (4/mo) +5%</option>
                <option value="bi-weekly" style={{ background: "#2E3A47", color: "white" }}>Bi-Weekly (2/mo) +12%</option>
              </select>
            )}
          </div>
        </div>
      </div>
    )}

    {marketSegment === "retail" && (
      <div style={{ marginBottom: "30px" }}>
        <label style={{
          fontSize: "13px",
          fontWeight: "800",
          color: "#B87333",
          marginBottom: "15px",
          display: "block",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          🛍️ Retail Details
        </label>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}>
          {/* Fitting/Dressing Rooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  👗 Fitting Rooms
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $18 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {fittingRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setFittingRooms(Math.max(0, fittingRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: fittingRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: fittingRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: fittingRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setFittingRooms(fittingRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Showroom/Display Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🛍️ Showrooms
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
                {showroomDisplays}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setShowroomDisplays(Math.max(0, showroomDisplays - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: showroomDisplays > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: showroomDisplays > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: showroomDisplays > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setShowroomDisplays(showroomDisplays + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Stockrooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  📦 Stockrooms
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
                {stockrooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setStockrooms(Math.max(0, stockrooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: stockrooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: stockrooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: stockrooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setStockrooms(stockrooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Customer Restrooms */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
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
                {customerRestrooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setCustomerRestrooms(Math.max(0, customerRestrooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: customerRestrooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: customerRestrooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: customerRestrooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setCustomerRestrooms(customerRestrooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* POS/Checkout Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🛒 POS/Checkout
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $20 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {posCheckouts}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setPosCheckouts(Math.max(0, posCheckouts - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: posCheckouts > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: posCheckouts > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: posCheckouts > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setPosCheckouts(posCheckouts + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

    {marketSegment === "industrial" && (
      <div style={{ marginBottom: "30px" }}>
        <label style={{
          fontSize: "13px",
          fontWeight: "800",
          color: "#B87333",
          marginBottom: "15px",
          display: "block",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          🏭 Industrial Details
        </label>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}>
          {/* Loading Docks */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  🚚 Loading Docks
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $50 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {loadingDocks}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setLoadingDocks(Math.max(0, loadingDocks - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: loadingDocks > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: loadingDocks > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: loadingDocks > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setLoadingDocks(loadingDocks + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Equipment/Maintenance Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  ⚙️ Equipment Areas
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}>
                  $40 each
                </div>
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "white",
                minWidth: "40px",
                textAlign: "right",
              }}>
                {equipmentAreas}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setEquipmentAreas(Math.max(0, equipmentAreas - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: equipmentAreas > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: equipmentAreas > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: equipmentAreas > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setEquipmentAreas(equipmentAreas + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
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
                {industrialBreakRooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setIndustrialBreakRooms(Math.max(0, industrialBreakRooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: industrialBreakRooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: industrialBreakRooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: industrialBreakRooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setIndustrialBreakRooms(industrialBreakRooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
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
                {industrialRestrooms}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setIndustrialRestrooms(Math.max(0, industrialRestrooms - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: industrialRestrooms > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: industrialRestrooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: industrialRestrooms > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setIndustrialRestrooms(industrialRestrooms + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

          {/* Office/Admin Areas */}
          <div style={{
            background: "linear-gradient(135deg, rgba(138, 85, 35, 0.08) 0%, rgba(184, 115, 51, 0.08) 100%)",
            border: "1px solid rgba(184, 115, 51, 0.2)",
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
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#B87333",
                  marginBottom: "2px",
                }}>
                  📋 Office/Admin
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
                {officeAreas}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "8px",
            }}>
              <button
                onClick={() => setOfficeAreas(Math.max(0, officeAreas - 1))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: officeAreas > 0 
                    ? "rgba(239, 68, 68, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: officeAreas > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "18px",
                  fontWeight: "900",
                  cursor: officeAreas > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                −
              </button>
              <button
                onClick={() => setOfficeAreas(officeAreas + 1)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #8a5523 0%, #B87333 50%, #D4955A 100%)",
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

    {/* Navigation Buttons */}
    <div className="button-row" style={{ display: "flex", gap: "15px" }}>
      <button
        onClick={handleBack}
        style={{
          flex: 1,
          padding: "18px",
          borderRadius: "16px",
          border: "2px solid rgba(184, 115, 51, 0.3)",
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
            ? "linear-gradient(135deg, #D4955A 0%, #D4955A 100%)"
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <CheckCircle2 size={18} color="#B87333" />
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
                ? "2px solid #D4955A"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: addOns[addon.key]
                ? "linear-gradient(135deg, #D4955A 0%, #5A7080 100%)"
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
                fontSize: "14px",
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Calendar size={18} color="#B87333" />
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
                ? "2px solid #D4955A"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: preferredDays.includes(day)
                ? "linear-gradient(135deg, #D4955A 0%, #5A7080 100%)"
                : "rgba(255, 255, 255, 0.03)",
              color: "white",
              fontSize: "14px",
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        <Clock size={18} color="#B87333" />
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
                ? "2px solid #D4955A"
                : "2px solid rgba(255, 255, 255, 0.1)",
              background: preferredTime === time
                ? "linear-gradient(135deg, #D4955A 0%, #5A7080 100%)"
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
        fontSize: "14px",
        fontWeight: "800",
        color: "#B87333",
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
          border: "2px solid rgba(184, 115, 51, 0.3)",
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
      background: "rgba(212, 149, 90, 0.1)",
      border: "1px solid rgba(212, 149, 90, 0.3)",
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
            color: "#D4955A",
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
          border: "2px solid rgba(184, 115, 51, 0.3)",
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
      backgroundColor: "#0F171E",
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),
        radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),
        radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),
        radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),
        radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
      border: "1px solid rgba(184, 115, 51, 0.2)",
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
          color: "#B87333",
          fontWeight: "800",
          marginBottom: "8px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>
          Price Breakdown
        </div>
        <div style={{
          fontSize: "14px",
          color: "#D4955A",
          fontWeight: "700",
          letterSpacing: "0.5px",
          background: "rgba(143, 170, 184, 0.12)",
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
            fontSize: "14px",
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
                  alignItems: "flex-start",
                  padding: "12px 0",
                  borderBottom: index < getPriceBreakdown().length - 1
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
                }}
              >
                <div style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  fontWeight: "600",
                  flex: 1,
                }}>
                  {item.label}
                  {item.discountPercent && (
                    <div style={{
                      display: "inline-block",
                      marginLeft: "8px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: item.isUpcharge
                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                        : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      fontSize: "10px",
                      fontWeight: "900",
                      color: "white",
                      letterSpacing: "0.5px",
                    }}>
                      {item.isUpcharge ? `+${item.discountPercent}` : `-${item.discountPercent}`}
                    </div>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "2px",
                }}>
                  {item.originalAmount && (
                    <div style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "line-through",
                    }}>
                      ${item.originalAmount.toFixed(2)}
                    </div>
                  )}
                  <div style={{
                    color: item.discountPercent && !item.isUpcharge ? "#10b981" : "white",
                    fontSize: "14px",
                    fontWeight: "800",
                  }}>
                    ${item.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Total Savings - For hospitality and office */}
            {(marketSegment === "hospitality" || marketSegment === "office") && (() => {
              const totalSavings = getPriceBreakdown().reduce((sum, item) => {
                if (item.discountAmount && !item.isUpcharge) {
                  return sum + item.discountAmount;
                }
                return sum;
              }, 0);
              
              if (totalSavings > 0) {
                return (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    marginTop: "10px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}>
                    <div style={{
                      color: "#10b981",
                      fontSize: "14px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}>
                      ✓ Total Savings
                    </div>
                    <div style={{
                      color: "#10b981",
                      fontSize: "16px",
                      fontWeight: "900",
                    }}>
                      -${totalSavings.toFixed(2)}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

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
                color: "#B87333",
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
              fontSize: "14px",
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
              fontSize: "14px",
              color: "#D4955A",
              fontWeight: "700",
              background: "rgba(143, 170, 184, 0.12)",
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
      backgroundColor: "#0F171E",
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(46,58,71,0.55) 0%, transparent 45%),
        radial-gradient(circle at 80% 68%, rgba(61,79,92,0.45) 0%, transparent 40%),
        radial-gradient(circle at 55% 8%, rgba(184,115,51,0.06) 0%, transparent 30%),
        radial-gradient(ellipse at 5% 88%, rgba(46,58,71,0.4) 0%, transparent 40%),
        radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
      borderRadius: "20px 20px 0 0",
      overflow: "hidden",
      boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.6)",
      border: "1px solid rgba(184, 115, 51, 0.2)",
      borderBottom: "none",
      maxHeight: "65vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* TOTAL SECTION - FIRST */}
      <div style={{
        padding: "20px 25px",
        background: "rgba(184, 115, 51, 0.15)",
        borderBottom: "1px solid rgba(184, 115, 51, 0.3)",
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
              color: "#D4955A",
              fontWeight: "700",
              background: "rgba(143, 170, 184, 0.12)",
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
              color: "#B87333",
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
            fontSize: "14px",
            fontWeight: "600",
          }}>
            Select services to see pricing
          </div>
        ) : (
          <>
            {getPriceBreakdown().map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: index < getPriceBreakdown().length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                  fontSize: "13px",
                }}
              >
                <div style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "600",
                  flex: 1,
                }}>
                  {item.label}
                  {item.discountPercent && (
                    <div style={{
                      display: "inline-block",
                      marginLeft: "6px",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      background: item.isUpcharge
                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                        : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      fontSize: "9px",
                      fontWeight: "900",
                      color: "white",
                      letterSpacing: "0.3px",
                    }}>
                      {item.isUpcharge ? `+${item.discountPercent}` : `-${item.discountPercent}`}
                    </div>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "2px",
                }}>
                  {item.originalAmount && (
                    <div style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "11px",
                      fontWeight: "600",
                      textDecoration: "line-through",
                    }}>
                      ${item.originalAmount.toFixed(2)}
                    </div>
                  )}
                  <div style={{
                    color: item.discountPercent && !item.isUpcharge ? "#10b981" : "white",
                    fontWeight: "800",
                    fontSize: "13px",
                  }}>
                    ${item.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total Savings - Mobile */}
            {(marketSegment === "hospitality" || marketSegment === "office") && (() => {
              const totalSavings = getPriceBreakdown().reduce((sum, item) => {
                if (item.discountAmount && !item.isUpcharge) {
                  return sum + item.discountAmount;
                }
                return sum;
              }, 0);
              
              if (totalSavings > 0) {
                return (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    marginTop: "8px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}>
                    <div style={{
                      color: "#10b981",
                      fontSize: "12px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      ✓ Total Savings
                    </div>
                    <div style={{
                      color: "#10b981",
                      fontSize: "14px",
                      fontWeight: "900",
                    }}>
                      -${totalSavings.toFixed(2)}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </>
        )}
      </div>
    </div>
  </div>
)}

{/* Guest Room Builder Modal */}
{showGuestRoomModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    overflowY: "auto",
  }}>
    <div style={{
      background: "linear-gradient(135deg, #2E3A47 0%, #1A252F 100%)",
      borderRadius: "24px",
      padding: "40px 35px",
      maxWidth: "700px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      border: "1px solid rgba(184, 115, 51, 0.3)",
      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7)",
    }}>
      <h2 style={{
        fontSize: "26px",
        fontWeight: "900",
        color: "white",
        marginBottom: "8px",
        letterSpacing: "-0.5px",
      }}>
        🛏️ Configure Guest Room
      </h2>
      <p style={{
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "30px",
        fontWeight: "600",
      }}>
        Choose a template or build custom
      </p>
      
      {/* Templates */}
      {!modalTemplate && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginBottom: "30px",
        }}>
          {[
            { id: "studio", label: "🏢 Studio", desc: "Kitchenette, 1 bath" },
            { id: "standard", label: "🏨 Standard", desc: "2 beds, 1 bath" },
            { id: "deluxe", label: "✨ Deluxe", desc: "2 beds, larger room" },
            { id: "suite", label: "🏰 Suite", desc: "Bedroom + living area" },
            { id: "custom", label: "🎯 Custom", desc: "Build from scratch" },
          ].map(template => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template.id)}
              style={{
                padding: "18px 16px",
                borderRadius: "14px",
                border: "2px solid rgba(184, 115, 51, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>
                {template.label}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", fontWeight: "600" }}>
                {template.desc}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Customization Options */}
      {modalTemplate && (
        <div style={{ marginBottom: "25px" }}>
          {/* Beds */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🛏️ Beds
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[0, 1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => setModalBeds(num)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: modalBeds === num ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                    background: modalBeds === num ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {num === 0 ? "Studio" : num}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bathrooms */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🚿 Bathrooms (in room)
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "16px",
              borderRadius: "12px",
            }}>
              <button
                onClick={() => setModalBathrooms(Math.max(0, modalBathrooms - 0.5))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: modalBathrooms > 0 
                    ? "rgba(239, 68, 68, 0.2)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: modalBathrooms > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.3)",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: modalBathrooms > 0 ? "pointer" : "not-allowed",
                }}
              >
                -0.5
              </button>
              <div style={{
                flex: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "white",
                }}>
                  {modalBathrooms === 0 ? "None" : modalBathrooms}
                </div>
                {modalBathrooms === 0 && (
                  <div style={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontWeight: "600",
                  }}>
                    Shared/Public Only
                  </div>
                )}
                {modalBathrooms % 1 !== 0 && modalBathrooms > 0 && (
                  <div style={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontWeight: "600",
                  }}>
                    {Math.floor(modalBathrooms)} Full + Half Bath
                  </div>
                )}
                {modalBathrooms % 1 === 0 && modalBathrooms > 0 && (
                  <div style={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontWeight: "600",
                  }}>
                    Full Bathroom{modalBathrooms > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <button
                onClick={() => setModalBathrooms(modalBathrooms + 0.5)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #B87333, #D4955A)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +0.5
              </button>
            </div>
          </div>
          
          {/* Kitchen */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🍳 Kitchen
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { value: "none", label: "None" },
                { value: "kitchenette", label: "Kitchenette" },
                { value: "full", label: "Full Kitchen" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setModalKitchen(option.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: modalKitchen === option.value ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                    background: modalKitchen === option.value ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Size */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              📏 Room Size
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { value: "small", label: "Small\n<300 sqft" },
                { value: "medium", label: "Medium\n300-500" },
                { value: "large", label: "Large\n500-800" },
                { value: "xl", label: "XL\n800+" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setModalSize(option.value)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    borderRadius: "10px",
                    border: modalSize === option.value ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                    background: modalSize === option.value ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "800",
                    cursor: "pointer",
                    whiteSpace: "pre-line",
                    lineHeight: "1.3",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Living Area Toggle */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setModalLivingArea(!modalLivingArea)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: modalLivingArea ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                background: modalLivingArea ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>🛋️ Separate Living Area</span>
              <span style={{ fontSize: "20px" }}>{modalLivingArea ? "✓" : ""}</span>
            </button>
          </div>
          
          {/* Price Preview */}
          <div style={{
            background: "rgba(184, 115, 51, 0.15)",
            border: "1px solid rgba(184, 115, 51, 0.3)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "25px",
          }}>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "8px", fontWeight: "600" }}>
              Price per clean:
            </div>
            <div style={{ fontSize: "32px", fontWeight: "900", color: "#D4955A" }}>
              ${calculateGuestRoomPrice({
                beds: modalBeds,
                bathrooms: modalBathrooms,
                kitchen: modalKitchen,
                size: modalSize,
                livingArea: modalLivingArea
              })}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", marginTop: "4px", fontWeight: "600" }}>
              {getRoomTypeLabel({
                beds: modalBeds,
                bathrooms: modalBathrooms,
                kitchen: modalKitchen,
                size: modalSize,
                livingArea: modalLivingArea
              })}
            </div>
          </div>
          
          {/* Quantity */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              📊 How many of these rooms?
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "16px",
              borderRadius: "12px",
            }}>
              <button
                onClick={() => setModalQuantity(Math.max(1, modalQuantity - 10))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                -10
              </button>
              <button
                onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                -1
              </button>
              <div style={{
                flex: 1,
                textAlign: "center",
                fontSize: "28px",
                fontWeight: "900",
                color: "white",
              }}>
                {modalQuantity}
              </div>
              <button
                onClick={() => setModalQuantity(modalQuantity + 1)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #B87333, #D4955A)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +1
              </button>
              <button
                onClick={() => setModalQuantity(modalQuantity + 10)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #B87333, #D4955A)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +10
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => {
            setShowGuestRoomModal(false);
            setModalTemplate("");
            setEditingIndex(null);
          }}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            background: "transparent",
            color: "white",
            fontSize: "15px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        {modalTemplate && (
          <button
            onClick={saveGuestRoomConfig}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #B87333, #D4955A)",
              color: "white",
              fontSize: "15px",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            {editingIndex !== null ? "Update Room Type" : "Add Room Type"}
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* Workspace Configuration Modal (Office) */}
{showWorkspaceModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    overflowY: "auto",
  }}>
    <div style={{
      background: "linear-gradient(135deg, #2E3A47 0%, #1A252F 100%)",
      borderRadius: "24px",
      padding: "40px 35px",
      maxWidth: "700px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      border: "1px solid rgba(184, 115, 51, 0.3)",
      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7)",
    }}>
      <h2 style={{
        fontSize: "26px",
        fontWeight: "900",
        color: "white",
        marginBottom: "8px",
        letterSpacing: "-0.5px",
      }}>
        💼 Configure Workspace
      </h2>
      <p style={{
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "30px",
        fontWeight: "600",
      }}>
        {wsEditingIndex !== null ? "Update workspace configuration" : "Create a custom workspace type"}
      </p>

      {/* Template Selection */}
      {!wsTemplate && (
        <div>
          <label style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#B87333",
            marginBottom: "15px",
            display: "block",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            Choose a Template
          </label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
            marginBottom: "25px",
          }}>
            {[
              { id: "executive", icon: "🏢", name: "Executive Office", desc: "Private, Large" },
              { id: "manager", icon: "💼", name: "Manager Office", desc: "Private, Medium" },
              { id: "cubicle", icon: "🪑", name: "Cubicle", desc: "Partial, Small" },
              { id: "open-desk", icon: "📋", name: "Open Desk", desc: "Hot-desk, Minimal" },
              { id: "creative", icon: "🎨", name: "Creative Space", desc: "Collaborative" },
              { id: "custom", icon: "🎯", name: "Custom", desc: "Build from scratch" },
            ].map((template) => (
              <button
                key={template.id}
                onClick={() => applyWorkspaceTemplate(template.id)}
                style={{
                  padding: "18px 16px",
                  borderRadius: "12px",
                  border: "2px solid rgba(184, 115, 51, 0.2)",
                  background: "rgba(255, 255, 255, 0.03)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(184, 115, 51, 0.5)";
                  e.currentTarget.style.background = "rgba(184, 115, 51, 0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(184, 115, 51, 0.2)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                }}
              >
                <div style={{
                  fontSize: "24px",
                  marginBottom: "6px",
                }}>
                  {template.icon}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  marginBottom: "3px",
                }}>
                  {template.name}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontWeight: "600",
                }}>
                  {template.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customization Options */}
      {wsTemplate && (
        <div style={{ marginBottom: "25px" }}>
          {/* Privacy Level */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🚪 Privacy Level
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { value: "open", label: "Open" },
                { value: "partial", label: "Cubicle" },
                { value: "private", label: "Private" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWsPrivacy(option.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: wsPrivacy === option.value ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                    background: wsPrivacy === option.value ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size - Only for private offices and creative spaces */}
          {(wsPrivacy === "private" || (wsPrivacy === "open" && wsTemplate === "creative")) && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#B87333",
                marginBottom: "10px",
                display: "block",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                📏 Size
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                  { value: "xl", label: "XL" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setWsSize(option.value)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: wsSize === option.value ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                      background: wsSize === option.value ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "800",
                      cursor: "pointer",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Complexity */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🧹 Cleanliness Complexity
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { value: "light", label: "Light" },
                { value: "standard", label: "Standard" },
                { value: "heavy", label: "Heavy" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWsComplexity(option.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: wsComplexity === option.value ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                    background: wsComplexity === option.value ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flooring */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🏢 Flooring Type
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { value: "hard", label: "Hard Floor" },
                { value: "carpet", label: "Carpet" },
                { value: "industrial", label: "Industrial" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWsFlooring(option.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: wsFlooring === option.value ? "2px solid #D4955A" : "2px solid rgba(255, 255, 255, 0.1)",
                    background: wsFlooring === option.value ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              ⭐ Special Features
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { key: "food", label: "Food/Beverage Allowed (+$2)" },
                { key: "equipment", label: "Equipment Heavy (+$3)" },
                { key: "highTraffic", label: "High Traffic (+$2)" },
                { key: "trash", label: "Trash Removal (+$1)" },
              ].map((feature) => (
                <label
                  key={feature.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    background: wsFeatures[feature.key] ? "rgba(212, 149, 90, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={wsFeatures[feature.key]}
                    onChange={(e) => setWsFeatures({ ...wsFeatures, [feature.key]: e.target.checked })}
                    style={{
                      marginRight: "10px",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span style={{
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}>
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Preview */}
          <div style={{
            padding: "18px",
            borderRadius: "12px",
            background: "rgba(143, 170, 184, 0.1)",
            border: "1px solid rgba(143, 170, 184, 0.3)",
            marginBottom: "20px",
          }}>
            <div style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#8FB8B8",
              marginBottom: "8px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              💰 Price Per Clean
            </div>
            <div style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "white",
            }}>
              ${calculateWorkspacePrice({
                privacy: wsPrivacy,
                size: wsSize,
                complexity: wsComplexity,
                flooring: wsFlooring,
                features: wsFeatures
              })}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              🔢 Quantity
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "16px",
              borderRadius: "12px",
            }}>
              <button
                onClick={() => setWsQuantity(Math.max(1, wsQuantity - 10))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "14px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                -10
              </button>
              <button
                onClick={() => setWsQuantity(Math.max(1, wsQuantity - 1))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                -1
              </button>
              <div style={{
                flex: 1,
                textAlign: "center",
                fontSize: "28px",
                fontWeight: "900",
                color: "white",
              }}>
                {wsQuantity}
              </div>
              <button
                onClick={() => setWsQuantity(wsQuantity + 1)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +1
              </button>
              <button
                onClick={() => setWsQuantity(wsQuantity + 10)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontSize: "14px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +10
              </button>
            </div>
          </div>

          {/* Daily Clean Count */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#B87333",
              marginBottom: "10px",
              display: "block",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              📊 Daily Clean Count
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "16px",
              borderRadius: "12px",
            }}>
              <button
                onClick={() => setWsDailyCount(Math.max(1, wsDailyCount - 10))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "14px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                -10
              </button>
              <button
                onClick={() => setWsDailyCount(Math.max(1, wsDailyCount - 1))}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                -1
              </button>
              <div style={{
                flex: 1,
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "white",
                }}>
                  {wsDailyCount}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontWeight: "600",
                  marginTop: "2px",
                }}>
                  cleaned/day
                </div>
              </div>
              <button
                onClick={() => setWsDailyCount(wsDailyCount + 1)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontSize: "16px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +1
              </button>
              <button
                onClick={() => setWsDailyCount(wsDailyCount + 10)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontSize: "14px",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              >
                +10
              </button>
            </div>
            <div style={{
              fontSize: "10px",
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: "8px",
              fontStyle: "italic",
            }}>
              How many of these workspaces are cleaned each day?
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginTop: "30px",
      }}>
        <button
          onClick={() => {
            setShowWorkspaceModal(false);
            setWsTemplate("");
            setWsEditingIndex(null);
          }}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            background: "transparent",
            color: "white",
            fontSize: "14px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        {wsTemplate && (
          <button
            onClick={saveWorkspaceConfig}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #B87333 0%, #D4955A 100%)",
              color: "white",
              fontSize: "14px",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            {wsEditingIndex !== null ? "Update Workspace" : "Save Workspace"}
          </button>
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
      background: "linear-gradient(135deg, #2E3A47 0%, #3D4F5C 100%)",
      borderRadius: "32px",
      padding: "50px 40px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      border: "1px solid rgba(184, 115, 51, 0.3)",
      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
    }}>
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #B87333 0%, #D4955A 100%)",
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
          
          // Office workspace builder reset
          setWorkspaceConfigs([]);
          
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
          background: "linear-gradient(135deg, #B87333 0%, #D4955A 100%)",
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
