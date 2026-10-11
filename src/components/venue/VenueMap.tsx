export function VenueMap({ src, title }: { src: string; title: string }) {
  return (
    <div className="venue-map">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
