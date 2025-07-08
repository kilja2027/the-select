import React from 'react';
import type { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="bg-brand-light p-8 rounded-xl text-center border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex justify-center items-center mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">{feature.title}</h3>
      <p className="text-base text-brand-secondary">
        {feature.description.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default FeatureCard;
