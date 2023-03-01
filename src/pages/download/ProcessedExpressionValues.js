/* eslint-disable jsx-a11y/interactive-supports-focus,react/no-array-index-key,react/button-has-type,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/label-has-associated-control */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import PATHS from '../../routes/paths';
import useQuery from '../../hooks/useQuery';
import Bulma from '../../components/Bulma';
import CreativeCommons from '../../components/CreativeCommons';
import api from '../../api';
import GridSpecies from '../../components/GridSpecies/GridSpecies';
import classnames from '../../helpers/classnames';
import GaEvent from '../../components/GaEvent/GaEvent';
import readableFileSize from '../../helpers/readableFileSize';
import ExpressionSearch from '../../components/Search/ExpressionSearch';
import expressionPageHelper from '../../helpers/expressionPageHelper';
import LinkExternal from '../../components/LinkExternal';
import imagePath from '../../helpers/imagePath';
import config from '../../config.json';

const ProcessedExpressionValues = () => {
  const history = useHistory();
  const [speciesList, setSpeciesList] = React.useState([]);
  const [kwList, setKwList] = React.useState({});
  const [search, setSearch] = React.useState('');
  const filteredSpecies = React.useMemo(() => {
    const tmp = JSON.parse(JSON.stringify(speciesList));
    if (search === '') return tmp;
    const regExp = new RegExp(search, 'i');
    return tmp.filter(({ id }) =>
      !kwList[id] ? false : Boolean(kwList[id].find((a) => regExp.test(a)))
    );
  }, [speciesList, search, kwList]);
  const [files, setFiles] = React.useState({});
  const speciesID = useQuery('id');

  React.useEffect(() => {
    api.search.species.processedValues().then((res) => {
      const sList = res.data.downloadFilesGroups.map((o) => ({
        ...o,
        ...o.members[0],
      }));
      setSpeciesList(sList);
      setKwList(res.data.speciesIdToKeywords);

      const speciesFiles = {};
      sList.forEach((s) => {
        speciesFiles[s.id.toString()] = {
          affymetrixData: s.downloadFiles.find(
            (d) => d.category === 'affy_data'
          ),
          affymetrixAnnot: s.downloadFiles.find(
            (d) => d.category === 'affy_annot'
          ),
          rnaSeqData: s.downloadFiles.find((d) => d.category === 'rnaseq_data'),
          rnaSeqAnnot: s.downloadFiles.find(
            (d) => d.category === 'rnaseq_annot'
          ),
          fullLengthAnnot: s.downloadFiles.find(
            (d) => d.category === 'full_length_annot'
          ),
          fullLengthData: s.downloadFiles.find(
            (d) => d.category === 'full_length_data'
          ),
        };
      });
      setFiles(speciesFiles);
    });
  }, []);

  const allSpeciesName = React.useMemo(
    () => speciesList.map((s) => ` ${s.name} ${s.speciesName}`).join(', '),
    [speciesList]
  );

  return (
    <>
      <Helmet>
        <title>Processed expression values download page</title>
        <meta
          name="description"
          content="Download TSV files containing sample annotations,
     experiment information, and processed expression values"
        />
        <meta
          name="keywords"
          content={`dataset, data download, gene expression,
     RNA-Seq, Affymetrix, full-length single-cell RNA-Seq, full-length scRNA-Seq, scRNA-Seq,
     expression data annotations, ${allSpeciesName}`}
        />
      </Helmet>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Processed expression values</Bulma.Title>
      </div>
      <p className="is-size-5">
        This page provides annotations and experiment information (e.g.,
        annotations to anatomy and development, quality scores used in QCs, chip
        or library information), and processed expression values (e.g., read
        counts, TPM and FPKM values, log values of Affymetrix probeset
        normalized signal intensities). Click on a species to browse files
        available for download. It is possible to download these data directly
        into R using our{' '}
        <LinkExternal to="https://bioconductor.org/packages/BgeeDB/">
          R package
        </LinkExternal>
        . See also{' '}
        <Link
          to={PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS}
          className="internal-link"
        >
          gene expression calls
        </Link>
        . All data are available under the{' '}
        <LinkExternal to="https://creativecommons.org/publicdomain/zero/1.0/">
          Creative Commons Zero license (CC0)
        </LinkExternal>
        .
      </p>
      <div>
        <Bulma.Card className="form search-input mx-auto my-3">
          <Bulma.Card.Body>
            <div className="content">
              <div className="field">
                <label className="label" htmlFor="search-species">
                  Search species
                </label>
                <ExpressionSearch
                  search={search}
                  setSearch={setSearch}
                  elements={expressionPageHelper.autocompleteSpecies(
                    filteredSpecies,
                    kwList,
                    search
                  )}
                  onRender={expressionPageHelper.autocompleteSpeciesRender(
                    setSearch,
                    history
                  )}
                />
              </div>
            </div>
          </Bulma.Card.Body>
        </Bulma.Card>
      </div>
      <Bulma.Card className="mt-4">
        <Bulma.Card.Header>
          <Bulma.Card.Header.Title className="is-size-4 has-text-primary">
            Species with data in Bgee{' '}
            <span className="ml-2 has-text-grey is-size-6">
              (click on species to see more details)
            </span>
          </Bulma.Card.Header.Title>
        </Bulma.Card.Header>
        <Bulma.Card.Body>
          <div className="content">
            <div className="grid-species">
              <GridSpecies
                speciesList={filteredSpecies}
                defaultSelection={speciesID}
                onClick={(species, isSelected) => {
                  history.replace(
                    isSelected
                      ? `?id=${species.id}`
                      : PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES
                  );
                }}
                onRenderSelection={(species, { onClose }) => (
                  <div
                    className={classnames(
                      'expression-species is-flex is-flex-direction-row p-4'
                    )}
                  >
                    <div className="image-container">
                      <Bulma.Image
                        className="m-0"
                        src={imagePath(`/species/${species.id}_light.jpg`)}
                        alt={`species ${species.genus} ${species.speciesName}- ${species.name}`}
                        fallback="https://via.placeholder.com/260"
                        height={260}
                        width={260}
                      />
                    </div>
                    <div
                      className="is-flex is-flex-direction-column is-justify-content-space-around ml-4"
                      style={{ height: '100%', flex: 1, overflow: 'hidden' }}
                    >
                      <div className="is-flex is-flex-direction-column">
                        <div className="is-flex is-justify-content-flex-end">
                          <Link
                            className="internal-link grey"
                            to={`${PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS}?id=${species.id}`}
                          >
                            See gene expression calls
                          </Link>
                          <div className="close" onClick={onClose}>
                            <ion-icon name="close-outline" />
                          </div>
                        </div>
                        <p className="is-size-3">
                          <i>{`${species.genus} ${species.speciesName}`}</i>
                          {species.name ? ` (${species.name})` : ''}
                        </p>
                      </div>
                      <div>
                        <div>
                          <p className="mb-2 is-size-5 has-text-weight-semibold">
                            RNA-Seq data
                          </p>
                          {files[species.id.toString()]?.rnaSeqAnnot ||
                          files[species.id.toString()]?.rnaSeqData ? (
                            <>
                              <div className="buttons-wrapper">
                                {files[species.id.toString()]?.rnaSeqAnnot && (
                                  <GaEvent
                                    category="Processed Expression Values"
                                    action="download_rna-seq_annotation-file"
                                    label={
                                      files[species.id.toString()]?.rnaSeqAnnot
                                        .path
                                    }
                                  >
                                    <a
                                      href={
                                        files[species.id.toString()]
                                          ?.rnaSeqAnnot.path
                                      }
                                    >
                                      <button className="button is-light is-multiline">
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-6 ml-2">
                                          Download experiments/libraries info
                                          {` (${readableFileSize(
                                            files[species.id.toString()]
                                              ?.rnaSeqAnnot.size
                                          )})`}
                                        </span>
                                      </button>
                                    </a>
                                  </GaEvent>
                                )}
                                {files[species.id.toString()]?.rnaSeqData && (
                                  <GaEvent
                                    category="Processed Expression Values"
                                    action="download_rna-seq_data-file"
                                    label={
                                      files[species.id.toString()]?.rnaSeqData
                                        .path
                                    }
                                  >
                                    <a
                                      href={
                                        files[species.id.toString()]?.rnaSeqData
                                          .path
                                      }
                                    >
                                      <button className="button is-light is-multiline">
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-6 ml-2">
                                          Download read count, TPMs and FPKMs
                                          {` (${readableFileSize(
                                            files[species.id.toString()]
                                              ?.rnaSeqData.size
                                          )})`}
                                        </span>
                                      </button>
                                    </a>
                                  </GaEvent>
                                )}
                              </div>
                              <p className="is-size-6 has-text-grey">
                                Files can also be retrieved per experiment, see{' '}
                                <a
                                  className="internal-link grey"
                                  href={`${config.ftpDomain}/download/processed_expr_values/rna_seq/${species.speciesFullNameWithoutSpace}/`}
                                >
                                  RNA-Seq data directory
                                </a>
                              </p>
                            </>
                          ) : (
                            <p className="is-size-6 has-text-grey mb-2">
                              No data
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <p className="mb-2 is-size-5 has-text-weight-semibold">
                            Affymetrix data
                          </p>
                          {files[species.id.toString()]?.affymetrixAnnot ||
                          files[species.id.toString()]?.affymetrixData ? (
                            <>
                              <div className="buttons-wrapper">
                                {files[species.id.toString()]
                                  ?.affymetrixAnnot && (
                                  <GaEvent
                                    category="Processed Expression Values"
                                    action="download_affymetrix_annotation-file"
                                    label={
                                      files[species.id.toString()]
                                        ?.affymetrixAnnot.path
                                    }
                                  >
                                    <a
                                      href={
                                        files[species.id.toString()]
                                          ?.affymetrixAnnot.path
                                      }
                                    >
                                      <button className="button is-light is-multiline">
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-6 ml-2">
                                          Download experiments/chips info
                                          {` (${readableFileSize(
                                            files[species.id.toString()]
                                              ?.affymetrixAnnot.size
                                          )})`}
                                        </span>
                                      </button>
                                    </a>
                                  </GaEvent>
                                )}
                                {files[species.id.toString()]
                                  ?.affymetrixData && (
                                  <GaEvent
                                    category="Processed Expression Values"
                                    action="download_affymetrix_data-file"
                                    label={
                                      files[species.id.toString()]
                                        ?.affymetrixData.path
                                    }
                                  >
                                    <a
                                      href={
                                        files[species.id.toString()]
                                          ?.affymetrixData.path
                                      }
                                    >
                                      <button className="button is-light is-multiline">
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-6 ml-2">
                                          Download signal intensities
                                          {` (${readableFileSize(
                                            files[species.id.toString()]
                                              ?.affymetrixData.size
                                          )})`}
                                        </span>
                                      </button>
                                    </a>
                                  </GaEvent>
                                )}
                              </div>
                              <p className="is-size-6 has-text-grey">
                                Files can also be retrieved per experiment, see{' '}
                                <a
                                  className="internal-link grey"
                                  href={`${config.ftpDomain}/download/processed_expr_values/affymetrix/${species.speciesFullNameWithoutSpace}/`}
                                >
                                  Affymetrix data directory
                                </a>
                              </p>
                            </>
                          ) : (
                            <p className="is-size-6 has-text-grey mb-2">
                              No data
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <p className="mb-2 is-size-5 has-text-weight-semibold">
                            Single cell full length RNA-Seq data
                          </p>
                          {files[species.id.toString()]?.fullLengthAnnot ||
                          files[species.id.toString()]?.fullLengthData ? (
                            <>
                              <div className="buttons-wrapper">
                                {files[species.id.toString()]
                                  ?.fullLengthAnnot && (
                                  <GaEvent
                                    category="Processed Expression Values"
                                    action="download_full-length_annotation-file"
                                    label={
                                      files[species.id.toString()]
                                        ?.fullLengthAnnot.path
                                    }
                                  >
                                    <a
                                      href={
                                        files[species.id.toString()]
                                          ?.fullLengthAnnot.path
                                      }
                                    >
                                      <button className="button is-light is-multiline">
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-6 ml-2">
                                          Download experiments/libraries info
                                          {` (${readableFileSize(
                                            files[species.id.toString()]
                                              ?.fullLengthAnnot.size
                                          )})`}
                                        </span>
                                      </button>
                                    </a>
                                  </GaEvent>
                                )}
                                {files[species.id.toString()]
                                  ?.fullLengthData && (
                                  <GaEvent
                                    category="Processed Expression Values"
                                    action="download_full-length_data-file"
                                    label={
                                      files[species.id.toString()]
                                        ?.fullLengthData.path
                                    }
                                  >
                                    <a
                                      href={
                                        files[species.id.toString()]
                                          ?.fullLengthData.path
                                      }
                                    >
                                      <button className="button is-light is-multiline">
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-6 ml-2">
                                          Download read count, TPMs and FPKMs
                                          {` (${readableFileSize(
                                            files[species.id.toString()]
                                              ?.fullLengthData.size
                                          )})`}
                                        </span>
                                      </button>
                                    </a>
                                  </GaEvent>
                                )}
                              </div>
                              <p className="is-size-6 has-text-grey">
                                Files can also be retrieved per experiment, see{' '}
                                <a
                                  className="internal-link grey"
                                  href={`${config.ftpDomain}/download/processed_expr_values/sc_full_length/${species.speciesFullNameWithoutSpace}/`}
                                >
                                  Full length single cell RNA-Seq data directory
                                </a>
                              </p>
                            </>
                          ) : (
                            <p className="is-size-6 has-text-grey mb-2">
                              No data
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </Bulma.Card.Body>
      </Bulma.Card>
      <Bulma.Columns className="mt-4">
        <Bulma.C size={12}>
          <CreativeCommons />
        </Bulma.C>
      </Bulma.Columns>
    </>
  );
};

export default ProcessedExpressionValues;
