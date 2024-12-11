interface DetectionImpactProps {
  tenthDetectionDay: number;
}

export function DetectionImpact({ tenthDetectionDay }: DetectionImpactProps) {
  const timeDifference = Math.abs(14 - tenthDetectionDay);

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
                respond compared to historical COVID-19 detection.
              </>
            ) : (
              <>
                Delayed detection resulted in approximately{" "}
                <strong>{timeDifference.toFixed(1)} fewer days</strong> to
                respond compared to historical COVID-19 detection.
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
}
