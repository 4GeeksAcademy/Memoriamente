fetchImages: async () => {
    try {

        const response = await fetch(`https://rickandmortyapi.com/api/character`);
        const data = await response.json();

        // Asegúrate de que la URL de las imágenes esté en `data.results`
        const images = await data.results.slice(0, 5).map((item) => item.image); // Obtén solo las primeras 20 imágenes

        // Duplica y mezcla aleatoriamente las imágenes
        const shuffledImages = await images
            .flatMap((item) => [`1|${item}`, `2|${item}`]) // Duplica cada imagen con identificadores
            .sort(() => Math.random() - 0.5); // Mezcla las imágenes

        // Aumentar el size en cada llamada
        const storeSize = getStore().size || 1; // Toma el size actual, o inicia en 1 si no existe
        setStore({ images: shuffledImages, size: storeSize + 1, clicks: 0 }); // Aumenta el size en 1 cada vez


        return data;
    } catch (error) {
        console.error("Error al cargar las imágenes desde la API:", error);
    }
}
