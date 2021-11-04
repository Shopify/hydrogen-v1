import {useShopQuery, flattenConnection} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Button from '../components/Button.client';

function Header() {
  return (
    <div className="bg-black text-white py-5 px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <svg
        aria-hidden="true"
        width="171"
        height="34"
        viewBox="0 0 171 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.8778 33.1462.735582 25.0518 5.9143 22.3054l5.8305 3.1152 4.8922-2.5949-5.8305-3.1153 5.1787-2.753 15.1422 8.0944-5.1787 2.7464-5.5082-2.944-4.8994 2.6016 5.5154 2.944-5.1787 2.7464Z"
          fill="#fff"
        />
        <path
          d="M15.8779 17.0447.735722 8.9503 5.91444 6.20387 11.745 9.31913l4.8922-2.59495-5.8306-3.11526L15.9854.855896 31.1276 8.9503l-5.1787 2.7464-5.5083-2.94398-4.8993 2.60158 5.5153 2.944-5.1787 2.7464Z"
          fill="url(#a)"
        />
        <path
          d="M44.8282 11.3157v11.8448h4.2353v-4.5466h5.1524v4.5466h4.2686V11.3157h-4.2686v4.3118h-5.1357v-4.3118h-4.252ZM64.8954 11.3157h-4.9189l5.4025 8.3216v3.5232h4.1853v-3.5232l5.3358-8.3216h-4.8689l-1.8342 3.322c-.2501.52-.5003 1.0569-.717 1.577-.1001-.2013-.1834-.4026-.2835-.604-.1167-.2516-.2334-.4865-.3501-.7214l-1.951-3.5736ZM76.4508 11.3157v11.8448h7.4701c1.1839-.0335 1.6175-.0839 2.2177-.2349.717-.1845 1.2506-.4697 1.5007-.6039.7004-.4027 1.1005-.8389 1.3173-1.0738 1.1839-1.4261 1.2506-3.3387 1.2506-3.8755 0-.6376-.0334-2.1475-1.0338-3.5904-.7003-1.0234-1.9009-2.181-4.6355-2.4159-.4669-.0336-.9338-.0504-1.4007-.0504h-6.6864Zm4.1186 2.8186h2.0176c.2835 0 1.534-.0335 2.4178.6376 1.0338.8053 1.0838 2.1307 1.0838 2.4998 0 .3188-.0167.9563-.3835 1.7113-.2835.604-.8004 1.2583-2.251 1.4428-.2502.0336-.5003.0504-.7337.0504h-2.151v-6.3419ZM92.3581 11.3157v11.8448h4.2353v-4.3117h2.2343l2.4343 4.3117h4.652l-2.934-4.7312c.6-.151.817-.2349 1.1-.4026 1.484-.8221 1.601-2.3992 1.601-2.9528 0-1.0738-.367-1.7784-.6-2.1308-.934-1.5099-2.468-1.6106-4.052-1.6274h-8.6709Zm4.2353 2.6844h3.5016c.45.0168.917.0671 1.201.4866.166.2348.183.5033.183.6039 0 .1343-.017.4027-.233.6711-.267.3188-.684.4027-1.4845.4195h-3.1681v-2.1811ZM114.752 10.8795c-2.635.0336-4.069.6376-5.069 1.3254-.967.6544-2.551 2.1475-2.551 5.1339 0 .755.05 2.2985 1.3 3.8252.584.7047 1.167 1.0906 1.484 1.2751.951.5704 2.468 1.1241 4.969 1.1241 1.668 0 2.701-.2013 3.385-.4027.7-.2013 1.301-.4865 1.918-.9059 2.384-1.6274 2.601-4.0098 2.601-5.0668 0-1.7952-.684-3.0199-1.067-3.5903-.817-1.1745-2.268-2.3992-5.386-2.6676-.534-.0336-1.051-.0504-1.584-.0504Zm.25 2.6341c.634 0 .95.0839 1.25.1845.567.2013.951.5201 1.134.6711.417.4027 1.068 1.3422 1.068 2.8522 0 1.3421-.534 2.8521-1.851 3.4393-.634.2852-1.384.2852-1.584.2852-.717 0-2.618-.151-3.319-2.2649-.216-.6208-.233-1.2248-.233-1.4429 0-1.4428.634-2.8689 2.018-3.4561.516-.2181.967-.2684 1.517-.2684ZM139.43 14.0337s-.167-.4027-.3-.604c-.2-.3356-.484-.6543-.784-.9228-.2-.2013-.584-.5368-1.217-.8556-1.718-.8389-4.085-.8724-4.519-.8724-3.568 0-5.486 1.1912-6.586 2.3823-1.468 1.6107-1.568 3.4394-1.568 4.2279 0 1.6945.584 2.8857.951 3.4226.166.2684.533.755 1.184 1.2583 1.784 1.3925 3.835 1.4429 4.585 1.4429 2.001 0 3.152-.4698 3.919-.8892.617-.3356.8-.5201 1.067-.7718v1.3086h3.651v-7.0968h-7.02v2.6844h3.069c-.034.1342-.067.2852-.084.3188-.3.6711-1.434 1.7448-3.335 1.7448-1.05 0-2.184-.3691-2.868-1.1912-.75-.8724-.783-1.9797-.783-2.3488 0-1.7784.983-2.7515 1.517-3.1374.934-.6711 2.001-.6878 2.368-.6878 1.45 0 2.184.6039 2.584 1.0402l4.169-.453ZM154.737 11.3157h-12.422v11.8448h12.572v-2.6843h-8.354v-1.8959h7.587v-2.6676h-7.587v-1.9461h8.204v-2.6509ZM156.905 11.3157v11.8448h4.168v-2.5166c-.016-1.3254-.033-2.6676-.066-4.0097.417.5368.867 1.0905 1.334 1.6274l4.318 4.8989h3.502V11.3157h-4.152v4.3454c.017.7885.05 1.4596.083 2.1307-.3-.4027-.617-.8053-.95-1.1912-.35-.4362-.75-.8556-1.134-1.2919l-3.618-3.993h-3.485Z"
          fill="#fff"
        />
        <defs>
          <linearGradient
            id="a"
            x1="30.5576"
            y1="9.57961"
            x2="8.17565"
            y2="21.5672"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".00224366" stopColor="#430470" />
            <stop offset=".385468" stopColor="#8E01F0" />
            <stop offset=".635473" stopColor="#354CF6" />
            <stop offset="1" stopColor="#01FFFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-center center space-x-10">
        <a
          href="https://github.com/Shopify/hydrogen/discussions"
          className="text-sm font-bold font-mono underline flex items-center"
          target="_blank"
          rel="noreferrer"
        >
          Give Feedback
          <svg
            aria-hidden="true"
            className="fill-current text-white ml-2"
            width="15"
            height="14"
            viewBox="0 0 15 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.11963 0.000976562C7.56734 0.000976562 7.11963 0.448692 7.11963 1.00098C7.11963 1.55326 7.56734 2.00098 8.11963 2.00098H10.7054L4.41252 8.29387C4.022 8.68439 4.022 9.31756 4.41252 9.70808C4.80305 10.0986 5.43621 10.0986 5.82674 9.70808L12.1196 3.41519V6.00098C12.1196 6.55326 12.5673 7.00098 13.1196 7.00098C13.6719 7.00098 14.1196 6.55326 14.1196 6.00098V1.00098C14.1196 0.448692 13.6719 0.000976562 13.1196 0.000976562H8.11963Z" />
            <path d="M2.11963 2.00098C1.01506 2.00098 0.119629 2.89641 0.119629 4.00098V12.001C0.119629 13.1055 1.01506 14.001 2.11963 14.001H10.1196C11.2242 14.001 12.1196 13.1055 12.1196 12.001V9.00098C12.1196 8.44869 11.6719 8.00098 11.1196 8.00098C10.5673 8.00098 10.1196 8.44869 10.1196 9.00098V12.001H2.11963V4.00098L5.11963 4.00098C5.67191 4.00098 6.11963 3.55326 6.11963 3.00098C6.11963 2.44869 5.67191 2.00098 5.11963 2.00098H2.11963Z" />
          </svg>
        </a>
        <div className="flex items-center space-x-4">
          <a
            href="https://discord.gg/ppSbThrFaS"
            target="_blank"
            rel="noreferrer"
          >
            <span className="sr-only">Discord</span>
            <svg
              aria-hidden="true"
              className="fill-current text-white"
              width="26"
              height="20"
              viewBox="0 0 26 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.3103 1.67597C19.691 0.893476 17.9595 0.324791 16.1494 0.000976562C15.9271 0.416095 15.6673 0.974439 15.4883 1.4186C13.564 1.11972 11.6574 1.11972 9.76855 1.4186C9.58952 0.974439 9.3239 0.416095 9.0996 0.000976562C7.28746 0.324791 5.55403 0.895566 3.93472 1.68012C0.668559 6.77767 -0.216844 11.7486 0.225859 16.649C2.39215 18.3198 4.49155 19.3348 6.55551 19.9989C7.06512 19.2745 7.51962 18.5045 7.91116 17.693C7.16546 17.4003 6.45123 17.0392 5.77638 16.6199C5.95541 16.4829 6.13054 16.3397 6.29973 16.1923C10.4159 18.1807 14.8882 18.1807 18.9551 16.1923C19.1263 16.3397 19.3014 16.4829 19.4785 16.6199C18.8016 17.0412 18.0855 17.4024 17.3398 17.6951C17.7313 18.5045 18.1838 19.2766 18.6954 20.001C20.7614 19.3368 22.8627 18.3219 25.029 16.649C25.5484 10.9682 24.1416 6.04292 21.3103 1.67597ZM8.47192 13.6353C7.2363 13.6353 6.22299 12.4439 6.22299 10.9931C6.22299 9.5423 7.21466 8.34886 8.47192 8.34886C9.72922 8.34886 10.7425 9.54021 10.7209 10.9931C10.7228 12.4439 9.72922 13.6353 8.47192 13.6353ZM16.7829 13.6353C15.5473 13.6353 14.534 12.4439 14.534 10.9931C14.534 9.5423 15.5256 8.34886 16.7829 8.34886C18.0402 8.34886 19.0535 9.54021 19.0319 10.9931C19.0319 12.4439 18.0402 13.6353 16.7829 13.6353Z" />
            </svg>
          </a>
          <a
            href="https://github.com/Shopify/hydrogen"
            target="_blank"
            rel="noreferrer"
          >
            <span className="sr-only">Github</span>
            <svg
              aria-hidden="true"
              className="fill-current text-white"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.1319 0.000976562C4.60874 0.000976562 0.135254 4.58917 0.135254 10.2539C0.135254 14.7908 2.99679 18.6229 6.97045 19.9814C7.47028 20.0711 7.65772 19.7635 7.65772 19.4944C7.65772 19.2509 7.64522 18.4434 7.64522 17.5848C5.13357 18.059 4.48379 16.9568 4.28385 16.38C4.17139 16.0853 3.68406 15.1753 3.2592 14.9318C2.90932 14.7396 2.40949 14.2654 3.2467 14.2526C4.03394 14.2397 4.59625 14.9959 4.78369 15.3035C5.68338 16.8542 7.1204 16.4185 7.6952 16.1494C7.78267 15.4829 8.04508 15.0343 8.33249 14.778C6.10824 14.5217 3.78402 13.6374 3.78402 9.71564C3.78402 8.60063 4.17139 7.67786 4.80868 6.96016C4.70871 6.70383 4.35883 5.65291 4.90864 4.24313C4.90864 4.24313 5.74586 3.97399 7.65772 5.29406C8.45745 5.06336 9.30716 4.94802 10.1569 4.94802C11.0066 4.94802 11.8563 5.06336 12.656 5.29406C14.5679 3.96117 15.4051 4.24313 15.4051 4.24313C15.9549 5.65291 15.605 6.70383 15.5051 6.96016C16.1424 7.67786 16.5297 8.58781 16.5297 9.71564C16.5297 13.6502 14.193 14.5217 11.9688 14.778C12.3311 15.0984 12.6435 15.7136 12.6435 16.6748C12.6435 18.0461 12.631 19.1483 12.631 19.4944C12.631 19.7635 12.8185 20.0839 13.3183 19.9814C15.3028 19.2943 17.0273 17.9861 18.2489 16.2411C19.4706 14.4962 20.128 12.4022 20.1285 10.2539C20.1285 4.58917 15.655 0.000976562 10.1319 0.000976562Z"
              />
            </svg>
          </a>
          <a
            href="https://twitter.com/shopifydevs"
            target="_blank"
            rel="noreferrer"
          >
            <span className="sr-only">Twitter</span>
            <svg
              aria-hidden="true"
              className="fill-current text-white"
              width="23"
              height="20"
              viewBox="0 0 23 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.6585 4.97993C20.6724 5.19691 20.6724 5.4139 20.6724 5.63288C20.6724 12.3055 15.9522 20.001 7.32122 20.001V19.997C4.77158 20.001 2.27491 19.215 0.12854 17.7331C0.499277 17.7811 0.871873 17.8051 1.2454 17.8061C3.35832 17.8081 5.41085 17.0452 7.07313 15.6403C5.0652 15.5993 3.30443 14.1903 2.68932 12.1335C3.3927 12.2795 4.11745 12.2495 4.80782 12.0465C2.61871 11.5705 1.04377 9.50064 1.04377 7.09679C1.04377 7.07479 1.04377 7.05379 1.04377 7.0328C1.69604 7.42377 2.42637 7.64076 3.17342 7.66476C1.1116 6.18185 0.476048 3.23004 1.72113 0.922181C4.10351 4.07698 7.61855 5.99486 11.3919 6.19785C11.0137 4.44396 11.5303 2.60607 12.7494 1.37315C14.6393 -0.538727 17.6117 -0.440733 19.3883 1.59214C20.4392 1.36915 21.4464 0.954179 22.3681 0.366216C22.0178 1.53514 21.2847 2.52808 20.3054 3.15904C21.2355 3.04105 22.1442 2.77306 23 2.36409C22.37 3.38003 21.5765 4.26497 20.6585 4.97993Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function WelcomeMessage({firstProductPath, firstCollectionPath}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr,1fr] col-span-2 gap-8 my-16 bg-white p-8 md:p-16 border-2 border-black">
      <div className="flex flex-col">
        <h1 className="text-black text-4xl md:text-5xl font-black mb-4">
          Hello, Hydrogen.
        </h1>
        <p className="text-2xl mb-8">Welcome to your custom storefront.</p>
        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-8 space-y-8 lg:space-y-0 mb-8">
          <Button
            className="md:px-5 py-4 flex-1 lg:flex-none"
            url="https://shopify.dev/custom-storefronts/hydrogen"
            label="Browse documentation"
            target="_blank"
          />
          <Button
            className="md:px-5 py-4 flex-1 lg:flex-none"
            url="/graphql"
            label="Open GraphiQL explorer"
            target="_blank"
          />
        </div>
      </div>
      <div className="max-w-max">
        <p className="text-black text-sm font-bold font-mono mb-3 uppercase">
          Explore the templates
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-8">
          <a href="/home" className="text-lg font-mono font-bold text-blue-600">
            Home template
          </a>
          <a
            href={`/collections/${firstCollectionPath}`}
            className="text-lg font-mono font-bold text-blue-600"
          >
            Collection template
          </a>
          <a
            href={`/products/${firstProductPath}`}
            className="text-lg font-mono font-bold text-blue-600"
          >
            Product template
          </a>
          <a
            href="/error-page"
            className="text-lg font-mono font-bold text-blue-600"
          >
            404 template
          </a>
        </div>
      </div>
    </div>
  );
}

function StorefrontInfo({shopName, totalProducts, totalCollections}) {
  const pluralize = (count, noun, suffix = 's') =>
    // eslint-disable-next-line no-negated-condition
    `${count} ${noun}${count !== 1 ? suffix : ''}`;
  return (
    <div className="bg-white p-8 md:p-16 border-2 border-black text-black">
      <p className="text-sm font-bold font-mono tracking-wider uppercase mb-4">
        Connected Storefront
      </p>
      <h2 className="text-2xl font-bold mb-4">{shopName}</h2>
      <p className="text-lg">
        {pluralize(totalProducts, 'Product')}
        {', '}
        {pluralize(totalCollections, 'Collection')}
      </p>
      {totalProducts === 0 && totalCollections === 0 && (
        <div className="py-2 px-3 bg-red-100 text-lg">
          Use the{' '}
          <a
            href="https://shopify.dev/apps/tools/cli/getting-started"
            className="text-blue-600 font-mono font-bold underline"
            target="_blank"
            rel="noreferrer"
          >
            Shopify CLI
          </a>{' '}
          to populate sample products and collections.
        </div>
      )}
      <hr className="my-8" />
      <a
        href="https://shopify.dev/custom-storefronts/hydrogen/getting-started#update-information-about-your-shopify-storefront"
        className="inline-flex items-center text-blue-600 font-mono font-bold underline"
        target="_blank"
        rel="noreferrer"
      >
        Changing your storefront access token
        <svg
          aria-hidden="true"
          className="fill-current ml-3"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.11963 0.000976562C7.56734 0.000976562 7.11963 0.448692 7.11963 1.00098C7.11963 1.55326 7.56734 2.00098 8.11963 2.00098H10.7054L4.41252 8.29387C4.022 8.68439 4.022 9.31756 4.41252 9.70808C4.80305 10.0986 5.43621 10.0986 5.82674 9.70808L12.1196 3.41519V6.00098C12.1196 6.55326 12.5673 7.00098 13.1196 7.00098C13.6719 7.00098 14.1196 6.55326 14.1196 6.00098V1.00098C14.1196 0.448692 13.6719 0.000976562 13.1196 0.000976562H8.11963Z" />
          <path d="M2.11963 2.00098C1.01506 2.00098 0.119629 2.89641 0.119629 4.00098V12.001C0.119629 13.1055 1.01506 14.001 2.11963 14.001H10.1196C11.2242 14.001 12.1196 13.1055 12.1196 12.001V9.00098C12.1196 8.44869 11.6719 8.00098 11.1196 8.00098C10.5673 8.00098 10.1196 8.44869 10.1196 9.00098V12.001H2.11963V4.00098L5.11963 4.00098C5.67191 4.00098 6.11963 3.55326 6.11963 3.00098C6.11963 2.44869 5.67191 2.00098 5.11963 2.00098H2.11963Z" />
        </svg>
      </a>
    </div>
  );
}

function NextSteps() {
  return (
    <div className="bg-white p-8 md:p-14 border-2 border-black text-black">
      <p className="text-sm font-bold font-mono tracking-wider uppercase mb-4">
        Update Your Index
      </p>
      <p className="text-lg mb-6 md:mb-4 leading-10">
        1. Remove or rename{' '}
        <span className="py-1 px-3 bg-gray-100 font-mono font-bold">
          pages/index.jsx
        </span>
      </p>
      <p className="text-lg mb-6 md:mb-4 leading-10">
        2. Rename{' '}
        <code className="py-1 px-3 bg-gray-100 font-mono font-bold">
          pages/home.jsx
        </code>{' '}
        to{' '}
        <code className="py-1 px-3 bg-gray-100 font-mono font-bold">
          pages/index.jsx
        </code>
      </p>
      <p className="text-lg mb-6 md:mb-4 leading-10">
        3. Happy Coding!{' '}
        <svg
          className="inline"
          width="27"
          height="27"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <path
            d="M84 39.3684v-8.1052h-4v-8.1053h-4v-4.0526h-8v-4.0527h-8V11H40v4.0526h-8v4.0527h-8v4.0526h-4v8.1053h-4v8.1052h-4V59.6316h4v8.1052h4v8.1053h4v4.0526h8v4.0527h8V88h20v-4.0526h8v-4.0527h8v-4.0526h4v-8.1053h4v-8.1052h4V39.3684h-4Z"
            fill="#FFFF01"
          />
          <path
            fill="#000"
            d="M36 29.2363h4v4.05263h-4zM32 33.2891h4v4.05263h-4zM60 33.2891h-4v4.05263h4zM32 37.3418h4v4.05263h-4zM40 33.2891h4v4.05263h-4zM60 37.3418h-4v4.05263h4zM40 37.3418h4v4.05263h-4zM59.3335 29.2363h4v4.05263h-4z"
          />
          <path
            fill="#000"
            d="M55.3335 33.2891h4v4.05263h-4zM63.3335 33.2891h4v4.05263h-4zM55.3335 37.3418h4v4.05263h-4zM63.3335 37.3418h4v4.05263h-4zM36 15.0527h4v4.05263h-4zM32 15.0527h4v4.05263h-4zM28 19.1055h4v4.05263h-4zM24 19.1055h4v4.05263h-4zM20 23.1582h4v4.05263h-4zM36 83.9473h4v-4.05264h-4zM32 83.9473h4v-4.05264h-4zM28 79.8945h4v-4.05263h-4zM20 27.2109h4v4.05263h-4zM24 79.8945h4v-4.05263h-4zM20 75.8438h4v-4.05263h-4zM40 11h4v4.05263h-4zM40 83.9473h4v4.05263h-4zM64 15.0527h-4v4.05263h4zM20 71.7891h4v-4.05263h-4zM68 15.0527h-4v4.05263h4zM16 31.2637h4v4.05263h-4zM72 19.1055h-4v4.05263h4zM76 19.1055h-4v4.05263h4zM80 23.1582h-4v4.05263h4zM64 83.9473h-4v-4.05264h4zM68 83.9473h-4v-4.05264h4zM72 79.8945h-4v-4.05263h4zM16 67.7363h4v-4.05263h-4zM12 39.3691h4v4.05263h-4zM80 27.2109h-4v4.05263h4zM76 79.8945h-4v-4.05263h4zM80 75.8438h-4v-4.05263h4z"
          />
          <path
            fill="#000"
            d="M16 35.3145h4v4.05263h-4zM36 33.2891h4v4.05263h-4zM22.6665 46.123h4v4.05263h-4zM78 46.123h-4.00001v4.05263H78zM80 71.7891h-4v-4.05263h4zM36 37.3418h4v4.05263h-4zM84 31.2637h-4v4.05263h4zM36 41.3945h4v4.05263h-4zM22.6665 50.1758h4v4.05263h-4z"
          />
          <path
            fill="#000"
            d="M22.6665 54.2266h4v4.05263h-4zM12 43.4219h4v4.05263h-4z"
          />
          <path
            fill="#000"
            d="M12 47.4727h4v4.05263h-4zM12 51.5254h4v4.05263h-4zM26.6665 58.2812h4v4.05263h-4zM30.6665 62.334h4v4.05263h-4zM12 55.5781h4v4.05263h-4zM34.6665 66.3848h4v4.05263h-4zM84 67.7363h-4v-4.05263h4zM88 39.3691h-4v4.05263h4zM78 50.1758h-4.00001v4.05263H78z"
          />
          <path
            fill="#000"
            d="M78 54.2266h-4.00001v4.05263H78zM74 58.2812h-4v4.05263h4zM84 35.3145h-4v4.05263h4zM70 62.334h-4v4.05263h4zM66 66.3848h-4v4.05263h4zM38.6665 70.4375h4v4.05264h-4zM42.6665 70.4375h4v4.05264h-4zM46.6665 70.4375h4v4.05264h-4zM50.6665 70.4375h4v4.05264h-4zM54.667 70.4375h4v4.05264h-4zM16 63.6836h4v-4.05264h-4zM80 63.6836h4v-4.05264h-4z"
          />
          <path
            fill="#000"
            d="M58.6665 70.4375h4v4.05264h-4zM88 43.4219h-4v4.05263h4z"
          />
          <path
            fill="#000"
            d="M88 47.4727h-4v4.05263h4zM88 51.5254h-4v4.05263h4zM44 11h4v4.05263h-4zM48 11h4v4.05263h-4zM88 55.5781h-4v4.05263h4zM52 11h4v4.05263h-4zM56 11h4v4.05263h-4zM44 83.9473h4v4.05263h-4zM48 83.9473h4v4.05263h-4zM59.3335 33.2891h4v4.05263h-4zM52 83.9473h4v4.05263h-4zM56 83.9473h4v4.05263h-4zM59.3335 37.3418h4v4.05263h-4zM59.3335 41.3945h4v4.05263h-4z"
          />
        </svg>
      </p>
    </div>
  );
}

export default function Index() {
  const {data} = useShopQuery({query: QUERY});
  const shopName = data ? data.shop.name : '';
  const products = data && flattenConnection(data.products);
  const collections = data && flattenConnection(data.collections);

  const firstProduct = products ? products[0].handle : '';
  const totalProducts = products && products.length;
  const firstCollection = collections ? collections[0].handle : '';
  const totalCollections = collections && collections.length;

  return (
    <div
      className="min-h-screen background-repeat pb-16"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='216' height='202' viewBox='0 0 216 202' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23a)' stroke='%23000' stroke-opacity='.5'%3E%3Cpath d='M43.5 1v200M86.5 1v200M129.5 1v200M172.5 1v201M215.5 2e-8V207M2e-8 165H215M2e-8 122H215M2e-8 79H215M2e-8 36H215M2e-8 .5 215 .500009'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h216v202H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
      }}
    >
      <Header />
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <WelcomeMessage
          firstProductPath={firstProduct}
          firstCollectionPath={firstCollection}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-8">
          <StorefrontInfo
            shopName={shopName}
            totalProducts={totalProducts}
            totalCollections={totalCollections}
          />
          <NextSteps />
        </div>
      </div>
    </div>
  );
}

const QUERY = gql`
  query welcomeContent {
    shop {
      name
    }
    products(first: 250) {
      edges {
        node {
          handle
        }
      }
    }
    collections(first: 250) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
