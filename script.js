// script.js
document.getElementById('submit-btn').addEventListener('click', function () {
    const name = document.getElementById('name').value;
    const units = parseFloat(document.getElementById('units').value);
    const hasAC = document.getElementById('has-ac').value === 'yes';
    const numAC = hasAC ? parseInt(document.getElementById('num-ac').value) : 0;
  
    const userProfile = {
      name: name,
      state: "Kerala",
      historical_units: units,
      historical_cost: calculateCost(units, "Kerala"),
      has_ac: hasAC,
      num_ac: numAC,
    };
  
    displayInsights(userProfile);
  });
  
  document.getElementById('track-btn').addEventListener('click', function () {
    const budget = parseFloat(document.getElementById('budget').value);
    const targetPeriod = document.getElementById('target-period').value;
    const nextBillDate = new Date(document.getElementById('next-bill-date').value);
    const currentUnits = parseFloat(document.getElementById('current-units').value);
  
    const daysRemaining = Math.ceil((nextBillDate - new Date()) / (1000 * 60 * 60 * 24));
    const targetUnits = calculateUnits(budget, "Kerala");
    const dailyUsageRate = targetUnits / daysRemaining;
    const expectedUnits = dailyUsageRate * (30 - daysRemaining); // Assuming 30-day month
  
    let output = `<p>With ₹${budget}, you can use up to ${targetUnits.toFixed(2)} units this ${targetPeriod}.</p>`;
    output += `<p>You need to use no more than ${dailyUsageRate.toFixed(2)} units per day to stay on track.</p>`;
  
    if (currentUnits > expectedUnits) {
      output += `<p>Alert! You've used ${(currentUnits - expectedUnits).toFixed(2)} units more than expected.</p>`;
    } else {
      output += `<p>You're on track! You've used ${((currentUnits / expectedUnits) * 100).toFixed(2)}% of your expected usage.</p>`;
    }
  
    document.getElementById('target-output').innerHTML = output;
  });
  
  document.getElementById('has-ac').addEventListener('change', function () {
    const numACInput = document.getElementById('num-ac');
    numACInput.disabled = this.value === 'no';
  });
  
  function calculateCost(units, state) {
    const slabs = tariffData[state];
    let totalCost = 0;
    for (const slab of slabs) {
      if (units > slab.slab_end) {
        totalCost += (slab.slab_end - slab.slab_start + 1) * slab.rate_per_unit;
      } else {
        totalCost += (units - slab.slab_start + 1) * slab.rate_per_unit;
        break;
      }
    }
    totalCost += slabs[0].fixed_charge;
    return totalCost;
  }
  
  function calculateUnits(budget, state) {
    const slabs = tariffData[state];
    let remainingBudget = budget - slabs[0].fixed_charge;
    let totalUnits = 0;
    for (const slab of slabs) {
      const slabUnits = slab.slab_end - slab.slab_start + 1;
      const slabCost = slabUnits * slab.rate_per_unit;
      if (remainingBudget >= slabCost) {
        totalUnits += slabUnits;
        remainingBudget -= slabCost;
      } else {
        totalUnits += remainingBudget / slab.rate_per_unit;
        break;
      }
    }
    return totalUnits;
  }
  
  function displayInsights(userProfile) {
    let insights = `<p>Hi ${userProfile.name}, here are your insights:</p>`;
    insights += `<p>- Your average monthly usage: ${userProfile.historical_units} units</p>`;
    insights += `<p>- Your average monthly cost: ₹${userProfile.historical_cost.toFixed(2)}</p>`;
  
    if (userProfile.has_ac) {
      insights += `<p>You have ${userProfile.num_ac} AC(s). Here are some tips to optimize their usage:</p>`;
      if (userProfile.num_ac > 1) {
        insights += `<p>- Reduce AC usage by 2 hours daily to save ₹500/month.</p>`;
      } else {
        insights += `<p>- Reduce AC usage by 1 hour daily to save ₹250/month.</p>`;
      }
    } else {
      insights += `<p>You don't have any ACs. Great job on keeping your energy usage low!</p>`;
    }
  
    document.getElementById('insights').innerHTML = insights;
  }
  
  const tariffData = {
    Kerala: [
      { slab_start: 0, slab_end: 50, rate_per_unit: 3.15, fixed_charge: 25 },
      { slab_start: 51, slab_end: 100, rate_per_unit: 3.95, fixed_charge: 50 },
      { slab_start: 101, slab_end: 150, rate_per_unit: 5.0, fixed_charge: 75 },
      { slab_start: 151, slab_end: 200, rate_per_unit: 6.35, fixed_charge: 100 },
      { slab_start: 201, slab_end: 250, rate_per_unit: 7.5, fixed_charge: 125 },
      { slab_start: 251, slab_end: 300, rate_per_unit: 8.5, fixed_charge: 150 },
      { slab_start: 301, slab_end: 100000, rate_per_unit: 9.0, fixed_charge: 200 },
    ],
  };
