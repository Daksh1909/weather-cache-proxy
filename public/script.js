document.getElementById("getWeatherBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(`/api?q=${city}`);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temp").textContent = `🌡️ ${Math.round(data.main.temp) - 273}°C`;
    document.getElementById("description").textContent = `☁️ ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `🌬️ Wind: ${data.wind.speed} m/s`;

    resultDiv.classList.remove("hidden");
  } catch (error) {
    alert(error.message || "Error fetching weather data");
    resultDiv.classList.add("hidden");
  }
});

document.getElementById("cityInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("getWeatherBtn").click();
  }
});