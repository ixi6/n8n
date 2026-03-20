import { mockInstance } from '@n8n/backend-test-utils';

import { PublicApiKeyService } from '@/services/public-api-key.service';

import * as middlewares from '../shared/middlewares/global.middleware';

const publicApiKeyService = mockInstance(PublicApiKeyService);

afterEach(() => {
	jest.clearAllMocks();
});

describe('apiKeyHasScope', () => {
	it('should return tagged API key scope middleware', () => {
		publicApiKeyService.getApiKeyScopeMiddleware.mockReturnValue(jest.fn());

		const result = middlewares.apiKeyHasScope('credential:create');

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(publicApiKeyService.getApiKeyScopeMiddleware).toHaveBeenCalledWith('credential:create');
		expect(result.__apiKeyScope).toBe('credential:create');
	});
});

describe('apiKeyHasScopeWithGlobalScopeFallback', () => {
	it('should return tagged API key scope middleware', () => {
		publicApiKeyService.getApiKeyScopeMiddleware.mockReturnValue(jest.fn());

		const result = middlewares.apiKeyHasScopeWithGlobalScopeFallback({
			scope: 'credential:create',
		});

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(publicApiKeyService.getApiKeyScopeMiddleware).toHaveBeenCalledWith('credential:create');
		expect(result.__apiKeyScope).toBe('credential:create');
	});
});
