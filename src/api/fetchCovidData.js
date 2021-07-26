function refactorResponse(data) {
  let covidData = {};
  data?.map((item) => {
    covidData[item.country] = {
      active: item.active,
      total: item.cases,
      deaths: item.deaths,
      recovered: item.recovered,
      countryInfo: item.countryInfo,
    };
  });
  return covidData;
}

export async function fetchCovidData() {
  try {
    const data = await (
      await fetch("https://corona.lmao.ninja/v2/countries?yesterday&sort")
    ).json();
    const refactoredData = refactorResponse(data);
    return refactoredData;
  } catch (e) {
    console.error(e);
  }
}
