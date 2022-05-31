import typographicBase from 'typographic-base';

export function missingClass(string, prefix) {
  if (!string) {
    return true;
  }

  let regex = new RegExp(` ?${prefix}`, 'g');
  return string.match(regex) === null;
}

export function formatText(input) {
  if (!input) {
    return;
  }

  if (typeof input !== 'string') {
    return input;
  }

  return typographicBase(input, {locale: 'en-us'}).replace(
    /\s([^\s<]+)\s*$/g,
    '\u00A0$1',
  );
}

export function isRangedPricing(priceRange) {
  return priceRange.minVariantPrice.amount < priceRange.maxVariantPrice.amount;
}

export function isNewArrival(date, daysOld = 30) {
  return new Date(date) > new Date().setDate(new Date().getDate() - daysOld);
}

export function isDiscounted(price, compareAtPrice) {
  if (compareAtPrice?.amount > price?.amount) {
    return true;
  }
  return false;
}
