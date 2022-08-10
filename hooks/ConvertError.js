export default function ConvertError(val) {
  if (isNaN(val)) {
    return 0;
  }
  return val;
}
