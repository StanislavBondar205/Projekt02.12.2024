const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Obiekt przechowujący wartości minimalnego i maksymalnego kąta dla wartości
const rotationValues = [];
for (let i = 0; i < 30; i++) {
  rotationValues.push({
    minDegree: i * 12,
    maxDegree: (i + 1) * 12 - 1,
    value: i + 1, // Przypisz unikalną wartość dla każdego fragmentu
  });
}

// Rozmiar każdego fragmentu
const data = new Array(30).fill(12); // 30 fragmentów, każdy o równym rozmiarze

// Kolory tła dla każdego fragmentu
const pieColors = [
  "#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc",
  "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da",
  "#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc",
  "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da",
  "#8b35bc", "#b163da", "#8b35bc", "#b163da", "#8b35bc",
  "#b163da", "#8b35bc", "#b163da", "#8b35bc", "#b163da"
];

// Utwórz wykres
let myChart = new Chart(wheel, {
  // Wtyczka do wyświetlania tekstu na wykresie kołowym
  plugins: [ChartDataLabels],
  // Typ wykresu: kołowy
  type: "pie",
  data: {
    // Etykiety (wartości, które mają być wyświetlane na wykresie)
    labels: Array.from({ length: 30 }, (_, i) => i + 1), // Etykiety od 1 do 30
    // Ustawienia dla danych/wykresu kołowego
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    // Wykres responsywny
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // Ukryj podpowiedzi i legendę
      tooltip: false,
      legend: {
        display: false,
      },
      // Wyświetl etykiety wewnątrz wykresu kołowego
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 14 },
      },
    },
  },
});

// Wyświetl wartość na podstawie losowego kąta
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // Jeśli angleValue znajduje się między min a max, wyświetl ją
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Wartość: ${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

// Licznik obrotów
let count = 0;
// 100 obrotów dla animacji i ostatni obrót dla wyniku
let resultValue = 101;

// Rozpocznij obracanie
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  // Wyczyszczenie końcowej wartości
  finalValue.innerHTML = `<p>Powodzenia!</p>`;
  // Wygeneruj losowy kąt zatrzymania
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  // Interwał dla animacji obrotu
  let rotationInterval = window.setInterval(() => {
    // Ustaw obrót dla wykresu kołowego
    /*
    Początkowo, aby wykres kołowy obracał się szybciej, ustawiamy resultValue na 101, 
    dzięki czemu obraca się o 101 stopni na raz, i zmniejszamy to o 5 z każdym liczeniem.
    Ostatecznie, podczas ostatniego obrotu, obracamy o 1 stopień na raz.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    // Zaktualizuj wykres z nową wartością
    myChart.update();
    // Jeśli obrót >= 360, zresetuj go do 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});
