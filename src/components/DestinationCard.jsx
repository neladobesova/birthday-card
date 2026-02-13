export default function DestinationCard({ destination, onLinkClick }) {
  const handleClick = () => {
    onLinkClick(destination.name, destination.airbnbUrl);
    window.open(destination.airbnbUrl, "_blank");
  };

  return (
    <div className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
        className="destination-image"
        loading="lazy"
      />
      <div className="destination-content">
        <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
        <p className="text-gray-600 mb-4">{destination.description}</p>
        <button
          className="btn btn-primary w-full"
          onClick={handleClick}
        >
          Proklik na Ubytko 🏠
        </button>
      </div>
    </div>
  );
}
