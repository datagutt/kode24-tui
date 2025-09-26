import { useState, useEffect } from 'react';
import type { Job } from '../types/index.js';

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
        <text content="Loading job listings..." style={{ fg: 'blue' }} />
      </box>
    );
  }

  return (
    <box style={{ flexDirection: "column", height: "100%", width: "100%", padding: 1 }}>
      {/* Header */}
      <box style={{ flexDirection: "column", marginBottom: 1 }}>
        <text content="💼 Job Listings" style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
        <text content={`Found ${filteredJobs.length} jobs`} style={{ fg: 'gray' }} />
      </box>

      {/* Search Bar */}
      {searchQuery && (
        <box style={{ border: true, marginBottom: 1, padding: 1 }}>
          <text content="🔍 Search: " style={{ fg: 'yellow', marginRight: 1 }} />
          <text content={searchQuery} style={{ fg: 'white' }} />
        </box>
      )}

      {/* Job Filters */}
      <box style={{ flexDirection: "row", marginBottom: 1 }}>
        <text content="Filters: " style={{ fg: 'cyan', marginRight: 1 }} />
        <text content="All Types" style={{ fg: 'white', marginRight: 2 }} />
        <text content="All Locations" style={{ fg: 'white', marginRight: 2 }} />
        <text content="All Companies" style={{ fg: 'white' }} />
      </box>

      {/* Jobs List */}
      <scrollbox style={{ height: "100%", width: "100%" }}>
        {filteredJobs.length === 0 ? (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <text content="No jobs found" style={{ fg: 'yellow' }} />
            <text content="Try adjusting your search or filters" style={{ fg: 'gray', marginTop: 1 }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column" }}>
            {filteredJobs.map((job, index) => (
              <box 
                key={job.id} 
                style={{
                  border: true,
                  marginBottom: 1,
                  padding: 1,
                  backgroundColor: index === selectedJob ? 'blue' : undefined
                }}
              >
                <box style={{ flexDirection: "row", width: "100%" }}>
                  {/* Left: Job Details */}
                  <box style={{ flexDirection: "column", width: "70%" }}>
                    <text 
                      content={job.title} 
                      style={{ fg: index === selectedJob ? 'white' : 'white', attributes: 1 }} 
                    />
                    <text 
                      content={`🏢 ${job.company.name}`} 
                      style={{ fg: 'green', marginTop: 1 }} 
                    />
                    {job.applicationTitle && (
                      <text 
                        content={job.applicationTitle} 
                        style={{ fg: 'gray', marginTop: 1 }} 
                      />
                    )}
                  </box>

                  {/* Right: Job Meta */}
                  <box style={{ flexDirection: "column", width: "30%", alignItems: "flex-end" }}>
                    <text 
                      content={job.type.toUpperCase()} 
                      style={{ fg: 'yellow', marginBottom: 1 }} 
                    />

                    <text 
                      content={`📅 Posted ${new Date(job.published).toLocaleDateString()}`} 
                      style={{ fg: 'blue' }} 
                    />
                  </box>
                </box>

                {/* Job type tag */}
                <box style={{ flexDirection: "row", marginTop: 1 }}>
                  <text content="🏷️ " style={{ fg: 'cyan', marginRight: 1 }} />
                  <text content={job.type} style={{ fg: 'cyan' }} />
                </box>

                {/* Action hint */}
                {index === selectedJob && (
                  <box style={{ marginTop: 1 }}>
                    <text content="Press Enter to view job details" style={{ fg: 'white', attributes: 1 }} />
                  </box>
                )}
              </box>
            ))}
          </box>
        )}
      </scrollbox>

      {/* Footer */}
      <box style={{ border: true, padding: 1, marginTop: 1 }}>
        <text content="Navigation: ↑↓ Browse jobs | Enter View details | s Search | f Filter" style={{ fg: 'blue' }} />
      </box>
    </box>
  );
};