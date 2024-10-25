export interface Layer {
  id: number;
  data: ImageData;
  visible: boolean;
  name: string;
}

export interface ProjectData {
  layers: Layer[];
  imageData: string;
  version: number;
}