import React from 'react';

const MOOD_IMAGES = {
  worried:    '/sajang_worried.png',
  determined: '/sajang_normal.png',
  happy:      '/sajang_happy.png',
  ecstatic:   '/sajang_happy.png',
  crisis:     '/sajang_crisis.png',
  bankrupt:   '/sajang_bankrupt.png',
};

export default function SajangCharacter({ size = 180, mood = 'worried' }) {
  const src = MOOD_IMAGES[mood] || MOOD_IMAGES.worried;

  return (
    <img
      src={src}
      alt={`아저씨 ${mood}`}
      style={{
        width: size,
        height: size * 1.5,
        objectFit: 'contain',
        objectPosition: 'bottom',
      }}
    />
  );
}
