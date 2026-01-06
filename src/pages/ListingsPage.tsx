import { useState, useEffect } from 'react';
import type { Job } from '../types/index.js';
import { t } from '../i18n/index.js';
import { useTheme } from '../hooks/useTheme.js';
import { JobCard } from '../components/JobCard.js';
import ScrollSurface from '../components/ScrollSurface.js';
import { useListNavigation } from '../hooks/useListNavigation.js';

interface ListingsPageProps {
  initialJobs?: Job[];
  selectedJob: number;
  onJobSelect: (jobId: string) => void;
}

export const ListingsPage = ({ initialJobs = [], selectedJob, onJobSelect }: ListingsPageProps) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);

  const theme = useTheme();

  const scrollboxRef = useListNavigation({
    selectedIndex: selectedJob,
    isActive: true,
    useDynamicMetrics: true,
    buffer: 2,
    scrollBehavior: 'minimal',
  });

  useEffect(() => {
    // Filter jobs based on search query
    if (searchQuery.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [jobs, searchQuery]);

  useEffect(() => {
    // If no initial jobs provided, we could fetch them here
    if (initialJobs.length === 0) {
      setLoading(true);
      // For now, just use empty array - could add API call here
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [initialJobs.length]);

  if (loading) {
    return (
      <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        <text content={t('loadingJobs')} style={{ fg: 'blue' }} />
      </box>
    );
  }

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 1 }}>
      {/* Header */}
      <box style={{ flexDirection: "column", marginBottom: 1 }}>
        <text content={t('jobListings')} style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
        <text content={t('foundJobs', { count: filteredJobs.length })} style={{ fg: 'gray' }} />
      </box>

      {/* Search Bar */}
      {searchQuery && (
        <box style={{ border: true, marginBottom: 1, padding: 1 }}>
          <text content={t('search')} style={{ fg: 'yellow', marginRight: 1 }} />
          <text content={searchQuery} style={{ fg: 'white' }} />
        </box>
      )}

      {/* Job Filters */}
      <box style={{ flexDirection: "row", marginBottom: 1 }}>
        <text content={t('filters')} style={{ fg: 'cyan', marginRight: 1 }} />
        <text content={t('allTypes')} style={{ fg: 'white', marginRight: 2 }} />
        <text content={t('allLocations')} style={{ fg: 'white', marginRight: 2 }} />
        <text content={t('allCompanies')} style={{ fg: 'white' }} />
      </box>

      {/* Jobs List */}
      <ScrollSurface
        ref={scrollboxRef}
        variant="panel"
        focused
        width="100%"
      >
        {filteredJobs.length === 0 ? (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <text content={t('noJobsFound')} style={{ fg: 'yellow' }} />
            <text content={t('tryAdjustingSearch')} style={{ fg: 'gray', marginTop: 1 }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column" }}>
            {filteredJobs.map((job, index) => (
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

      {/* Footer */}
      <box style={{ border: true, padding: 1, marginTop: 1 }}>
        <text content={t('navJobs')} style={{ fg: 'blue' }} />
      </box>
    </box>
  );
};
