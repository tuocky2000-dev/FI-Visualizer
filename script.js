let chart;


// Expand/Collapse Assumptions Panel
const assumptionsToggle = document.getElementById("assumptionsToggle");
const assumptionsPanel = document.getElementById("assumptionsPanel");

assumptionsToggle.addEventListener("click", () => {
    assumptionsPanel.classList.toggle("hidden");

    assumptionsToggle.textContent = assumptionsPanel.classList.contains("hidden")
        ? "Show Assumptions ▼"
        : "Hide Assumptions ▲";
});

function calculate() {
  const age = parseInt(document.getElementById("age").value);
  let netWorth = parseFloat(document.getElementById("netWorth").value);
  let income = parseFloat(document.getElementById("income").value);
  let expenses = parseFloat(document.getElementById("expenses").value);
  const wageGrowth = parseFloat(document.getElementById("wageGrowth").value) / 100;
  const inflation = parseFloat(document.getElementById("inflation").value) / 100;
  const roi = parseFloat(document.getElementById("roi").value) / 100;
  const withdrawalRate = parseFloat(document.getElementById("withdrawalRate").value) / 100;

  let monthlyInvestment = income - expenses;
  document.getElementById("monthlyInvestment").textContent = monthlyInvestment.toFixed(2);
  if (age > 100) {
    alert("The maximum age you can enter is 100.");
    ageInput.value = 100;
    if (chart) chart.destroy();
    document.getElementById("fiProgressContainer").style.display = "none";
    document.getElementById("fiPercentText").style.display = "none";
    document.querySelector(".toggles").style.display = "none";
    document.getElementById("fiAgeDisplay").textContent = "";
    return; 
  }
  let year = age;

    const data = {
    labels: [],
    netWorth: [],
    income: [],
    expenses: [],
    deposits: [],
    returns: [],
  };

    let fiAge = null;

    // Project forward year by year
    while (year <= 100) {
    const annualDeposit = monthlyInvestment * 12;
    const investmentReturn = netWorth * roi;

    netWorth = netWorth + annualDeposit + investmentReturn;

    data.labels.push(year);
    data.netWorth.push(netWorth);
    data.income.push(income * 12);
    data.expenses.push(expenses * 12);
    data.deposits.push(annualDeposit);
    data.returns.push(investmentReturn);

    if (!fiAge && netWorth * withdrawalRate >= expenses * 12) {
      fiAge = year;
      break;
    }

    income *= (1 + wageGrowth);
    expenses *= (1 + inflation);
    monthlyInvestment = income/12 - expenses/12;

    year++;
  }
  document.getElementById("fiAgeDisplay").textContent = fiAge ? `You reach Financial Independence at age ${fiAge}.` : "You do not reach Financial Independence by age 100.";
    updateFIInfo(
    parseFloat(document.getElementById("netWorth").value),
    parseFloat(document.getElementById("expenses").value),
    withdrawalRate);
    document.querySelector(".toggles").style.display = "flex";
    document.getElementById("fiProgressContainer").style.display = "block";
    document.getElementById("fiPercentText").style.display = "block";
    renderChart(data)
}

function updateFIInfo(netWorth, expenses, withdrawalRate) {
    // FI percentage calculation
    const annualExpenses = expenses * 12;
    const fireTarget = annualExpenses / withdrawalRate;
    const fiPercent = Math.min((netWorth / fireTarget) * 100, 100);

    // Update bar + label
    document.getElementById("fiProgressBar").style.width = fiPercent + "%";
    document.getElementById("fiPercentText").textContent =
     `Current Financial Independence Progress: ${fiPercent.toFixed(1)}%`;
}

function renderChart(data) {
  const isDark = document.body.classList.contains("dark");
  const axisColor = isDark ? "#ffffff" : "#000000";
  const gridColor = isDark ? "#4f4f4fff" : "#cccccc";
  const ctx = document.getElementById("chart").getContext("2d");
  const toggles = [...document.querySelectorAll('.toggle:checked')].map(t => t.value);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        toggles.includes("netWorth") && { label: "Net Worth", data: data.netWorth, backgroundColor:"rgba(255,99,132,0.95)" },
        toggles.includes("income") && { label: "Income", data: data.income, backgroundColor:"rgba(255,154,64,0.95)" },
        toggles.includes("expenses") && { label: "Expenses", data: data.expenses, backgroundColor:"rgba(255,205,86,0.95)" },
        toggles.includes("deposits") && { label: "Capital Deposited", data: data.deposits, backgroundColor:"rgba(75,192,192,0.95)" },
        toggles.includes("returns") && { label: "Investment Returns", data: data.returns, backgroundColor:"rgba(54,162,235,0.95)" },
      ].filter(Boolean)
    },
    options: {
      responsive: true,
       scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: axisColor
      },
      grid: {
        color: gridColor
      },
      border: {
        color: axisColor
      },
      title: {
        display: true,
        text: "Amount ($)",
        color: axisColor
      }
    },
    x: {
      ticks: {
        color: axisColor
      },
      grid: {
        display: false,
        color: gridColor
      },
      border: {
        color: axisColor
      },
      title: {
        display: true,
        text: "Age",
        color: axisColor
      }
    }
  },
  plugins: {
        legend: {
          labels: {
            color: axisColor
          }
        },
      }
    }
  });
};
function darkInputTyping(i) {
  i.target.style.color = "black";
}

function darkInputBlur(i) {
  i.target.style.color = "white";
}

function darkInputFocus(i) {
  i.target.style.color = "black";
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.querySelector(".inputs-card").classList.toggle("dark");
  document.querySelector(".chart-card").classList.toggle("dark");
  document.querySelector(".chart-inner").classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  const inputs = [...document.querySelectorAll(".inputColor")];
  if (isDark) {
    inputs.forEach(input => {
      input.addEventListener("input", darkInputTyping);
      input.addEventListener("blur", darkInputBlur);
      input.addEventListener("focus", darkInputFocus);
      input.style.color = "white";
    });

  } else {
    inputs.forEach(input => {
      input.removeEventListener("input", darkInputTyping);
      input.removeEventListener("blur", darkInputBlur);
      input.removeEventListener("focus", darkInputFocus);
      input.style.color = "black";
    });
  }

  
  const btn = document.getElementById("themeButton");
    if (isDark) {
    btn.textContent = "Light Mode";
    btn.style.backgroundColor = "#333";
    btn.style.color = "#fff";
  } else {
    btn.textContent = "Dark Mode";
    btn.style.backgroundColor = "#eee";
    btn.style.color = "#000";
  }
  const axisColor = isDark ? "#ffffff" : "#000000";
  const gridColor = isDark ? "#4f4f4fff" : "#cccccc";
  chart.options.scales.x.ticks.color = axisColor;
  chart.options.scales.y.ticks.color = axisColor;
  chart.options.scales.x.grid.color = gridColor;
  chart.options.scales.y.grid.color = gridColor;
  chart.options.scales.x.border.color = axisColor;
  chart.options.scales.y.border.color = axisColor;
  chart.options.scales.x.title.color = axisColor;
  chart.options.scales.y.title.color = axisColor;
  chart.options.plugins.legend.labels.color=axisColor;
  chart.update()
}
function toggleThemeButton() {
  // Toggle your site dark mode
  toggleDarkMode();

  // Update button text
  const btn = document.getElementById("themeButton");

  if (document.body.classList.contains("dark")) {
    btn.textContent = "Dark Mode";
  } else {
    btn.textContent = "Light Mode";
  }
}

// Update chart instantly when toggles are clicked
document.getElementById("runCalc").addEventListener("click", calculate);
document.querySelectorAll('.toggle').forEach(t => t.addEventListener('change', calculate));