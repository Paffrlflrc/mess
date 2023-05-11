const units = [
  'S',
  'T',
  'Y',
  'C',
  'N',
  'Q',
  'D',
  'E',
  'R',
  'K',
  'H',
  'G',
  'A',
  'V',
  'L',
  'I',
  'P',
  'F',
  'W',
  'M',
];

export default function getRandomSequence(lenght = 6) {
  const sequence = [];
  for (let index = 0; index < lenght; index += 1) {
    const unit = units[Math.floor(Math.random() * units.length)];

    sequence.push(unit);
  }
  return sequence;
}
