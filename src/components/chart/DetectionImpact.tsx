import { DiseasePreset } from "../../lib/types";

interface DetectionImpactProps {
  tenthDetectionDay: number;
  disease: DiseasePreset;
}

export function DetectionImpact({
  tenthDetectionDay,
  disease,
}: DetectionImpactProps) {
  const timeDifference = Math.abs(
    disease.firstDetectionDay - tenthDetectionDay
  );

  return (
    <>
      {tenthDetectionDay > 0 && (
        <div>
          <h3>Detection Impact</h3>
          <p className="text-sm text-gray-600">
            {tenthDetectionDay < 14 ? (
              <>
                Early detection provided approximately{" "}
                <strong>{timeDifference.toFixed(1)} additional days</strong> to
                respond compared to historical {disease.name} detection.
              </>
            ) : (
              <>
                Delayed detection resulted in approximately{" "}
                <strong>{timeDifference.toFixed(1)} fewer days</strong> to
                respond compared to historical {disease.name} detection.
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
}
