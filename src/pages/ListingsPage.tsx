import { useState, useEffect } from 'react';
import { useKeyboard } from '@opentui/react';
import type { Job, KeyEvent } from '../types/index.js';
import { t } from '../i18n/index.js';
import { useTheme } from '../hooks/useTheme.js';
import { JobCard } from '../components/JobCard.js';
import ScrollSurface from '../components/ScrollSurface.js';
import { useListNavigation } from '../hooks/useListNavigation.js';

interface ListingsPageProps {
  initialJobs?: Job[];
}

export const ListingsPage = ({ initialJobs = [] }: ListingsPageProps) => {
  const [selectedJob, setSelectedJob] = useState(0);
  const [jobs] = useState<Job[]>(initialJobs);
  const theme = useTheme();

  const scrollboxRef = useListNavigation({
    selectedIndex: selectedJob,
    isActive: true,
    buffer: 2,
  });

  useKeyboard((key: KeyEvent) => {
    if (key.name === 'up' && selectedJob > 0) {
      setSelectedJob(selectedJob - 1);
    } else if (key.name === 'down' && selectedJob < jobs.length - 1) {
      setSelectedJob(selectedJob + 1);
    }
  });

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 1 }}>
      <box style={{ flexDirection: "column", marginBottom: 1 }}>
        <text content={t('jobListings')} style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
        <text content={t('foundJobs', { count: jobs.length })} style={{ fg: 'gray' }} />
      </box>

      <ScrollSurface
        ref={scrollboxRef}
        variant="panel"
        focused
        width="100%"
      >
        {jobs.length === 0 ? (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <text content={t('noJobsFound')} style={{ fg: 'yellow' }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column" }}>
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                selected={index === selectedJob}
                footnote={index === selectedJob ? t('pressEnter') : undefined}
              />
            ))}
          </box>
        )}
      </ScrollSurface>
    </box>
  );
};
