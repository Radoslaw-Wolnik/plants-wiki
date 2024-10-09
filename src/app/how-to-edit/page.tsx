// src/app/how-to-edit/page.tsx

import React from 'react';
import Layout from '../components/Layout';

const HowToEditPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">How to Edit & Rules</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Editing Guidelines</h2>
          <ul className="list-disc pl-6">
            <li>Ensure all information is accurate and from reliable sources</li>
            <li>Use clear and concise language</li>
            <li>Follow the existing article structure</li>
            <li>Add references where appropriate</li>
            <li>Respect copyright and do not plagiarize</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Moderation Process</h2>
          <p>All changes must be approved by at least 5 moderators before being published.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Becoming a Moderator</h2>
          <p>To request moderator status, you must meet the following criteria:</p>
          <ul className="list-disc pl-6">
            <li>Have at least 5 approved changes</li>
            <li>Be registered for at least one month</li>
            <li>Have at least 3 plants in your library</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Community Guidelines</h2>
          <ul className="list-disc pl-6">
            <li>Be respectful to other users</li>
            <li>Do not post offensive or inappropriate content</li>
            <li>Avoid spamming or excessive self-promotion</li>
            <li>Report any suspicious or rule-breaking behavior</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default HowToEditPage;