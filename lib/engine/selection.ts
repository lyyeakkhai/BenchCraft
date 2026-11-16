import { getCatalog } from '../catalog';
import { CatalogModel, DomainProfile } from '../types';

export function selectCandidates(profile: DomainProfile, catalog: CatalogModel[] = getCatalog()): CatalogModel[] {
  // 1. Filter models matching category & language capabilities
  const eligible = catalog.filter((model) => {
    const matchesCategory = model.categories.includes(profile.taskCategory);
    const matchesLangs = profile.languages.every((l) =>
      model.languages.map((ml) => ml.toLowerCase()).includes(l.toLowerCase())
    );
    const matchesContext = profile.needsLongContext ? model.contextLength >= 120000 : true;
    const matchesVision = profile.needsVision ? model.modalities.includes('image') : true;

    return matchesCategory && (matchesLangs || profile.languages.length <= 1) && matchesContext && matchesVision;
  });

  const pool = eligible.length >= 3 ? eligible : catalog; // Graceful fallback if criteria too narrow

  // Separate by tier
  const topTier = pool.filter((m) => m.tier === 'top');
  const midTier = pool.filter((m) => m.tier === 'mid');
  const smallTier = pool.filter((m) => m.tier === 'small');

  // Pick top reference model (isReference or highest priorScore in category)
  const reference =
    topTier.find((m) => m.isReference?.[profile.taskCategory]) ||
    topTier.sort((a, b) => (b.priorScores[profile.taskCategory] || 0) - (a.priorScores[profile.taskCategory] || 0))[0] ||
    catalog.find((m) => m.tier === 'top')!;

  // Pick 2 mid models
  const selectedMid = midTier
    .filter((m) => m.id !== reference.id)
    .sort((a, b) => (b.priorScores[profile.taskCategory] || 0) - (a.priorScores[profile.taskCategory] || 0))
    .slice(0, 2);

  // Pick 2 small models
  const selectedSmall = smallTier
    .filter((m) => m.id !== reference.id)
    .sort((a, b) => (b.priorScores[profile.taskCategory] || 0) - (a.priorScores[profile.taskCategory] || 0))
    .slice(0, 2);

  const candidates: CatalogModel[] = [reference, ...selectedMid, ...selectedSmall];

  // Ensure minimum 3 candidates
  if (candidates.length < 3) {
    for (const model of catalog) {
      if (!candidates.find((c) => c.id === model.id)) {
        candidates.push(model);
        if (candidates.length >= 3) break;
      }
    }
  }

  return candidates.slice(0, 5);
}
