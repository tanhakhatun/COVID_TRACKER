import { useEffect, useState } from "react";
import { fetchCovidData } from "./api/fetchCovidData";
import Flag from "./components/flag";
import Card from "./components/card";
import { MapContainer } from "react-leaflet";
import CovidMap from "./components/covid-map";
import "./CovidTracker.css";

function App() {
  const [covidData, setCovidData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState("India");
  const [mapMarkerInfo, setMapMarkerInfo] = useState({
    color: "red",
    type: "active",
  });
  const [globalMaxCount, setGlobalMaxCount] = useState({
    total: 0,
    active: 0,
    recovered: 0,
    deaths: 0,
  });

  const getCovidData = async () => {
    const data = await fetchCovidData();
    setCovidData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getCovidData();
  }, []);

  useEffect(() => {
    const maxCasesData = {
      total: 0,
      active: 0,
      recovered: 0,
      deaths: 0,
    };

    Object.keys(covidData).forEach((country) => {
      maxCasesData.total = Math.max(
        maxCasesData.total,
        covidData[country].total
      );
      maxCasesData.active = Math.max(
        maxCasesData.active,
        covidData[country].active
      );
      maxCasesData.recovered = Math.max(
        maxCasesData.recovered,
        covidData[country].recovered
      );
      maxCasesData.deaths = Math.max(
        maxCasesData.deaths,
        covidData[country].deaths
      );
    });
    setGlobalMaxCount(maxCasesData);
  }, [covidData]);

  if (isLoading) {
    return <div className="waitingLoader">Waiting....</div>;
  }

  const getDropdownOptions = () => {
    return Object.keys(covidData).map((country) => {
      return <option key={country}>{country}</option>;
    });
  };

  const changeCountry = (event) => {
    setCountry(event.target.value);
  };

  const setMapInfo = (color, type) => {
    setMapMarkerInfo({ color: color, type: type });
  };

  const getTrackerCards = () => {
    return (
      <div className="trackerCardsContainer">
        <Card
          changeMapColor={setMapInfo}
          heading="Total"
          cases={covidData[country].total}
          color="blue"
          type="total"
        />
        <Card
          changeMapColor={setMapInfo}
          heading="Active"
          cases={covidData[country].active}
          color="red"
          type="active"
        />
        <Card
          changeMapColor={setMapInfo}
          heading="Deaths"
          cases={covidData[country].deaths}
          color="grey"
          type="deaths"
        />
        <Card
          changeMapColor={setMapInfo}
          heading="Recovered"
          cases={covidData[country].recovered}
          color="green"
          type="recovered"
        />
      </div>
    );
  };

  const getWorldMap = () => {
    const { lat, long } = covidData[country]?.countryInfo;
    return (
      <MapContainer
        className="covidMap"
        center={[lat, long]}
        zoom={3}
        scrollWheelZoom={true}
      >
        <CovidMap
          covidData={covidData}
          mapMarkerInfo={mapMarkerInfo}
          selectedCountry={country}
          globalMaxCount={globalMaxCount}
          lat={lat}
          long={long}
        />
      </MapContainer>
    );
  };

  return (
    <div className="covidTrackerContainer">
      <h1 className="covidTrackerHeading">Covid tracker</h1>
      <div className="covidTrackerBody">
        <div>{getWorldMap()}</div>
        <div className="right">
          <div className="flagSelectContainer">
            <Flag countryInfo={covidData[country]?.countryInfo} />
            <select
              className="countryDropDown"
              value={country}
              onChange={changeCountry}
            >
              {getDropdownOptions()}
            </select>
          </div>
          <div className="cardsContainer">{getTrackerCards()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
