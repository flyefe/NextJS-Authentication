
// This function is used to pluralize model names.
export function pluralizeModel(model: string): string {
    // Special cases for irregular plurals
    const irregulars: Record<string, string> = {
      country: 'countries',
      category: 'categories',
      person: 'people',
      // Add more as needed
    };
    return irregulars[model] || (model.endsWith('s') ? model : model + 's');
  }