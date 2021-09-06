/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router-dom';
import species from './species.json';
import PATHS from '../../routes/paths';
import i18n from '../../i18n';
import { CardSpecies } from '../../components/CustomCard';

const SpeciesList = () => {
  const page = 'SpeciesList';
  return (
    <div className="section pt-1">
      <div className="content has-text-centered">
        <p className="title is-5">{i18n.t('search.species.list-title')}</p>
      </div>
      <div className="grid-species">
        {species.map((s, key) => (
          <Link key={key} to={`${PATHS.SEARCH.SPECIES}/165198498498789789`}>
            <CardSpecies {...s} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpeciesList;
