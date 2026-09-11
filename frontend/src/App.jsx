import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { DirectorProvider, useDirector } from './context/DirectorContext';
import useAchievements from './hooks/useAchievements';
import useIntersectionRev from './hooks/useIntersectionRev';
import apiService from './services/api';

// Common visual elements & Resilience
import ErrorBoundary from './components/common/ErrorBoundary';
import GrainOverlay from './components/common/GrainOverlay';
import Letterbox from './components/common/Letterbox';
import Vignette from './components/common/Vignette';
import StarCanvas from './components/common/StarCanvas';
import AuroraCanvas from './components/common/AuroraCanvas';
import AmbientParticles from './components/common/AmbientParticles';
import AchievementToast from './components/common/AchievementToast';

// Navigation & Interactive Controls
import FloatingToolbar from './components/navigation/FloatingToolbar';
import MusicPlayer from './components/navigation/MusicPlayer';
import NowPlaying from './components/navigation/NowPlaying';
import ThemeSwitcher from './components/navigation/ThemeSwitcher';

// Intro sequence
import FilmCountdown from './components/intro/FilmCountdown';
import IntroSequencer from './components/intro/IntroSequencer';

// Story sections
import HeroSection from './components/sections/HeroSection';
import StoryScene from './components/sections/StoryScene';
import InterludeQuote from './components/sections/InterludeQuote';
import MemoryCarousel3D from './components/sections/MemoryCarousel3D';
import FlipCardsGrid from './components/sections/FlipCardsGrid';
import TimelineSection from './components/sections/TimelineSection';
import PolaroidWall from './components/sections/PolaroidWall';
import PhotoGallery from './components/sections/PhotoGallery';
import CakeSection from './components/sections/CakeSection';
import GiftBoxSection from './components/sections/GiftBoxSection';
import WishWallSection from './components/sections/WishWallSection';

import CinematicVideoSection from './components/sections/CinematicVideoSection';
import ShareCardSection from './components/sections/ShareCardSection';
import FinaleSection from './components/sections/FinaleSection';
import EndCredits from './components/sections/EndCredits';

// Modal
import PhotoModal from './components/modals/PhotoModal';

const AppContent = () => {
  const { introFinished, setIntroFinished } = useTheme();
  const { achievements, triggerAchievement } = useAchievements();

  const [inCountdown, setInCountdown] = useState(true);
  const [inIntro, setInIntro] = useState(false);
  const [mainReady, setMainReady] = useState(false);
  const [photos, setPhotos] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false, src: '', caption: '', slotId: null });
  const [confettiPieces, setConfettiPieces] = useState([]);


  // Scroll reveal observer
  useIntersectionRev([mainReady, introFinished]);



  // Load photos from backend
  useEffect(() => {
    let isMounted = true;
    apiService.getPhotos().then((data) => {
      if (Array.isArray(data) && isMounted) {
        const photoMap = {};
        data.forEach((p) => {
          photoMap[p.slot_id] = p;
        });
        setPhotos(photoMap);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setInCountdown(false);
    setInIntro(true);
  }, []);

  const handleSkipIntro = useCallback(() => {
    setInCountdown(false);
    setInIntro(false);
    setIntroFinished(true);
    setMainReady(true);
    setTimeout(() => {
      triggerAchievement('🎬', 'Curtain Rises', 'The story begins...');
    }, 800);
  }, [setIntroFinished, triggerAchievement]);

  const handleEnterSite = useCallback(() => {
    setInIntro(false);
    setIntroFinished(true);
    setMainReady(true);
    setTimeout(() => {
      triggerAchievement('🎬', 'Curtain Rises', 'The story begins...');
      setTimeout(() => {
        triggerAchievement('⭐', 'Explorer', 'You entered the cinematic experience');
      }, 2500);
    }, 600);
  }, [setIntroFinished, triggerAchievement]);

  // Photo upload handler
  const handlePhotoUpload = async (slotId, imageUrl, caption, filterStyle = 'none') => {
    setPhotos((prev) => ({
      ...prev,
      [slotId]: { slot_id: slotId, image_url: imageUrl, caption, filter_style: filterStyle },
    }));

    try {
      const saved = await apiService.uploadPhoto({
        slot_id: slotId,
        image_url: imageUrl,
        caption,
        filter_style: filterStyle,
      });
      if (saved && saved.image_url) {
        setPhotos((prev) => ({
          ...prev,
          [slotId]: saved,
        }));
      }
    } catch (err) {
      console.warn('Failed to upload photo to backend:', err);
    }
  };

  // Lightbox Modal
  const openModal = (src, caption, slotId = null) => {
    setModalData({ isOpen: true, src, caption, slotId });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, src: '', caption: '', slotId: null });
  };

  // Confetti Blast
  const launchConfetti = useCallback(() => {
    const colors = ['#e8b84b', '#f5d07a', '#c9922a', '#e8a0b4', '#f5c8d8', '#fff8ef'];
    const newConfetti = Array.from({ length: 70 }, (_, i) => ({
      id: Date.now() + i,
      style: {
        left: `${Math.random() * 100}%`,
        background: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        width: `${Math.random() * 7 + 3}px`,
        height: `${Math.random() * 9 + 4}px`,
        animationDuration: `${Math.random() * 2 + 2.5}s`,
        animationDelay: `${Math.random() * 1.2}s`,
      },
    }));

    setConfettiPieces((prev) => [...prev, ...newConfetti]);
    setTimeout(() => {
      setConfettiPieces([]);
    }, 5500);
  }, []);

  return (
    <>
      <GrainOverlay />
      <Letterbox isIntro={!introFinished} />
      <Vignette />
      <StarCanvas />
      <AuroraCanvas />
      <AmbientParticles />
      <AchievementToast achievements={achievements} />



      {/* Retro Film Leader Countdown */}
      {inCountdown && (
        <FilmCountdown
          onComplete={handleCountdownComplete}
          onSkip={handleSkipIntro}
        />
      )}

      {/* Cinematic Intro Sequencer */}
      {inIntro && <IntroSequencer onEnterSite={handleEnterSite} />}

      {/* Confetti Elements */}
      {confettiPieces.map((c) => (
        <div key={c.id} className="cpiece" style={c.style} aria-hidden="true" />
      ))}

      {/* Floating Navigation Controls */}
      <MusicPlayer visible={mainReady} />
      <NowPlaying visible={mainReady} />
      <ThemeSwitcher visible={mainReady} />
      <FloatingToolbar visible={mainReady} />

      {/* Main Experience */}
      <main id="main" className={mainReady ? 'show' : ''} style={{ display: mainReady ? 'block' : 'none' }}>
        <div className="amb" aria-hidden="true" />

        {/* Hero Section */}
        <HeroSection />

        {/* Scene 1 */}
        <StoryScene
          sceneNumber="01"
          sceneLabel="Scene One"
          reverse={false}
          titleKey="scene_1_title"
          bodyKey="scene_1_body"
          captionKey="scene_1_caption"
          slotId="scene_1"
          photo={photos.scene_1}
          onPhotoUpload={handlePhotoUpload}
          onOpenModal={openModal}
        />

        {/* Interlude 1 */}
        <InterludeQuote
          quoteKey="interlude_1_quote"
          attrKey="interlude_1_attr"
          isPink={false}
        />

        {/* 3D Memory Carousel */}
        <MemoryCarousel3D
          onOpenModal={openModal}
          onTriggerAchievement={triggerAchievement}
        />

        {/* Scene 2 */}
        <StoryScene
          sceneNumber="02"
          sceneLabel="Scene Two"
          reverse={true}
          titleKey="scene_2_title"
          bodyKey="scene_2_body"
          captionKey="scene_2_caption"
          slotId="scene_2"
          photo={photos.scene_2}
          onPhotoUpload={handlePhotoUpload}
          onOpenModal={openModal}
        />

        {/* Scene 3 */}
        <StoryScene
          sceneNumber="03"
          sceneLabel="Scene Three"
          reverse={false}
          titleKey="scene_3_title"
          bodyKey="scene_3_body"
          captionKey="scene_3_caption"
          slotId="scene_3"
          photo={photos.scene_3}
          onPhotoUpload={handlePhotoUpload}
          onOpenModal={openModal}
        />

        {/* 3D Flip Cards: Why You're Amazing */}
        <FlipCardsGrid />

        {/* Scene 4 */}
        <StoryScene
          sceneNumber="04"
          sceneLabel="Scene Four"
          reverse={true}
          titleKey="scene_4_title"
          bodyKey="scene_4_body"
          captionKey="scene_4_caption"
          slotId="scene_4"
          photo={photos.scene_4}
          onPhotoUpload={handlePhotoUpload}
          onOpenModal={openModal}
        />

        {/* Friendship Timeline */}
        <TimelineSection />

        {/* Polaroid Wall */}
        <PolaroidWall
          photos={photos}
          onUploadPhoto={handlePhotoUpload}
          onTriggerAchievement={triggerAchievement}
        />

        {/* Photo Gallery with all 51 Dhanya memories */}
        <PhotoGallery
          photos={photos}
          onUploadPhoto={handlePhotoUpload}
          onOpenModal={openModal}
          onTriggerAchievement={triggerAchievement}
        />

        {/* Birthday Cake with Candles */}
        <CakeSection
          onTriggerConfetti={launchConfetti}
          onTriggerAchievement={triggerAchievement}
        />

        {/* Surprise Gift Box */}
        <GiftBoxSection
          onTriggerConfetti={launchConfetti}
          onTriggerAchievement={triggerAchievement}
        />

        {/* Floating Wish Wall */}
        <WishWallSection onTriggerAchievement={triggerAchievement} />

        {/* Cinematic Video Spotlight */}
        <CinematicVideoSection onTriggerAchievement={triggerAchievement} />

        {/* Shareable Card Generator */}
        <ShareCardSection onTriggerAchievement={triggerAchievement} />

        {/* Interlude 2 */}
        <InterludeQuote
          quoteKey="interlude_2_quote"
          attrKey="interlude_2_attr"
          isPink={true}
        />

        {/* Grand Finale */}
        <FinaleSection onTriggerAchievement={triggerAchievement} />

        {/* End Credits Roll */}
        <EndCredits />
      </main>

      {/* Lightbox Modal */}
      <PhotoModal
        isOpen={modalData.isOpen}
        photoSrc={modalData.src}
        caption={modalData.caption}
        slotId={modalData.slotId}
        onPhotoUpload={handlePhotoUpload}
        onTriggerAchievement={triggerAchievement}
        onClose={closeModal}
      />
    </>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AudioProvider>
          <DirectorProvider>
            <AppContent />
          </DirectorProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
