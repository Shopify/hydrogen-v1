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

export function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
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

// Recursively add `to` and `target` attributes to links based on their url
export function parseMenu(menu, shopDomain) {
  function parseItem(item) {
    if (!item?.url || !item?.type) {
      console.warn('Invalid menu item', item);
      return;
    }

    const {pathname, origin} = new URL(item.url);
    const isExternal = origin !== shopDomain;

    const parsedItem = isExternal
      ? {
          ...item,
          target: '_blank',
          to: item.url,
        }
      : {
          ...item,
          target: undefined,
          to: pathname,
        };

    const hasSubItems = item?.items?.length > 0;
    if (hasSubItems) {
      return {
        ...parsedItem,
        items: item.items.map(parseItem),
      };
    }

    return parsedItem;
  }

  if (!shopDomain) {
    console.warn('shopDomain not provided to parseMenu');
    return menu;
  }

  if (!menu?.items) {
    console.warn('Invalid menu passed to parseMenu');
    return menu;
  }

  return {
    ...menu,
    items: menu.items.map(parseItem),
  };
}
