import { useState, useEffect } from 'react';
import AnnouncementForm from '../components/AnnouncementForm';
import AnnouncementCard from '../components/AnnouncementCard';
import announcementService from '../services/announcementService';
import { RefreshCw, MessageSquare, AlertCircle, TrendingUp, Bell, Filter, SortDesc } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await announcementService.getAll();
      setAnnouncements(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (data) => {
    try {
      await announcementService.create(data);
      await fetchAnnouncements(); 
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
      console.error(err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await announcementService.update(id, data);
      await fetchAnnouncements();
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'annonce');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await announcementService.delete(id);
      await fetchAnnouncements();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'annonce');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Tableau de bord</h1>
                <p className="text-neutral-500 text-sm mt-0.5">Bonjour {user?.name} 👋</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => fetchAnnouncements(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-neutral-200 hover:border-primary-200 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">Actualiser</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Annonces</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{announcements.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
              <Bell className="w-7 h-7 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">Active</span>
          </div>
        </div>

        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Cette semaine</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {announcements.filter(a => {
                  const date = new Date(a.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date > weekAgo;
                }).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-success-100 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500">
            <span>Nouvelles publications</span>
          </div>
        </div>

        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Mes annonces</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {announcements.filter(a => a.user_id === user?.id).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-warning-100 rounded-2xl flex items-center justify-center">
              <Filter className="w-7 h-7 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500">
            <span>Publications personnelles</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-2xl animate-slide-in-right">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-error-700">{error}</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="text-error-600 hover:text-error-700"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
      )}

      <AnnouncementForm onSubmit={handleCreate} />

      {loading && (
        <div className="text-center py-20">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-neutral-600 font-medium text-lg">Chargement des annonces...</p>
          <p className="mt-2 text-neutral-400 text-sm">Veuillez patienter</p>
        </div>
      )}
      
      {!loading && announcements.length === 0 && (
        <div className="text-center py-20 card">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl mb-6 shadow-lg shadow-primary-500/10">
            <MessageSquare className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Aucune annonce pour le moment</h3>
          <p className="text-neutral-500 max-w-md mx-auto">
            Soyez le premier à publier une annonce et partagez des informations importantes avec votre équipe !
          </p>
        </div>
      )}
      
      {/* Announcements List */}
      {!loading && announcements.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
              <SortDesc className="w-5 h-5 text-neutral-500" />
              Annonces récentes
            </h2>
            <span className="text-sm text-neutral-500">
              {announcements.length} résultat{announcements.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className="animate-slide-in-right"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <AnnouncementCard
                announcement={announcement}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
