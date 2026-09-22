import { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";

export default function MainPhoto() {
    const [loading, setLoading] = useState(true);
    const [videoFailed, setVideoFailed] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleLoadedData = () => setLoading(false);
        const handleError = () => {
            setVideoFailed(true);
            setLoading(false);
        };

        videoElement.addEventListener("loadeddata", handleLoadedData);
        videoElement.addEventListener("error", handleError);

        return () => {
            videoElement.removeEventListener("loadeddata", handleLoadedData);
            videoElement.removeEventListener("error", handleError);
        };
    }, []);

    return (
        <section className="flex uppercase justify-center flex-col text-pseudo overflow-hidden min-h-[280px] md:min-h-[500px]">
            {loading && <Skeleton height={500} width="100%" className="absolute inset-0" />}
            {videoFailed ? (
                <div
                    className="md:absolute top-0 left-0 min-w-full md:h-full min-h-[280px] md:min-h-[500px] bg-gradient-to-br from-primary to-primaryDark"
                    aria-hidden
                />
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    playsInline
                    className="md:absolute top-0 left-0 min-w-full md:h-full object-cover pointer-events-none"
                >
                    <source src="/videos/main.webm" type="video/webm" />
                    <source src="/videos/main2.mp4" type="video/mp4" />
                </video>
            )}
        </section>
    );
}
