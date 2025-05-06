import { useState, useEffect } from 'react';
import { RefreshCw, Award, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

// Define types for our data
type Team = {
  name: string;
  logo: string;
  shortName: string;
};

type LiveMatch = {
  id: string;
  status: 'live' | 'upcoming' | 'completed';
  team1: Team;
  team2: Team;
  team1Score?: string;
  team2Score?: string;
  currentBatting?: string;
  currentBowling?: string;
  venue: string;
  date: string;
  time: string;
  result?: string;
  liveText?: string;
};

type PointsTableEntry = {
  team: Team;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  nrr: number;
  points: number;
};

type ScheduleMatch = {
  id: string;
  team1: Team;
  team2: Team;
  venue: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'live';
  result?: string;
};

// Define team logo URLs
const teamLogos = {
  CSK: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/CSK.png?v=2",
  MI: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/MI.png?v=2",
  RCB: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/RCB.png?v=2",
  RR: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/RR.png?v=2",
  DC: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/DC.png?v=2",
  KKR: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/KKR.png?v=2",
  GT: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/GT.png?v=2",
  LSG: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/LSG.png?v=2",
  SRH: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/SRH.png?v=2",
  PBKS: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/PBKS.png?v=2"
};

export default function IPLDashboard() {
  const [activeTab, setActiveTab] = useState('live');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // State variables for our data
  const [liveMatch, setLiveMatch] = useState<LiveMatch | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<LiveMatch[]>([]);
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [schedule, setSchedule] = useState<ScheduleMatch[]>([]);

  // Fetch data from our API
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/scrape');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Update state with the fetched data
      setLiveMatch(data.liveMatch);
      setUpcomingMatches(data.upcomingMatches);
      setPointsTable(data.pointsTable);
      setSchedule(data.schedule);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error(err);
      
      // Load dummy data if API fails
      loadDummyData();
    } finally {
      setIsLoading(false);
    }
  };

  // Load dummy data for development or when API fails
  const loadDummyData = () => {
    // Dummy Live Match
    setLiveMatch({
      id: 'match1',
      status: 'live',
      team1: { name: 'Chennai Super Kings', shortName: 'CSK', logo: teamLogos.CSK },
      team2: { name: 'Mumbai Indians', shortName: 'MI', logo: teamLogos.MI },
      team1Score: '182/4 (20)',
      team2Score: '120/6 (13.0)',
      currentBatting: 'MI',
      currentBowling: 'CSK',
      venue: 'Wankhede Stadium, Mumbai',
      date: '03 May 2025',
      time: '7:30 PM IST',
      liveText: 'MI need 63 runs from 42 balls'
    });
    
    // Dummy Upcoming Matches
    setUpcomingMatches([
      {
        id: 'match2',
        status: 'upcoming',
        team1: { name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: teamLogos.RCB },
        team2: { name: 'Rajasthan Royals', shortName: 'RR', logo: teamLogos.RR },
        venue: 'M. Chinnaswamy Stadium, Bangalore',
        date: '04 May 2025',
        time: '3:30 PM IST'
      },
      {
        id: 'match3',
        status: 'upcoming',
        team1: { name: 'Delhi Capitals', shortName: 'DC', logo: teamLogos.DC },
        team2: { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: teamLogos.KKR },
        venue: 'Arun Jaitley Stadium, Delhi',
        date: '04 May 2025',
        time: '7:30 PM IST'
      }
    ]);
    
    // Dummy Points Table
    setPointsTable([
      { team: { name: 'Gujarat Titans', shortName: 'GT', logo: teamLogos.GT }, matches: 10, won: 8, lost: 2, tied: 0, nrr: 0.825, points: 16 },
      { team: { name: 'Rajasthan Royals', shortName: 'RR', logo: teamLogos.RR }, matches: 10, won: 7, lost: 3, tied: 0, nrr: 0.591, points: 14 },
      { team: { name: 'Chennai Super Kings', shortName: 'CSK', logo: teamLogos.CSK }, matches: 11, won: 6, lost: 5, tied: 0, nrr: 0.356, points: 12 },
      { team: { name: 'Lucknow Super Giants', shortName: 'LSG', logo: teamLogos.LSG }, matches: 10, won: 6, lost: 4, tied: 0, nrr: 0.307, points: 12 },
      { team: { name: 'Delhi Capitals', shortName: 'DC', logo: teamLogos.DC }, matches: 11, won: 5, lost: 6, tied: 0, nrr: -0.442, points: 10 },
      { team: { name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: teamLogos.RCB }, matches: 10, won: 5, lost: 5, tied: 0, nrr: 0.068, points: 10 },
      { team: { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: teamLogos.KKR }, matches: 10, won: 5, lost: 5, tied: 0, nrr: -0.174, points: 10 },
      { team: { name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: teamLogos.SRH }, matches: 10, won: 4, lost: 6, tied: 0, nrr: -0.186, points: 8 },
      { team: { name: 'Punjab Kings', shortName: 'PBKS', logo: teamLogos.PBKS }, matches: 10, won: 4, lost: 6, tied: 0, nrr: -0.309, points: 8 },
      { team: { name: 'Mumbai Indians', shortName: 'MI', logo: teamLogos.MI }, matches: 10, won: 3, lost: 7, tied: 0, nrr: -0.954, points: 6 }
    ]);
    
    // Dummy Schedule
    setSchedule([
      {
        id: 'match1',
        team1: { name: 'Chennai Super Kings', shortName: 'CSK', logo: teamLogos.CSK },
        team2: { name: 'Mumbai Indians', shortName: 'MI', logo: teamLogos.MI },
        venue: 'Wankhede Stadium, Mumbai',
        date: '03 May 2025',
        time: '7:30 PM IST',
        status: 'live'
      },
      {
        id: 'match2',
        team1: { name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: teamLogos.RCB },
        team2: { name: 'Rajasthan Royals', shortName: 'RR', logo: teamLogos.RR },
        venue: 'M. Chinnaswamy Stadium, Bangalore',
        date: '04 May 2025',
        time: '3:30 PM IST',
        status: 'upcoming'
      },
      {
        id: 'match3',
        team1: { name: 'Delhi Capitals', shortName: 'DC', logo: teamLogos.DC },
        team2: { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: teamLogos.KKR },
        venue: 'Arun Jaitley Stadium, Delhi',
        date: '04 May 2025',
        time: '7:30 PM IST',
        status: 'upcoming'
      },
      {
        id: 'match4',
        team1: { name: 'Punjab Kings', shortName: 'PBKS', logo: teamLogos.PBKS },
        team2: { name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: teamLogos.SRH },
        venue: 'Punjab Cricket Association Stadium, Mohali',
        date: '05 May 2025',
        time: '7:30 PM IST',
        status: 'upcoming'
      },
      {
        id: 'match5',
        team1: { name: 'Gujarat Titans', shortName: 'GT', logo: teamLogos.GT },
        team2: { name: 'Lucknow Super Giants', shortName: 'LSG', logo: teamLogos.LSG },
        venue: 'Narendra Modi Stadium, Ahmedabad',
        date: '06 May 2025',
        time: '7:30 PM IST',
        status: 'upcoming'
      }
    ]);
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchData();
    
    // Set up interval to refresh data every 30 seconds for live matches
    const intervalId = setInterval(() => {
      if (activeTab === 'live' && liveMatch?.status === 'live') {
        fetchData();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [activeTab, liveMatch?.status]);

  // Format time since last update
  const getLastUpdatedText = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">IPL T20 Live Dashboard</h1>
          <div className="flex items-center text-sm">
            <span>Last updated: {getLastUpdatedText()}</span>
            <button 
              onClick={fetchData} 
              className="ml-3 p-2 rounded-full hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setActiveTab('live')}
            >
              Live/Upcoming
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'points' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setActiveTab('points')}
            >
              Points Table
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-start">
            <AlertCircle className="mr-2 flex-shrink-0" size={20} />
            <p>{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Live/Upcoming Matches Tab */}
            {activeTab === 'live' && (
              <div className="space-y-6">
                {/* Live Match Card */}
                {liveMatch && liveMatch.status === 'live' && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-600">
                    <div className="bg-blue-50 p-3 flex justify-between items-center">
                      <span className="flex items-center">
                        <span className="inline-block h-2 w-2 bg-red-600 rounded-full animate-pulse mr-2"></span>
                        <span className="font-bold text-red-600">LIVE</span>
                      </span>
                      <span className="text-sm text-gray-600">{liveMatch.venue}</span>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-6">
                        {/* Team 1 */}
                        <div className="text-center flex-1">
                          <div className="w-16 h-16 mx-auto mb-2">
                            <img src={liveMatch.team1.logo} alt={liveMatch.team1.name} className="w-full h-full object-contain" />
                          </div>
                          <h3 className="font-bold text-lg">{liveMatch.team1.shortName}</h3>
                          <p className="text-xl font-bold">{liveMatch.team1Score || '-'}</p>
                        </div>
                        
                        {/* VS */}
                        <div className="px-4">
                          <span className="text-xl font-bold text-gray-400">VS</span>
                        </div>
                        
                        {/* Team 2 */}
                        <div className="text-center flex-1">
                          <div className="w-16 h-16 mx-auto mb-2">
                            <img src={liveMatch.team2.logo} alt={liveMatch.team2.name} className="w-full h-full object-contain" />
                          </div>
                          <h3 className="font-bold text-lg">{liveMatch.team2.shortName}</h3>
                          <p className="text-xl font-bold">{liveMatch.team2Score || '-'}</p>
                        </div>
                      </div>
                      
                      {/* Live Commentary */}
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="font-medium text-blue-800">{liveMatch.liveText || 'Match in progress'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Upcoming Matches */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {liveMatch && liveMatch.status === 'live' ? 'Upcoming Matches' : 'Next Matches'}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingMatches.map(match => (
                      <div key={match.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-center mb-3">
                          {/* Team 1 */}
                          <div className="text-center flex-1">
                            <div className="w-12 h-12 mx-auto mb-1">
                              <img src={match.team1.logo} alt={match.team1.name} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-bold">{match.team1.shortName}</h3>
                          </div>
                          
                          {/* VS */}
                          <div className="px-2">
                            <span className="text-sm font-bold text-gray-400">VS</span>
                          </div>
                          
                          {/* Team 2 */}
                          <div className="text-center flex-1">
                            <div className="w-12 h-12 mx-auto mb-1">
                              <img src={match.team2.logo} alt={match.team2.name} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-bold">{match.team2.shortName}</h3>
                          </div>
                        </div>
                        
                        {/* Match Details */}
                        <div className="border-t pt-3 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            <span>{match.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2" />
                            <span>{match.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2" />
                            <span className="truncate">{match.venue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Points Table Tab */}
            {activeTab === 'points' && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="mr-2" size={20} />
                  Points Table
                </h2>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="py-3 px-4 text-left font-medium">Pos</th>
                          <th className="py-3 px-4 text-left font-medium">Team</th>
                          <th className="py-3 px-4 text-center font-medium">P</th>
                          <th className="py-3 px-4 text-center font-medium">W</th>
                          <th className="py-3 px-4 text-center font-medium">L</th>
                          <th className="py-3 px-4 text-center font-medium">T</th>
                          <th className="py-3 px-4 text-center font-medium">NRR</th>
                          <th className="py-3 px-4 text-center font-medium">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointsTable.map((entry, index) => (
                          <tr 
                            key={entry.team.shortName} 
                            className={`${index < 4 ? 'bg-blue-50' : ''} border-b hover:bg-gray-50`}
                          >
                            <td className="py-3 px-4 text-left">
                              {index + 1}
                              {index < 4 && <span className="ml-1 text-xs text-blue-600">(Q)</span>}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 mr-3">
                                  <img src={entry.team.logo} alt={entry.team.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="font-medium hidden md:block">{entry.team.name}</span>
                                <span className="font-medium md:hidden">{entry.team.shortName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">{entry.matches}</td>
                            <td className="py-3 px-4 text-center">{entry.won}</td>
                            <td className="py-3 px-4 text-center">{entry.lost}</td>
                            <td className="py-3 px-4 text-center">{entry.tied}</td>
                            <td className="py-3 px-4 text-center">{entry.nrr.toFixed(3)}</td>
                            <td className="py-3 px-4 text-center font-bold">{entry.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-xs p-3 bg-gray-50 border-t">
                    <span className="text-blue-600 font-medium">(Q)</span> - Qualified for playoffs
                  </div>
                </div>
              </div>
            )}
            
            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Match Schedule
                </h2>
                
                <div className="space-y-4">
                  {schedule.map((match) => (
                    <div 
                      key={match.id} 
                      className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                        match.status === 'live' 
                          ? 'border-red-500' 
                          : match.status === 'completed' 
                            ? 'border-gray-400' 
                            : 'border-blue-500'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center mb-3 md:mb-0">
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-500 mb-1">{match.date} • {match.time}</div>
                            <div className="flex items-center">
                              {match.status === 'live' && (
                                <span className="inline-flex items-center mr-2">
                                  <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
                                  <span className="text-xs font-medium text-red-500">LIVE</span>
                                </span>
                              )}
                              <span className="text-sm">{match.venue}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {/* Team 1 */}
                          <div className="text-center flex-1">
                            <div className="w-8 h-8 mx-auto mb-1">
                              <img src={match.team1.logo} alt={match.team1.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="font-medium text-sm">{match.team1.shortName}</div>
                          </div>
                          
                          {/* VS */}
                          <div className="px-4">
                            <span className="text-sm font-bold text-gray-400">VS</span>
                          </div>
                          
                          {/* Team 2 */}
                          <div className="text-center flex-1">
                            <div className="w-8 h-8 mx-auto mb-1">
                              <img src={match.team2.logo} alt={match.team2.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="font-medium text-sm">{match.team2.shortName}</div>
                          </div>
                        </div>
                        
                        {match.status === 'completed' && match.result && (
                          <div className="mt-3 md:mt-0 md:ml-4 text-sm font-medium">
                            {match.result}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center text-sm">
          <p>IPL T20 Live Dashboard | Data sourced from iplt20.com</p>
          <p className="text-gray-400 text-xs mt-1">This is a demonstration project and not affiliated with BCCI or IPL</p>
        </div>
      </footer>
    </div>
  );
}


