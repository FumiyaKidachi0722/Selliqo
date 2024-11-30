import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { src, alt, width, height, priority, ...rest } = props;
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  },
}));
