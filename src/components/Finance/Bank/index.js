import _ from 'lodash';
import Display from '../../UI/Display';

const totalMonthPreOrPost = (income, headers, year, month, isPre) => {
  return _.reduce(income[year][month].income, (sum, amount, type) => {
    var header = _.keyBy(headers, 'id')[type];
    if (!header || header.pretax !== isPre) return sum;
    return sum + amount / header.count;
  }, 0);
};

const totalMonthPre = (income, headers, year, month) => {
  const value = totalMonthPreOrPost(income, headers, year, month, true);

  return Display.amount(value);
};

const totalMonthPost = (income, headers, year, month) => {
  const value = totalMonthPreOrPost(income, headers, year, month, false);

  return Display.amount(value);
};

const totalMonth = (income, headers, year, month) => {
  const value = totalMonthPreOrPost(income, headers, year, month, true) + totalMonthPreOrPost(income, headers, year, month, false);
  
  return value;
};

const savingRateMonth = (income, headers, year, month, formatted) => {
  const i = _.reduce(income[year][month].income, (sum, amount, type) => {
    var header = _.keyBy(headers, 'id')[type];
    return sum + amount / header.count;
  }, 0);
  const value = income[year][month].savings / i;

  if (!formatted) return value;
  return Display.percentage(value * 100);
};

const yearlySavings = (income, year) => {
  const value = _.reduce(income[year], (sum, month) => {
    return sum + _.get(month, 'savings', 0);
  }, 0);

  return Display.amount(value, true);
};

const yearlyIncome = (income, year, header) => {
  const value = _.reduce(income[year], (sum, month) => {
    return sum + _.get(month, ['income', header.id], 0);
  }, 0);

  return Display.amount(value, true);
};

const totalYearPreOrPost = (income, headers, year, isPre) => {
  return _.reduce(income[year], (sum, month) => {
    return sum + _.reduce(_.get(month, 'income', {}), (sum, amount, type) => {
      var header = _.keyBy(headers, 'id')[type];
      if (!header || header.pretax !== isPre) return sum;
      return sum + amount / header.count;
    }, 0);
  }, 0);
};

const totalYearPre = (income, headers, year) => {
  const value = totalYearPreOrPost(income, headers, year, true);

  return Display.amount(value, true);
};

const totalYearPost = (income, headers, year) => {
  const value = totalYearPreOrPost(income, headers, year, false);

  return Display.amount(value, true);
};

// const yearlyTotal = (income, headers, year) => {
//   return totalYearPre(income, headers, year) + totalYearPost(income, headers, year);
// };

const savingRateYear = (income, headers, year) => {
  let i = _.reduce(income[year], (sum, month) => {
    return sum + _.reduce(_.get(month, 'income', {}), (sum, amount, type) => {
      var header = _.keyBy(headers, 'id')[type];
      return sum + amount / header.count;
    }, 0);
  }, 0);
  let s = _.reduce(income[year], (sum, month) => {
    return sum + _.get(month, 'savings', 0);
  }, 0);

  return s / i;
};

export default {
  totalMonthPreOrPost,
  totalMonthPre,
  totalMonthPost,
  totalMonth,
  savingRateMonth,
  yearlySavings,
  yearlyIncome,
  // totalYearPreOrPost,
  totalYearPre,
  totalYearPost,
  // yearlyTotal,
  savingRateYear
}