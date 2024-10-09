// src/pages/articles/[id]/history/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import VersionComparison from '../../../components/VersionComparison';

const ArticleHistoryPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [versions, setVersions] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([]);

  useEffect(() => {
    if (id) {
      fetchVersionHistory();
    }
  }, [id]);

  const fetchVersionHistory = async () => {
    const response = await fetch(`/api/articles/${id}/history`);
    const data = await response.json();
    setVersions(data);
  };

  const handleVersionSelect = (versionId) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId);
      }
      if (prev.length < 2) {
        return [...prev, versionId];
      }
      return [prev[1], versionId];
    });
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Article Version History</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Select versions to compare:</h2>
        {versions.map((version) => (
          <div key={version.id} className="flex items-center my-2">
            <input
              type="checkbox"
              id={`version-${version.id}`}
              checked={selectedVersions.includes(version.id)}
              onChange={() => handleVersionSelect(version.id)}
              className="mr-2"
            />
            <label htmlFor={`version-${version.id}`}>
              Version {version.id} - {new Date(version.createdAt).toLocaleString()} by {version.author.username}
            </label>
          </div>
        ))}
      </div>
      {selectedVersions.length === 2 && (
        <VersionComparison 
          version1={versions.find(v => v.id === selectedVersions[0])}
          version2={versions.find(v => v.id === selectedVersions[1])}
        />
      )}
    </Layout>
  );
};

export default ArticleHistoryPage;