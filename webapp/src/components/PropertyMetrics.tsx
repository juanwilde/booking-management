import { PropertyMetrics as PropertyMetricsType } from '../types';

interface PropertyMetricsProps {
  metrics: PropertyMetricsType[];
}

export const PropertyMetrics = ({ metrics }: PropertyMetricsProps) => {
  const totalIncome = metrics.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = metrics.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = metrics.reduce((sum, m) => sum + m.profit, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Resumen por Propiedad
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            €{totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            €{totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Beneficio Total</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            €{totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Property Breakdown Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income by Property */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Ingresos por Propiedad
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Propiedad
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Ingresos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map(metric => (
                  <tr key={metric.propertyName}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {metric.propertyName}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                      €{metric.income.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses by Property */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Gastos por Propiedad
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Propiedad
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Gastos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map(metric => (
                  <tr key={metric.propertyName}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {metric.propertyName}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                      €{metric.expenses.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit by Property */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Beneficio por Propiedad
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Propiedad
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Beneficio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map(metric => (
                  <tr key={metric.propertyName}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {metric.propertyName}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right font-medium ${
                      metric.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      €{metric.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
