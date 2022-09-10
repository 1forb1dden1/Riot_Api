import React, { useState } from "react";

import axios from 'axios';
import './App.css';

//change to servers
const options = [
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
const options2 = [
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
  const API_KEY ="RGAPI-f7f4e773-b6b9-4cb6-bf37-254975189d66";
  const patch = "12.17.1";
  const [playerData, setPlayerData] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [searchText, setSearchText] = useState("");
  const [serverName, setServerName] = useState("na1");

  function searchForPlayer(event){
    var ApiCallString = "https://" + serverName + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;
    axios.get(ApiCallString).then(function(response){
      setPlayerData(response.data);
      //console.log(playerData);
    }).catch (function (error){
      console.log(error);
    });
  }
  
  function searchForPlayerRank(event){
    var ApiCallString = "https://" + serverName + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerData.id + "?api_key=" + API_KEY;
    axios.get(ApiCallString).then(function(response){
      setPlayerStats(response.data);
      console.log(playerStats);
    }).catch (function (error){
      console.log(error);
    });
  }

  function buttonPressHandler(event){
    searchForPlayer(event);
    searchForPlayerRank(event);
  }
  return (
    <div className="App">
      <div className="container">
        <h5>League of Legends Player Searcher</h5>

        <select value={serverName} onChange={e => setServerName(e.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input type="text" onChange={e => setSearchText(e.target.value)}></input>
        <button onClick={e => buttonPressHandler(e)}>Search for Player</button>
      </div>
      {JSON.stringify(playerData) != '{}' && JSON.stringify(playerStats) != '{}' ?
      <>
      <p>{playerData.name}</p>
      <img width="150" height="150" src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + playerData.profileIconId + ".png"}></img>
      <p>Summoner Level {playerData.summonerLevel}</p>
      <p>{playerStats[0].tier} {playerStats[0].rank} {playerStats[0].leaguePoints} {playerStats[0].wins}</p>
      </> :
      <><p>No player data</p> 
      </>}
    </div>
  );
}
export default App;
