import { useState, useEffect } from 'react';

export default function ProductImageCarousel({ images, productName }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Removed auto-slide functionality

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center rounded-lg bg-gray-200">
                <span className="text-gray-400">No image available</span>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="flex items-center justify-center rounded-lg bg-gray-100">
                <img
                    src={images[0].image_url}
                    alt={productName}
                    className="max-h-96 w-auto rounded-lg object-contain"
                />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Main Image */}
            <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={images[currentIndex].image_url}
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    className="max-h-full max-w-full object-contain transition-opacity duration-500"
                />

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
                    aria-label="Previous image"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
                    aria-label="Next image"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-4 flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => goToSlide(index)}
                        className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            index === currentIndex
                                ? 'border-indigo-600'
                                : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                        <img
                            src={image.image_url}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-20 w-20 object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Dot Indicators */}
            <div className="mt-4 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 w-2 rounded-full transition ${
                            index === currentIndex
                                ? 'bg-indigo-600 w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
