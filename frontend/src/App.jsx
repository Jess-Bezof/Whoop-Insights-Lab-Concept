import React, { useState } from 'react';
import { Brain, Zap, Coffee, Activity } from 'lucide-react';
import ImpactSlider from './components/ImpactSlider';
import CircularMetric from './components/CircularMetric';
import DashboardCard from './components/DashboardCard';
import Header from './components/Header';
import InfoModal from './components/InfoModal';

const DEFINITIONS = {
  CNS: "Central Nervous System - The control center for the body/mind. Alcohol acts as a depressant here.",
  HRV: "Heart Rate Variability - The variation in time between heartbeats. Higher is better (indicates recovery).",
  RHR: "Resting Heart Rate - Your heart beats per minute when completely at rest. Lower is usually better.",
  REM: "Rapid Eye Movement - Deep sleep stage crucial for mental restoration and memory consolidation.",
  Sympathetic: "Fight or Flight - The stress response state. High sympathetic activity lowers HRV.",
  Parasympathetic: "Rest and Digest - The recovery state. Dominance here leads to high HRV and recovery."
};

const DIAGNOSTIC_DATA = {
    neuro_toxicity: {
        title: "NEURO-TOXICITY",
        icon: Brain,
        unit: "units",
        getValue: (m) => m.active_units || 0,
        statusMap: {
            green: {
                pill: "✓ Primed",
                title: "NEURO-TOXICITY - PRIMED",
                text: "Your CNS is free of ethanol depressants. HRV rhythms and cellular repair are uninhibited."
            },
            yellow: {
                pill: "! Moderate Strain",
                title: "NEURO-TOXICITY - MODERATE STRAIN",
                text: "CNS is processing ethanol, creating \"Autonomic Noise.\" Expect suppressed HRV and a restless night."
            },
            red: {
                pill: "⚠ Systemic Crash",
                title: "NEURO-TOXICITY - SYSTEMIC CRASH",
                text: "High toxicity induced a major Parasympathetic brake. HRV is crashed; repair is halted."
            }
        }
    },
    metabolic_state: {
        title: "METABOLIC STATE",
        icon: Zap,
        unit: "kcal",
        getValue: (m) => m.active_calories || 0,
        statusMap: {
            green: {
                pill: "✓ Restorative",
                title: "METABOLIC STATE - RESTORATIVE",
                text: "Body has shifted from digestion to restoration. Energy is used for hormone regulation, not food breakdown."
            },
            yellow: {
                pill: "! Digestive Load",
                title: "METABOLIC STATE - DIGESTIVE LOAD",
                text: "Your heart is beating faster to facilitate digestion, preventing RHR from reaching its true baseline."
            },
            red: {
                pill: "⚠ Metabolic Overdrive",
                title: "METABOLIC STATE - OVERDRIVE",
                text: "Excessive calories are forcing a prolonged RHR spike, starving muscles of repair energy."
            }
        }
    },
    cns_stimulants: {
        title: "CNS STIMULANTS",
        icon: Coffee,
        unit: "mg",
        getValue: (m) => m.caffeine_residue || 0,
        statusMap: {
            green: {
                pill: "✓ Ready",
                title: "CNS STIMULANTS - READY",
                text: "Caffeine is below adenosine disruption levels. Brain can fully access deep REM and restorative stages."
            },
            yellow: {
                pill: "! Fragmented Sleep",
                title: "CNS STIMULANTS - FRAGMENTED SLEEP",
                text: "Moderate residue is interfering with adenosine. You may sleep, but will lack deep REM quality."
            },
            red: {
                pill: "⚠ REM Blockage",
                title: "CNS STIMULANTS - REM BLOCKAGE",
                text: "High residue is significantly blocking sleep-inducing adenosine. Expect nearly total loss of restorative REM."
            }
        }
    },
    autonomic_load: {
        title: "AUTONOMIC LOAD",
        icon: Activity,
        unit: "ANS",
        getValue: (m) => m.ans_score || 0, // Using ANS Score as the metric
        statusMap: {
            green: {
                pill: "✓ Balanced",
                title: "AUTONOMIC LOAD - BALANCED",
                text: "Low stress allows healthy Autonomic balance. You are in a \"Rest and Digest\" state for peak recovery."
            },
            yellow: {
                pill: "! Elevated Tension",
                title: "AUTONOMIC LOAD - ELEVATED TENSION",
                text: "Moderate stress is keeping the CNS in a \"Ready\" state, struggling to transition into recovery mode."
            },
            red: {
                pill: "⚠ Fight or Flight",
                title: "AUTONOMIC LOAD - FIGHT OR FLIGHT",
                text: "Locked in a high-sympathetic state. Autonomic load prevents HRV signals for a Green recovery."
            }
        }
    }
};

const EDUCATION_CONTENT = {
    Sleep: "The Performance Multiplier: Sleep is the baseline for all physical and mental repair. This metric reflects the raw \"Quality x Quantity\" of your rest. Short-changing your sleep window creates \"Sleep Debt\" that no amount of caffeine can fully offset.",
    Recovery: "Autonomic Readiness: Recovery is not a grade on yesterday; it's a measure of your capacity for today. It is primarily driven by your Autonomic Nervous System (ANS) balance—how well your body has transitioned from \"Fight or Flight\" to \"Rest and Digest\".",
    "Recovery Foundation": "The Baseline Load: These are the internal factors you control. High mental stress and insufficient sleep keep your body in a sympathetic state, preventing the deep cellular repair needed for a \"Green\" recovery day.",
    "Food Consumption": "Metabolic Strain: Digestion is an energy-intensive process. Consuming large caloric loads close to bedtime diverts blood flow to the gut, causing your Resting Heart Rate (RHR) to stay elevated and preventing your heart from entering its most restorative state.",
    "Alcohol Consumption": "The Systemic Toxin: Alcohol is a potent parasympathetic suppressor. It causes a non-linear crash in Heart Rate Variability (HRV) and fragments your sleep architecture, specifically suppressing REM sleep while your liver works to clear the ethanol.",
    Caffeine: "Adenosine Blockage: Caffeine has a ~6-hour half-life. It works by blocking adenosine receptors in the brain, which are responsible for \"sleep pressure.\" High residue at bedtime prevents you from falling into deep, restorative sleep cycles.",
    "Neuro-Toxicity": "Alcohol & The CNS: Alcohol is a potent CNS (Central Nervous System) depressant. It causes an immediate drop in HRV (Heart Rate Variability), which is the primary marker of recovery. This \"toxicity\" load forces the liver into high-gear, preventing the body from entering deep, restorative sleep. Even after ethanol is cleared, systemic inflammation can suppress recovery scores for up to 24 hours.",
    "Metabolic State": "The Cost of Digestion: Digesting food is an energy-intensive process. When you eat a high-calorie meal close to bedtime, your body diverts blood flow to the digestive tract instead of focusing on cellular repair. This results in an elevated RHR (Resting Heart Rate) throughout the night, preventing your heart from reaching its most restorative \"resting\" state.",
    "CNS Stimulants": "Caffeine & Adenosine: CNS (Central Nervous System) stimulants like caffeine work by blocking adenosine receptors—the chemical signals that create \"sleep pressure.\" High caffeine residue at bedtime prevents the brain from transitioning into REM (Rapid Eye Movement) cycles. This leads to \"fragmented sleep,\" where you remain unconscious but your brain fails to reach deep recovery stages.",
    "Autonomic Load": "Sympathetic Overdrive: Mental stress keeps your body locked in a Sympathetic (Fight or Flight) state. For optimal recovery, you need to transition into a Parasympathetic (Rest & Digest) state. High stress acts as a \"parasympathetic brake,\" preventing the rhythmic heart-rate variability that signals a body ready for high performance."
};

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const [inputs, setInputs] = useState({
    sleep_duration: 7.5,
    alcohol_intake: 0, // Keep for backward compatibility or remove
    alcohol_type_abv: 5, // Default Beer
    alcohol_volume_per_drink: 330,
    alcohol_count: 0,
    alcohol_hours_since: 0,
    caffeine_amount: 0,
    caffeine_timing: 8,
    late_meal_timing: 2,
    meal_calories: 0,
    stress_level: 1, // 0: Low, 1: Med, 2: High
  });

  const [metrics, setMetrics] = useState({
    sleep_performance: 0,
    recovery_score: 0,
    standard_drinks: 0, // For explainability
    active_units: 0,
    alcohol_penalty: 0,
    insight_grid: {
        neuro_toxicity: { status: 'green', message: 'Loading...' },
        metabolic_state: { status: 'green', message: 'Loading...' },
        cns_stimulants: { status: 'green', message: 'Loading...' },
        autonomic_load: { status: 'green', message: 'Loading...' }
    }
  });

  const [response, setResponse] = useState(null);

  // Real-time sync for core logic
  React.useEffect(() => {
    const calculateRecovery = async () => {
        try {
            const stressMap = { 0: 'Low', 1: 'Medium', 2: 'High' };
            const totalAlcoholVolume = inputs.alcohol_volume_per_drink * inputs.alcohol_count;
            
            const payload = { 
                sleep_duration: inputs.sleep_duration,
                stress_level: stressMap[inputs.stress_level],
                late_meal_timing: inputs.late_meal_timing,
                meal_calories: inputs.meal_calories,
                caffeine_amount: inputs.caffeine_amount,
                caffeine_timing: inputs.caffeine_timing,
                alcohol_volume_ml: totalAlcoholVolume,
                alcohol_abv: inputs.alcohol_type_abv,
                alcohol_hours_since_last_drink: inputs.alcohol_hours_since
            };

            const res = await fetch('http://127.0.0.1:8000/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            setMetrics({
                sleep_performance: data.sleep_performance,
                recovery_score: data.recovery_score,
                standard_drinks: data.details.standard_drinks,
                active_units: data.details.active_units,
                alcohol_penalty: data.details.alcohol_penalty_recovery,
                active_calories: data.details.active_calories,
                caffeine_residue: data.details.caffeine_residue,
                ans_score: data.details.nervous_system_score,
                insight_grid: data.insight_grid
            });
        } catch (error) {
            console.error('Calculation error:', error);
        }
    };
    calculateRecovery();
  }, [inputs.sleep_duration, inputs.stress_level, inputs.late_meal_timing, inputs.meal_calories, inputs.caffeine_amount, inputs.caffeine_timing, inputs.alcohol_count, inputs.alcohol_type_abv, inputs.alcohol_volume_per_drink, inputs.alcohol_hours_since]);

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Keep existing full simulation logic if needed, or remove. 
    // For now, let's keep it but maybe it logs or does something else.
    try {
        const stressMap = { 0: 'Low', 1: 'Medium', 2: 'High' };
        const payload = { ...inputs, stress_level: stressMap[inputs.stress_level] };

        const res = await fetch('http://127.0.0.1:8000/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        setResponse(data);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const getStressLabel = (val) => {
      if (val === 0) return 'Low';
      if (val === 1) return 'Medium';
      return 'High';
  };

  const openModal = (title, content) => setActiveModal({ title, content });
  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-whoop-gradient text-white font-sans pb-10">
      <InfoModal 
        isOpen={!!activeModal}
        onClose={closeModal}
        title={activeModal?.title}
        content={activeModal?.content}
      />
      <div className="max-w-md mx-auto">
        <Header />

        <div className="text-center mb-8 mt-4">
            <h2 className="text-white text-lg tracking-widest font-light uppercase">WHOOP Insight Lab</h2>
        </div>

        {/* Main Metrics Rings */}
        <div className="sticky top-0 z-50 bg-whoop-gradient/95 backdrop-blur-md py-4 -mx-4 px-8 flex justify-center items-center gap-8 mb-10 shadow-lg border-b border-white/5">
          <CircularMetric 
            value={metrics.sleep_performance} 
            label="Sleep" 
            color="#66CCFF" 
            suffix="%" 
            size="w-44 h-44"
            onClick={() => openModal('Sleep', EDUCATION_CONTENT['Sleep'])}
          />
          <CircularMetric 
            value={metrics.recovery_score} 
            label="Recovery" 
            color={metrics.recovery_score >= 66 ? "#00E266" : metrics.recovery_score >= 33 ? "#FFDE59" : "#FF5C5C"}
            suffix="%" 
            size="w-44 h-44"
            onClick={() => openModal('Recovery', EDUCATION_CONTENT['Recovery'])}
          />
        </div>

        {/* Daily Health Insights (2x2 Grid) */}
        <div className="px-4 mb-8">
            <h3 className="text-whoop-textDim text-xs uppercase tracking-widest mb-3 ml-1">Daily Health Insights</h3>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(DIAGNOSTIC_DATA).map(([key, config]) => {
                    const backendData = metrics.insight_grid[key] || { status: 'green' };
                    const status = backendData.status || 'green';
                    const mapData = config.statusMap[status];
                    const value = config.getValue(metrics);
                    const Icon = config.icon;
                    
                    // Color Logic for Pill
                    let pillColors = 'bg-green-500/20 text-green-400';
                    if (status === 'yellow') pillColors = 'bg-yellow-500/20 text-yellow-400';
                    if (status === 'red') pillColors = 'bg-red-500/20 text-red-400';

                    return (
                        <div 
                            key={key} 
                            className="bg-whoop-monitor-bg border border-whoop-monitor-border rounded-xl p-5 flex flex-col justify-between h-32 cursor-pointer hover:border-slate-500 transition-colors duration-300"
                            onClick={() => {
                                const modalContent = (
                                    <div className="space-y-4">
                                        <p className="font-medium text-white text-sm leading-relaxed">{mapData.text}</p>
                                        <div className="border-t border-white/10 pt-4">
                                            <h4 className="text-xs font-bold text-whoop-textDim uppercase mb-2">Key Definitions</h4>
                                            <div className="space-y-2 text-xs text-whoop-textDim">
                                                {Object.entries(DEFINITIONS).map(([term, def]) => (
                                                    <p key={term}><span className="text-white font-semibold">{term}:</span> {def}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                                openModal(mapData.title, modalContent);
                            }}
                        >
                            {/* Top Row: Icon + Title */}
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className="w-4 h-4 text-whoop-textDim" />
                                <span className="text-[10px] font-bold text-whoop-textDim uppercase tracking-wider">{config.title}</span>
                            </div>

                            {/* Middle Row: Statistic */}
                            <div>
                                <span className="text-2xl font-bold text-white">{value}</span>
                                <span className="text-xs text-whoop-textDim font-medium ml-1">{config.unit}</span>
                            </div>

                            {/* Bottom Row: Status Pill */}
                            <div className="mt-2">
                                <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${pillColors}`}>
                                    {mapData.pill}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Simulation Controls (Core Logic) */}
        <div className="px-4 mb-8">
            <DashboardCard 
              title="Recovery Foundation"
              onTitleClick={() => openModal('Recovery Foundation', EDUCATION_CONTENT['Recovery Foundation'])}
            >
                <div className="space-y-6">
                    <ImpactSlider
                        label="Sleep Duration"
                        value={inputs.sleep_duration}
                        min={0} max={8} step={0.5} unit="h"
                        onChange={(val) => handleChange('sleep_duration', val)}
                    />
                    
                    <div className="mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                            Mental Stress Load
                        </label>
                        <div className="flex justify-between gap-2">
                             <button 
                                 className={`flex-1 py-2 text-xs rounded-lg border transition-all duration-200 ${inputs.stress_level === 0 ? 'bg-whoop-primary border-2 border-white text-white font-bold shadow-lg transform scale-105' : 'border-whoop-textDim text-whoop-textDim hover:text-white'}`}
                                 onClick={() => handleChange('stress_level', 0)}
                             >
                                 Low
                             </button>
                             <button 
                                 className={`flex-1 py-2 text-xs rounded-lg border transition-all duration-200 ${inputs.stress_level === 1 ? 'bg-whoop-primary border-2 border-white text-white font-bold shadow-lg transform scale-105' : 'border-whoop-textDim text-whoop-textDim hover:text-white'}`}
                                 onClick={() => handleChange('stress_level', 1)}
                             >
                                 Medium
                             </button>
                             <button 
                                 className={`flex-1 py-2 text-xs rounded-lg border transition-all duration-200 ${inputs.stress_level === 2 ? 'bg-whoop-primary border-2 border-white text-white font-bold shadow-lg transform scale-105' : 'border-whoop-textDim text-whoop-textDim hover:text-white'}`}
                                 onClick={() => handleChange('stress_level', 2)}
                             >
                                 High
                             </button>
                        </div>
                    </div>
                </div>
            </DashboardCard>
        </div>

        {/* Food Consumption */}
        <div className="px-4 mb-8">
            <DashboardCard 
              title="Food Consumption"
              onTitleClick={() => openModal('Food Consumption', EDUCATION_CONTENT['Food Consumption'])}
            >
                <div className="space-y-6">
                    <ImpactSlider
                        label="Meal Size (Calories)"
                        value={inputs.meal_calories}
                        min={0} max={1500} step={50} unit="kcal"
                        onChange={(val) => handleChange('meal_calories', val)}
                        reverseColor={true}
                    />
                    <ImpactSlider
                        label="Meal Timing"
                        value={inputs.late_meal_timing}
                        min={0} max={6} step={0.5} unit="h before bed"
                        onChange={(val) => handleChange('late_meal_timing', val)}
                        reverseColor={true}
                    />
                </div>
            </DashboardCard>
        </div>

        {/* Other Factors */}
        <div className="px-4 mb-8">
            <DashboardCard 
              title="Alcohol Consumption"
              onTitleClick={() => openModal('Alcohol Consumption', EDUCATION_CONTENT['Alcohol Consumption'])}
            >
                 <div className="space-y-4">
                    <div className="flex justify-between gap-2">
                         <button 
                             className={`flex-1 py-2 text-xs rounded-lg border transition-all duration-200 ${inputs.alcohol_type_abv === 5 ? 'bg-whoop-primary border-2 border-white text-white font-bold shadow-lg transform scale-105' : 'border-whoop-textDim text-whoop-textDim'}`}
                             onClick={() => handleChange('alcohol_type_abv', 5)}
                         >
                             Beer (5%)
                         </button>
                         <button 
                             className={`flex-1 py-2 text-xs rounded-lg border transition-all duration-200 ${inputs.alcohol_type_abv === 12 ? 'bg-whoop-primary border-2 border-white text-white font-bold shadow-lg transform scale-105' : 'border-whoop-textDim text-whoop-textDim'}`}
                             onClick={() => handleChange('alcohol_type_abv', 12)}
                         >
                             Wine (12%)
                         </button>
                         <button 
                             className={`flex-1 py-2 text-xs rounded-lg border transition-all duration-200 ${inputs.alcohol_type_abv === 40 ? 'bg-whoop-primary border-2 border-white text-white font-bold shadow-lg transform scale-105' : 'border-whoop-textDim text-whoop-textDim'}`}
                             onClick={() => handleChange('alcohol_type_abv', 40)}
                         >
                             Spirit (40%)
                         </button>
                    </div>

                    <ImpactSlider
                        label="Volume per Drink"
                        value={inputs.alcohol_volume_per_drink}
                        min={0} max={1000} step={10} unit="ml"
                        onChange={(val) => handleChange('alcohol_volume_per_drink', val)}
                        reverseColor={true}
                    />
                     <ImpactSlider
                        label="Number of Drinks"
                        value={inputs.alcohol_count}
                        min={0} max={10} step={1}
                        onChange={(val) => handleChange('alcohol_count', val)}
                        reverseColor={true}
                    />
                     <ImpactSlider
                        label="Hours Since Last Drink"
                        value={inputs.alcohol_hours_since}
                        min={0} max={12} step={0.5} unit="h"
                        onChange={(val) => handleChange('alcohol_hours_since', val)}
                        // Not reversing this one because "More hours since" is GOOD
                    />
                    
                    {metrics.standard_drinks > 0 && (
                        <div className="mt-2 p-3 bg-red-900 bg-opacity-30 rounded-lg border border-red-800 text-center">
                            <p className="text-red-400 text-xs font-bold">
                                By the time you sleep, {metrics.active_units} standard drinks will still be in your system, causing a {metrics.alcohol_penalty}% recovery crash.
                            </p>
                        </div>
                    )}
                 </div>
            </DashboardCard>
        </div>

        <div className="px-4 mb-8">
            <DashboardCard 
              title="Caffeine"
              onTitleClick={() => openModal('Caffeine', EDUCATION_CONTENT['Caffeine'])}
            >
                <div className="space-y-6">
                     <ImpactSlider
                        label="Caffeine Amount"
                        value={inputs.caffeine_amount}
                        min={0} max={600} step={10} unit="mg"
                        onChange={(val) => handleChange('caffeine_amount', val)}
                        reverseColor={true}
                    />
                    <ImpactSlider
                        label="Caffeine Timing"
                        value={inputs.caffeine_timing}
                        min={0} max={12} step={0.5} unit="h before bed"
                        onChange={(val) => handleChange('caffeine_timing', val)}
                        // Not reversing timing (Assuming more hours before bed is good)
                    />
                </div>
            </DashboardCard>
        </div>
        
        {/* Dynamic Daily Insight - Removed as replaced by notifications */}
        
        {response && (
            <div className="mt-4 px-4 text-center">
                 <p className="text-whoop-textDim text-xs">Simulated: {response.message}</p>
            </div>
        )}

      </div>
    </div>
  );
}

export default App;
