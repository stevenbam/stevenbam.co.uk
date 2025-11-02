import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { photoApi, Photo } from '../services/api';
import AdminProtected from './AdminProtected';
import EngagementPanel from './EngagementPanel';

const PhotosContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
`;

const PhotosHeader = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const UploadSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(139, 92, 246, 0.5);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadText = styled.p`
  margin: 0;
  color: #cbd5e1;
  font-size: 1.1rem;
`;

const CaptionInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PhotoCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(139, 92, 246, 0.3);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const PhotoInfo = styled.div`
  padding: 1.5rem;
`;

const PhotoCaption = styled.h3`
  color: #a78bfa;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const PhotoDate = styled.p`
  color: #94a3b8;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  grid-column: 1 / -1;
  padding: 3rem;
`;

const PhotoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  cursor: default;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #ffffff;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #8b5cf6;
  }
`;

const ModalCaption = styled.div`
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  text-align: center;
  color: #ffffff;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const ClickablePhotoImage = styled(PhotoImage)`
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
`;

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const fetchedPhotos = await photoApi.getAll();
      setPhotos(fetchedPhotos);
    } catch (err) {
      setError('Failed to load photos');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && caption.trim()) {
      try {
        setLoading(true);
        await photoApi.upload(selectedFile, caption.trim());
        setSelectedFile(null);
        setCaption('');
        setPreviewUrl('');
        await loadPhotos(); // Refresh the list
      } catch (err) {
        setError('Failed to upload photo');
        console.error('Error uploading photo:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const deletePhoto = async (id: number) => {
    try {
      setLoading(true);
      await photoApi.delete(id);
      await loadPhotos(); // Refresh the list
    } catch (err) {
      setError('Failed to delete photo');
      console.error('Error deleting photo:', err);
    } finally {
      setLoading(false);
    }
  };

  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePhotoModal();
    }
  };

  return (
    <PhotosContainer>
      <PhotosHeader>Photo Gallery</PhotosHeader>
      
      <UploadSection>
        <h3 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Upload New Photo</h3>
        
        <AdminProtected 
          isAuthenticated={isAdminAuthenticated}
          onAuthenticated={() => setIsAdminAuthenticated(true)}
        >
          <UploadArea onClick={() => isAdminAuthenticated && document.getElementById('fileInput')?.click()}>
            <FileInput
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={!isAdminAuthenticated}
            />
            <UploadText>
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select an image'}
            </UploadText>
          </UploadArea>
          
          {previewUrl && (
            <PhotoImage 
              src={previewUrl} 
              alt="Preview" 
              style={{ marginBottom: '1rem', borderRadius: '8px' }}
            />
          )}
          
          <CaptionInput
            type="text"
            placeholder="Enter a caption for your photo"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={!isAdminAuthenticated}
          />
          
          <UploadButton 
            onClick={handleUpload}
            disabled={!selectedFile || !caption.trim() || loading || !isAdminAuthenticated}
          >
            {loading ? 'Uploading...' : 'Upload Photo'}
          </UploadButton>
        </AdminProtected>
      </UploadSection>

      {error && (
        <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <PhotoGrid>
        {loading && photos.length === 0 ? (
          <EmptyState>
            Loading photos...
          </EmptyState>
        ) : photos.length === 0 ? (
          <EmptyState>
            No photos uploaded yet. Share your first memory above!
          </EmptyState>
        ) : (
          photos.map(photo => (
            <PhotoCard key={photo.id}>
              <ClickablePhotoImage 
                src={photoApi.getImageUrl(photo)} 
                alt={photo.caption}
                onClick={() => openPhotoModal(photo)}
                title="Click to view full size"
              />
              <PhotoInfo>
                <PhotoCaption>{photo.caption}</PhotoCaption>
                <PhotoDate>Uploaded on {new Date(photo.uploadedDate).toLocaleDateString()}</PhotoDate>
                <AdminProtected 
                  isAuthenticated={isAdminAuthenticated}
                  onAuthenticated={() => setIsAdminAuthenticated(true)}
                >
                  <DeleteButton 
                    onClick={() => deletePhoto(photo.id)}
                    disabled={loading || !isAdminAuthenticated}
                  >
                    {loading ? 'Deleting...' : 'Delete Photo'}
                  </DeleteButton>
                </AdminProtected>
              </PhotoInfo>
              <EngagementPanel 
                contentType="photo"
                contentId={photo.id}
                initialMode="comments"
              />
            </PhotoCard>
          ))
        )}
      </PhotoGrid>

      {selectedPhoto && (
        <PhotoModal onClick={handleModalClick}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closePhotoModal}>×</CloseButton>
            <ModalImage 
              src={photoApi.getImageUrl(selectedPhoto)} 
              alt={selectedPhoto.caption}
            />
            <ModalCaption>
              {selectedPhoto.caption}
            </ModalCaption>
          </ModalContent>
        </PhotoModal>
      )}
    </PhotosContainer>
  );
};

export default Photos;