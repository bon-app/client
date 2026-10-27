import { CaptureDraftService } from './capture-draft.service';
import { AuthService } from '../../auth/auth.service';

describe('capture draft ownership', () => {
  afterEach(() => localStorage.clear());
  it('keeps unfinished recipes separate for signed-in accounts', () => {
    let id = 'first';
    const service = new CaptureDraftService({ getIdentity: () => ({ id }) } as AuthService);
    service.set({ photo: 'photo-one', recipe: { name: 'Soup' } });
    id = 'second'; expect(service.get().photo).toBeUndefined();
    service.set({ photo: 'photo-two' });
    id = 'first'; expect(service.get().recipe.name).toBe('Soup');
    service.clear(); id = 'second'; expect(service.get().photo).toBe('photo-two');
  });
});
