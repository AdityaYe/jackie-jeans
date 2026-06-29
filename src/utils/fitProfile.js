export function convertWeight(value, fromUnit, toUnit) {
  const numeric = Number(value);
  if (!value || Number.isNaN(numeric) || fromUnit === toUnit) return value;
  return String(Math.round(fromUnit === 'lb' ? numeric * 0.453592 : numeric / 0.453592));
}

export function formatAnswerValue(key, value) {
  if (key === 'weight') return value ? `${value} lb` : 'Skipped';
  if (key === 'brands') return value?.length ? value.join(', ') : 'Skipped';
  if (key === 'brandSizes') {
    const entries = Object.entries(value || {});
    return entries.length
      ? entries.map(([brand, size]) => `${brand}: ${size}`).join(', ')
      : 'Not answered yet';
  }
  return value || 'Not answered yet';
}

export function buildFitProfileParams(answers) {
  const params = new URLSearchParams();
  const fields = {
    height: 'height',
    weight: 'weight',
    weightUnit: 'weight_unit',
    waist: 'waist',
    hip: 'hip',
    waistFit: 'waist_fit',
    rise: 'rise',
    thighFit: 'thigh_fit',
    frustration: 'frustration',
  };

  Object.entries(fields).forEach(([answerKey, paramKey]) => {
    if (answers[answerKey]) params.set(paramKey, answers[answerKey]);
  });

  if (answers.brands?.length) params.set('brands', answers.brands.join(','));
  if (Object.keys(answers.brandSizes || {}).length) {
    params.set('brand_sizes', JSON.stringify(answers.brandSizes));
  }

  return params;
}

export function buildSummaryParts(answers) {
  const summaryParts = [];
  if (answers.height) summaryParts.push(answers.height);
  if (answers.waist) summaryParts.push(`${answers.waist} waist`);
  if (answers.hip) summaryParts.push(`${answers.hip} hip`);
  if (answers.rise) summaryParts.push(answers.rise.toLowerCase());
  if (answers.thighFit) summaryParts.push(`${answers.thighFit.toLowerCase()} through the thigh`);
  return summaryParts;
}
