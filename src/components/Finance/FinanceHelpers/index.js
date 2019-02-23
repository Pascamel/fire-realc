import _ from 'lodash';

const savingsHeadersLine1 = (savings) => {
  return _(savings)
    .map((header) => {
      return {
        label: header.label,
        icon: header.icon,
        weight: header.interest ? 3 : 1
      };
    })
    .groupBy('label')
    .map((header, key) => {
      return {
        label: key,
        icon: header[0].icon,
        weight: _.reduce(header, (sum, h) => sum + h.weight, 0)
      };
    })
    .value();
}

const savingsHeadersLine2 = (savings) => {
  return _(savings)
    .map((header) => {
      let headers = [header.sublabel || 'Principal'];
      if (header.interest) _.each(['Interest', 'Total'], (t) => headers.push(t)); 
      headers = _.map(headers, (h, idx) => {
        return {
          label: h,
          last: idx === headers.length-1
        }
      });
      return headers;
    })
    .flatMap()
    .value();
}

const headersLine = (headers) => {
  return _.map(headers.incomes, (h, idx) => {
    h.last = (idx === headers.incomes.length - 1);
    return h;
  });
}

const savingsInputs = (savings) => {
  return _(savings)
    .map((header) => {
      let headers = [{id: header.id, type: 'P'}];
      if (header.interest) _.each(['I', 'T'], (t) => headers.push({id: header.id, type: t})); 
      _.each(headers, (item) => { item.types = _.map(headers, 'type')});
      return headers;
    })
    .flatMap()
    .value();
}

const formatYear = (months, value) => {
  return _(months).reduce((acc, m) => {
    acc[m] = _.cloneDeep(value || {});
    return acc;
  }, {});
};

const savings = (data, headers) => {
  let result = {};
  let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

  _(years).each((y, idx) => {
    if (idx === 0 && years.length === 1) {
      result[y] = formatYear(_.range(headers.firstMonth, new Date().getMonth() + 2));
    } else if (idx === 0) {
      result[y] = formatYear(_.range(headers.firstMonth, 13));
    } else {
      result[y] = formatYear(_.range(1, 13));
    }
  });

  _(data).each((d) => {
    _.set(result, [d.year, d.month, d.institution, d.type], d.amount);
  });

  return result;
}

const income = (income_data, savings_data, headers) => {
  let result = {};

  
  let years = _.range(headers.firstYear, new Date().getFullYear() + 1);

  _(years).each((y, idx) => {
    if (idx === 0 && years.length === 1) {
      result[y] = formatYear(_.range(headers.firstMonth, new Date().getMonth() + 2), {});
    } else if (idx === 0) {
      result[y] = formatYear(_.range(headers.firstMonth, 13), {});
    } else {
      result[y] = formatYear(_.range(1, 13), {});
    }
  });

  _(savings_data).each((d) => {
    let current_value = _.get(result, [d.year, d.month, 'savings'], 0);
    _.set(result, [d.year, d.month, 'savings'], current_value + d.amount);
  });

  _(income_data).each((d) => {
    _.set(result, [d.year, d.month, 'income', d.type], d.amount);
  });

  return result;
}

const formatSavingstaToSave = (savings) => {
  let data = [];

  _.each(savings, (data_year, year) => {
    _.each(data_year, (data_month, month) => {
      _.each(data_month, (data_institution, institution) => {
        _.each(data_institution, (amount, type) => {
          if (type === 'T') return;
          if (amount === 0) return;

          data.push({year: parseInt(year), month: parseInt(month), institution: institution, type: type, amount: amount});
        });
      });
    });
  });

  return data;
}; 

const formatIncomeToSave = (income) => {
  let data = [];

  _.each(income, (data_year, year) => {
    _.each(data_year, (data_month, month) => {
      _.each(data_month.income, (amount, institution) => {
        data.push({year: parseInt(year), month: parseInt(month), type: institution, amount: amount});
      })
    });
  });

  return data;
};

export default {
  savingsHeadersLine1,
  savingsHeadersLine2,
  headersLine,
  savingsInputs,
  savings,
  income,
  formatSavingstaToSave,
  formatIncomeToSave
};