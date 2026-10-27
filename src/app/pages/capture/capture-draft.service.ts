import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { AuthService } from '../../auth/auth.service';

export interface RecordingStatus { state: 'idle'|'starting'|'recording'|'paused'|'stopped'|'interrupted'|'error'; duration: number; error?: string; notificationsAllowed?: boolean; }
export interface RecipeRecorderPlugin {
  start(options: { language: string }): Promise<void>;
  pause(): Promise<void>; resume(): Promise<void>; stop(): Promise<void>;
  status(): Promise<RecordingStatus>; read(): Promise<{path: string}>; discard(): Promise<void>;
}
const nativeRecorder = registerPlugin<any>('RecipeRecorder');
function recordingOwner(): string {
  try {
    const payload = (localStorage.getItem('token') || '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return String(JSON.parse(atob(payload)).id || '');
  } catch { return ''; }
}
export const RecipeRecorder: RecipeRecorderPlugin = {
  start: options => nativeRecorder.start({ ...options, owner: recordingOwner() }),
  pause: () => nativeRecorder.pause({ owner: recordingOwner() }),
  resume: () => nativeRecorder.resume({ owner: recordingOwner() }),
  stop: () => nativeRecorder.stop({ owner: recordingOwner() }),
  status: () => nativeRecorder.status({ owner: recordingOwner() }),
  read: () => nativeRecorder.read({ owner: recordingOwner() }),
  discard: () => nativeRecorder.discard({ owner: recordingOwner() })
};
export interface CaptureDraft {
  photo?: string; captureId?: string; status?: string; language?: string; keep?: boolean;
  result?: { name: string; ingredients: string[]; steps: string[]; transcript: string; questions: string[] };
  recipe?: any; bulk?: string;
}
@Injectable({ providedIn: 'root' })
export class CaptureDraftService {
  constructor(private auth: AuthService) {}
  private key() { return 'bonapp.capture.' + (this.auth.getIdentity()?.id || 'anonymous'); }
  get(): CaptureDraft { try { return JSON.parse(localStorage.getItem(this.key()) || '{}'); } catch { return {}; } }
  set(draft: CaptureDraft) { localStorage.setItem(this.key(), JSON.stringify(draft)); }
  clear() { localStorage.removeItem(this.key()); }
}
