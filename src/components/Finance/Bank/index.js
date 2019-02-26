import _ from 'lodash';
import FinanceHelpers from '../../Finance/FinanceHelpers';
import Display from '../../UI/Display';

class Bank {
  constructor(firebase) {
    this.loaded = false;
    this.firebase = firebase;
  }

  load = () => {
    var promise = new Promise( (resolve, reject) => {
      this.firebase.getHeaders().then((snapshotHeaders) => {
        this.firebase.getSavings().then((snapshotSavings) => {
          this.firebase.getRevenues().then((snapshotIncome) => {

            let headers = snapshotHeaders.data() || [];
            let savings_data = _.get(snapshotSavings.data(), 'data', []);
            let income_data = _.get(snapshotIncome.data(), 'data', []);

            this.income = FinanceHelpers.income(income_data, savings_data, headers);
            this.savings = FinanceHelpers.savings(savings_data, headers);
            this.incomeHeaders = FinanceHelpers.incomeHeaders(headers);
            this.savingsHeaders = headers.savings;
            this.savingsHeadersLine1 = FinanceHelpers.savingsHeadersLine1(this.savingsHeaders);
            this.savingsHeadersLine2 = FinanceHelpers.savingsHeadersLine2(this.savingsHeaders);
            this.savingsInputs = FinanceHelpers.savingsInputs(this.savingsHeaders);

            this.startingCapital = headers.startingCapital;
            this.income_year_headers = {collapsed: {}};
            this.savings_year_headers = _.get(snapshotSavings.data(), 'yearly_data', {collapsed: {}, goals: {}});

            if (!this.savings_year_headers.collapsed) this.savings_year_headers.collapsed = {};            

            // this.showDecimals = !snapshotSavings.data().hideDecimals;
            this.loadLocalStorage();

            this.loaded = true;

            resolve(true);
          }).catch(function(error) {
            reject(false);
          });
        }).catch(function(error) {
          reject(false);
        });
      }).catch(function(error) {
        reject(false);
      });
    });

    return promise;
  }

  loadLocalStorage = () => {
    _.each(JSON.parse(localStorage.getItem('savings_collapsed', '{}')), (value, key) => {
      this.savings_year_headers.collapsed[key] = value;
    });
    _.each(JSON.parse(localStorage.getItem('income_collapsed', '{}')), (value, key) => {
      this.income_year_headers.collapsed[key] = value;
    });
    this.showDecimals = (parseInt(localStorage.getItem('show_decimals') || '1') > 0);
  };

  saveLocalStorage = () => {
    localStorage.setItem('savings_collapsed', JSON.stringify(this.savings_year_headers.collapsed));
    localStorage.setItem('income_collapsed', JSON.stringify(this.income_year_headers.collapsed));
    localStorage.setItem('show_decimals', this.showDecimals ? '1' : '0');
  };

  monthlyGoal = (year, formatted) => {
    const idxYear = _(this.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;

    const goal_year = _.get(this.savings_year_headers, ['goals', year], 0);
    const start_of_year = (idxYear === 0) ? this.startingCapital : this.totalHolding('12', (parseInt(year) - 1).toString(), false);
    const goal = (goal_year - start_of_year) /  _.keys(this.savings[year]).length;

    if (!formatted) return goal;
    return Display.amount(goal, false, this.showDecimals);
  }

  totalMonthPreOrPost = (year, month, isPre) => {
    return _.reduce(_(this.income).get([year, month, 'income'], {}), (sum, amount, type) => {
      const header = _.keyBy(this.incomeHeaders, 'id')[type];
      if (!header || header.pretax !== isPre) return sum;
      return sum + amount / header.count;
    }, 0);
  };

  totalMonthPre = (year, month) => {
    const value = this.totalMonthPreOrPost(year, month, true);

    return Display.amount(value, false, this.showDecimals);
  };

  totalMonthPost = (year, month) => {
    const value = this.totalMonthPreOrPost(year, month, false);

    return Display.amount(value, false, this.showDecimals);
  };

  totalMonthIncome = (year, month) => {
    const value = this.totalMonthPreOrPost(year, month, true) + this.totalMonthPreOrPost(year, month, false);
    
    return value;
  };

  savingRateMonth = (year, month, formatted) => {
    const i = this.totalMonthIncome(year, month);

    if (i === 0) return formatted ? '?' : 0;
  
    const value = (this.totalMonthSavings(month, year, 'T', false) / i) || 0;

    if (!formatted) return value;
    return Display.percentage(value * 100);
  };

  yearlyIncome = (year, h) => {
    const value = _.reduce(this.income[year], (sum, month) => {
      return sum + _.get(month, ['income', h.id], 0);
    }, 0);

    return Display.amount(value, true, this.showDecimals);
  };

  totalYearPreOrPost = (year, isPre) => {
    return _.reduce(this.income[year], (sum, month) => {
      return sum + _.reduce(_.get(month, 'income', {}), (sum, amount, type) => {
        const header = _.keyBy(this.incomeHeaders, 'id')[type];
        if (!header || header.pretax !== isPre) return sum;
        return sum + amount / header.count;
      }, 0);
    }, 0);
  };

  totalYearPre = (year, formatted) => {
    const value = this.totalYearPreOrPost(year, true);

    if (!formatted) return value;
    return Display.amount(value, true, this.showDecimals);
  };

  totalYearPost = (year, formatted) => {
    const value = this.totalYearPreOrPost(year, false);

    if (!formatted) return value;
    return Display.amount(value, true, this.showDecimals);
  };

  savingRateYear = (year, month, formatted) => {
    let i = _(_.range(1, month + 1)).reduce((sum, m) => {
      return sum + this.totalMonthIncome(year, m);
    }, 0);

    let s = this.totalHolding(month, year, false) - this.startOfYearAmount(year, false);

    if (!formatted) return s / i;
    return Display.percentage(100 * s / i);
  };

  // Savings

  startOfYearAmount = (year, formatted) => {
    const keys = _.keys(this.savings), idx = keys.indexOf(year);

    if (idx <= 0) return this.startingCapital;
    
    const value = this.totalHolding('12', keys[idx - 1], false);

    if (!formatted) return value;
    return Display.amount(value, false, this.showDecimals);
  };

  totalHolding = (month, year, formatted) => {
    const keys = _.keys(this.savings), idxYear = keys.indexOf(year);
    if (idxYear < 0) return 0;
    if (month < 0 || month >= this.savings[year].length) return 0;

    const value = _.reduce(this.savings, (sum, data_y, y) => {
      if (parseInt(y) > parseInt(year)) return sum;
      return sum + _.reduce(data_y, (sum, data_m, m) => {
        if (parseInt(y) === parseInt(year) && parseInt(m) > parseInt(month)) return sum;
        return sum + _.reduce(data_m, (sum, data_institution) => {
          return sum + _.reduce(data_institution, (sum, amount, type) =>{
            if (type === 'T') return sum;
            return sum + amount;
          }, 0);
        }, 0)
      }, 0);
    }, this.startingCapital);

    if (!formatted) return value;
    return Display.amount(value, false, this.showDecimals);
  };

  totalMonthInstitution = (year, month, institution) => {
    const value = _.reduce(['P', 'I'], (v, i) => v + _.get(this.savings, [year, month, institution, i], 0), 0);

    return Display.amount(value, false, this.showDecimals);
  }

  totalMonthSavings = (month, year, type, formatted) => {
    const m = _.get(this.savings, [year, month]);
    let value = 0;

    if (!m || !Object.keys(m).length) {
      value = 0;
    } else if (type === 'T') {
      value = _.reduce(['P', 'I'], (v, i) => v + this.totalMonthSavings(month, year, i, false), 0);
    } else {
      value = _.reduce(m, (v, i) => v + _.get(i, [type], 0), 0);
    }

    if (!formatted) return value;
    return Display.amount(value, false, this.showDecimals);
  };

  goalMonth = (month, year, formatted) => {
    const idxYear = _(this.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;

    const goal_year = _.get(this.savings_year_headers, ['goals', year], 0);
    const start_of_year = (idxYear === 0) ? this.startingCapital : this.totalHolding('12', (parseInt(year) - 1).toString(), false);
    const goal = (goal_year - start_of_year) /  _.keys(this.savings[year]).length;
    const achieved = this.totalMonthSavings(month, year, 'T', false);

    const value = Display.roundFloat(achieved - goal);

    if (!formatted) return value;
    return Display.amount(value, true, this.showDecimals);
  };

  goalYearToDate = (month, year, formatted) => {
    const idxYear = _(this.savings).keys().indexOf(year);
    if (idxYear < 0) return 0;

    if (month.substring) month = parseInt(month) || 0;
    if (month < 0 || month >= this.savings[year].length) return 0;

    const goal_year = _.get(this.savings_year_headers, ['goals', year], 0);
    const start_of_year = (idxYear === 0) ? this.startingCapital : this.totalHolding('12', (parseInt(year) - 1).toString(), false);
    const goal_by_month = (goal_year - start_of_year) / _.keys(this.savings[year]).length;
    const goal = start_of_year + goal_by_month * (month + _.keys(this.savings[year]).length - 12);
    const achieved = this.totalHolding(month, year, false);

    const value = Display.roundFloat(achieved - goal);

    if (!formatted) return value;
    return Display.amount(value, true, this.showDecimals);
  };

  totalInstitution = (year, institution, type, formatted) => {
    const idxYear = _(this.savings).keys().indexOf(year);
    let value = 0;
    if (idxYear < 0) {
      value = 0;
    } else if (type === 'T') {
      value =  _.reduce(['P', 'I'], (v, i) => v + this.totalInstitution(year, institution, i, false), 0);
    } else {
      value = _.reduce(this.savings[year], (v, i) => v + _.get(i, [institution, type], 0), 0);
    }

    if (!formatted) return value
    return Display.amount(value, true, this.showDecimals);
  };

  grandTotalInstitution = (institution, type, formatted) => {
    if (type === 'T') {
      const value = _.reduce(['P', 'I'], (v, i) => v + this.grandTotalInstitution(institution, i), 0);

      if (!formatted) return value;
      return Display.amount(value, true, this.showDecimals);
    }

    const sp = (type === 'P' && _.findIndex(this.savingsInputs, (o) => { return o.id === institution; }) === 0) ? this.startingCapital : 0;
    const ti = _(this.savings).keys().reduce((acc, year) => acc + this.totalInstitution(year, institution, type, false), 0);

    if (!formatted) return sp + ti;
    return Display.amount(sp + ti, true, this.showDecimals);
  };

  grandTotalHolding = () => {
    const year = _(this.savings).keys().last();
    if (!year) return '';

    const month = _(this.savings[year]).keys().last();
    if (!month) return '';

    const value = this.totalHolding(month, year);

    return Display.amount(value, false, this.showDecimals);
  };

  updateValue = (index, indexes, value) => {
    if (indexes.length > 0) {
      _.set(this[index], indexes, value);
    } else {
      _.set(this, [index], value);
    }
  };

  saveIncome = () => {
    var promise = new Promise((resolve, reject) => {
      const payload = {
        last_update: (new Date()).getTime(),
        data: JSON.parse(JSON.stringify(FinanceHelpers.formatIncomeToSave(this.income))),
        yearly_data: JSON.parse(JSON.stringify(this.income_year_headers))
      };

      this.firebase.setRevenues(payload).then(() => {
        resolve(true);
      }).catch((error) => {
        reject(false);
      });
    });
  
    return promise;
  };

  saveSavings = () => {
    var promise = new Promise((resolve, reject) => {
      const payload = {
        last_update: (new Date()).getTime(),
        data: JSON.parse(JSON.stringify(FinanceHelpers.formatSavingstaToSave(this.savings))),
        yearly_data: JSON.parse(JSON.stringify(this.savings_year_headers)),
        hideDecimals: !this.showDecimals
      };

      this.firebase.setSavings(payload).then(() => {
        resolve(true);
      }).catch((error) => {
        reject(false);
      });
    });
    
    return promise;
  };
}
  
export default Bank;