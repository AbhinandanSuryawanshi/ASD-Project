import React from "react";
import { Card } from "@/components/ui/card";

/**
 * Renders a 2x2 confusion matrix as a heatmap.
 * Rows: Actual (No ASD, ASD), Cols: Predicted (No ASD, ASD)
 */
const ConfusionMatrixHeatmap = ({ matrix, title, className = "" }) => {
  if (!matrix || matrix.length !== 2 || matrix[0].length !== 2) return null;

  const [[tn, fp], [fn, tp]] = matrix;
  const maxVal = Math.max(tn, fp, fn, tp, 1);

  const cellStyle = (value) => ({
    backgroundColor: `rgba(59, 130, 246, ${0.2 + (value / maxVal) * 0.8})`,
    color: value / maxVal > 0.5 ? "white" : "rgb(30 58 138)",
    fontWeight: 600,
  });

  return (
    <Card className={`p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-text-primary mb-3">{title}</h4>
      <div className="inline-block border border-stone-200 rounded-lg overflow-hidden">
        <table className="text-sm">
          <thead>
            <tr>
              <th className="p-2 border-b border-r border-stone-200 bg-stone-50 text-text-secondary font-medium" />
              <th className="p-2 border-b border-r border-stone-200 bg-stone-50 text-text-secondary font-medium" colSpan="2">
                Predicted
              </th>
            </tr>
            <tr>
              <th className="p-2 border-r border-stone-200 bg-stone-50 text-text-secondary font-medium text-left">Actual</th>
              <th className="p-2 border-r border-stone-200 bg-stone-100 text-text-secondary font-medium w-16">No ASD</th>
              <th className="p-2 border-stone-200 bg-stone-100 text-text-secondary font-medium w-16">ASD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-r border-b border-stone-200 bg-stone-50 text-text-secondary font-medium">No ASD</td>
              <td className="p-3 border-r border-b border-stone-200 text-center" style={cellStyle(tn)}>{tn}</td>
              <td className="p-3 border-b border-stone-200 text-center" style={cellStyle(fp)}>{fp}</td>
            </tr>
            <tr>
              <td className="p-2 border-r border-stone-200 bg-stone-50 text-text-secondary font-medium">ASD</td>
              <td className="p-3 border-r border-stone-200 text-center" style={cellStyle(fn)}>{fn}</td>
              <td className="p-3 border-stone-200 text-center" style={cellStyle(tp)}>{tp}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted mt-2">TN: {tn} · FP: {fp} · FN: {fn} · TP: {tp}</p>
    </Card>
  );
};

export default ConfusionMatrixHeatmap;
