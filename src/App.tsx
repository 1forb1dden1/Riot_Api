import React, { useState } from "react";
import axios from 'axios';
import {servers, ranks} from "./data"
import './App.css';
 
const RANKED_SOLO_5v5 = "RANKED_SOLO_5x5";
const RANKED_FLEX_SR = "RANKED_FLEX_SR";
const RANKED_TFT = "RANKED_FLEX_TFT";

interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface Player_Ranked_Solo_Stats {
  summonerName: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface Player_Ranked_Flex_Stats {
  summonerName: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface Player_Ranked_TFT_Stats{
  summonerName: string;
  tier: string;
  rank: string;
  leaguePoints: number
}

function App() {
  const API_KEY ="";
  const patch = "12.18";
  const [playerProfile, setPlayerProfile] = useState<any>({});
  const [playerStats, setPlayerStats] = useState<any>({});
  const [searchText, setSearchText] = useState<string>("");
  const [serverName, setServerName] = useState<string>("na1");
  const [value, setValue] = useState<any>(0);

  function getMatchData() {

  }

  function searchForPlayer(input : any) {
    var ApiCallString = "https://" + serverName + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY;
    axios.get(ApiCallString).then(function(response){
      setPlayerProfile(response.data);
      var ApiCallString2 = "https://" + serverName + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + response.data.id + "?api_key=" + API_KEY;
      axios.get(ApiCallString2).then(function(response){
        setPlayerStats(response.data);
      });
    }).catch (function (error){
      console.log(error);
      setPlayerProfile({});
    });
  }

  const getRankIndex = (playerStats: any, rankType: string) : any => {
    for ( var i = 0 ; i < playerStats.length ; i++){
      if(playerStats[i].queueType == rankType){
        return i;
      }
    }
  }

  function renderPlayerProfile(){
    if(JSON.stringify(playerProfile) != '{}'  )
    {
      return (
        <div>
          <p>{playerProfile.name}</p>
          <img width="150" height="150" src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + playerProfile.profileIconId + ".png"}></img>
          <p>Summoner Level {playerProfile.summonerLevel}</p>
          <p>Solo Queue </p>
        </div>
      );
    }
    else
    {
      return (
        <div>
          <p>Player Not Found</p>
        </div>
      )
    }
  }
  function renderPlayerStats(gameMode: string){
    if(playerStats[getRankIndex(playerStats, gameMode)] != null)
    {
      var winrate = 100*playerStats[getRankIndex(playerStats, gameMode)].wins / (playerStats[getRankIndex(playerStats, gameMode)].wins + playerStats[getRankIndex(playerStats, gameMode)].losses);
      return (
        <div>
          <p>{playerStats[getRankIndex(playerStats, gameMode)].tier} {playerStats[getRankIndex(playerStats, gameMode)].rank}</p>
          <img width="150" height="150" src={"../src/img/lolRanks/Emblem_" + playerStats[getRankIndex(playerStats, gameMode)].tier + ".png"} alt ="rank"/>
          <p>{playerStats[getRankIndex(playerStats, gameMode)].leaguePoints} LP</p>
          <p>{playerStats[getRankIndex(playerStats, gameMode)].wins}W {playerStats[getRankIndex(playerStats, gameMode)].losses}L</p>
          <p>{Math.round(winrate)}% Win Rate</p>
        </div>
      );
    }
    else{
      return (
        <div>
          <p>5v5 Flex Queue</p>
          <p>Unranked</p>
        </div>
      )
    }
  }
  
  return (
    <div className="App">
      <div className="NavBar">
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
        {renderPlayerProfile()}
        {renderPlayerStats(RANKED_SOLO_5v5)}
        {renderPlayerStats(RANKED_FLEX_SR)}
      </div>
    </div>
  );
}
export default App;
