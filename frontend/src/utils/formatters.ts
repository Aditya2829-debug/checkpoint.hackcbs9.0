export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  } catch {
    return dateString;
  }
}

export function getGradeLabel(grade: 'A' | 'B' | 'C' | 'D'): {
  label: string;
  badgeBg: string;
  textColor: string;
  description: string;
} {
  switch (grade) {
    case 'A':
      return {
        label: 'Grade A — Clean & Safe',
        badgeBg: 'bg-[#176B3A]',
        textColor: 'text-white',
        description: 'Meets stringent clean label criteria, zero high-risk additives.',
      };
    case 'B':
      return {
        label: 'Grade B — Moderate Risk',
        badgeBg: 'bg-[#92D959]',
        textColor: 'text-[#111F15]',
        description: 'Acceptable nutrition profile with minor processed ingredients.',
      };
    case 'C':
      return {
        label: 'Grade C — Exercise Caution',
        badgeBg: 'bg-[#E6AD45]',
        textColor: 'text-[#111F15]',
        description: 'Contains high sodium/sugar, synthetic colors or additives.',
      };
    case 'D':
      return {
        label: 'Grade D — Critical Concern',
        badgeBg: 'bg-[#D96E61]',
        textColor: 'text-white',
        description: 'High levels of ultra-processed compounds, artificial sweeteners, or toxic risk markers.',
      };
  }
}
