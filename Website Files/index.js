const videoElement = document.getElementById('bg-video');

function handleVideoLoop() {
  videoElement.classList.add('video-fade');
  videoElement.addEventListener('transitionend', () => {
    videoElement.currentTime = 0;
    videoElement.classList.remove('video-fade');
    videoElement.play();
  }, { once: true });
}

videoElement.addEventListener('ended', handleVideoLoop);

const weather = {
  apiKey: '3f7e6abb7a6c4e6ea9e195439241905',

  async fetchWeather(query) {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    loaderWrapper.style.display = 'flex';

    try {
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${query}&days=2&aqi=yes`
      );
      if (!weatherResponse.ok) {
        throw new Error("City Not Found");
      }
      const weatherData = await weatherResponse.json();
      this.displayWeather(weatherData);

      const astronomyResponse = await fetch(
        `https://api.weatherapi.com/v1/astronomy.json?key=${this.apiKey}&q=${query}`
      );
      if (!astronomyResponse.ok) {
        throw new Error("Failed to fetch astronomy data.");
      }
      const astronomyData = await astronomyResponse.json();
      this.displayAstronomy(astronomyData);
    } catch (error) {
      console.log(error);
      if (error.message === "City Not Found") {
        document.querySelector(".name").innerHTML = "City Not Found";
      } else if (!navigator.onLine) {
        alert(
          "No Internet Connection. Please check your internet connection and try again."
        );
      }
    } finally {
      setTimeout(() => {
        loaderWrapper.classList.add('hidden');
        setTimeout(() => {
          loaderWrapper.style.display = 'none';
        }, 1800);
      }, 3500);
    }
  },

  async setBackgroundVideo(dayVideo, nightVideo, submitBackgroundDay, submitBackgroundNight, is_day) {
    const videoElement = document.getElementById('bg-video');
    const sourceElement = document.getElementById('bg-video-source');
    const videoPath = is_day ? dayVideo : nightVideo;

    if (sourceElement.src !== videoPath) {
      try {
        videoElement.classList.add('video-fade');

        await new Promise(resolve => {
          videoElement.addEventListener('transitionend', resolve, { once: true });
          setTimeout(resolve, 1000);
        });

        sourceElement.src = videoPath;
        await videoElement.load();
        await videoElement.play();

        videoElement.classList.remove('video-fade');

      } catch (error) {
        console.error('Video error:', error);
        document.body.style.backgroundImage = `url(${is_day ?
          dayVideo.replace('.mp4', '.jpg') :
          nightVideo.replace('.mp4', '.jpg')})`;
      }
    }

    this.setButtonBackground(is_day, submitBackgroundDay, submitBackgroundNight);
  },

  setButtonBackground(isDay, dayColor, nightColor) {
    const submitButton = document.querySelector(".submit");
    submitButton.style.background = isDay ? dayColor : nightColor;
  },

  displayWeather(data) {
    const {
      location: { name, localtime, country },
      current: {
        condition: { icon, text, code },
        temp_c,
        temp_f,
        humidity,
        wind_kph,
        wind_mph,
        wind_degree,
        wind_dir,
        cloud,
        is_day,
        feelslike_c,
        feelslike_f,
        vis_km,
        vis_miles,
        uv,
        pressure_mb,
        pressure_in,
        gust_mph,
        gust_kph,
        precip_in,
        precip_mm,
        last_updated,
        air_quality: { co, o3, no2, so2, pm2_5, pm10 },
        air_quality: { "us-epa-index": usepaindex, "gb-defra-index": ukdefraindex },
      },
      forecast: { forecastday }
    } = data;

    const weatherIcon = document.getElementById("weatherIcon");

    const localIconPath = icon.replace(
      "//cdn.weatherapi.com/weather/64x64",
      "./assets/weather/64x64"
    );

    document.querySelector(".name").innerHTML = name;
    document.querySelector(".country").innerHTML = country;
    weatherIcon.src = localIconPath;
    document.querySelector(".datetime").innerHTML = localtime;
    document.querySelector(".condition").innerHTML = text;
    document.querySelector(".temp").innerHTML = `${temp_c}&#176;C / ${temp_f}&#176;F`;
    document.querySelector(".cloud").innerHTML = `${cloud}%`;
    document.querySelector(".humidity").innerHTML = `${humidity}%`;
    document.querySelector(".precip").innerHTML = `${precip_mm} MM / ${precip_in} IN`;
    document.querySelector(".wind").innerHTML = `${wind_kph} KMph / ${wind_mph} Mph`;
    document.querySelector(".gust").innerHTML = `${gust_kph} KMph / ${gust_mph} Mph`;
    document.querySelector(".winddeg").innerHTML = `${wind_degree}&#176;`;
    document.querySelector(".winddir").innerHTML = wind_dir;
    document.querySelector(".feelslike").innerHTML = `${feelslike_c}&#176;C / ${feelslike_f}&#176;F`;
    document.querySelector(".visib").innerHTML = `${vis_km} KM / ${vis_miles} Miles`;
    document.querySelector(".uvindex").innerHTML = uv;
    document.querySelector(".pressure").innerHTML = `${pressure_mb} MB / ${pressure_in} IN`;
    document.querySelector(".carbmonx").innerHTML = `${Math.trunc(co)} &#181;g/m3`;
    document.querySelector(".ozone").innerHTML = `${Math.trunc(o3)} &#181;g/m3`;
    document.querySelector(".nitrodiox").innerHTML = `${Math.trunc(no2)} &#181;g/m3`;
    document.querySelector(".sulphdiox").innerHTML = `${Math.trunc(so2)} &#181;g/m3`;
    document.querySelector(".pm25").innerHTML = `${Math.trunc(pm2_5)} &#181;g/m3`;
    document.querySelector(".pm10").innerHTML = `${Math.trunc(pm10)} &#181;g/m3`;
    document.querySelector(".usepaindex").innerHTML = usepaindex;
    document.querySelector(".ukdefraindex").innerHTML = ukdefraindex;
    document.querySelector(".lastupdated").innerHTML = `Last Updated At: ${last_updated}`;

    if (code === 1000) {
      this.setBackgroundVideo(
        './assets/day_bg/ClearDay.mp4',
        './assets/night_bg/ClearNight.mp4',
        "#e5ba92",
        "#181e27",
        is_day
      );
    } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282,].includes(code)) {
      this.setBackgroundVideo(
        './assets/day_bg/CloudyDay.mp4',
        './assets/night_bg/CloudyNight.mp4',
        "#fa6d1b",
        "#181e27",
        is_day
      );
    } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195,
      1204, 1207, 1240, 1243, 1246, 1249, 1252,].includes(code)) {
      this.setBackgroundVideo(
        './assets/day_bg/RainyDay.mp4',
        './assets/night_bg/RainyNight.mp4',
        "#647d75",
        "#325c80",
        is_day
      );
    } else {
      this.setBackgroundVideo(
        './assets/day_bg/SnowyDay.mp4',
        './assets/night_bg/SnowyNight.mp4',
        "#1b1b1b",
        "#1b1b1b",
        is_day
      );
    }

    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
      const forecastHour = forecastday[0].hour[hourIndex];
      const weatherBox = document.querySelector(`.weather-box.hour${hourIndex + 1}`);
      const boxIcon = weatherBox.querySelector(".box-icon");
      const localForecastIconPath = forecastHour.condition.icon.replace(
        "//cdn.weatherapi.com/weather/64x64",
        "./assets/weather/64x64"
      );
      boxIcon.src = localForecastIconPath;
      weatherBox.querySelector(".box-title").innerText = `${forecastHour.temp_c}°C / ${forecastHour.temp_f}°F`;
      weatherBox.querySelector(".box-subtitle").innerText = forecastHour.time;
    }

  },

  displayAstronomy(data) {
    const {
      sunrise,
      sunset,
      moonrise,
      moonset,
      moon_phase,
      moon_illumination,
    } = data.astronomy.astro;

    document.querySelector(".sunrise").innerHTML = sunrise;
    document.querySelector(".sunset").innerHTML = sunset;
    document.querySelector(".moonrise").innerHTML = moonrise;
    document.querySelector(".moonset").innerHTML = moonset;
    document.querySelector(".moonphase").innerHTML = moon_phase;
    document.querySelector(".moonillum").innerHTML = moon_illumination;
  },

  search() {
    this.fetchWeather(document.querySelector(".search").value);
  },
};

document.querySelector(".submit").addEventListener("click", () => weather.search());

document.querySelector(".search").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    weather.search();
  }
});

async function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        await getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Location access denied. Please enable it in browser settings.");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by your browser.");
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    await weather.fetchWeather(`${lat},${lon}`);
  } catch (error) {
    console.error("Error fetching weather by location:", error);
  }
}

// Call function on page load
getUserLocation();

window.addEventListener("offline", () => {
  alert("No Internet Connection. Please check your internet connection and try again.");
});

document.getElementById('bg-video').addEventListener('error', (e) => {
  console.error('Video error:', e.target.error);
  document.body.style.backgroundImage = `url(./assets/fallback.png)`;
});