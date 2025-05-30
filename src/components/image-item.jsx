import { useApp } from "@/context/app-provider";
import { useState } from "react";

export const ImageItem = ({ image, isSelected }) => {
  const { handleSelectImage } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden h-full ${
        isSelected ? "ring-4 ring-primary" : "ring-1 ring-muted-foreground/50"
      }`}
      onClick={() => handleSelectImage(image)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      <img
        src={image.url}
        alt={image.prompt}
        className="w-full h-auto object-contain"
        onLoad={() => setIsLoading(false)}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};
