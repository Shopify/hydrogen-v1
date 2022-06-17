/** The set of valid sort keys for the Article query. */
export var ArticleSortKeys;
(function (ArticleSortKeys) {
    /** Sort by the `author` value. */
    ArticleSortKeys["Author"] = "AUTHOR";
    /** Sort by the `blog_title` value. */
    ArticleSortKeys["BlogTitle"] = "BLOG_TITLE";
    /** Sort by the `id` value. */
    ArticleSortKeys["Id"] = "ID";
    /** Sort by the `published_at` value. */
    ArticleSortKeys["PublishedAt"] = "PUBLISHED_AT";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    ArticleSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `title` value. */
    ArticleSortKeys["Title"] = "TITLE";
    /** Sort by the `updated_at` value. */
    ArticleSortKeys["UpdatedAt"] = "UPDATED_AT";
})(ArticleSortKeys || (ArticleSortKeys = {}));
/** The set of valid sort keys for the Blog query. */
export var BlogSortKeys;
(function (BlogSortKeys) {
    /** Sort by the `handle` value. */
    BlogSortKeys["Handle"] = "HANDLE";
    /** Sort by the `id` value. */
    BlogSortKeys["Id"] = "ID";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    BlogSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `title` value. */
    BlogSortKeys["Title"] = "TITLE";
})(BlogSortKeys || (BlogSortKeys = {}));
/** Card brand, such as Visa or Mastercard, which can be used for payments. */
export var CardBrand;
(function (CardBrand) {
    /** American Express. */
    CardBrand["AmericanExpress"] = "AMERICAN_EXPRESS";
    /** Diners Club. */
    CardBrand["DinersClub"] = "DINERS_CLUB";
    /** Discover. */
    CardBrand["Discover"] = "DISCOVER";
    /** JCB. */
    CardBrand["Jcb"] = "JCB";
    /** Mastercard. */
    CardBrand["Mastercard"] = "MASTERCARD";
    /** Visa. */
    CardBrand["Visa"] = "VISA";
})(CardBrand || (CardBrand = {}));
/** Possible error codes that can be returned by `CartUserError`. */
export var CartErrorCode;
(function (CartErrorCode) {
    /** The input value is invalid. */
    CartErrorCode["Invalid"] = "INVALID";
    /** Merchandise line was not found in cart. */
    CartErrorCode["InvalidMerchandiseLine"] = "INVALID_MERCHANDISE_LINE";
    /** The input value should be less than the maximum value allowed. */
    CartErrorCode["LessThan"] = "LESS_THAN";
    /** Missing discount code. */
    CartErrorCode["MissingDiscountCode"] = "MISSING_DISCOUNT_CODE";
    /** Missing note. */
    CartErrorCode["MissingNote"] = "MISSING_NOTE";
})(CartErrorCode || (CartErrorCode = {}));
/** Possible error codes that can be returned by `CheckoutUserError`. */
export var CheckoutErrorCode;
(function (CheckoutErrorCode) {
    /** Checkout is already completed. */
    CheckoutErrorCode["AlreadyCompleted"] = "ALREADY_COMPLETED";
    /** Input email contains an invalid domain name. */
    CheckoutErrorCode["BadDomain"] = "BAD_DOMAIN";
    /** The input value is blank. */
    CheckoutErrorCode["Blank"] = "BLANK";
    /** Cart does not meet discount requirements notice. */
    CheckoutErrorCode["CartDoesNotMeetDiscountRequirementsNotice"] = "CART_DOES_NOT_MEET_DISCOUNT_REQUIREMENTS_NOTICE";
    /** Customer already used once per customer discount notice. */
    CheckoutErrorCode["CustomerAlreadyUsedOncePerCustomerDiscountNotice"] = "CUSTOMER_ALREADY_USED_ONCE_PER_CUSTOMER_DISCOUNT_NOTICE";
    /** Discount already applied. */
    CheckoutErrorCode["DiscountAlreadyApplied"] = "DISCOUNT_ALREADY_APPLIED";
    /** Discount disabled. */
    CheckoutErrorCode["DiscountDisabled"] = "DISCOUNT_DISABLED";
    /** Discount expired. */
    CheckoutErrorCode["DiscountExpired"] = "DISCOUNT_EXPIRED";
    /** Discount limit reached. */
    CheckoutErrorCode["DiscountLimitReached"] = "DISCOUNT_LIMIT_REACHED";
    /** Discount not found. */
    CheckoutErrorCode["DiscountNotFound"] = "DISCOUNT_NOT_FOUND";
    /** Checkout is already completed. */
    CheckoutErrorCode["Empty"] = "EMPTY";
    /** Queue token has expired. */
    CheckoutErrorCode["ExpiredQueueToken"] = "EXPIRED_QUEUE_TOKEN";
    /** Gift card has already been applied. */
    CheckoutErrorCode["GiftCardAlreadyApplied"] = "GIFT_CARD_ALREADY_APPLIED";
    /** Gift card code is invalid. */
    CheckoutErrorCode["GiftCardCodeInvalid"] = "GIFT_CARD_CODE_INVALID";
    /** Gift card currency does not match checkout currency. */
    CheckoutErrorCode["GiftCardCurrencyMismatch"] = "GIFT_CARD_CURRENCY_MISMATCH";
    /** Gift card has no funds left. */
    CheckoutErrorCode["GiftCardDepleted"] = "GIFT_CARD_DEPLETED";
    /** Gift card is disabled. */
    CheckoutErrorCode["GiftCardDisabled"] = "GIFT_CARD_DISABLED";
    /** Gift card is expired. */
    CheckoutErrorCode["GiftCardExpired"] = "GIFT_CARD_EXPIRED";
    /** Gift card was not found. */
    CheckoutErrorCode["GiftCardNotFound"] = "GIFT_CARD_NOT_FOUND";
    /** Gift card cannot be applied to a checkout that contains a gift card. */
    CheckoutErrorCode["GiftCardUnusable"] = "GIFT_CARD_UNUSABLE";
    /** The input value should be greater than or equal to the minimum value allowed. */
    CheckoutErrorCode["GreaterThanOrEqualTo"] = "GREATER_THAN_OR_EQUAL_TO";
    /** The input value is invalid. */
    CheckoutErrorCode["Invalid"] = "INVALID";
    /** Cannot specify country and presentment currency code. */
    CheckoutErrorCode["InvalidCountryAndCurrency"] = "INVALID_COUNTRY_AND_CURRENCY";
    /** Input Zip is invalid for country provided. */
    CheckoutErrorCode["InvalidForCountry"] = "INVALID_FOR_COUNTRY";
    /** Input Zip is invalid for country and province provided. */
    CheckoutErrorCode["InvalidForCountryAndProvince"] = "INVALID_FOR_COUNTRY_AND_PROVINCE";
    /** Invalid province in country. */
    CheckoutErrorCode["InvalidProvinceInCountry"] = "INVALID_PROVINCE_IN_COUNTRY";
    /** Queue token is invalid. */
    CheckoutErrorCode["InvalidQueueToken"] = "INVALID_QUEUE_TOKEN";
    /** Invalid region in country. */
    CheckoutErrorCode["InvalidRegionInCountry"] = "INVALID_REGION_IN_COUNTRY";
    /** Invalid state in country. */
    CheckoutErrorCode["InvalidStateInCountry"] = "INVALID_STATE_IN_COUNTRY";
    /** The input value should be less than the maximum value allowed. */
    CheckoutErrorCode["LessThan"] = "LESS_THAN";
    /** The input value should be less than or equal to the maximum value allowed. */
    CheckoutErrorCode["LessThanOrEqualTo"] = "LESS_THAN_OR_EQUAL_TO";
    /** Line item was not found in checkout. */
    CheckoutErrorCode["LineItemNotFound"] = "LINE_ITEM_NOT_FOUND";
    /** Checkout is locked. */
    CheckoutErrorCode["Locked"] = "LOCKED";
    /** Missing payment input. */
    CheckoutErrorCode["MissingPaymentInput"] = "MISSING_PAYMENT_INPUT";
    /** Not enough in stock. */
    CheckoutErrorCode["NotEnoughInStock"] = "NOT_ENOUGH_IN_STOCK";
    /** Input value is not supported. */
    CheckoutErrorCode["NotSupported"] = "NOT_SUPPORTED";
    /** The input value needs to be blank. */
    CheckoutErrorCode["Present"] = "PRESENT";
    /** Shipping rate expired. */
    CheckoutErrorCode["ShippingRateExpired"] = "SHIPPING_RATE_EXPIRED";
    /** Throttled during checkout. */
    CheckoutErrorCode["ThrottledDuringCheckout"] = "THROTTLED_DURING_CHECKOUT";
    /** The input value is too long. */
    CheckoutErrorCode["TooLong"] = "TOO_LONG";
    /** The amount of the payment does not match the value to be paid. */
    CheckoutErrorCode["TotalPriceMismatch"] = "TOTAL_PRICE_MISMATCH";
    /** Unable to apply discount. */
    CheckoutErrorCode["UnableToApply"] = "UNABLE_TO_APPLY";
})(CheckoutErrorCode || (CheckoutErrorCode = {}));
/** The set of valid sort keys for the Collection query. */
export var CollectionSortKeys;
(function (CollectionSortKeys) {
    /** Sort by the `id` value. */
    CollectionSortKeys["Id"] = "ID";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    CollectionSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `title` value. */
    CollectionSortKeys["Title"] = "TITLE";
    /** Sort by the `updated_at` value. */
    CollectionSortKeys["UpdatedAt"] = "UPDATED_AT";
})(CollectionSortKeys || (CollectionSortKeys = {}));
/**
 * The code designating a country/region, which generally follows ISO 3166-1 alpha-2 guidelines.
 * If a territory doesn't have a country code value in the `CountryCode` enum, it might be considered a subdivision
 * of another country. For example, the territories associated with Spain are represented by the country code `ES`,
 * and the territories associated with the United States of America are represented by the country code `US`.
 *
 */
export var CountryCode;
(function (CountryCode) {
    /** Ascension Island. */
    CountryCode["Ac"] = "AC";
    /** Andorra. */
    CountryCode["Ad"] = "AD";
    /** United Arab Emirates. */
    CountryCode["Ae"] = "AE";
    /** Afghanistan. */
    CountryCode["Af"] = "AF";
    /** Antigua & Barbuda. */
    CountryCode["Ag"] = "AG";
    /** Anguilla. */
    CountryCode["Ai"] = "AI";
    /** Albania. */
    CountryCode["Al"] = "AL";
    /** Armenia. */
    CountryCode["Am"] = "AM";
    /** Netherlands Antilles. */
    CountryCode["An"] = "AN";
    /** Angola. */
    CountryCode["Ao"] = "AO";
    /** Argentina. */
    CountryCode["Ar"] = "AR";
    /** Austria. */
    CountryCode["At"] = "AT";
    /** Australia. */
    CountryCode["Au"] = "AU";
    /** Aruba. */
    CountryCode["Aw"] = "AW";
    /** Åland Islands. */
    CountryCode["Ax"] = "AX";
    /** Azerbaijan. */
    CountryCode["Az"] = "AZ";
    /** Bosnia & Herzegovina. */
    CountryCode["Ba"] = "BA";
    /** Barbados. */
    CountryCode["Bb"] = "BB";
    /** Bangladesh. */
    CountryCode["Bd"] = "BD";
    /** Belgium. */
    CountryCode["Be"] = "BE";
    /** Burkina Faso. */
    CountryCode["Bf"] = "BF";
    /** Bulgaria. */
    CountryCode["Bg"] = "BG";
    /** Bahrain. */
    CountryCode["Bh"] = "BH";
    /** Burundi. */
    CountryCode["Bi"] = "BI";
    /** Benin. */
    CountryCode["Bj"] = "BJ";
    /** St. Barthélemy. */
    CountryCode["Bl"] = "BL";
    /** Bermuda. */
    CountryCode["Bm"] = "BM";
    /** Brunei. */
    CountryCode["Bn"] = "BN";
    /** Bolivia. */
    CountryCode["Bo"] = "BO";
    /** Caribbean Netherlands. */
    CountryCode["Bq"] = "BQ";
    /** Brazil. */
    CountryCode["Br"] = "BR";
    /** Bahamas. */
    CountryCode["Bs"] = "BS";
    /** Bhutan. */
    CountryCode["Bt"] = "BT";
    /** Bouvet Island. */
    CountryCode["Bv"] = "BV";
    /** Botswana. */
    CountryCode["Bw"] = "BW";
    /** Belarus. */
    CountryCode["By"] = "BY";
    /** Belize. */
    CountryCode["Bz"] = "BZ";
    /** Canada. */
    CountryCode["Ca"] = "CA";
    /** Cocos (Keeling) Islands. */
    CountryCode["Cc"] = "CC";
    /** Congo - Kinshasa. */
    CountryCode["Cd"] = "CD";
    /** Central African Republic. */
    CountryCode["Cf"] = "CF";
    /** Congo - Brazzaville. */
    CountryCode["Cg"] = "CG";
    /** Switzerland. */
    CountryCode["Ch"] = "CH";
    /** Côte d’Ivoire. */
    CountryCode["Ci"] = "CI";
    /** Cook Islands. */
    CountryCode["Ck"] = "CK";
    /** Chile. */
    CountryCode["Cl"] = "CL";
    /** Cameroon. */
    CountryCode["Cm"] = "CM";
    /** China. */
    CountryCode["Cn"] = "CN";
    /** Colombia. */
    CountryCode["Co"] = "CO";
    /** Costa Rica. */
    CountryCode["Cr"] = "CR";
    /** Cuba. */
    CountryCode["Cu"] = "CU";
    /** Cape Verde. */
    CountryCode["Cv"] = "CV";
    /** Curaçao. */
    CountryCode["Cw"] = "CW";
    /** Christmas Island. */
    CountryCode["Cx"] = "CX";
    /** Cyprus. */
    CountryCode["Cy"] = "CY";
    /** Czechia. */
    CountryCode["Cz"] = "CZ";
    /** Germany. */
    CountryCode["De"] = "DE";
    /** Djibouti. */
    CountryCode["Dj"] = "DJ";
    /** Denmark. */
    CountryCode["Dk"] = "DK";
    /** Dominica. */
    CountryCode["Dm"] = "DM";
    /** Dominican Republic. */
    CountryCode["Do"] = "DO";
    /** Algeria. */
    CountryCode["Dz"] = "DZ";
    /** Ecuador. */
    CountryCode["Ec"] = "EC";
    /** Estonia. */
    CountryCode["Ee"] = "EE";
    /** Egypt. */
    CountryCode["Eg"] = "EG";
    /** Western Sahara. */
    CountryCode["Eh"] = "EH";
    /** Eritrea. */
    CountryCode["Er"] = "ER";
    /** Spain. */
    CountryCode["Es"] = "ES";
    /** Ethiopia. */
    CountryCode["Et"] = "ET";
    /** Finland. */
    CountryCode["Fi"] = "FI";
    /** Fiji. */
    CountryCode["Fj"] = "FJ";
    /** Falkland Islands. */
    CountryCode["Fk"] = "FK";
    /** Faroe Islands. */
    CountryCode["Fo"] = "FO";
    /** France. */
    CountryCode["Fr"] = "FR";
    /** Gabon. */
    CountryCode["Ga"] = "GA";
    /** United Kingdom. */
    CountryCode["Gb"] = "GB";
    /** Grenada. */
    CountryCode["Gd"] = "GD";
    /** Georgia. */
    CountryCode["Ge"] = "GE";
    /** French Guiana. */
    CountryCode["Gf"] = "GF";
    /** Guernsey. */
    CountryCode["Gg"] = "GG";
    /** Ghana. */
    CountryCode["Gh"] = "GH";
    /** Gibraltar. */
    CountryCode["Gi"] = "GI";
    /** Greenland. */
    CountryCode["Gl"] = "GL";
    /** Gambia. */
    CountryCode["Gm"] = "GM";
    /** Guinea. */
    CountryCode["Gn"] = "GN";
    /** Guadeloupe. */
    CountryCode["Gp"] = "GP";
    /** Equatorial Guinea. */
    CountryCode["Gq"] = "GQ";
    /** Greece. */
    CountryCode["Gr"] = "GR";
    /** South Georgia & South Sandwich Islands. */
    CountryCode["Gs"] = "GS";
    /** Guatemala. */
    CountryCode["Gt"] = "GT";
    /** Guinea-Bissau. */
    CountryCode["Gw"] = "GW";
    /** Guyana. */
    CountryCode["Gy"] = "GY";
    /** Hong Kong SAR. */
    CountryCode["Hk"] = "HK";
    /** Heard & McDonald Islands. */
    CountryCode["Hm"] = "HM";
    /** Honduras. */
    CountryCode["Hn"] = "HN";
    /** Croatia. */
    CountryCode["Hr"] = "HR";
    /** Haiti. */
    CountryCode["Ht"] = "HT";
    /** Hungary. */
    CountryCode["Hu"] = "HU";
    /** Indonesia. */
    CountryCode["Id"] = "ID";
    /** Ireland. */
    CountryCode["Ie"] = "IE";
    /** Israel. */
    CountryCode["Il"] = "IL";
    /** Isle of Man. */
    CountryCode["Im"] = "IM";
    /** India. */
    CountryCode["In"] = "IN";
    /** British Indian Ocean Territory. */
    CountryCode["Io"] = "IO";
    /** Iraq. */
    CountryCode["Iq"] = "IQ";
    /** Iran. */
    CountryCode["Ir"] = "IR";
    /** Iceland. */
    CountryCode["Is"] = "IS";
    /** Italy. */
    CountryCode["It"] = "IT";
    /** Jersey. */
    CountryCode["Je"] = "JE";
    /** Jamaica. */
    CountryCode["Jm"] = "JM";
    /** Jordan. */
    CountryCode["Jo"] = "JO";
    /** Japan. */
    CountryCode["Jp"] = "JP";
    /** Kenya. */
    CountryCode["Ke"] = "KE";
    /** Kyrgyzstan. */
    CountryCode["Kg"] = "KG";
    /** Cambodia. */
    CountryCode["Kh"] = "KH";
    /** Kiribati. */
    CountryCode["Ki"] = "KI";
    /** Comoros. */
    CountryCode["Km"] = "KM";
    /** St. Kitts & Nevis. */
    CountryCode["Kn"] = "KN";
    /** North Korea. */
    CountryCode["Kp"] = "KP";
    /** South Korea. */
    CountryCode["Kr"] = "KR";
    /** Kuwait. */
    CountryCode["Kw"] = "KW";
    /** Cayman Islands. */
    CountryCode["Ky"] = "KY";
    /** Kazakhstan. */
    CountryCode["Kz"] = "KZ";
    /** Laos. */
    CountryCode["La"] = "LA";
    /** Lebanon. */
    CountryCode["Lb"] = "LB";
    /** St. Lucia. */
    CountryCode["Lc"] = "LC";
    /** Liechtenstein. */
    CountryCode["Li"] = "LI";
    /** Sri Lanka. */
    CountryCode["Lk"] = "LK";
    /** Liberia. */
    CountryCode["Lr"] = "LR";
    /** Lesotho. */
    CountryCode["Ls"] = "LS";
    /** Lithuania. */
    CountryCode["Lt"] = "LT";
    /** Luxembourg. */
    CountryCode["Lu"] = "LU";
    /** Latvia. */
    CountryCode["Lv"] = "LV";
    /** Libya. */
    CountryCode["Ly"] = "LY";
    /** Morocco. */
    CountryCode["Ma"] = "MA";
    /** Monaco. */
    CountryCode["Mc"] = "MC";
    /** Moldova. */
    CountryCode["Md"] = "MD";
    /** Montenegro. */
    CountryCode["Me"] = "ME";
    /** St. Martin. */
    CountryCode["Mf"] = "MF";
    /** Madagascar. */
    CountryCode["Mg"] = "MG";
    /** North Macedonia. */
    CountryCode["Mk"] = "MK";
    /** Mali. */
    CountryCode["Ml"] = "ML";
    /** Myanmar (Burma). */
    CountryCode["Mm"] = "MM";
    /** Mongolia. */
    CountryCode["Mn"] = "MN";
    /** Macao SAR. */
    CountryCode["Mo"] = "MO";
    /** Martinique. */
    CountryCode["Mq"] = "MQ";
    /** Mauritania. */
    CountryCode["Mr"] = "MR";
    /** Montserrat. */
    CountryCode["Ms"] = "MS";
    /** Malta. */
    CountryCode["Mt"] = "MT";
    /** Mauritius. */
    CountryCode["Mu"] = "MU";
    /** Maldives. */
    CountryCode["Mv"] = "MV";
    /** Malawi. */
    CountryCode["Mw"] = "MW";
    /** Mexico. */
    CountryCode["Mx"] = "MX";
    /** Malaysia. */
    CountryCode["My"] = "MY";
    /** Mozambique. */
    CountryCode["Mz"] = "MZ";
    /** Namibia. */
    CountryCode["Na"] = "NA";
    /** New Caledonia. */
    CountryCode["Nc"] = "NC";
    /** Niger. */
    CountryCode["Ne"] = "NE";
    /** Norfolk Island. */
    CountryCode["Nf"] = "NF";
    /** Nigeria. */
    CountryCode["Ng"] = "NG";
    /** Nicaragua. */
    CountryCode["Ni"] = "NI";
    /** Netherlands. */
    CountryCode["Nl"] = "NL";
    /** Norway. */
    CountryCode["No"] = "NO";
    /** Nepal. */
    CountryCode["Np"] = "NP";
    /** Nauru. */
    CountryCode["Nr"] = "NR";
    /** Niue. */
    CountryCode["Nu"] = "NU";
    /** New Zealand. */
    CountryCode["Nz"] = "NZ";
    /** Oman. */
    CountryCode["Om"] = "OM";
    /** Panama. */
    CountryCode["Pa"] = "PA";
    /** Peru. */
    CountryCode["Pe"] = "PE";
    /** French Polynesia. */
    CountryCode["Pf"] = "PF";
    /** Papua New Guinea. */
    CountryCode["Pg"] = "PG";
    /** Philippines. */
    CountryCode["Ph"] = "PH";
    /** Pakistan. */
    CountryCode["Pk"] = "PK";
    /** Poland. */
    CountryCode["Pl"] = "PL";
    /** St. Pierre & Miquelon. */
    CountryCode["Pm"] = "PM";
    /** Pitcairn Islands. */
    CountryCode["Pn"] = "PN";
    /** Palestinian Territories. */
    CountryCode["Ps"] = "PS";
    /** Portugal. */
    CountryCode["Pt"] = "PT";
    /** Paraguay. */
    CountryCode["Py"] = "PY";
    /** Qatar. */
    CountryCode["Qa"] = "QA";
    /** Réunion. */
    CountryCode["Re"] = "RE";
    /** Romania. */
    CountryCode["Ro"] = "RO";
    /** Serbia. */
    CountryCode["Rs"] = "RS";
    /** Russia. */
    CountryCode["Ru"] = "RU";
    /** Rwanda. */
    CountryCode["Rw"] = "RW";
    /** Saudi Arabia. */
    CountryCode["Sa"] = "SA";
    /** Solomon Islands. */
    CountryCode["Sb"] = "SB";
    /** Seychelles. */
    CountryCode["Sc"] = "SC";
    /** Sudan. */
    CountryCode["Sd"] = "SD";
    /** Sweden. */
    CountryCode["Se"] = "SE";
    /** Singapore. */
    CountryCode["Sg"] = "SG";
    /** St. Helena. */
    CountryCode["Sh"] = "SH";
    /** Slovenia. */
    CountryCode["Si"] = "SI";
    /** Svalbard & Jan Mayen. */
    CountryCode["Sj"] = "SJ";
    /** Slovakia. */
    CountryCode["Sk"] = "SK";
    /** Sierra Leone. */
    CountryCode["Sl"] = "SL";
    /** San Marino. */
    CountryCode["Sm"] = "SM";
    /** Senegal. */
    CountryCode["Sn"] = "SN";
    /** Somalia. */
    CountryCode["So"] = "SO";
    /** Suriname. */
    CountryCode["Sr"] = "SR";
    /** South Sudan. */
    CountryCode["Ss"] = "SS";
    /** São Tomé & Príncipe. */
    CountryCode["St"] = "ST";
    /** El Salvador. */
    CountryCode["Sv"] = "SV";
    /** Sint Maarten. */
    CountryCode["Sx"] = "SX";
    /** Syria. */
    CountryCode["Sy"] = "SY";
    /** Eswatini. */
    CountryCode["Sz"] = "SZ";
    /** Tristan da Cunha. */
    CountryCode["Ta"] = "TA";
    /** Turks & Caicos Islands. */
    CountryCode["Tc"] = "TC";
    /** Chad. */
    CountryCode["Td"] = "TD";
    /** French Southern Territories. */
    CountryCode["Tf"] = "TF";
    /** Togo. */
    CountryCode["Tg"] = "TG";
    /** Thailand. */
    CountryCode["Th"] = "TH";
    /** Tajikistan. */
    CountryCode["Tj"] = "TJ";
    /** Tokelau. */
    CountryCode["Tk"] = "TK";
    /** Timor-Leste. */
    CountryCode["Tl"] = "TL";
    /** Turkmenistan. */
    CountryCode["Tm"] = "TM";
    /** Tunisia. */
    CountryCode["Tn"] = "TN";
    /** Tonga. */
    CountryCode["To"] = "TO";
    /** Turkey. */
    CountryCode["Tr"] = "TR";
    /** Trinidad & Tobago. */
    CountryCode["Tt"] = "TT";
    /** Tuvalu. */
    CountryCode["Tv"] = "TV";
    /** Taiwan. */
    CountryCode["Tw"] = "TW";
    /** Tanzania. */
    CountryCode["Tz"] = "TZ";
    /** Ukraine. */
    CountryCode["Ua"] = "UA";
    /** Uganda. */
    CountryCode["Ug"] = "UG";
    /** U.S. Outlying Islands. */
    CountryCode["Um"] = "UM";
    /** United States. */
    CountryCode["Us"] = "US";
    /** Uruguay. */
    CountryCode["Uy"] = "UY";
    /** Uzbekistan. */
    CountryCode["Uz"] = "UZ";
    /** Vatican City. */
    CountryCode["Va"] = "VA";
    /** St. Vincent & Grenadines. */
    CountryCode["Vc"] = "VC";
    /** Venezuela. */
    CountryCode["Ve"] = "VE";
    /** British Virgin Islands. */
    CountryCode["Vg"] = "VG";
    /** Vietnam. */
    CountryCode["Vn"] = "VN";
    /** Vanuatu. */
    CountryCode["Vu"] = "VU";
    /** Wallis & Futuna. */
    CountryCode["Wf"] = "WF";
    /** Samoa. */
    CountryCode["Ws"] = "WS";
    /** Kosovo. */
    CountryCode["Xk"] = "XK";
    /** Yemen. */
    CountryCode["Ye"] = "YE";
    /** Mayotte. */
    CountryCode["Yt"] = "YT";
    /** South Africa. */
    CountryCode["Za"] = "ZA";
    /** Zambia. */
    CountryCode["Zm"] = "ZM";
    /** Zimbabwe. */
    CountryCode["Zw"] = "ZW";
    /** Unknown Region. */
    CountryCode["Zz"] = "ZZ";
})(CountryCode || (CountryCode = {}));
/** The part of the image that should remain after cropping. */
export var CropRegion;
(function (CropRegion) {
    /** Keep the bottom of the image. */
    CropRegion["Bottom"] = "BOTTOM";
    /** Keep the center of the image. */
    CropRegion["Center"] = "CENTER";
    /** Keep the left of the image. */
    CropRegion["Left"] = "LEFT";
    /** Keep the right of the image. */
    CropRegion["Right"] = "RIGHT";
    /** Keep the top of the image. */
    CropRegion["Top"] = "TOP";
})(CropRegion || (CropRegion = {}));
/**
 * The three-letter currency codes that represent the world currencies used in stores. These include standard ISO 4217 codes, legacy codes,
 * and non-standard codes.
 *
 */
export var CurrencyCode;
(function (CurrencyCode) {
    /** United Arab Emirates Dirham (AED). */
    CurrencyCode["Aed"] = "AED";
    /** Afghan Afghani (AFN). */
    CurrencyCode["Afn"] = "AFN";
    /** Albanian Lek (ALL). */
    CurrencyCode["All"] = "ALL";
    /** Armenian Dram (AMD). */
    CurrencyCode["Amd"] = "AMD";
    /** Netherlands Antillean Guilder. */
    CurrencyCode["Ang"] = "ANG";
    /** Angolan Kwanza (AOA). */
    CurrencyCode["Aoa"] = "AOA";
    /** Argentine Pesos (ARS). */
    CurrencyCode["Ars"] = "ARS";
    /** Australian Dollars (AUD). */
    CurrencyCode["Aud"] = "AUD";
    /** Aruban Florin (AWG). */
    CurrencyCode["Awg"] = "AWG";
    /** Azerbaijani Manat (AZN). */
    CurrencyCode["Azn"] = "AZN";
    /** Bosnia and Herzegovina Convertible Mark (BAM). */
    CurrencyCode["Bam"] = "BAM";
    /** Barbadian Dollar (BBD). */
    CurrencyCode["Bbd"] = "BBD";
    /** Bangladesh Taka (BDT). */
    CurrencyCode["Bdt"] = "BDT";
    /** Bulgarian Lev (BGN). */
    CurrencyCode["Bgn"] = "BGN";
    /** Bahraini Dinar (BHD). */
    CurrencyCode["Bhd"] = "BHD";
    /** Burundian Franc (BIF). */
    CurrencyCode["Bif"] = "BIF";
    /** Bermudian Dollar (BMD). */
    CurrencyCode["Bmd"] = "BMD";
    /** Brunei Dollar (BND). */
    CurrencyCode["Bnd"] = "BND";
    /** Bolivian Boliviano (BOB). */
    CurrencyCode["Bob"] = "BOB";
    /** Brazilian Real (BRL). */
    CurrencyCode["Brl"] = "BRL";
    /** Bahamian Dollar (BSD). */
    CurrencyCode["Bsd"] = "BSD";
    /** Bhutanese Ngultrum (BTN). */
    CurrencyCode["Btn"] = "BTN";
    /** Botswana Pula (BWP). */
    CurrencyCode["Bwp"] = "BWP";
    /** Belarusian Ruble (BYN). */
    CurrencyCode["Byn"] = "BYN";
    /** Belarusian Ruble (BYR). */
    CurrencyCode["Byr"] = "BYR";
    /** Belize Dollar (BZD). */
    CurrencyCode["Bzd"] = "BZD";
    /** Canadian Dollars (CAD). */
    CurrencyCode["Cad"] = "CAD";
    /** Congolese franc (CDF). */
    CurrencyCode["Cdf"] = "CDF";
    /** Swiss Francs (CHF). */
    CurrencyCode["Chf"] = "CHF";
    /** Chilean Peso (CLP). */
    CurrencyCode["Clp"] = "CLP";
    /** Chinese Yuan Renminbi (CNY). */
    CurrencyCode["Cny"] = "CNY";
    /** Colombian Peso (COP). */
    CurrencyCode["Cop"] = "COP";
    /** Costa Rican Colones (CRC). */
    CurrencyCode["Crc"] = "CRC";
    /** Cape Verdean escudo (CVE). */
    CurrencyCode["Cve"] = "CVE";
    /** Czech Koruny (CZK). */
    CurrencyCode["Czk"] = "CZK";
    /** Djiboutian Franc (DJF). */
    CurrencyCode["Djf"] = "DJF";
    /** Danish Kroner (DKK). */
    CurrencyCode["Dkk"] = "DKK";
    /** Dominican Peso (DOP). */
    CurrencyCode["Dop"] = "DOP";
    /** Algerian Dinar (DZD). */
    CurrencyCode["Dzd"] = "DZD";
    /** Egyptian Pound (EGP). */
    CurrencyCode["Egp"] = "EGP";
    /** Eritrean Nakfa (ERN). */
    CurrencyCode["Ern"] = "ERN";
    /** Ethiopian Birr (ETB). */
    CurrencyCode["Etb"] = "ETB";
    /** Euro (EUR). */
    CurrencyCode["Eur"] = "EUR";
    /** Fijian Dollars (FJD). */
    CurrencyCode["Fjd"] = "FJD";
    /** Falkland Islands Pounds (FKP). */
    CurrencyCode["Fkp"] = "FKP";
    /** United Kingdom Pounds (GBP). */
    CurrencyCode["Gbp"] = "GBP";
    /** Georgian Lari (GEL). */
    CurrencyCode["Gel"] = "GEL";
    /** Ghanaian Cedi (GHS). */
    CurrencyCode["Ghs"] = "GHS";
    /** Gibraltar Pounds (GIP). */
    CurrencyCode["Gip"] = "GIP";
    /** Gambian Dalasi (GMD). */
    CurrencyCode["Gmd"] = "GMD";
    /** Guinean Franc (GNF). */
    CurrencyCode["Gnf"] = "GNF";
    /** Guatemalan Quetzal (GTQ). */
    CurrencyCode["Gtq"] = "GTQ";
    /** Guyanese Dollar (GYD). */
    CurrencyCode["Gyd"] = "GYD";
    /** Hong Kong Dollars (HKD). */
    CurrencyCode["Hkd"] = "HKD";
    /** Honduran Lempira (HNL). */
    CurrencyCode["Hnl"] = "HNL";
    /** Croatian Kuna (HRK). */
    CurrencyCode["Hrk"] = "HRK";
    /** Haitian Gourde (HTG). */
    CurrencyCode["Htg"] = "HTG";
    /** Hungarian Forint (HUF). */
    CurrencyCode["Huf"] = "HUF";
    /** Indonesian Rupiah (IDR). */
    CurrencyCode["Idr"] = "IDR";
    /** Israeli New Shekel (NIS). */
    CurrencyCode["Ils"] = "ILS";
    /** Indian Rupees (INR). */
    CurrencyCode["Inr"] = "INR";
    /** Iraqi Dinar (IQD). */
    CurrencyCode["Iqd"] = "IQD";
    /** Iranian Rial (IRR). */
    CurrencyCode["Irr"] = "IRR";
    /** Icelandic Kronur (ISK). */
    CurrencyCode["Isk"] = "ISK";
    /** Jersey Pound. */
    CurrencyCode["Jep"] = "JEP";
    /** Jamaican Dollars (JMD). */
    CurrencyCode["Jmd"] = "JMD";
    /** Jordanian Dinar (JOD). */
    CurrencyCode["Jod"] = "JOD";
    /** Japanese Yen (JPY). */
    CurrencyCode["Jpy"] = "JPY";
    /** Kenyan Shilling (KES). */
    CurrencyCode["Kes"] = "KES";
    /** Kyrgyzstani Som (KGS). */
    CurrencyCode["Kgs"] = "KGS";
    /** Cambodian Riel. */
    CurrencyCode["Khr"] = "KHR";
    /** Kiribati Dollar (KID). */
    CurrencyCode["Kid"] = "KID";
    /** Comorian Franc (KMF). */
    CurrencyCode["Kmf"] = "KMF";
    /** South Korean Won (KRW). */
    CurrencyCode["Krw"] = "KRW";
    /** Kuwaiti Dinar (KWD). */
    CurrencyCode["Kwd"] = "KWD";
    /** Cayman Dollars (KYD). */
    CurrencyCode["Kyd"] = "KYD";
    /** Kazakhstani Tenge (KZT). */
    CurrencyCode["Kzt"] = "KZT";
    /** Laotian Kip (LAK). */
    CurrencyCode["Lak"] = "LAK";
    /** Lebanese Pounds (LBP). */
    CurrencyCode["Lbp"] = "LBP";
    /** Sri Lankan Rupees (LKR). */
    CurrencyCode["Lkr"] = "LKR";
    /** Liberian Dollar (LRD). */
    CurrencyCode["Lrd"] = "LRD";
    /** Lesotho Loti (LSL). */
    CurrencyCode["Lsl"] = "LSL";
    /** Lithuanian Litai (LTL). */
    CurrencyCode["Ltl"] = "LTL";
    /** Latvian Lati (LVL). */
    CurrencyCode["Lvl"] = "LVL";
    /** Libyan Dinar (LYD). */
    CurrencyCode["Lyd"] = "LYD";
    /** Moroccan Dirham. */
    CurrencyCode["Mad"] = "MAD";
    /** Moldovan Leu (MDL). */
    CurrencyCode["Mdl"] = "MDL";
    /** Malagasy Ariary (MGA). */
    CurrencyCode["Mga"] = "MGA";
    /** Macedonia Denar (MKD). */
    CurrencyCode["Mkd"] = "MKD";
    /** Burmese Kyat (MMK). */
    CurrencyCode["Mmk"] = "MMK";
    /** Mongolian Tugrik. */
    CurrencyCode["Mnt"] = "MNT";
    /** Macanese Pataca (MOP). */
    CurrencyCode["Mop"] = "MOP";
    /** Mauritanian Ouguiya (MRU). */
    CurrencyCode["Mru"] = "MRU";
    /** Mauritian Rupee (MUR). */
    CurrencyCode["Mur"] = "MUR";
    /** Maldivian Rufiyaa (MVR). */
    CurrencyCode["Mvr"] = "MVR";
    /** Malawian Kwacha (MWK). */
    CurrencyCode["Mwk"] = "MWK";
    /** Mexican Pesos (MXN). */
    CurrencyCode["Mxn"] = "MXN";
    /** Malaysian Ringgits (MYR). */
    CurrencyCode["Myr"] = "MYR";
    /** Mozambican Metical. */
    CurrencyCode["Mzn"] = "MZN";
    /** Namibian Dollar. */
    CurrencyCode["Nad"] = "NAD";
    /** Nigerian Naira (NGN). */
    CurrencyCode["Ngn"] = "NGN";
    /** Nicaraguan Córdoba (NIO). */
    CurrencyCode["Nio"] = "NIO";
    /** Norwegian Kroner (NOK). */
    CurrencyCode["Nok"] = "NOK";
    /** Nepalese Rupee (NPR). */
    CurrencyCode["Npr"] = "NPR";
    /** New Zealand Dollars (NZD). */
    CurrencyCode["Nzd"] = "NZD";
    /** Omani Rial (OMR). */
    CurrencyCode["Omr"] = "OMR";
    /** Panamian Balboa (PAB). */
    CurrencyCode["Pab"] = "PAB";
    /** Peruvian Nuevo Sol (PEN). */
    CurrencyCode["Pen"] = "PEN";
    /** Papua New Guinean Kina (PGK). */
    CurrencyCode["Pgk"] = "PGK";
    /** Philippine Peso (PHP). */
    CurrencyCode["Php"] = "PHP";
    /** Pakistani Rupee (PKR). */
    CurrencyCode["Pkr"] = "PKR";
    /** Polish Zlotych (PLN). */
    CurrencyCode["Pln"] = "PLN";
    /** Paraguayan Guarani (PYG). */
    CurrencyCode["Pyg"] = "PYG";
    /** Qatari Rial (QAR). */
    CurrencyCode["Qar"] = "QAR";
    /** Romanian Lei (RON). */
    CurrencyCode["Ron"] = "RON";
    /** Serbian dinar (RSD). */
    CurrencyCode["Rsd"] = "RSD";
    /** Russian Rubles (RUB). */
    CurrencyCode["Rub"] = "RUB";
    /** Rwandan Franc (RWF). */
    CurrencyCode["Rwf"] = "RWF";
    /** Saudi Riyal (SAR). */
    CurrencyCode["Sar"] = "SAR";
    /** Solomon Islands Dollar (SBD). */
    CurrencyCode["Sbd"] = "SBD";
    /** Seychellois Rupee (SCR). */
    CurrencyCode["Scr"] = "SCR";
    /** Sudanese Pound (SDG). */
    CurrencyCode["Sdg"] = "SDG";
    /** Swedish Kronor (SEK). */
    CurrencyCode["Sek"] = "SEK";
    /** Singapore Dollars (SGD). */
    CurrencyCode["Sgd"] = "SGD";
    /** Saint Helena Pounds (SHP). */
    CurrencyCode["Shp"] = "SHP";
    /** Sierra Leonean Leone (SLL). */
    CurrencyCode["Sll"] = "SLL";
    /** Somali Shilling (SOS). */
    CurrencyCode["Sos"] = "SOS";
    /** Surinamese Dollar (SRD). */
    CurrencyCode["Srd"] = "SRD";
    /** South Sudanese Pound (SSP). */
    CurrencyCode["Ssp"] = "SSP";
    /** Sao Tome And Principe Dobra (STD). */
    CurrencyCode["Std"] = "STD";
    /** Sao Tome And Principe Dobra (STN). */
    CurrencyCode["Stn"] = "STN";
    /** Syrian Pound (SYP). */
    CurrencyCode["Syp"] = "SYP";
    /** Swazi Lilangeni (SZL). */
    CurrencyCode["Szl"] = "SZL";
    /** Thai baht (THB). */
    CurrencyCode["Thb"] = "THB";
    /** Tajikistani Somoni (TJS). */
    CurrencyCode["Tjs"] = "TJS";
    /** Turkmenistani Manat (TMT). */
    CurrencyCode["Tmt"] = "TMT";
    /** Tunisian Dinar (TND). */
    CurrencyCode["Tnd"] = "TND";
    /** Tongan Pa'anga (TOP). */
    CurrencyCode["Top"] = "TOP";
    /** Turkish Lira (TRY). */
    CurrencyCode["Try"] = "TRY";
    /** Trinidad and Tobago Dollars (TTD). */
    CurrencyCode["Ttd"] = "TTD";
    /** Taiwan Dollars (TWD). */
    CurrencyCode["Twd"] = "TWD";
    /** Tanzanian Shilling (TZS). */
    CurrencyCode["Tzs"] = "TZS";
    /** Ukrainian Hryvnia (UAH). */
    CurrencyCode["Uah"] = "UAH";
    /** Ugandan Shilling (UGX). */
    CurrencyCode["Ugx"] = "UGX";
    /** United States Dollars (USD). */
    CurrencyCode["Usd"] = "USD";
    /** Uruguayan Pesos (UYU). */
    CurrencyCode["Uyu"] = "UYU";
    /** Uzbekistan som (UZS). */
    CurrencyCode["Uzs"] = "UZS";
    /** Venezuelan Bolivares (VED). */
    CurrencyCode["Ved"] = "VED";
    /** Venezuelan Bolivares (VEF). */
    CurrencyCode["Vef"] = "VEF";
    /** Venezuelan Bolivares (VES). */
    CurrencyCode["Ves"] = "VES";
    /** Vietnamese đồng (VND). */
    CurrencyCode["Vnd"] = "VND";
    /** Vanuatu Vatu (VUV). */
    CurrencyCode["Vuv"] = "VUV";
    /** Samoan Tala (WST). */
    CurrencyCode["Wst"] = "WST";
    /** Central African CFA Franc (XAF). */
    CurrencyCode["Xaf"] = "XAF";
    /** East Caribbean Dollar (XCD). */
    CurrencyCode["Xcd"] = "XCD";
    /** West African CFA franc (XOF). */
    CurrencyCode["Xof"] = "XOF";
    /** CFP Franc (XPF). */
    CurrencyCode["Xpf"] = "XPF";
    /** Unrecognized currency. */
    CurrencyCode["Xxx"] = "XXX";
    /** Yemeni Rial (YER). */
    CurrencyCode["Yer"] = "YER";
    /** South African Rand (ZAR). */
    CurrencyCode["Zar"] = "ZAR";
    /** Zambian Kwacha (ZMW). */
    CurrencyCode["Zmw"] = "ZMW";
})(CurrencyCode || (CurrencyCode = {}));
/** Possible error codes that can be returned by `CustomerUserError`. */
export var CustomerErrorCode;
(function (CustomerErrorCode) {
    /** Customer already enabled. */
    CustomerErrorCode["AlreadyEnabled"] = "ALREADY_ENABLED";
    /** Input email contains an invalid domain name. */
    CustomerErrorCode["BadDomain"] = "BAD_DOMAIN";
    /** The input value is blank. */
    CustomerErrorCode["Blank"] = "BLANK";
    /** Input contains HTML tags. */
    CustomerErrorCode["ContainsHtmlTags"] = "CONTAINS_HTML_TAGS";
    /** Input contains URL. */
    CustomerErrorCode["ContainsUrl"] = "CONTAINS_URL";
    /** Customer is disabled. */
    CustomerErrorCode["CustomerDisabled"] = "CUSTOMER_DISABLED";
    /** The input value is invalid. */
    CustomerErrorCode["Invalid"] = "INVALID";
    /** Multipass token is not valid. */
    CustomerErrorCode["InvalidMultipassRequest"] = "INVALID_MULTIPASS_REQUEST";
    /** Address does not exist. */
    CustomerErrorCode["NotFound"] = "NOT_FOUND";
    /** Input password starts or ends with whitespace. */
    CustomerErrorCode["PasswordStartsOrEndsWithWhitespace"] = "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE";
    /** The input value is already taken. */
    CustomerErrorCode["Taken"] = "TAKEN";
    /** Invalid activation token. */
    CustomerErrorCode["TokenInvalid"] = "TOKEN_INVALID";
    /** The input value is too long. */
    CustomerErrorCode["TooLong"] = "TOO_LONG";
    /** The input value is too short. */
    CustomerErrorCode["TooShort"] = "TOO_SHORT";
    /** Unidentified customer. */
    CustomerErrorCode["UnidentifiedCustomer"] = "UNIDENTIFIED_CUSTOMER";
})(CustomerErrorCode || (CustomerErrorCode = {}));
/** List of different delivery method types. */
export var DeliveryMethodType;
(function (DeliveryMethodType) {
    /** Local Delivery. */
    DeliveryMethodType["Local"] = "LOCAL";
    /** None. */
    DeliveryMethodType["None"] = "NONE";
    /** Shipping to a Pickup Point. */
    DeliveryMethodType["PickupPoint"] = "PICKUP_POINT";
    /** Local Pickup. */
    DeliveryMethodType["PickUp"] = "PICK_UP";
    /** Retail. */
    DeliveryMethodType["Retail"] = "RETAIL";
    /** Shipping. */
    DeliveryMethodType["Shipping"] = "SHIPPING";
})(DeliveryMethodType || (DeliveryMethodType = {}));
/** Digital wallet, such as Apple Pay, which can be used for accelerated checkouts. */
export var DigitalWallet;
(function (DigitalWallet) {
    /** Android Pay. */
    DigitalWallet["AndroidPay"] = "ANDROID_PAY";
    /** Apple Pay. */
    DigitalWallet["ApplePay"] = "APPLE_PAY";
    /** Google Pay. */
    DigitalWallet["GooglePay"] = "GOOGLE_PAY";
    /** Shopify Pay. */
    DigitalWallet["ShopifyPay"] = "SHOPIFY_PAY";
})(DigitalWallet || (DigitalWallet = {}));
/** The method by which the discount's value is allocated onto its entitled lines. */
export var DiscountApplicationAllocationMethod;
(function (DiscountApplicationAllocationMethod) {
    /** The value is spread across all entitled lines. */
    DiscountApplicationAllocationMethod["Across"] = "ACROSS";
    /** The value is applied onto every entitled line. */
    DiscountApplicationAllocationMethod["Each"] = "EACH";
    /** The value is specifically applied onto a particular line. */
    DiscountApplicationAllocationMethod["One"] = "ONE";
})(DiscountApplicationAllocationMethod || (DiscountApplicationAllocationMethod = {}));
/**
 * The lines on the order to which the discount is applied, of the type defined by
 * the discount application's `targetType`. For example, the value `ENTITLED`, combined with a `targetType` of
 * `LINE_ITEM`, applies the discount on all line items that are entitled to the discount.
 * The value `ALL`, combined with a `targetType` of `SHIPPING_LINE`, applies the discount on all shipping lines.
 *
 */
export var DiscountApplicationTargetSelection;
(function (DiscountApplicationTargetSelection) {
    /** The discount is allocated onto all the lines. */
    DiscountApplicationTargetSelection["All"] = "ALL";
    /** The discount is allocated onto only the lines that it's entitled for. */
    DiscountApplicationTargetSelection["Entitled"] = "ENTITLED";
    /** The discount is allocated onto explicitly chosen lines. */
    DiscountApplicationTargetSelection["Explicit"] = "EXPLICIT";
})(DiscountApplicationTargetSelection || (DiscountApplicationTargetSelection = {}));
/**
 * The type of line (i.e. line item or shipping line) on an order that the discount is applicable towards.
 *
 */
export var DiscountApplicationTargetType;
(function (DiscountApplicationTargetType) {
    /** The discount applies onto line items. */
    DiscountApplicationTargetType["LineItem"] = "LINE_ITEM";
    /** The discount applies onto shipping lines. */
    DiscountApplicationTargetType["ShippingLine"] = "SHIPPING_LINE";
})(DiscountApplicationTargetType || (DiscountApplicationTargetType = {}));
/**
 * The type of data that the filter group represents.
 *
 * For more information, refer to [Filter products in a collection with the Storefront API]
 * (https://shopify.dev/api/examples/filter-products).
 *
 */
export var FilterType;
(function (FilterType) {
    /** A boolean value. */
    FilterType["Boolean"] = "BOOLEAN";
    /** A list of selectable values. */
    FilterType["List"] = "LIST";
    /** A range of prices. */
    FilterType["PriceRange"] = "PRICE_RANGE";
})(FilterType || (FilterType = {}));
/** List of supported image content types. */
export var ImageContentType;
(function (ImageContentType) {
    /** A JPG image. */
    ImageContentType["Jpg"] = "JPG";
    /** A PNG image. */
    ImageContentType["Png"] = "PNG";
    /** A WEBP image. */
    ImageContentType["Webp"] = "WEBP";
})(ImageContentType || (ImageContentType = {}));
/** ISO 639-1 language codes supported by Shopify. */
export var LanguageCode;
(function (LanguageCode) {
    /** Afrikaans. */
    LanguageCode["Af"] = "AF";
    /** Akan. */
    LanguageCode["Ak"] = "AK";
    /** Amharic. */
    LanguageCode["Am"] = "AM";
    /** Arabic. */
    LanguageCode["Ar"] = "AR";
    /** Assamese. */
    LanguageCode["As"] = "AS";
    /** Azerbaijani. */
    LanguageCode["Az"] = "AZ";
    /** Belarusian. */
    LanguageCode["Be"] = "BE";
    /** Bulgarian. */
    LanguageCode["Bg"] = "BG";
    /** Bambara. */
    LanguageCode["Bm"] = "BM";
    /** Bangla. */
    LanguageCode["Bn"] = "BN";
    /** Tibetan. */
    LanguageCode["Bo"] = "BO";
    /** Breton. */
    LanguageCode["Br"] = "BR";
    /** Bosnian. */
    LanguageCode["Bs"] = "BS";
    /** Catalan. */
    LanguageCode["Ca"] = "CA";
    /** Chechen. */
    LanguageCode["Ce"] = "CE";
    /** Czech. */
    LanguageCode["Cs"] = "CS";
    /** Church Slavic. */
    LanguageCode["Cu"] = "CU";
    /** Welsh. */
    LanguageCode["Cy"] = "CY";
    /** Danish. */
    LanguageCode["Da"] = "DA";
    /** German. */
    LanguageCode["De"] = "DE";
    /** Dzongkha. */
    LanguageCode["Dz"] = "DZ";
    /** Ewe. */
    LanguageCode["Ee"] = "EE";
    /** Greek. */
    LanguageCode["El"] = "EL";
    /** English. */
    LanguageCode["En"] = "EN";
    /** Esperanto. */
    LanguageCode["Eo"] = "EO";
    /** Spanish. */
    LanguageCode["Es"] = "ES";
    /** Estonian. */
    LanguageCode["Et"] = "ET";
    /** Basque. */
    LanguageCode["Eu"] = "EU";
    /** Persian. */
    LanguageCode["Fa"] = "FA";
    /** Fulah. */
    LanguageCode["Ff"] = "FF";
    /** Finnish. */
    LanguageCode["Fi"] = "FI";
    /** Faroese. */
    LanguageCode["Fo"] = "FO";
    /** French. */
    LanguageCode["Fr"] = "FR";
    /** Western Frisian. */
    LanguageCode["Fy"] = "FY";
    /** Irish. */
    LanguageCode["Ga"] = "GA";
    /** Scottish Gaelic. */
    LanguageCode["Gd"] = "GD";
    /** Galician. */
    LanguageCode["Gl"] = "GL";
    /** Gujarati. */
    LanguageCode["Gu"] = "GU";
    /** Manx. */
    LanguageCode["Gv"] = "GV";
    /** Hausa. */
    LanguageCode["Ha"] = "HA";
    /** Hebrew. */
    LanguageCode["He"] = "HE";
    /** Hindi. */
    LanguageCode["Hi"] = "HI";
    /** Croatian. */
    LanguageCode["Hr"] = "HR";
    /** Hungarian. */
    LanguageCode["Hu"] = "HU";
    /** Armenian. */
    LanguageCode["Hy"] = "HY";
    /** Interlingua. */
    LanguageCode["Ia"] = "IA";
    /** Indonesian. */
    LanguageCode["Id"] = "ID";
    /** Igbo. */
    LanguageCode["Ig"] = "IG";
    /** Sichuan Yi. */
    LanguageCode["Ii"] = "II";
    /** Icelandic. */
    LanguageCode["Is"] = "IS";
    /** Italian. */
    LanguageCode["It"] = "IT";
    /** Japanese. */
    LanguageCode["Ja"] = "JA";
    /** Javanese. */
    LanguageCode["Jv"] = "JV";
    /** Georgian. */
    LanguageCode["Ka"] = "KA";
    /** Kikuyu. */
    LanguageCode["Ki"] = "KI";
    /** Kazakh. */
    LanguageCode["Kk"] = "KK";
    /** Kalaallisut. */
    LanguageCode["Kl"] = "KL";
    /** Khmer. */
    LanguageCode["Km"] = "KM";
    /** Kannada. */
    LanguageCode["Kn"] = "KN";
    /** Korean. */
    LanguageCode["Ko"] = "KO";
    /** Kashmiri. */
    LanguageCode["Ks"] = "KS";
    /** Kurdish. */
    LanguageCode["Ku"] = "KU";
    /** Cornish. */
    LanguageCode["Kw"] = "KW";
    /** Kyrgyz. */
    LanguageCode["Ky"] = "KY";
    /** Luxembourgish. */
    LanguageCode["Lb"] = "LB";
    /** Ganda. */
    LanguageCode["Lg"] = "LG";
    /** Lingala. */
    LanguageCode["Ln"] = "LN";
    /** Lao. */
    LanguageCode["Lo"] = "LO";
    /** Lithuanian. */
    LanguageCode["Lt"] = "LT";
    /** Luba-Katanga. */
    LanguageCode["Lu"] = "LU";
    /** Latvian. */
    LanguageCode["Lv"] = "LV";
    /** Malagasy. */
    LanguageCode["Mg"] = "MG";
    /** Maori. */
    LanguageCode["Mi"] = "MI";
    /** Macedonian. */
    LanguageCode["Mk"] = "MK";
    /** Malayalam. */
    LanguageCode["Ml"] = "ML";
    /** Mongolian. */
    LanguageCode["Mn"] = "MN";
    /** Marathi. */
    LanguageCode["Mr"] = "MR";
    /** Malay. */
    LanguageCode["Ms"] = "MS";
    /** Maltese. */
    LanguageCode["Mt"] = "MT";
    /** Burmese. */
    LanguageCode["My"] = "MY";
    /** Norwegian (Bokmål). */
    LanguageCode["Nb"] = "NB";
    /** North Ndebele. */
    LanguageCode["Nd"] = "ND";
    /** Nepali. */
    LanguageCode["Ne"] = "NE";
    /** Dutch. */
    LanguageCode["Nl"] = "NL";
    /** Norwegian Nynorsk. */
    LanguageCode["Nn"] = "NN";
    /** Norwegian. */
    LanguageCode["No"] = "NO";
    /** Oromo. */
    LanguageCode["Om"] = "OM";
    /** Odia. */
    LanguageCode["Or"] = "OR";
    /** Ossetic. */
    LanguageCode["Os"] = "OS";
    /** Punjabi. */
    LanguageCode["Pa"] = "PA";
    /** Polish. */
    LanguageCode["Pl"] = "PL";
    /** Pashto. */
    LanguageCode["Ps"] = "PS";
    /** Portuguese. */
    LanguageCode["Pt"] = "PT";
    /** Portuguese (Brazil). */
    LanguageCode["PtBr"] = "PT_BR";
    /** Portuguese (Portugal). */
    LanguageCode["PtPt"] = "PT_PT";
    /** Quechua. */
    LanguageCode["Qu"] = "QU";
    /** Romansh. */
    LanguageCode["Rm"] = "RM";
    /** Rundi. */
    LanguageCode["Rn"] = "RN";
    /** Romanian. */
    LanguageCode["Ro"] = "RO";
    /** Russian. */
    LanguageCode["Ru"] = "RU";
    /** Kinyarwanda. */
    LanguageCode["Rw"] = "RW";
    /** Sindhi. */
    LanguageCode["Sd"] = "SD";
    /** Northern Sami. */
    LanguageCode["Se"] = "SE";
    /** Sango. */
    LanguageCode["Sg"] = "SG";
    /** Sinhala. */
    LanguageCode["Si"] = "SI";
    /** Slovak. */
    LanguageCode["Sk"] = "SK";
    /** Slovenian. */
    LanguageCode["Sl"] = "SL";
    /** Shona. */
    LanguageCode["Sn"] = "SN";
    /** Somali. */
    LanguageCode["So"] = "SO";
    /** Albanian. */
    LanguageCode["Sq"] = "SQ";
    /** Serbian. */
    LanguageCode["Sr"] = "SR";
    /** Sundanese. */
    LanguageCode["Su"] = "SU";
    /** Swedish. */
    LanguageCode["Sv"] = "SV";
    /** Swahili. */
    LanguageCode["Sw"] = "SW";
    /** Tamil. */
    LanguageCode["Ta"] = "TA";
    /** Telugu. */
    LanguageCode["Te"] = "TE";
    /** Tajik. */
    LanguageCode["Tg"] = "TG";
    /** Thai. */
    LanguageCode["Th"] = "TH";
    /** Tigrinya. */
    LanguageCode["Ti"] = "TI";
    /** Turkmen. */
    LanguageCode["Tk"] = "TK";
    /** Tongan. */
    LanguageCode["To"] = "TO";
    /** Turkish. */
    LanguageCode["Tr"] = "TR";
    /** Tatar. */
    LanguageCode["Tt"] = "TT";
    /** Uyghur. */
    LanguageCode["Ug"] = "UG";
    /** Ukrainian. */
    LanguageCode["Uk"] = "UK";
    /** Urdu. */
    LanguageCode["Ur"] = "UR";
    /** Uzbek. */
    LanguageCode["Uz"] = "UZ";
    /** Vietnamese. */
    LanguageCode["Vi"] = "VI";
    /** Volapük. */
    LanguageCode["Vo"] = "VO";
    /** Wolof. */
    LanguageCode["Wo"] = "WO";
    /** Xhosa. */
    LanguageCode["Xh"] = "XH";
    /** Yiddish. */
    LanguageCode["Yi"] = "YI";
    /** Yoruba. */
    LanguageCode["Yo"] = "YO";
    /** Chinese. */
    LanguageCode["Zh"] = "ZH";
    /** Chinese (Simplified). */
    LanguageCode["ZhCn"] = "ZH_CN";
    /** Chinese (Traditional). */
    LanguageCode["ZhTw"] = "ZH_TW";
    /** Zulu. */
    LanguageCode["Zu"] = "ZU";
})(LanguageCode || (LanguageCode = {}));
/** The set of valid sort keys for the Location query. */
export var LocationSortKeys;
(function (LocationSortKeys) {
    /** Sort by the `city` value. */
    LocationSortKeys["City"] = "CITY";
    /** Sort by the `distance` value. */
    LocationSortKeys["Distance"] = "DISTANCE";
    /** Sort by the `id` value. */
    LocationSortKeys["Id"] = "ID";
    /** Sort by the `name` value. */
    LocationSortKeys["Name"] = "NAME";
})(LocationSortKeys || (LocationSortKeys = {}));
/** The possible content types for a media object. */
export var MediaContentType;
(function (MediaContentType) {
    /** An externally hosted video. */
    MediaContentType["ExternalVideo"] = "EXTERNAL_VIDEO";
    /** A Shopify hosted image. */
    MediaContentType["Image"] = "IMAGE";
    /** A 3d model. */
    MediaContentType["Model_3D"] = "MODEL_3D";
    /** A Shopify hosted video. */
    MediaContentType["Video"] = "VIDEO";
})(MediaContentType || (MediaContentType = {}));
/** Host for a Media Resource. */
export var MediaHost;
(function (MediaHost) {
    /** Host for Vimeo embedded videos. */
    MediaHost["Vimeo"] = "VIMEO";
    /** Host for YouTube embedded videos. */
    MediaHost["Youtube"] = "YOUTUBE";
})(MediaHost || (MediaHost = {}));
/** A menu item type. */
export var MenuItemType;
(function (MenuItemType) {
    /** An article link. */
    MenuItemType["Article"] = "ARTICLE";
    /** A blog link. */
    MenuItemType["Blog"] = "BLOG";
    /** A catalog link. */
    MenuItemType["Catalog"] = "CATALOG";
    /** A collection link. */
    MenuItemType["Collection"] = "COLLECTION";
    /** A collection link. */
    MenuItemType["Collections"] = "COLLECTIONS";
    /** A frontpage link. */
    MenuItemType["Frontpage"] = "FRONTPAGE";
    /** An http link. */
    MenuItemType["Http"] = "HTTP";
    /** A page link. */
    MenuItemType["Page"] = "PAGE";
    /** A product link. */
    MenuItemType["Product"] = "PRODUCT";
    /** A search link. */
    MenuItemType["Search"] = "SEARCH";
    /** A shop policy link. */
    MenuItemType["ShopPolicy"] = "SHOP_POLICY";
})(MenuItemType || (MenuItemType = {}));
/** Represents the reason for the order's cancellation. */
export var OrderCancelReason;
(function (OrderCancelReason) {
    /** The customer wanted to cancel the order. */
    OrderCancelReason["Customer"] = "CUSTOMER";
    /** Payment was declined. */
    OrderCancelReason["Declined"] = "DECLINED";
    /** The order was fraudulent. */
    OrderCancelReason["Fraud"] = "FRAUD";
    /** There was insufficient inventory. */
    OrderCancelReason["Inventory"] = "INVENTORY";
    /** The order was canceled for an unlisted reason. */
    OrderCancelReason["Other"] = "OTHER";
})(OrderCancelReason || (OrderCancelReason = {}));
/** Represents the order's current financial status. */
export var OrderFinancialStatus;
(function (OrderFinancialStatus) {
    /** Displayed as **Authorized**. */
    OrderFinancialStatus["Authorized"] = "AUTHORIZED";
    /** Displayed as **Paid**. */
    OrderFinancialStatus["Paid"] = "PAID";
    /** Displayed as **Partially paid**. */
    OrderFinancialStatus["PartiallyPaid"] = "PARTIALLY_PAID";
    /** Displayed as **Partially refunded**. */
    OrderFinancialStatus["PartiallyRefunded"] = "PARTIALLY_REFUNDED";
    /** Displayed as **Pending**. */
    OrderFinancialStatus["Pending"] = "PENDING";
    /** Displayed as **Refunded**. */
    OrderFinancialStatus["Refunded"] = "REFUNDED";
    /** Displayed as **Voided**. */
    OrderFinancialStatus["Voided"] = "VOIDED";
})(OrderFinancialStatus || (OrderFinancialStatus = {}));
/** Represents the order's aggregated fulfillment status for display purposes. */
export var OrderFulfillmentStatus;
(function (OrderFulfillmentStatus) {
    /** Displayed as **Fulfilled**. All of the items in the order have been fulfilled. */
    OrderFulfillmentStatus["Fulfilled"] = "FULFILLED";
    /** Displayed as **In progress**. Some of the items in the order have been fulfilled, or a request for fulfillment has been sent to the fulfillment service. */
    OrderFulfillmentStatus["InProgress"] = "IN_PROGRESS";
    /** Displayed as **On hold**. All of the unfulfilled items in this order are on hold. */
    OrderFulfillmentStatus["OnHold"] = "ON_HOLD";
    /** Displayed as **Open**. None of the items in the order have been fulfilled. Replaced by "UNFULFILLED" status. */
    OrderFulfillmentStatus["Open"] = "OPEN";
    /** Displayed as **Partially fulfilled**. Some of the items in the order have been fulfilled. */
    OrderFulfillmentStatus["PartiallyFulfilled"] = "PARTIALLY_FULFILLED";
    /** Displayed as **Pending fulfillment**. A request for fulfillment of some items awaits a response from the fulfillment service. Replaced by "IN_PROGRESS" status. */
    OrderFulfillmentStatus["PendingFulfillment"] = "PENDING_FULFILLMENT";
    /** Displayed as **Restocked**. All of the items in the order have been restocked. Replaced by "UNFULFILLED" status. */
    OrderFulfillmentStatus["Restocked"] = "RESTOCKED";
    /** Displayed as **Scheduled**. All of the unfulfilled items in this order are scheduled for fulfillment at later time. */
    OrderFulfillmentStatus["Scheduled"] = "SCHEDULED";
    /** Displayed as **Unfulfilled**. None of the items in the order have been fulfilled. */
    OrderFulfillmentStatus["Unfulfilled"] = "UNFULFILLED";
})(OrderFulfillmentStatus || (OrderFulfillmentStatus = {}));
/** The set of valid sort keys for the Order query. */
export var OrderSortKeys;
(function (OrderSortKeys) {
    /** Sort by the `id` value. */
    OrderSortKeys["Id"] = "ID";
    /** Sort by the `processed_at` value. */
    OrderSortKeys["ProcessedAt"] = "PROCESSED_AT";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    OrderSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `total_price` value. */
    OrderSortKeys["TotalPrice"] = "TOTAL_PRICE";
})(OrderSortKeys || (OrderSortKeys = {}));
/** The set of valid sort keys for the Page query. */
export var PageSortKeys;
(function (PageSortKeys) {
    /** Sort by the `id` value. */
    PageSortKeys["Id"] = "ID";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    PageSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `title` value. */
    PageSortKeys["Title"] = "TITLE";
    /** Sort by the `updated_at` value. */
    PageSortKeys["UpdatedAt"] = "UPDATED_AT";
})(PageSortKeys || (PageSortKeys = {}));
/** The valid values for the types of payment token. */
export var PaymentTokenType;
(function (PaymentTokenType) {
    /** Apple Pay token type. */
    PaymentTokenType["ApplePay"] = "APPLE_PAY";
    /** Google Pay token type. */
    PaymentTokenType["GooglePay"] = "GOOGLE_PAY";
    /** Shopify Pay token type. */
    PaymentTokenType["ShopifyPay"] = "SHOPIFY_PAY";
    /** Stripe token type. */
    PaymentTokenType["StripeVaultToken"] = "STRIPE_VAULT_TOKEN";
    /** Vault payment token type. */
    PaymentTokenType["Vault"] = "VAULT";
})(PaymentTokenType || (PaymentTokenType = {}));
/** The set of valid sort keys for the ProductCollection query. */
export var ProductCollectionSortKeys;
(function (ProductCollectionSortKeys) {
    /** Sort by the `best-selling` value. */
    ProductCollectionSortKeys["BestSelling"] = "BEST_SELLING";
    /** Sort by the `collection-default` value. */
    ProductCollectionSortKeys["CollectionDefault"] = "COLLECTION_DEFAULT";
    /** Sort by the `created` value. */
    ProductCollectionSortKeys["Created"] = "CREATED";
    /** Sort by the `id` value. */
    ProductCollectionSortKeys["Id"] = "ID";
    /** Sort by the `manual` value. */
    ProductCollectionSortKeys["Manual"] = "MANUAL";
    /** Sort by the `price` value. */
    ProductCollectionSortKeys["Price"] = "PRICE";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    ProductCollectionSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `title` value. */
    ProductCollectionSortKeys["Title"] = "TITLE";
})(ProductCollectionSortKeys || (ProductCollectionSortKeys = {}));
/** The set of valid sort keys for the ProductImage query. */
export var ProductImageSortKeys;
(function (ProductImageSortKeys) {
    /** Sort by the `created_at` value. */
    ProductImageSortKeys["CreatedAt"] = "CREATED_AT";
    /** Sort by the `id` value. */
    ProductImageSortKeys["Id"] = "ID";
    /** Sort by the `position` value. */
    ProductImageSortKeys["Position"] = "POSITION";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    ProductImageSortKeys["Relevance"] = "RELEVANCE";
})(ProductImageSortKeys || (ProductImageSortKeys = {}));
/** The set of valid sort keys for the ProductMedia query. */
export var ProductMediaSortKeys;
(function (ProductMediaSortKeys) {
    /** Sort by the `id` value. */
    ProductMediaSortKeys["Id"] = "ID";
    /** Sort by the `position` value. */
    ProductMediaSortKeys["Position"] = "POSITION";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    ProductMediaSortKeys["Relevance"] = "RELEVANCE";
})(ProductMediaSortKeys || (ProductMediaSortKeys = {}));
/** The set of valid sort keys for the Product query. */
export var ProductSortKeys;
(function (ProductSortKeys) {
    /** Sort by the `best_selling` value. */
    ProductSortKeys["BestSelling"] = "BEST_SELLING";
    /** Sort by the `created_at` value. */
    ProductSortKeys["CreatedAt"] = "CREATED_AT";
    /** Sort by the `id` value. */
    ProductSortKeys["Id"] = "ID";
    /** Sort by the `price` value. */
    ProductSortKeys["Price"] = "PRICE";
    /** Sort by the `product_type` value. */
    ProductSortKeys["ProductType"] = "PRODUCT_TYPE";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    ProductSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `title` value. */
    ProductSortKeys["Title"] = "TITLE";
    /** Sort by the `updated_at` value. */
    ProductSortKeys["UpdatedAt"] = "UPDATED_AT";
    /** Sort by the `vendor` value. */
    ProductSortKeys["Vendor"] = "VENDOR";
})(ProductSortKeys || (ProductSortKeys = {}));
/** The set of valid sort keys for the ProductVariant query. */
export var ProductVariantSortKeys;
(function (ProductVariantSortKeys) {
    /** Sort by the `id` value. */
    ProductVariantSortKeys["Id"] = "ID";
    /** Sort by the `position` value. */
    ProductVariantSortKeys["Position"] = "POSITION";
    /**
     * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
     * Don't use this sort key when no search query is specified.
     *
     */
    ProductVariantSortKeys["Relevance"] = "RELEVANCE";
    /** Sort by the `sku` value. */
    ProductVariantSortKeys["Sku"] = "SKU";
    /** Sort by the `title` value. */
    ProductVariantSortKeys["Title"] = "TITLE";
})(ProductVariantSortKeys || (ProductVariantSortKeys = {}));
/** The checkout charge when the full amount isn't charged at checkout. */
export var SellingPlanCheckoutChargeType;
(function (SellingPlanCheckoutChargeType) {
    /** The checkout charge is a percentage of the product or variant price. */
    SellingPlanCheckoutChargeType["Percentage"] = "PERCENTAGE";
    /** The checkout charge is a fixed price amount. */
    SellingPlanCheckoutChargeType["Price"] = "PRICE";
})(SellingPlanCheckoutChargeType || (SellingPlanCheckoutChargeType = {}));
/** The different kinds of order transactions. */
export var TransactionKind;
(function (TransactionKind) {
    /**
     * An amount reserved against the cardholder's funding source.
     * Money does not change hands until the authorization is captured.
     *
     */
    TransactionKind["Authorization"] = "AUTHORIZATION";
    /** A transfer of the money that was reserved during the authorization stage. */
    TransactionKind["Capture"] = "CAPTURE";
    /** Money returned to the customer when they have paid too much. */
    TransactionKind["Change"] = "CHANGE";
    /** An authorization for a payment taken with an EMV credit card reader. */
    TransactionKind["EmvAuthorization"] = "EMV_AUTHORIZATION";
    /** An authorization and capture performed together in a single step. */
    TransactionKind["Sale"] = "SALE";
})(TransactionKind || (TransactionKind = {}));
/** Transaction statuses describe the status of a transaction. */
export var TransactionStatus;
(function (TransactionStatus) {
    /** There was an error while processing the transaction. */
    TransactionStatus["Error"] = "ERROR";
    /** The transaction failed. */
    TransactionStatus["Failure"] = "FAILURE";
    /** The transaction is pending. */
    TransactionStatus["Pending"] = "PENDING";
    /** The transaction succeeded. */
    TransactionStatus["Success"] = "SUCCESS";
})(TransactionStatus || (TransactionStatus = {}));
/** The accepted types of unit of measurement. */
export var UnitPriceMeasurementMeasuredType;
(function (UnitPriceMeasurementMeasuredType) {
    /** Unit of measurements representing areas. */
    UnitPriceMeasurementMeasuredType["Area"] = "AREA";
    /** Unit of measurements representing lengths. */
    UnitPriceMeasurementMeasuredType["Length"] = "LENGTH";
    /** Unit of measurements representing volumes. */
    UnitPriceMeasurementMeasuredType["Volume"] = "VOLUME";
    /** Unit of measurements representing weights. */
    UnitPriceMeasurementMeasuredType["Weight"] = "WEIGHT";
})(UnitPriceMeasurementMeasuredType || (UnitPriceMeasurementMeasuredType = {}));
/** The valid units of measurement for a unit price measurement. */
export var UnitPriceMeasurementMeasuredUnit;
(function (UnitPriceMeasurementMeasuredUnit) {
    /** 100 centiliters equals 1 liter. */
    UnitPriceMeasurementMeasuredUnit["Cl"] = "CL";
    /** 100 centimeters equals 1 meter. */
    UnitPriceMeasurementMeasuredUnit["Cm"] = "CM";
    /** Metric system unit of weight. */
    UnitPriceMeasurementMeasuredUnit["G"] = "G";
    /** 1 kilogram equals 1000 grams. */
    UnitPriceMeasurementMeasuredUnit["Kg"] = "KG";
    /** Metric system unit of volume. */
    UnitPriceMeasurementMeasuredUnit["L"] = "L";
    /** Metric system unit of length. */
    UnitPriceMeasurementMeasuredUnit["M"] = "M";
    /** Metric system unit of area. */
    UnitPriceMeasurementMeasuredUnit["M2"] = "M2";
    /** 1 cubic meter equals 1000 liters. */
    UnitPriceMeasurementMeasuredUnit["M3"] = "M3";
    /** 1000 milligrams equals 1 gram. */
    UnitPriceMeasurementMeasuredUnit["Mg"] = "MG";
    /** 1000 milliliters equals 1 liter. */
    UnitPriceMeasurementMeasuredUnit["Ml"] = "ML";
    /** 1000 millimeters equals 1 meter. */
    UnitPriceMeasurementMeasuredUnit["Mm"] = "MM";
})(UnitPriceMeasurementMeasuredUnit || (UnitPriceMeasurementMeasuredUnit = {}));
/** Systems of weights and measures. */
export var UnitSystem;
(function (UnitSystem) {
    /** Imperial system of weights and measures. */
    UnitSystem["ImperialSystem"] = "IMPERIAL_SYSTEM";
    /** Metric system of weights and measures. */
    UnitSystem["MetricSystem"] = "METRIC_SYSTEM";
})(UnitSystem || (UnitSystem = {}));
/** Units of measurement for weight. */
export var WeightUnit;
(function (WeightUnit) {
    /** Metric system unit of mass. */
    WeightUnit["Grams"] = "GRAMS";
    /** 1 kilogram equals 1000 grams. */
    WeightUnit["Kilograms"] = "KILOGRAMS";
    /** Imperial system unit of mass. */
    WeightUnit["Ounces"] = "OUNCES";
    /** 1 pound equals 16 ounces. */
    WeightUnit["Pounds"] = "POUNDS";
})(WeightUnit || (WeightUnit = {}));
