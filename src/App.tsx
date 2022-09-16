import React, { useState } from "react";
import axios from 'axios';
import {servers, ranks} from "./data"
import './App.css';

function App() {
  const API_KEY ="RGAPI-3fe92e43-bf2b-4082-95e7-c5c9fe5e2ab6";
  const patch = "12.17.1";
  const [playerData, setPlayerData] = useState<any>({});
  const [playerStats, setPlayerStats] = useState<any>({});
  const [searchText, setSearchText] = useState<string>("");
  const [serverName, setServerName] = useState<string>("na1");

  function searchForPlayer(input : any) {
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
        <h3>League of Legends Player Searcher</h3>

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
