import React, { useState } from "react";
import axios from 'axios';
import './App.css';

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

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [serverName, setServerName] = useState("na1");
  const API_KEY ="RGAPI-5284c9b5-b11c-4eb3-b64e-db85fde14f90";
  const patch = "12.17.1";

  function searchForPlayer(event){
    var ApiCallString = "https://" + serverName + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;
    axios.get(ApiCallString).then(function(response){
      setPlayerData(response.data);
      console.log(playerData);
    }).catch (function (error){
      console.log(error);
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h5>League of Legends Player Searcher</h5>
        <select>
          {options.map((option) => (<option key={option.value} value={option.value}> {option.label} </option>))}
        </select>
        <input type="text" onChange={e => setSearchText(e.target.value)}></input>
        <button onClick={e => searchForPlayer(e)}>Search for Player</button>
      </div>
      {JSON.stringify(playerData) != '{}' ?
      <>
      <p>{playerData.name}</p>
      <img width="150" height="150" src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + playerData.profileIconId + ".png"}></img>
      <p>Summoner Level {playerData.summonerLevel}</p>
      </> :
      <><p>No player data</p> 
      </>}
    </div>
  );
}
export default App;
