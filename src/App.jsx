import React, { useState } from "react";
import axios from 'axios';
import './App.css';

//change to servers
const servers = [
  { value: 'na1', label: 'NA' },
  { value: 'euw1', label: 'EUW' },
  { value: 'eun1', label: 'EUNE' },
  { value: 'br1', label: 'BR' },
  { value: 'jp1', label: 'JP' },
  { value: 'kr', label: 'KR' },
  { value: 'la1', label: 'LAN' },
  { value: 'la2', label: 'LAS' },
  { value: 'oc1', label: 'OCE' },
  { value: 'tr1', label: 'TR' },
  { value: 'ru', label: 'RU' },
]

//change to ranks
const ranks = [
  { value: "bronze", label: "img/lolRanks/Emblem_Bronze.png" },
  { value: "silver", label: "img/lolRanks/Emblem_Silver.png" },
  { value: "gold", label: "img/lolRanks/Emblem_Gold.png" },
  { value: "platinum", label: "img/lolRanks/Emblem_Platinum.png" },
  { value: "diamond", label: "img/lolRanks/Emblem_Diamond.png" },
  { value: "master", label: "img/lolRanks/Emblem_Master.png" },
  { value: "grandmaster", label: "img/lolRanks/Emblem_Grandmaster.png" },
  { value: "challenger", label: "img/lolRanks/Emblem_Challenger.png" },
]

function App() {
  const API_KEY ="RGAPI-4925a7d7-915b-44da-a4cb-17ee261e2294";
  const patch = "12.17.1";
  const [playerData, setPlayerData] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [searchText, setSearchText] = useState("");
  const [serverName, setServerName] = useState("na1");

  function searchForPlayer(){
    var ApiCallString = "https://" + serverName + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;
    axios.get(ApiCallString).then(function(response){
      setPlayerData(response.data);
      console.log(response.data);
      var ApiCallString2 = "https://" + serverName + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + response.data.id + "?api_key=" + API_KEY;
      axios.get(ApiCallString2).then(function(response){
        setPlayerStats(response.data);
        console.log(response.data);
      });
    }).catch (function (error){
      console.log(error);
      setPlayerData({});
    });
  }
  
  return (
    <div className="App">
      <div className="container">
        <h5>League of Legends Player Searcher</h5>

        <select value={serverName} onChange={e => setServerName(e.target.value)}>
          {servers.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <input type="text" onChange={e => setSearchText(e.target.value)}></input>
        <button onClick={e => searchForPlayer(e)}>Search for Player</button>
      </div>
      {JSON.stringify(playerData) != '{}' && JSON.stringify(playerStats) != '{}'?
      <>
      <p>{playerData.name}</p>
      <img width="150" height="150" src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + playerData.profileIconId + ".png"}></img>
      <p>Summoner Level {playerData.summonerLevel}</p>
      {playerStats[0] != undefined ? 
      <> <p>{playerStats[0].tier} {playerStats[0].rank} {playerStats[0].leaguePoints} lp</p> </>
      : <> <p>Unranked</p> </>}
      </> :
      <><p>No player data</p> 
      </>}
    </div>
  );
}
export default App;
