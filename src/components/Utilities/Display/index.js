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

export default {
  amount, 
  percentage,
  goal
};

