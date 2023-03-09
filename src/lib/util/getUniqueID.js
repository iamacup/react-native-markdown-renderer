let uuid = new Date().getTime();

export default function getUniqueID() {
  uuid++;
  return `rnmr_${uuid.toString(16)}`;
}
