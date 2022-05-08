export default function FormatCurrency(num) {
  return 'GH₵ ' + num.toFixed(2).toLocaleString() + ' ';
}
