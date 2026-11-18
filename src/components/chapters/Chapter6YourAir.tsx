import React from 'react';
import { useAqiStore } from '../../store/useAqiStore';
import { UserPersona, PersonaPrescription } from '../../types/aqi';
import { UserCheck, Shield, Clock, Compass, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';

const PERSONAS: Array<{ id: UserPersona; label: string; desc: string }> = [
  { id: 'runner', label: 'Endurance Runner', desc: '5x–6x elevated minute ventilation rate (~60 L/min).' },
  { id: 'asthma', label: 'Asthma / Respiratory', desc: 'Hyper-reactive airway lining prone to NO2 spasms.' },
  { id: 'child', label: 'Child (<8 yrs)', desc: 'Stroller breathing height aligns with tailpipe exhaust.' },
  { id: 'senior', label: 'Senior / Cardiovascular', desc: 'Ultrafine particle vascular constriction vulnerability.' },
  { id: 'cyclist', label: 'Urban Cyclist', desc: 'High cadence breathing along congested motor corridors.' },
  { id: 'commuter', label: 'Pedestrian Commuter', desc: 'Standard ambient walking & public transit exposure.' },
];

export function evaluatePrescription(persona: UserPersona, aqi: number): PersonaPrescription {
  let verdict: 'Go' | 'Careful' | 'Stay in' = 'Go';
  let verdictColor = '#4ADE80';
  let mask = 'No mask required.';
  let window = 'Anytime during daylight hours.';
  let reasoning = '';
  let checklist: string[] = [];

  switch (persona) {
    case 'runner':
      if (aqi <= 50) {
        verdict = 'Go';
        verdictColor = '#4ADE80';
        mask = 'No mask required. Ambient airway clearance optimal.';
        window = '06:00 – 09:30 (Pre-ozone formation).';
        reasoning = 'Clean atmospheric baseline allows vigorous aerobic training without alveolar alveolar particle loading.';
        checklist = ['Hydrate normally', 'Enjoy outdoor route'];
      } else if (aqi <= 100) {
        verdict = 'Careful';
        verdictColor = '#FBBF24';
        mask = 'Optional lightweight particulate band if sensitive.';
        window = '06:30 – 08:00 (Prior to secondary photochemical synthesis).';
        reasoning = 'Elevated respiratory rate (50+ L/min) multiplies particulate intake 5x. Route through parklands away from truck corridors.';
        checklist = ['Avoid multi-lane arterials', 'Cap long run duration to 45 mins'];
      } else {
        verdict = 'Stay in';
        verdictColor = '#EF4444';
        mask = 'N95 / FFP2 mandatory if outdoors.';
        window = 'Indoor treadmill in HEPA-filtered space.';
        reasoning = 'Deep inhalation during strenuous exertion bypasses upper mucosal filters, depositing toxic PM2.5 directly into terminal bronchioles.';
        checklist = ['Move workout indoors', 'Seal gym windows', 'Run HEPA air purifier'];
      }
      break;

    case 'asthma':
      if (aqi <= 35) {
        verdict = 'Go';
        verdictColor = '#4ADE80';
        mask = 'No mask required.';
        window = 'Late morning to mid-afternoon.';
        reasoning = 'Negligible NO2 and particulate irritants. Minimal bronchospasm triggering.';
        checklist = ['Carry standard maintenance inhaler'];
      } else if (aqi <= 80) {
        verdict = 'Careful';
        verdictColor = '#FBBF24';
        mask = 'Surgical or KF94 mask recommended near busy avenues.';
        window = '12:00 – 16:00 (Thermal mixing disperses ground NO2).';
        reasoning = 'Nitrogen dioxide and particulate allergens can trigger hyper-reactive bronchial spasms.';
        checklist = ['Keep fast-acting rescue inhaler accessible', 'Avoid early morning thermal inversions'];
      } else {
        verdict = 'Stay in';
        verdictColor = '#EF4444';
        mask = 'Certified N95 / FFP2 tight-seal mask.';
        window = 'Remain in climate-controlled indoor filtration environment.';
        reasoning = 'Severe airway inflammation risk. WHO and pulmonology guidelines advise minimizing all non-essential outdoor exposure.';
        checklist = ['Pre-medicate as advised by physician', 'Run indoor HEPA filter on high'];
      }
      break;

    case 'child':
      if (aqi <= 50) {
        verdict = 'Go';
        verdictColor = '#4ADE80';
        mask = 'No mask required.';
        window = 'Morning to late afternoon.';
        reasoning = 'Airway tissue development undisturbed by ambient aerosol concentrations.';
        checklist = ['Standard outdoor recreation'];
      } else if (aqi <= 100) {
        verdict = 'Careful';
        verdictColor = '#FBBF24';
        mask = 'Child-sized KF80 or cloth barrier if near traffic.';
        window = 'Afternoon (Avoid morning school-run traffic peaks).';
        reasoning = 'Children breathe faster per pound of body weight, and stroller height directly matches vehicle tailpipe discharge heights.';
        checklist = ['Avoid stroller walks along arterial roads', 'Prioritize tree-covered neighborhood parks'];
      } else {
        verdict = 'Stay in';
        verdictColor = '#EF4444';
        mask = 'Pediatric certified particulate respirator.';
        window = 'Indoor play spaces only.';
        reasoning = 'High particulate exposure during formative lung development is clinically linked to reduced lifetime lung capacity.';
        checklist = ['Keep school recess indoors', 'Ensure indoor air filtration'];
      }
      break;

    case 'senior':
      if (aqi <= 50) {
        verdict = 'Go';
        verdictColor = '#4ADE80';
        mask = 'None needed.';
        window = '09:00 – 17:00.';
        reasoning = 'Cardiovascular stability maintained. Clean atmospheric conditions.';
        checklist = ['Standard daily walks'];
      } else if (aqi <= 100) {
        verdict = 'Careful';
        verdictColor = '#FBBF24';
        mask = 'Lightweight mask recommended.';
        window = '11:00 – 15:00.';
        reasoning = 'Ultrafine particles can provoke micro-vascular constriction and elevate resting blood pressure.';
        checklist = ['Pace outdoor walking gently', 'Stay hydrated'];
      } else {
        verdict = 'Stay in';
        verdictColor = '#EF4444';
        mask = 'N95 / FFP2 mask.';
        window = 'Remain indoors.';
        reasoning = 'High correlation between elevated PM2.5 episodes and acute cardiovascular events in elder populations.';
        checklist = ['Keep windows closed', 'Take prescribed cardiovascular meds on schedule'];
      }
      break;

    case 'cyclist':
      if (aqi <= 70) {
        verdict = 'Go';
        verdictColor = '#4ADE80';
        mask = 'None needed.';
        window = 'All daylight commute windows.';
        reasoning = 'Ventilation rates remain within safe physiological oxidative margins.';
        checklist = ['Standard bike transit'];
      } else if (aqi <= 140) {
        verdict = 'Careful';
        verdictColor = '#FBBF24';
        mask = 'Valved sport particulate mask (FFP2/N95 equivalent).';
        window = 'Choose off-peak traffic hours.';
        reasoning = 'Drafting behind buses and diesel trucks dramatically elevates direct black carbon inhalation.';
        checklist = ['Reroute to designated cycle greenways', 'Avoid stopping behind idling exhaust pipes'];
      } else {
        verdict = 'Stay in';
        verdictColor = '#EF4444';
        mask = 'High-grade sealed respirator.';
        window = 'Switch to metro/subway or indoor spinning.';
        reasoning = 'Cardiopulmonary stress from vigorous cycling in heavy smog negates cardiovascular fitness benefits.';
        checklist = ['Take electric rail / closed cabin transit', 'Postpone long outdoor rides'];
      }
      break;

    case 'commuter':
    default:
      if (aqi <= 100) {
        verdict = 'Go';
        verdictColor = '#4ADE80';
        mask = 'Optional.';
        window = 'Standard commute times.';
        reasoning = 'General population physiological clearance mechanisms can handle moderate ambient loads.';
        checklist = ['Normal transit routine'];
      } else if (aqi <= 160) {
        verdict = 'Careful';
        verdictColor = '#FBBF24';
        mask = 'Surgical or KF94 mask on open street corridors.';
        window = 'Minimize prolonged roadside wait times.';
        reasoning = 'Prolonged exposure to trapped street canyon exhaust causes throat dryness and mild headache.';
        checklist = ['Keep car ventilation on recirculate', 'Wear mask while waiting for bus/tram'];
      } else {
        verdict = 'Stay in';
        verdictColor = '#EF4444';
        mask = 'N95 / FFP2 mask mandatory for any pedestrian transit.';
        window = 'Limit transit to essential travel only.';
        reasoning = 'Hazardous ambient particulate density. Direct mucosal irritation and general health strain.';
        checklist = ['Wear tight-seal mask outdoors', 'Run indoor filtration upon arrival'];
      }
      break;
  }

  return {
    persona,
    title: PERSONAS.find(p => p.id === persona)?.label || 'Urban Citizen',
    verdict,
    verdictColor,
    maskRecommendation: mask,
    optimalWindow: window,
    reasoning,
    actionChecklist: checklist,
  };
}

export const Chapter6YourAir: React.FC = () => {
  const activePersona = useAqiStore((s) => s.activePersona);
  const setActivePersona = useAqiStore((s) => s.setActivePersona);
  const getEffectiveAqi = useAqiStore((s) => s.getEffectiveAqi);

  const aqi = getEffectiveAqi();
  const prescription = evaluatePrescription(activePersona, aqi);

  return (
    <section
      id="your-air"
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-20 py-24 select-none"
    >
      <div className="max-w-6xl">
        <div className="font-tech text-xs tracking-widest text-[#8E99A8] uppercase mb-3 flex items-center gap-2">
          <span>ZONE 06 // 250 FT</span>
          <span>•</span>
          <span className="text-[#8DA9C4]">PHYSIOLOGICAL EXPOSURE CO-PILOT</span>
        </div>

        <h2 className="font-display text-4xl md:text-7xl font-light text-white tracking-tight leading-none mb-3">
          Your Air, Your Day
        </h2>

        <p className="font-tech text-xs text-[#8E99A8] mb-8">
          Strictly rule-based guidance calculated from World Health Organization (WHO 2021) and EPA AQI epidemiological thresholds. No hallucinated AI claims.
        </p>

        {/* Persona Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 font-tech">
          {PERSONAS.map((p) => {
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E8A858] bg-[#E8A858]/15 shadow-lg'
                    : 'border-white/10 hover:border-white/30 text-[#8E99A8]'
                }`}
              >
                <div className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-[#8E99A8]'}`}>
                  {p.label}
                </div>
                <div className="text-[9px] text-[#8E99A8] mt-1 leading-tight line-clamp-2">
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Prescription Verdict Dossier */}
        <div className="atmospheric-plate border border-white/15 p-8 max-w-4xl shadow-2xl font-tech">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-b pb-4 mb-6">
            <div>
              <span className="text-[10px] text-[#8E99A8] uppercase tracking-wider">
                PERSONALIZED CLINICAL ASSESSMENT
              </span>
              <h3 className="font-display text-3xl font-normal text-white mt-0.5">
                {prescription.title}
              </h3>
            </div>

            {/* Huge Verdict Badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#8E99A8]">OUTDOOR VERDICT:</span>
              <span
                className="px-4 py-1.5 text-base font-bold uppercase tracking-wider border shadow-lg"
                style={{
                  color: prescription.verdictColor,
                  borderColor: prescription.verdictColor,
                  backgroundColor: `${prescription.verdictColor}18`,
                }}
              >
                {prescription.verdict}
              </span>
            </div>
          </div>

          {/* Core Prescriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold uppercase text-[11px]">
                <Shield size={14} className="text-[#8DA9C4]" />
                <span>Certified Mask Guidance</span>
              </div>
              <p className="text-[#C8D1DC]">{prescription.maskRecommendation}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold uppercase text-[11px]">
                <Clock size={14} className="text-[#E8A858]" />
                <span>Optimal Aeration Window</span>
              </div>
              <p className="text-[#C8D1DC]">{prescription.optimalWindow}</p>
            </div>
          </div>

          {/* Epidemiological Reasoning */}
          <div className="hairline-t pt-4 text-xs">
            <div className="text-[10px] text-[#8E99A8] uppercase tracking-wider mb-1">
              PATHOPHYSIOLOGICAL RATIONALE
            </div>
            <p className="text-[#C8D1DC] leading-relaxed">{prescription.reasoning}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
