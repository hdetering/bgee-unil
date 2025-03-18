import { Helmet } from 'react-helmet';
import config from '../config.json';

const current = new Date();
const copyright = `Bgee copyright 2007/${current.getFullYear()} SIB/UNIL`;
const title = 'Bgee: gene expression data in animals';
const description = 'Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal species. It provides an intuitive answer to the question -where is a gene expressed?- and supports research in cancer and agriculture, as well as evolutionary biology.';

const GenericHelmetProvider = () => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="bgee, gene expression, evolution, ontology, anatomy, development, evo-devo database, anatomical ontology, developmental ontology, gene expression evolution" />
      <meta name="dcterms.rights" content={copyright} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property="og:image" content={`${config.genericDomain}/img/logo/bgee13-logo.png`} />
      <meta property="og:url" content={`${config.genericDomain}`} />
      <meta property="og:site_name" content="Bgee" />
      <script>
      {`
        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='https://matomo.sib.swiss/js/container_F5WPJc2X.js'; s.parentNode.insertBefore(g,s);
      `}
      </script>
    </Helmet>
  </>
);

export default GenericHelmetProvider;
