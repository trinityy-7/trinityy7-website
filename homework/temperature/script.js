// implemented at https://trinityy7.com/homework/temperature

const CtoF = x => x * 9/5 + 32; // convert to Farenheit
const FtoC = x => (x - 32) * 5/9; // convert to Celcius

const main = () => {

  let mode = prompt("Celcius to Farenheit (1) or Farenheit to Celcius (2)");
  while (mode != '1' && mode != '2') {
    mode = prompt("invalid mode! Celcius to Farenheit (1) or Farenheit to Celcius (2)");
  }

  let inputUnit = mode == '1' ? 'C' : 'F'

  let inputTemp = Number.parseInt(prompt("enter temperature"));

  let outputTemp, outputUnit;

  if (mode == '1') {
    outputUnit = 'F';
    outputTemp = CtoF(inputTemp);
  } else {
    outputUnit = 'C';
    outputTemp = FtoC(inputTemp);
  } 
  outputTemp = Math.round(outputTemp * 100) / 100; // round to 2 decimal places

  alert(`${inputTemp}${inputUnit} is equal to ${outputTemp}${outputUnit}`);
};

main();