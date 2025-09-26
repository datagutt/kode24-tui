import React from 'react';
import type { Frontpage } from '../types/index.js';

interface FrontpagePageProps {
  frontpageData: Frontpage;
  selectedSection: number;
  selectedArticle: number;
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToListings: () => void;
}

export const FrontpagePage = ({
  frontpageData,
  selectedSection,
  selectedArticle,
  onNavigateToArticle,
  onNavigateToListings,
}: FrontpagePageProps) => {
  return (
    <box style={{ flexDirection: "row", width: "100%", height: "100%" }}>
      {/* Sidebar with sections */}
      <box style={{ width: 30, backgroundColor: "gray", flexDirection: "column", padding: 1 }}>
        <text content="📑 Sections" style={{ fg: 'white', attributes: 1 }} />
        {frontpageData.frontpage.map((section, index) => (
          <box key={index} style={{ marginTop: 1, backgroundColor: index === selectedSection ? 'cyan' : undefined }}>
            <text 
              content={`${index === selectedSection ? '▶' : ' '} ${section.title}`} 
              style={{ fg: index === selectedSection ? 'black' : 'cyan' }} 
            />
          </box>
        ))}
        
        <box style={{ marginTop: 2 }}>
          <text content="💼 Quick Actions" style={{ fg: 'white', attributes: 1 }} />
        </box>
        <box style={{ marginTop: 1, backgroundColor: selectedSection === -1 ? 'cyan' : undefined }}>
          <text 
            content={`${selectedSection === -1 ? '▶' : ' '} View All Jobs`} 
            style={{ fg: selectedSection === -1 ? 'black' : 'yellow' }} 
          />
        </box>
      </box>
      
      {/* Main article area */}
      <box style={{ flexDirection: "column", padding: 1, width: "60%" }}>
        <text content="📰 Latest Articles" style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
        <scrollbox style={{ height: "100%" }}>
          {frontpageData.latestArticles.slice(0, 15).map((article, index) => (
            <box 
              key={article.id} 
              style={{
                marginBottom: 1,
                padding: 1,
                border: true,
                backgroundColor: index === selectedArticle ? 'blue' : undefined
              }}
            >
              <box style={{ flexDirection: "column" }}>
                <text 
                  content={article.title} 
                  style={{ fg: index === selectedArticle ? 'white' : 'white', attributes: 1 }} 
                />
                <text 
                  content={`${article.byline.name} - ${new Date(article.published).toLocaleDateString()}`} 
                  style={{ fg: 'gray' }} 
                />
                <text content={article.subtitle} style={{ fg: 'cyan' }} />
                <text 
                  content={`❤️ ${article.reactions.reactions_count} reactions | 💬 ${article.reactions.comments_count} comments`} 
                  style={{ fg: 'yellow' }} 
                />
              </box>
            </box>
          ))}
        </scrollbox>
      </box>
      
      {/* Right sidebar with jobs and events */}
      <box style={{ width: 35, backgroundColor: "darkblue", flexDirection: "column", padding: 1 }}>
        <text content="💼 Recent Jobs" style={{ fg: 'white', attributes: 1 }} />
        {frontpageData.jobs.slice(0, 5).map((job, index) => (
          <box key={job.id} style={{ marginTop: 1, padding: 1, border: true }}>
            <box style={{ flexDirection: "column" }}>
              <text content={job.title} style={{ fg: 'white' }} />
              <text content={job.company.name} style={{ fg: 'green' }} />
              <text content={job.type.toUpperCase()} style={{ fg: 'yellow' }} />
            </box>
          </box>
        ))}
        
        <text content="📅 Upcoming Events" style={{ fg: 'white', attributes: 1, marginTop: 2 }} />
        {frontpageData.events.upcomingEvents.slice(0, 3).map((event, index) => (
          <box key={index} style={{ marginTop: 1, padding: 1, border: true }}>
            <box style={{ flexDirection: "column" }}>
              <text content={event.name} style={{ fg: 'white' }} />
              <text content={event.arrangedBy} style={{ fg: 'green' }} />
              <text content={event.startDateFormatted} style={{ fg: 'yellow' }} />
            </box>
          </box>
        ))}
        
        <text content="💬 Recent Comments" style={{ fg: 'white', attributes: 1, marginTop: 2 }} />
        {frontpageData.newestComments.slice(0, 2).map((comment, index) => (
          <box key={index} style={{ marginTop: 1, padding: 1, border: true }}>
            <box style={{ flexDirection: "column" }}>
              <text content={comment.user.name} style={{ fg: 'green' }} />
              <text content={comment.bodySnippet.slice(0, 50) + '...'} style={{ fg: 'white' }} />
            </box>
          </box>
        ))}
      </box>
    </box>
  );
};