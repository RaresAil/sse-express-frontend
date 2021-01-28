import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';

import { Nest } from './App';

export default function Table(props: { data: Nest[] }) {
  return (
    <HotTable
      licenseKey={'non-commercial-and-evaluation'}
      data={props.data.map(({ country, code, currency, level, units }) => [
        country,
        code,
        currency,
        level.toFixed(3),
        units
      ])}
      colHeaders={true}
      rowHeaders={true}
      width="600"
      height="300"
    />
  );
}
