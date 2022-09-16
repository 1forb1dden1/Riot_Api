import React, { useState } from "react";
import axios from 'axios';
import {servers, ranks} from "./data"
import './App.css';

// create playerData interface
// create PlayerStats interface. 

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
      //console.log(response.data);
      var ApiCallString2 = "https://" + serverName + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + response.data.id + "?api_key=" + API_KEY;
      axios.get(ApiCallString2).then(function(response){
        setPlayerStats(response.data);
        //console.log(response.data);
      });
    }).catch (function (error){
      console.log(error);
      setPlayerData({});
    });
  }

  const RankIndex = (playerStats: any, rankType: string) : any => {
    //"RANKED_FLEX_SR"
    //"RANKED_SOLO_5x5"
    //"RANKED_TFT_DOUBLE_UP"
    //"RANKED_TFT"
    for( var i = 0 ; i < playerStats.length ; i++){
      if(playerStats[i].queueType == rankType){
        return i;
      }
    }
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
      <div className = "RANKED_SOLO_5x5">
        {JSON.stringify(playerData[RankIndex(playerStats, "RANKED_SOLO_5x5")]) != '{}' && JSON.stringify(playerStats) != '{}'?
          <>
            <p>{playerData.name}</p>
            <img width="150" height="150" src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + playerData.profileIconId + ".png"}></img>
            <p>Summoner Level {playerData.summonerLevel}</p>
            <p>Solo Queue </p>
              {
                playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")] != undefined ? 
                <> 
                <p>
                  {playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")].tier} {playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")].rank} {playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")].leaguePoints} lp
                </p>
                <p>
                  {playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")].wins}W {playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")].losses}L
                </p>
                <img width="150" height="150" src={"../src/img/lolRanks/Emblem_" + playerStats[RankIndex(playerStats, "RANKED_SOLO_5x5")].tier + ".png"} alt ="rank"/>
                </>
                : 
                <> 
                  <p>Unranked</p> 
                </>
              }
          </> :
          <>
            <p>No player data</p> 
          </>
        }
      </div>
      <div className = "RANKED_FLEX_SR">
        {JSON.stringify(playerData) != '{}' && JSON.stringify(playerStats) != '{}'?
          <>
            <p>Flex Queue</p>
              {
                playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")] != undefined ?
                <>      
                <p>
                  {playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")].tier} {playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")].rank} {playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")].leaguePoints} lp
                </p>
                <p>
                  {playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")].wins}W {playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")].losses}L
                </p>
                <img width="150" height="150" src={"../src/img/lolRanks/Emblem_" + playerStats[RankIndex(playerStats, "RANKED_FLEX_SR")].tier + ".png"} alt ="rank"/>
                </>
                :
                <>
                  <p>Unranked</p>
                </> 
              }
          </> :
          <>
            <p>No player data</p>
          </>
        }
      </div>
    </div>
  );
}
export default App;
