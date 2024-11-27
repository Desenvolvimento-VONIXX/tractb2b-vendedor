import React, { useState } from "react";

interface StarRatingProps {
  id: string;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ id, onChange }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex flex-row-reverse justify-center items-center space-x-1">
      {[5, 4, 3, 2, 1].map((star) => (
        <div
          key={star}
          className="flex items-center"
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <input
            type="radio"
            name="rating"
            value={star}
            id={`${id}-${star}`}
            className="hidden"
            onChange={() => {
              setRating(star);
              onChange(star); // Chama onChange para passar o valor ao componente pai
            }}
          />
          <label
            htmlFor={`${id}-${star}`}
            className={`cursor-pointer text-3xl ${
              (hoveredRating || rating) >= star
                ? "text-yellow-400"
                : "text-gray-400"
            } hover:text-yellow-300`}
          >
            ★
          </label>
        </div>
      ))}
    </div>
  );
};

export default StarRating;
