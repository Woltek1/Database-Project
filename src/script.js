let xValues = [];
let yValues = [];
let barColors = ["#F58F7C"];

let chart = new Chart("myChart", {
    type: "doughnut",
    data: {
        labels: xValues,
        datasets: [
            {
                backgroundColor: barColors,
                data: yValues,
            },
        ],
    },
    options: {
        title: {
            display: true,
            text: "Your Budget",
        },
    },
});

// Sprawdzenie, czy localStorage zawiera dane, jeśli tak, to wczytaj je
let storedBudgetData = JSON.parse(localStorage.getItem("budgetData"));
if (storedBudgetData) {
    xValues = storedBudgetData.xValues;
    yValues = storedBudgetData.yValues;
    chart.data.labels = xValues;
    chart.data.datasets[0].data = yValues;
    chart.data.datasets[0].backgroundColor = storedBudgetData.barColors;
    chart.update();

    // Sprawdzenie, czy dane mają długość większą niż 0 i ukrycie/odkrycie odpowiednich sekcji
    if (xValues.length > 0) {
        document.querySelector(".beforeBudget").style.display = "none";
        document.querySelector(".afterBudget").style.display = "block";
    }
}

function createBudget() {
    let name = document.querySelector(".budgetName").value;
    let amount = document.querySelector(".budgetAmount").value;
    if (amount <= 0) {
        alert("Amount too low");
    } else {
        chart.data.labels.push(name);
        chart.data.datasets[0].data.push(amount);
        chart.update();

        // Zapis danych do localStorage po utworzeniu budżetu
        saveToLocalStorage();

        document.querySelector(".beforeBudget").style.display = "none";
        document.querySelector(".afterBudget").style.display = "block";
    }
}

function fun() {
    if (
        document.querySelector(".exAmount").value <= 0 ||
        document.querySelector(".exAmount").value > yValues[0]
    ) {
        alert("Nuh uh");
    } else {
        chart.data.labels.push(document.querySelector(".exName").value);
        chart.data.datasets[0].data.push(
            document.querySelector(".exAmount").value
        );
        chart.data.datasets[0].backgroundColor.push(
            document.querySelector(".exColor").value
        );
        yValues[0] -= document.querySelector(".exAmount").value;
        if (yValues[0] > 0) {
            chart.update();
            let name = document.querySelector(".exName");
            name.value = "";
            let amount = document.querySelector(".exAmount");
            amount.value = "";
            let color = document.querySelector(".exColor");
            color.value = "";

            // Zapis danych do localStorage po dodaniu wydatku
            saveToLocalStorage();
        } else {
            alert("You are going over budget!");
        }
    }
}

function reverse() {
    if (xValues.length > 1) {
        yValues[0] += Number(yValues[yValues.length - 1]);
        xValues.pop();
        yValues.pop();
        chart.data.labels = xValues;
        chart.data.datasets[0].data = yValues;
        chart.data.datasets[0].backgroundColor.pop();
        chart.update();

        // Zapis danych do localStorage po cofnięciu ostatniego wydatku
        saveToLocalStorage();
    } else {
        alert("No elements left to delete");
    }
}

function saveToLocalStorage() {
    localStorage.setItem(
        "budgetData",
        JSON.stringify({
            xValues: xValues,
            yValues: yValues,
            barColors: chart.data.datasets[0].backgroundColor,
        })
    );
}

function refresh() {
    localStorage.clear();
    location.reload();
}
