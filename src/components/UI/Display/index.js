const amount = (number, display_if_zero) => {
  if ((!number || number === 0) && !display_if_zero) return '';
  return Number(number).toFixed(2);     
};

const percentage = (number) => {
  return Number(number).toFixed(2) + '%';     
};

const goal = (value, threshold, success, danger) => {
  success = success || 'table-success';
  danger = danger || 'table-danger';
  
  return (value >= threshold) ? success : danger;
};

const roundFloat = (num) => {
  return Math.round((num + 0.00001) * 100) / 100;
};

const showIf = (bool, className) => {
  className = className || 'hidden';

  return bool ? '' : className;
};

const hideIf = (bool, className) => {
  className = className || 'hidden';

  return bool ? className : '';
};

export default {
  amount, 
  percentage,
  goal,
  roundFloat,
  showIf,
  hideIf
};