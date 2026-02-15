import { useRef, useCallback, useEffect } from 'react';
import LoadSound from '../Assects/Souncd Effects/Load.wav';
import HoverSound from '../Assects/Souncd Effects/Hover.wav';
import ClickSound from '../Assects/Souncd Effects/Click.wav';

/* ============================================================
   SOUND EFFECTS HOOK - Using Custom Sound Files
   ============================================================ */

export function useSound() {
  const audioRefs = useRef({});
  const initializedRef = useRef(false);

  // Initialize audio elements
  const initializeAudio = useCallback(() => {
    if (initializedRef.current) return;
    
    console.log('🔊 Initializing audio system...');
    
    try {
      // Load sound (for page load/route change)
      if (!audioRefs.current.load) {
        audioRefs.current.load = new Audio(LoadSound);
        audioRefs.current.load.volume = 0.4;
        audioRefs.current.load.load();
      }
      
      // Hover sound (for cards/buttons)
      if (!audioRefs.current.hover) {
        audioRefs.current.hover = new Audio(HoverSound);
        audioRefs.current.hover.volume = 0.3;
        audioRefs.current.hover.load();
      }
      
      // Click sound (for buttons)
      if (!audioRefs.current.click) {
        audioRefs.current.click = new Audio(ClickSound);
        audioRefs.current.click.volume = 0.4;
        audioRefs.current.click.load();
      }
      
      initializedRef.current = true;
      console.log('✅ Audio system initialized');
    } catch (error) {
      console.error('❌ Audio initialization error:', error);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Play load/glitch sound (for page load/route change)
  const playGlitch = useCallback(() => {
    initializeAudio();
    try {
      console.log('🎵 Playing load sound...');
      audioRefs.current.load.currentTime = 0;
      audioRefs.current.load.play()
        .then(() => console.log('✅ Load sound played'))
        .catch((err) => {
          console.warn('⚠️ Load sound blocked:', err.message);
        });
    } catch (e) {
      console.error('❌ Load sound error:', e);
    }
  }, [initializeAudio]);

  // Play hover sound (for cards/buttons)
  const playHover = useCallback(() => {
    initializeAudio();
    try {
      audioRefs.current.hover.currentTime = 0;
      audioRefs.current.hover.play().catch((err) => {
        console.warn('⚠️ Hover sound blocked:', err.message);
      });
    } catch (e) {
      console.error('❌ Hover sound error:', e);
    }
  }, [initializeAudio]);

  // Play click sound (with electric effect)
  const playClick = useCallback(() => {
    initializeAudio();
    try {
      console.log('⚡ Click sound triggered');
      audioRefs.current.click.currentTime = 0;
      audioRefs.current.click.play()
        .then(() => console.log('✅ Click sound played'))
        .catch((err) => {
          console.warn('⚠️ Click sound blocked:', err.message);
        });
    } catch (e) {
      console.error('❌ Click sound error:', e);
    }
  }, [initializeAudio]);

  // Ambient sound (no file - silent function for compatibility)
  const playAmbient = useCallback(() => {
    // No ambient sound file - keeping function for compatibility
    console.log('ℹ️ Ambient sound not configured');
  }, []);

  // Stop ambient (no-op for compatibility)
  const stopAmbient = useCallback(() => {
    // No-op
  }, []);

  return {
    playGlitch,
    playHover,
    playClick,
    playAmbient,
    stopAmbient,
  };
}
