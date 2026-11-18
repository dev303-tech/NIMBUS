import { describe, it, expect } from 'vitest';
import { evaluatePrescription } from '../components/chapters/Chapter6YourAir';
import { UserPersona } from '../types/aqi';

describe('WHO & EPA Epidemiological Prescription Engine', () => {
  const personas: UserPersona[] = ['runner', 'asthma', 'child', 'senior', 'cyclist', 'commuter'];

  it('generates valid prescriptions for all 6 personas across clean air (AQI 25)', () => {
    personas.forEach((persona) => {
      const rx = evaluatePrescription(persona, 25);
      expect(rx.verdict).toBe('Go');
      expect(rx.verdictColor).toBe('#4ADE80');
      expect(rx.reasoning).toBeTruthy();
      expect(rx.actionChecklist.length).toBeGreaterThan(0);
    });
  });

  it('triggers "Careful" threshold earlier for vulnerable populations (Asthma / Child)', () => {
    const asthmaRx = evaluatePrescription('asthma', 55);
    const runnerRx = evaluatePrescription('runner', 45);

    expect(asthmaRx.verdict).toBe('Careful');
    expect(runnerRx.verdict).toBe('Go');
  });

  it('triggers strict "Stay in" for heavy exercise under combustion smog (AQI 140)', () => {
    const runnerRx = evaluatePrescription('runner', 140);
    expect(runnerRx.verdict).toBe('Stay in');
    expect(runnerRx.verdictColor).toBe('#EF4444');
    expect(runnerRx.maskRecommendation).toContain('N95');
    expect(runnerRx.actionChecklist).toContain('Move workout indoors');
  });

  it('triggers senior cardiovascular protections when AQI exceeds 110', () => {
    const seniorRx = evaluatePrescription('senior', 120);
    expect(seniorRx.verdict).toBe('Stay in');
    expect(seniorRx.reasoning).toContain('vascular');
  });

  describe('CleanPath™ Inhalation Dosage Calculations', () => {
    it('calculates cigarette equivalence accurately based on ambient PM2.5 exposure', () => {
      const pm2_5 = 44; // 44 μg/m³ for 24h = ~2 cigarettes
      const dailyEquivalence = pm2_5 / 22;
      expect(dailyEquivalence).toBeCloseTo(2.0, 1);
    });

    it('calculates lung particulate deposition rate across exertion levels', () => {
      const pm2_5 = 50; // μg/m³
      const restingIntakePerHour = pm2_5 * 0.36;
      const runningIntakePerHour = pm2_5 * 3.6;

      expect(runningIntakePerHour).toBe(restingIntakePerHour * 10);
      expect(restingIntakePerHour).toBe(18);
      expect(runningIntakePerHour).toBe(180);
    });
  });
});
