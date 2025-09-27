import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { useScrollboxFocus } from '../hooks/useScrollboxFocus.js';
import type { ScrollBoxRenderable } from '@opentui/core';
import { t } from '../i18n/index.js';

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

  const tagsScrollboxRef = useRef<ScrollBoxRenderable>(null);
  const articlesScrollboxRef = useScrollboxFocus([tagArticles]);

  useEffect(() => {
    if (tagsScrollboxRef.current) {
      const estimatedHeightPerTag = 5;
      tagsScrollboxRef.current.scrollTop = selectedTag * estimatedHeightPerTag;
    }
  }, [selectedTag]);

  // Kode24 tags from left menu navigation
  const popularTags: TagInfo[] = [
    { name: 'lønn', count: 0, description: 'Lønn og kompensasjon for utviklere' },
    { name: 'sikkerhet', count: 0, description: 'Sikkerhet og personvern' },
    { name: 'meninger', count: 0, description: 'Meninger og debatter' },
    { name: 'utdanning', count: 0, description: 'Utdanning og læring' },
    { name: 'karriere', count: 0, description: 'Karriere og jobbmarked' },
    { name: 'kontor', count: 0, description: 'Kontor og arbeidsplasser' },
    { name: 'frontend', count: 0, description: 'Frontend-utvikling' },
    { name: 'backend', count: 0, description: 'Backend-utvikling' },
    { name: 'apputvikling', count: 0, description: 'Mobil- og app-utvikling' },
    { name: 'devops', count: 0, description: 'DevOps og infrastruktur' },
    { name: 'IoT', count: 0, description: 'Internet of Things' },
    { name: 'maskinlæring', count: 0, description: 'Maskinlæring og AI' },
    { name: 'design', count: 0, description: 'Design og UX' },
    { name: 'tilgjengelighet', count: 0, description: 'Tilgjengelighet og universell utforming' },
    { name: 'ukas koder', count: 0, description: 'Ukas koder' },
    { name: 'inn/ut', count: 0, description: 'Inn og ut av bransjen' },
    { name: 'hobby', count: 0, description: 'Hobby og fritidskoding' },
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
        <text content={t('categoriesTags')} style={{ fg: 'green', attributes: 1, marginBottom: 1 }} />
        <text content={t('categoriesAvailable', { count: tags.length })} style={{ fg: 'gray', marginBottom: 1 }} />
        
              <scrollbox ref={articlesScrollboxRef} style={{ height: "100%" }}>
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
                    content={t('pressEnterViewArticles')} 
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
            <text content={t('selectTag')} style={{ fg: 'cyan', attributes: 1, marginBottom: 1 }} />
            <text content={t('chooseCategory')} style={{ fg: 'gray', marginBottom: 2 }} />
            <text content={t('popularCategories')} style={{ fg: 'white', marginBottom: 1 }} />
            <text content={t('jsWebDev')} style={{ fg: 'blue', marginBottom: 1 }} />
            <text content={t('pythonData')} style={{ fg: 'blue', marginBottom: 1 }} />
            <text content={t('devopsCloud')} style={{ fg: 'blue', marginBottom: 1 }} />
            <text content={t('aiMl')} style={{ fg: 'blue' }} />
          </box>
        ) : (
          <box style={{ flexDirection: "column", height: "100%" }}>
            <text
              content={t('articlesTaggedWith', { name: selectedTagName })}
              style={{ fg: 'green', attributes: 1, marginBottom: 1 }}
            />
            
            {loading ? (
              <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <text content={t('loadingArticles')} style={{ fg: 'blue' }} />
              </box>
            ) : tagArticles.length === 0 ? (
              <box style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <text content={t('noArticlesFound')} style={{ fg: 'yellow' }} />
                <text content={t('demoLimitation')} style={{ fg: 'gray', marginTop: 1 }} />
              </box>
            ) : (
        <scrollbox ref={tagsScrollboxRef} style={{ height: "100%" }}>
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