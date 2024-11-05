// getImages.js
import imagen1 from "../../img/1.png";
import imagen2 from "../../img/2.png";
import imagen3 from "../../img/3.png";
import imagen4 from "../../img/4.png";
import imagen5 from "../../img/5.png";
import imagen6 from "../../img/6.png";

export const getImages = (size) => {
    // Array con todas las imágenes
    const images = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6];

    // Selecciona solo las primeras `size` imágenes
    const selectedImages = images.slice(0, size);

    // Duplica y mezcla las imágenes
    const duplicatedImages = selectedImages.flatMap(image => [image, image]).sort(() => Math.random() - 0.5);

    return duplicatedImages;
};
