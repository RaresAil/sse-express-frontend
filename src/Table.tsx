import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';

import { Nest } from './App';

export default function Table(props: { data: Nest[] }) {
  return (
    <HotTable
      licenseKey={'non-commercial-and-evaluation'}
      data={props.data.map(
        ({ country, code, currency, level, units, total, quantity }) => [
          country,
          code,
          currency,
          level.toFixed(3),
          units,
          total,
          quantity
        ]
      )}
      colHeaders={[
        'Country',
        'Code',
        'Currency',
        'Level',
        'Units',
        'Total',
        'Quantity'
      ]}
      rowHeaders={true}
      beforeChange={(changes, method) => {
        const [row, col, oldValue, newValue] = changes[0];
        if (method !== 'edit' || oldValue === newValue || col !== 6) {
          return;
        }

        const itemId = props.data[row]?.id;

        if (!itemId) {
          return;
        }

        fetch(`/api/v1/sse/quantity/${itemId}`, {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: parseInt(newValue)
          }),
          method: 'PUT'
        });
      }}
      cells={(row, col) => {
        let cellProperties = {};
        if (col !== 6) {
          cellProperties = {
            ...cellProperties,
            readOnly: true
          };
        }
        return cellProperties;
      }}
    />
  );
}
