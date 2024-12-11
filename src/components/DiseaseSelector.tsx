import { Bug } from "lucide-react";
import { DiseasePreset } from "../lib/types";

interface Props {
  presets: DiseasePreset[];
  onSelect: (preset: DiseasePreset) => void;
  selectedDisease: string;
}

export function DiseaseSelector({ presets, onSelect, selectedDisease }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bug className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-700">Select Pathogen</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selectedDisease === preset.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}
