export interface MultipassResponse {
  /* the multipass-authenticated targetUrl */
  url: string | null;
  /* the multipass-authenticated token */
  token: string | null;
  /* Errors that occurred while authenticating via multipass. Includes any errors return from /multipass api route */
  error?: string | null;
}

export interface MultipassCustomer {
  /* The customer email of the customer used during authentication */
  email: string;
  /* The `targetUrl` passed in for authentication */
  return_to: string;
  /* additional customer properties such as `acceptsMarketing`, addresses etc. */
  [key: string]: string | boolean | object | object[];
}

export interface MultipassCustomerData {
  customer?: MultipassCustomer;
}

export interface CustomerInfoType {
  email: string;
  return_to: string;
  [key: string]: string | boolean | object | object[];
}
export interface MultipassRequestBody {
  customer?: CustomerInfoType;
  return_to?: string;
}

export interface CustomerDataResponseType {
  data: MultipassRequestBody;
  errors: string | null;
}

export interface NotAuthResponse {
  url: string | null;
  error: string | null;
}

export interface NotLoggedInResponseType {
  url: string | null;
  error: string | null;
}

export interface NotAuthResponse {
  url: string | null;
  error: string | null;
}

interface MultipassBaseOptions {
  /* required */
  redirect: boolean;
  shopDomain: string;
}

interface MultipassCustomerOption extends MultipassBaseOptions {
  customer: MultipassCustomer;
  return_to?: never;
}

interface MultipassReturnToOption extends MultipassBaseOptions {
  return_to: string;
  customer?: never;
}

/* `redirect_to` is required with either `customer` or `return_to` */
export type MultipassOptions =
  | MultipassCustomerOption
  | MultipassReturnToOption;
