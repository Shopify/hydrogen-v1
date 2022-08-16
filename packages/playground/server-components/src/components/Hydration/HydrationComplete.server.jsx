import HydrationCompleteTrigger from './HydrationCompleteTrigger.client';
import HydrationCompleteListener from './HydrationCompleteListener.server';

export default function HydrationComplete() {
  return (
    <HydrationCompleteTrigger>
      <HydrationCompleteListener />
    </HydrationCompleteTrigger>
  );
}
