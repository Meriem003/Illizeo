import { useState, useEffect } from 'react';
import AnnouncementForm from '../components/AnnouncementForm';
import AnnouncementCard from '../components/AnnouncementCard';
import announcementService from '../services/announcementService';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau d'annonces</h1>
        <button
          onClick={fetchAnnouncements}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <AnnouncementForm onSubmit={handleCreate} />

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Chargement des annonces...</p>
        </div>
      )}
      
      {!loading && announcements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Aucune annonce pour le moment</p>
          <p className="text-gray-400 text-sm mt-2">Soyez le premier à publier !</p>
        </div>
      )}
      
      {!loading && announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;