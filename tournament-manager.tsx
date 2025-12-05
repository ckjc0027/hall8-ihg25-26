import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Save, X, Calendar, Lock, Unlock } from 'lucide-react';

export default function TournamentManager() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const ADMIN_PASSWORD = 'ihg2526admin'; // Change this to your preferred password
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team Alpha', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, sport: '' },
    { id: 2, name: 'Team Beta', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, sport: '' },
    { id: 3, name: 'Team Gamma', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, sport: '' },
    { id: 4, name: 'Team Delta', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, sport: '' },
  ]);
  
  const [sports, setSports] = useState(['Football', 'Basketball', 'Volleyball']);
  const [matches, setMatches] = useState([]);
  const [todayMatches, setTodayMatches] = useState([]);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showAddTodayMatch, setShowAddTodayMatch] = useState(false);
  const [showSportsManager, setShowSportsManager] = useState(false);
  const [newSport, setNewSport] = useState('');
  const [editingSport, setEditingSport] = useState(null);
  const [editSportName, setEditSportName] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    score1: '',
    score2: '',
    sport: ''
  });
  const [newTodayMatch, setNewTodayMatch] = useState({
    team1: '',
    team2: '',
    time: '',
    sport: ''
  });
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTeamSport, setEditTeamSport] = useState('');

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const calculateStandings = (updatedMatches) => {
    const standings = teams.map(team => ({
      ...team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    }));

    const filteredMatches = selectedSport === 'All Sports' 
      ? updatedMatches 
      : updatedMatches.filter(m => m.sport === selectedSport);

    filteredMatches.forEach(match => {
      const team1 = standings.find(t => t.id === parseInt(match.team1));
      const team2 = standings.find(t => t.id === parseInt(match.team2));
      
      if (team1 && team2) {
        team1.played++;
        team2.played++;
        team1.goalsFor += match.score1;
        team1.goalsAgainst += match.score2;
        team2.goalsFor += match.score2;
        team2.goalsAgainst += match.score1;

        if (match.score1 > match.score2) {
          team1.won++;
          team1.points += 3;
          team2.lost++;
        } else if (match.score1 < match.score2) {
          team2.won++;
          team2.points += 3;
          team1.lost++;
        } else {
          team1.drawn++;
          team2.drawn++;
          team1.points++;
          team2.points++;
        }
      }
    });

    let filtered = selectedSport === 'All Sports' 
      ? standings 
      : standings.filter(t => t.sport === selectedSport);

    return filtered.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    });
  };

  const addMatch = () => {
    if (newMatch.team1 && newMatch.team2 && newMatch.team1 !== newMatch.team2 && 
        newMatch.score1 !== '' && newMatch.score2 !== '' && newMatch.sport) {
      const match = {
        id: Date.now(),
        team1: newMatch.team1,
        team2: newMatch.team2,
        score1: parseInt(newMatch.score1),
        score2: parseInt(newMatch.score2),
        sport: newMatch.sport
      };
      const updatedMatches = [...matches, match];
      setMatches(updatedMatches);
      setTeams(calculateStandings(updatedMatches));
      setNewMatch({ team1: '', team2: '', score1: '', score2: '', sport: '' });
      setShowAddMatch(false);
    }
  };

  const deleteMatch = (matchId) => {
    const updatedMatches = matches.filter(m => m.id !== matchId);
    setMatches(updatedMatches);
    setTeams(calculateStandings(updatedMatches));
  };

  const addTodayMatch = () => {
    if (newTodayMatch.team1 && newTodayMatch.team2 && newTodayMatch.team1 !== newTodayMatch.team2 && newTodayMatch.time && newTodayMatch.sport) {
      const match = {
        id: Date.now(),
        team1: newTodayMatch.team1,
        team2: newTodayMatch.team2,
        time: newTodayMatch.time,
        sport: newTodayMatch.sport
      };
      setTodayMatches([...todayMatches, match]);
      setNewTodayMatch({ team1: '', team2: '', time: '', sport: '' });
      setShowAddTodayMatch(false);
    }
  };

  const deleteTodayMatch = (matchId) => {
    setTodayMatches(todayMatches.filter(m => m.id !== matchId));
  };

  const addSport = () => {
    if (newSport.trim() && !sports.includes(newSport.trim())) {
      setSports([...sports, newSport.trim()]);
      setNewSport('');
    }
  };

  const startEditSport = (sport) => {
    setEditingSport(sport);
    setEditSportName(sport);
  };

  const saveSportName = () => {
    if (editSportName.trim() && !sports.includes(editSportName.trim())) {
      setSports(sports.map(s => s === editingSport ? editSportName.trim() : s));
      setEditingSport(null);
    }
  };

  const deleteSport = (sport) => {
    setSports(sports.filter(s => s !== sport));
  };

  const addTeam = () => {
    const newTeam = {
      id: Date.now(),
      name: `Team ${teams.length + 1}`,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      sport: ''
    };
    setTeams([...teams, newTeam]);
  };

  const startEditTeam = (team) => {
    setEditingTeam(team.id);
    setEditName(team.name);
    setEditTeamSport(team.sport);
  };

  const saveTeamName = () => {
    setTeams(teams.map(t => t.id === editingTeam ? { ...t, name: editName, sport: editTeamSport } : t));
    setEditingTeam(null);
  };

  const getTeamName = (id) => {
    const team = teams.find(t => t.id === parseInt(id));
    return team ? team.name : '';
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-3">
            <Trophy className="w-10 h-10 text-white mr-3" />
            <h1 className="text-5xl font-light tracking-tight text-white">
              IHG 25/26
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-light tracking-wide">Inter Hall Games Tournament</p>
          
          {/* Admin Login/Logout Button */}
          <div className="mt-6">
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-900 text-white px-6 py-2.5 rounded-md hover:bg-red-800 transition text-sm font-medium mx-auto"
              >
                <Lock className="w-4 h-4" />
                Logout (Admin Mode)
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 bg-zinc-800 text-gray-400 px-6 py-2.5 rounded-md hover:bg-zinc-700 transition text-sm font-medium mx-auto"
              >
                <Unlock className="w-4 h-4" />
                Admin Login
              </button>
            )}
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 max-w-md w-full mx-4">
              <h2 className="text-2xl font-medium text-white mb-4">Admin Login</h2>
              <p className="text-gray-400 text-sm mb-6">Enter the admin password to make changes</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full bg-black border border-zinc-800 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:border-white mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setPassword('');
                  }}
                  className="flex-1 bg-zinc-800 text-gray-400 px-6 py-3 rounded-md hover:bg-zinc-700 transition text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sports Manager Section */}
        <div className="bg-zinc-900 rounded-lg p-8 mb-6 border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-white">Sports</h2>
            {isAdmin && (
              <button
                onClick={() => setShowSportsManager(!showSportsManager)}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Manage Sports
              </button>
            )}
          </div>

          {/* Sport Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setSelectedSport('All Sports')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                selectedSport === 'All Sports'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
              }`}
            >
              All Sports
            </button>
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  selectedSport === sport
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {showSportsManager && (
            <div className="bg-black p-5 rounded-md border border-zinc-800">
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSport()}
                  placeholder="Add new sport"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                />
                <button
                  onClick={addSport}
                  className="bg-white text-black px-5 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {sports.map(sport => (
                  <div key={sport} className="flex items-center justify-between bg-zinc-900 p-3 rounded-md group">
                    {editingSport === sport ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editSportName}
                          onChange={(e) => setEditSportName(e.target.value)}
                          className="flex-1 bg-black border border-zinc-800 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white"
                          autoFocus
                        />
                        <button onClick={saveSportName} className="text-white hover:text-gray-300">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingSport(null)} className="text-gray-600 hover:text-gray-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-white font-light">{sport}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => startEditSport(sport)} className="text-gray-600 hover:text-white">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteSport(sport)} className="text-gray-600 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Today's Matches Section */}
        <div className="bg-zinc-900 rounded-lg p-8 mb-6 border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Calendar className="w-5 h-5 text-white" />
                <h2 className="text-xl font-medium text-white">Today's Matches</h2>
              </div>
              <p className="text-gray-500 text-sm ml-8">{getTodayDate()}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddTodayMatch(!showAddTodayMatch)}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Schedule Match
              </button>
            )}
          </div>

          {showAddTodayMatch && (
            <div className="bg-black p-5 rounded-md mb-6 border border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  value={newTodayMatch.team1}
                  onChange={(e) => setNewTodayMatch({ ...newTodayMatch, team1: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                >
                  <option value="">Select Team 1</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <select
                  value={newTodayMatch.team2}
                  onChange={(e) => setNewTodayMatch({ ...newTodayMatch, team2: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                >
                  <option value="">Select Team 2</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={newTodayMatch.time}
                  onChange={(e) => setNewTodayMatch({ ...newTodayMatch, time: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                />
                <select
                  value={newTodayMatch.sport}
                  onChange={(e) => setNewTodayMatch({ ...newTodayMatch, sport: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                >
                  <option value="">Select Sport</option>
                  {sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addTodayMatch}
                className="mt-4 bg-white text-black px-6 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
              >
                Schedule Match
              </button>
            </div>
          )}

          <div className="space-y-3">
            {todayMatches.map(match => (
              <div key={match.id} className="bg-black border border-zinc-800 rounded-md p-5 hover:border-zinc-700 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center justify-between">
                    <div className="text-right flex-1">
                      <p className="text-lg font-light text-white">{getTeamName(match.team1)}</p>
                    </div>
                    <div className="mx-8 text-center">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-md px-5 py-2">
                        <p className="text-xs text-gray-500 font-light mb-0.5">{match.sport}</p>
                        <p className="text-xl font-light text-white">{match.time}</p>
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-lg font-light text-white">{getTeamName(match.team2)}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteTodayMatch(match.id)}
                      className="ml-4 text-gray-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {todayMatches.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                <p className="text-gray-600 text-sm font-light">No matches scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-8 mb-6 border border-zinc-800">

          {/* Standings Table */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white">Standings</h2>
              {isAdmin && (
                <button
                  onClick={addTeam}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Team
                </button>
              )}
            </div>
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black border-b border-zinc-800">
                    <th className="p-4 text-left text-gray-500 font-medium text-xs uppercase tracking-wider">Pos</th>
                    <th className="p-4 text-left text-gray-500 font-medium text-xs uppercase tracking-wider">Team</th>
                    <th className="p-4 text-left text-gray-500 font-medium text-xs uppercase tracking-wider">Sport</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">P</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">W</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">D</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">L</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">GF</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">GA</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">GD</th>
                    <th className="p-4 text-center text-gray-500 font-medium text-xs uppercase tracking-wider">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team.id} className={`border-b border-zinc-800 hover:bg-zinc-900 transition group`}>
                      <td className="p-4 font-light text-gray-400">{index + 1}</td>
                      <td className="p-4">
                        {editingTeam === team.id && isAdmin ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-black border border-zinc-800 rounded-md px-3 py-1.5 flex-1 text-white text-sm focus:outline-none focus:border-white"
                              autoFocus
                            />
                            <button onClick={saveTeamName} className="text-white hover:text-gray-300">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingTeam(null)} className="text-gray-600 hover:text-gray-400">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-light text-white">{team.name}</span>
                            {isAdmin && (
                              <button onClick={() => startEditTeam(team)} className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {editingTeam === team.id && isAdmin ? (
                          <select
                            value={editTeamSport}
                            onChange={(e) => setEditTeamSport(e.target.value)}
                            className="bg-black border border-zinc-800 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white"
                          >
                            <option value="">No Sport</option>
                            {sports.map(sport => (
                              <option key={sport} value={sport}>{sport}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400 text-sm">{team.sport || '-'}</span>
                        )}
                      </td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.played}</td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.won}</td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.drawn}</td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.lost}</td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.goalsFor}</td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.goalsAgainst}</td>
                      <td className="p-4 text-center text-gray-400 font-light">{team.goalsFor - team.goalsAgainst}</td>
                      <td className="p-4 text-center font-medium text-white">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Match Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white">Match Results</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMatch(!showAddMatch)}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Result
                </button>
              )}
            </div>

            {showAddMatch && (
              <div className="bg-black p-5 rounded-md mb-6 border border-zinc-800">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <select
                    value={newMatch.team1}
                    onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                  >
                    <option value="">Select Team 1</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={newMatch.score1}
                    onChange={(e) => setNewMatch({ ...newMatch, score1: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 placeholder-gray-600 text-sm focus:outline-none focus:border-white"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={newMatch.score2}
                    onChange={(e) => setNewMatch({ ...newMatch, score2: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 placeholder-gray-600 text-sm focus:outline-none focus:border-white"
                  />
                  <select
                    value={newMatch.team2}
                    onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                  >
                    <option value="">Select Team 2</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  <select
                    value={newMatch.sport}
                    onChange={(e) => setNewMatch({ ...newMatch, sport: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-white"
                  >
                    <option value="">Select Sport</option>
                    {sports.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={addMatch}
                  className="mt-4 bg-white text-black px-6 py-2.5 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                >
                  Save Result
                </button>
              </div>
            )}

            {/* Match List */}
            <div className="space-y-3">
              {matches
                .filter(match => selectedSport === 'All Sports' || match.sport === selectedSport)
                .map(match => (
                <div key={match.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-md p-5 hover:border-zinc-700 transition group">
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-light text-white flex-1 text-right">{getTeamName(match.team1)}</span>
                    <div className="mx-8 flex items-center gap-3">
                      <span className="text-2xl font-light text-white">{match.score1}</span>
                      <span className="text-gray-700">-</span>
                      <span className="text-2xl font-light text-white">{match.score2}</span>
                    </div>
                    <span className="font-light text-white flex-1">{getTeamName(match.team2)}</span>
                    <span className="ml-4 text-gray-500 text-sm">{match.sport}</span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteMatch(match.id)}
                      className="ml-4 text-gray-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              {matches.filter(match => selectedSport === 'All Sports' || match.sport === selectedSport).length === 0 && (
                <div className="text-center py-12 bg-zinc-900 rounded-md border border-zinc-800">
                  <Trophy className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm font-light">No matches recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}