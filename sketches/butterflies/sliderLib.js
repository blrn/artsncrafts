let vars = {};
function addSlider(variable, min, max, val, step, text, numDigits, parent) {
  if (parent === undefined) {
    parent = createDiv();
  }
  if (numDigits === undefined) {
    numDigits = 2;
  }
  let label = createSpan(text.replace("#", val.toFixed(numDigits)));  
  let slider = createSlider(min, max, val, step);

  createElement("br");
  
  let onInput = () => {
    vars[variable] = slider.value();
    label.html(text.replace("#", slider.value().toFixed(numDigits)));
    background(245);
    stroke(vars.r, vars.g, vars.z, vars.o); 
  };
  
  slider.input(onInput);
  
  vars[variable] = val;
}