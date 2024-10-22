import PixelArtEditor from '../../components/pixelArt/Editor';
import { Layer } from '@/types/image-editor';

function PixelArt() {
  const handleSave = (imageData: string, layers: Layer[]) => {
    // Implement your save logic here
    console.log('Saving:', imageData, layers);
  };

  const handleLoad = (projectData: { layers: Layer[] }) => {
    // Implement your load logic here
    console.log('Loading:', projectData);
  };

  const libraryImages = [
    '/path/to/image1.png',
    '/path/to/image2.png',
    // Add more image URLs as needed
  ];

  return (
    <div className="App">
      <h1>Pixel Art Editor</h1>
      <PixelArtEditor
        onSave={handleSave}
        onLoad={handleLoad}
        libraryImages={libraryImages}
      />
    </div>
  );
}

export default PixelArt;