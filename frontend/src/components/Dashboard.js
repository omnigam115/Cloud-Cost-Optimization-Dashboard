import React from 'react';
import SummaryCards from './SummaryCards';
import Charts from './Charts';
import ServiceTable from './ServiceTable';
import Recommendations from './Recommendations';

const s = {
  page: { maxWidth: 1280, margin: '0 auto', padding: '32px 24px' },
  sectionTitle: {
    fontWeight: 800, fontSize: 22, marginBottom: 20,
    letterSpacing: '-0.02em', color: 'var(--text)',
  },
};

export default function Dashboard({ data }) {
  return (
    <div style={s.page}>
      <SummaryCards summary={data.summary} />
      <Charts data={data} />
      <ServiceTable services={data.topServices} />
      <Recommendations recommendations={data.recommendations} />
    </div>
  );
}
