import React from 'react';
import Image from 'next/image';
import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-content">
        <div className="page-loader-bounce">
          <Image 
            src="/images/mascot-award-1.webp" 
            alt="Loading Mascot" 
            width={80} 
            height={80} 
            className="page-loader-image"
          />
        </div>
        <p className="page-loader-text">Memuat Data...</p>
      </div>
    </div>
  );
}
