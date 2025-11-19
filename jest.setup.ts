import '@testing-library/jest-dom';
import { server } from './apps/trade-ui/src/test/mswServer';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
