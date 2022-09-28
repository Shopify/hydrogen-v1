import {Script} from '@shopify/hydrogen/experimental';

export default function ScriptCallbacks(props) {
  return (
    <Script
      {...props}
      onLoad={(load) => {
        console.log('📞 🌕 onLoad event', load);
      }}
      onReady={(ready) => {
        console.log('📞 🟢 onReady event', ready);
      }}
      onError={(error) => {
        console.error('📞 🔴 onError event', error);
      }}
    />
  );
}
