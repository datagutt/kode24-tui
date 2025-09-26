import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

interface TagsPageProps {
  selectedTag: number;
  onTagSelect: (tag: string) => void;
}

interface TagInfo {
  name: string;
  count: number;
  description?: string;
}

export const TagsPage = ({ selectedTag, onTagSelect }: TagsPageProps) => {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [tagArticles, setTagArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTagName, setSelectedTagName] = useState<string | null>(null);

  // Popular programming tags for demo purposes
  const popularTags: TagInfo[] = [
    { name: 'JavaScript', count: 1247, description: 'Web development with JavaScript' },
    { name: 'Python', count: 892, description: 'Python programming and data science' },
    { name: 'React', count: 634, description: 'React.js and frontend development' },
    { name: 'TypeScript', count: 423, description: 'TypeScript and type-safe development' },
    { name: 'Node.js', count: 389, description: 'Server-side JavaScript with Node.js' },
    { name: 'DevOps', count: 276, description: 'DevOps practices and tools' },
    { name: 'AI', count: 234, description: 'Artificial Intelligence and Machine Learning' },
    { name: 'Cloud', count: 198, description: 'Cloud computing and services' },
    { name: 'Cybersecurity', count: 167, description: 'Security and privacy topics' },
    { name: 'Mobile', count: 145, description: 'Mobile app development' },
    { name: 'Go', count: 123, description: 'Go programming language' },
    { name: 'Rust', count: 98, description: 'Rust systems programming' },
    { name: 'Docker', count: 87, description: 'Containerization with Docker' },
    { name: 'Kubernetes', count: 76, description: 'Container orchestration' },
    { name: 'Database', count: 65, description: 'Database design and management' },
  ];

  useEffect(() => {
    setTags(popularTags);
  }, []);

  useEffect(() => {
    if (selectedTagName) {
      fetchTagArticles(selectedTagName);
    }
  }, [selectedTagName]);

  const fetchTagArticles = async (tagName: string) => {
    try {
      setLoading(true);
      const articles = await api.fetchTagArticles(tagName);
      setTagArticles(articles);
    } catch (error) {
      console.error('Failed to fetch tag articles:', error);
      setTagArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelection = (tagName: string) => {
    setSelectedTagName(tagName);
    onTagSelect(tagName);
  };

  return (
    <box style={{ flexDirection: "row", height: "100%", width: "100%" }}>
      {/* Left: Tags List */}
      <box style={{ width: "40%", flexDirection: "column", padding: 1 }}>
        <text content="🏷️ Categories & Tags" style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
        <text content={`${tags.length} categories available`} style={{ fg: 'gray', marginBottom: 1 }} />
        
        <scrollbox style={{ height: "100%" }}>
          {tags.map((tag, index) => (
            <box 
              key={tag.name} 
              style={{
                border: true,
                marginBottom: 1,
                padding: 1,
                backgroundColor: index === selectedTag ? 'blue' : undefined
              }}
            >
              <box style={{ flexDirection: "column" }}>
                <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <text 
                    content={tag.name} 
                    style={{ fg: index === selectedTag ? 'white' : 'cyan', attributes: 1 }} 
                  />
                  <text 
                    content={`${tag.count} articles`} 
                    style={{ fg: 'yellow' }} 
                  />
                </box>
                {tag.description && (
                  <text 
                    content={tag.description} 
                    style={{ fg: 'gray', marginTop: 1 }} 
                  />
                )}
                {index === selectedTag && (
                  <text 
                    content="Press Enter to view articles" 
                    style={{ fg: 'white', attributes: 1, marginTop: 1 }} 
                  />
                )}
              </box>
            </box>
          ))}
        </scrollbox>
      </box>

      {/* Right: Tag Articles or Instructions */}
      <box style={{ width: "60%", flexDirection: "column", padding: 1 }}>
        {!selectedTagName ? (
          <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <text content="🏷️ Select a Tag" style={{ fg: 'cyan', attributes: 1, marginBottom: 1 }} />
            <text content="Choose a category from the left to see related articles" style={{ fg: 'gray', marginBottom: 2 }} />
            <text content="Popular categories:" style={{ fg: 'white', marginBottom: 1 }} />
            <text content="• JavaScript & Web Development" style={{ fg: 'blue', marginBottom: 1 }} />
            <text content="• Python & Data Science" style={{ fg: 'blue', marginBottom: 1 }} />
            <text content="• DevOps & Cloud" style={{ fg: 'blue', marginBottom: 1 }} />
            <text content="• AI & Machine Learning" style={{ fg: 'blue' }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column", height: "100%" }}>
            <text 
              content={`📰 Articles tagged with "${selectedTagName}"`} 
              style={{ fg: 'green', attributes: 1, marginBottom: 1 }} 
            />
            
            {loading ? (
              <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <text content="Loading articles..." style={{ fg: 'blue' }} />
              </box>
            ) : tagArticles.length === 0 ? (
              <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <text content="No articles found for this tag" style={{ fg: 'yellow' }} />
                <text content="This might be a demo limitation" style={{ fg: 'gray', marginTop: 1 }} />
              </box>
            ) : (
              <scrollbox style={{ height: "100%" }}>
                {tagArticles.slice(0, 20).map((article: any, index: number) => (
                  <box 
                    key={index} 
                    style={{
                      border: true,
                      marginBottom: 1,
                      padding: 1
                    }}
                  >
                    <box style={{ flexDirection: "column" }}>
                      <text 
                        content={article.title || `Article ${index + 1}`} 
                        style={{ fg: 'white', attributes: 1 }} 
                      />
                      <text 
                        content={`By ${article.author || 'Unknown Author'} - ${article.date || 'Date unknown'}`} 
                        style={{ fg: 'gray', marginTop: 1 }} 
                      />
                      {article.excerpt && (
                        <text 
                          content={article.excerpt} 
                          style={{ fg: 'cyan', marginTop: 1 }} 
                        />
                      )}
                      <box style={{ flexDirection: "row", marginTop: 1 }}>
                        <text content="👁️ " style={{ fg: 'green', marginRight: 1 }} />
                        <text content={`${article.views || 0} views`} style={{ fg: 'green', marginRight: 2 }} />
                        <text content="❤️ " style={{ fg: 'red', marginRight: 1 }} />
                        <text content={`${article.likes || 0} likes`} style={{ fg: 'red' }} />
                      </box>
                    </box>
                  </box>
                ))}
              </scrollbox>
            )}
          </box>
        )}
      </box>
    </box>
  );
};