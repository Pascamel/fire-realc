import _ from 'lodash';

const labelSavings = (saving) => {
  const labels = {
    'P': 'Principal',
    'I': 'Interest',
    'T': 'Total'
  };

  return _.get(labels, saving, 'N/A');
}

const hashHiddenColumns = (hidden) => {
  return _(hidden)
    .reduce((acc, value, key) => {
      const c = _.reduce(value, (acc, v) => acc + v ? 1 : 0, 0);
      if (c > 0) acc[key] = c;
      return acc;
    }, {});
}

const savingsHeadersLine1 = (savings, hidden) => {
  const h = hashHiddenColumns(hidden);

  return _(savings)
    .map((header) => {
      return {
        label: header.label,
        icon: header.icon,
        weight: (header.interest ? 3 : 1) - _.get(h, header.id, 0)
      };
    })
    .filter((header) => header.weight > 0)
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

const savingsHeadersLine2 = (savings, hidden) => {
  return _(savings)
    .map((header) => {
      let headers = [];

      if (!_.get(hidden, [header.id, 'P'], false)) headers.push(header.sublabel || labelSavings('P'));

      if (header.interest) {
        _.each(['I', 'T'], (t) => {
          if (!_.get(hidden, [header.id, t], false)) headers.push(labelSavings(t));
        }); 
      }

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

const incomeHeaders = (headers) => {
  return _.map(headers.incomes, (h, idx) => {
    h.last = (idx === headers.incomes.length - 1);
    return h;
  });
}

const savingsInputs = (savings, hidden) => {
  return _(savings)
    .map((header) => {
      let headers = [{id: header.id, type: 'P'}];
      if (header.interest) _.each(['I', 'T'], (t) => headers.push({id: header.id, type: t})); 
      _.each(headers, (item) => { item.types = _.map(headers, 'type')});
      return headers;
    })
    .flatMap()
    .filter(header => !_.get(hidden, [header.id, header.type], false))
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
  labelSavings,
  savingsHeadersLine1,
  savingsHeadersLine2,
  incomeHeaders,
  savingsInputs,
  savings,
  income,
  formatSavingstaToSave,
  formatIncomeToSave
};