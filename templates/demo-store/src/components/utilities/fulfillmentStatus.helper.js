export default function fulfillmentStatus(status) {
  let text = status;
  switch (status) {
    case 'FULFILLED':
      text = 'Fulfilled';
      break;
    case 'IN_PROGRESS':
      text = 'In Progress';
      break;
    case 'ON_HOLD':
      text = 'On Hold';
      break;
    case 'OPEN':
      text = 'Open';
      break;
    case 'PARTIALLY_FULFILLED':
      text = 'Partially Fulfilled';
      break;
    case 'PENDING_FULFILLMENT':
      text = 'Pending';
      break;
    case 'RESTOCKED':
      text = 'Restocked';
      break;
    case 'SCHEDULED':
      text = 'Scheduled';
      break;
    case 'UNFULFILLED':
      text = 'Unfulfilled';
      break;
    default:
      text = status;
  }
  return text;
}
