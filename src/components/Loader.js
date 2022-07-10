import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return (
    <div>
      <Spinner animation="grow" size="lg" variant="primary" />{' '}
      <Spinner animation="grow" size="lg" variant="primary" />{' '}
      <Spinner animation="grow" size="lg" variant="primary" />{' '}
      <Spinner animation="grow" size="lg" variant="primary" />{' '}
      <Spinner animation="grow" size="lg" variant="primary" />
    </div>
  )
}

export default Loader;